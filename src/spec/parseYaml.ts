/*
 * Függőségmentes YAML-részhalmaz parser a deklaratív oldalleíróhoz.
 *
 * Támogatott: behúzásalapú térkép és lista (a lista a kulccsal azonos behúzással is), skalárok
 * (szöveg, szám, `true`/`false`, `null`/`~`), idézőjeles szövegek (`'..'` és `".."` escape-ekkel),
 * flow-forma (`[a, b]`, `{a: 1}`, többsoros is), `#` megjegyzés, `|` és `>` blokk-skalár (`-` / `+` jelzővel),
 * valamint a `${...}` kifejezések (ezeken belül `:`, `,`, `#` stb. nem tördeli a szöveget).
 *
 * Nem támogatott (hibát dob): horgonyok és aliasok (`&a`, `*a`), címkék (`!tag`), több dokumentum,
 * tabulátor behúzás, többsoros sima (idézőjel nélküli) skalár.
 */

/**
 * A YAML-részhalmaz értelmezésének hibája; az üzenet tartalmazza a sorszámot.
 *
 * @group yaml
 */
export class YamlError extends Error {
  constructor(message: string, public line: number, public column = 1) {
    super(`YAML hiba (${line}. sor): ${message}`);
    this.name = "YamlError";
  }
}

interface Line {
  indent: number;
  /** a sor tartalma behúzás nélkül (megjegyzés nélkül, jobbról vágva) */
  text: string;
  /** a nyers sor (blokk-skalárhoz) */
  raw: string;
  no: number;
}

const isSpace = (c: string | undefined): boolean => c === " " || c === "\t";

/** Egy skalár elején álló idézőjel nyit-e idézett szöveget (a "don't" aposztrófja nem). */
function opensQuote(s: string, i: number): boolean {
  if (s[i] !== "'" && s[i] !== '"') return false;
  if (i === 0) return true;
  return "[{,: \t-".includes(s[i - 1]);
}

/** `#` megjegyzés levágása: csak szóköz után vagy sor elején, idézőjelen és `${}`-on kívül. */
function stripComment(s: string): string {
  let quote = "";
  let depth = 0;
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (quote) {
      if (c === "\\" && quote === '"') i++;
      else if (c === quote) {
        if (quote === "'" && s[i + 1] === "'") i++;
        else quote = "";
      }
      continue;
    }
    if (opensQuote(s, i)) {
      quote = c;
      continue;
    }
    if (c === "$" && s[i + 1] === "{") {
      depth++;
      i++;
      continue;
    }
    if (depth > 0) {
      if (c === "{") depth++;
      else if (c === "}") depth--;
      continue;
    }
    if (c === "#" && (i === 0 || isSpace(s[i - 1]))) return s.slice(0, i);
  }
  return s;
}

/**
 * A kulcs-érték elválasztó `:` helye (utána szóköz vagy sorvég), idézőjelen, `${}`-on kívül.
 * -1: nem kulcs-érték sor.
 */
function findKeyColon(s: string): number {
  if (s[0] === "[" || s[0] === "{") return -1;
  let quote = "";
  let depth = 0;
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (quote) {
      if (c === "\\" && quote === '"') i++;
      else if (c === quote) {
        if (quote === "'" && s[i + 1] === "'") i++;
        else quote = "";
      }
      continue;
    }
    if (opensQuote(s, i)) {
      quote = c;
      continue;
    }
    if (c === "$" && s[i + 1] === "{") {
      depth++;
      i++;
      continue;
    }
    if (depth > 0) {
      if (c === "{") depth++;
      else if (c === "}") depth--;
      continue;
    }
    if (c === ":" && (i === s.length - 1 || isSpace(s[i + 1]))) return i;
  }
  return -1;
}

function unescapeDouble(body: string, line: number): string {
  let out = "";
  for (let i = 0; i < body.length; i++) {
    const c = body[i];
    if (c !== "\\") {
      out += c;
      continue;
    }
    const n = body[++i];
    switch (n) {
      case "n": out += "\n"; break;
      case "t": out += "\t"; break;
      case "r": out += "\r"; break;
      case "0": out += "\0"; break;
      case '"': out += '"'; break;
      case "\\": out += "\\"; break;
      case "/": out += "/"; break;
      case "u": {
        const hex = body.slice(i + 1, i + 5);
        if (!/^[0-9a-fA-F]{4}$/.test(hex)) throw new YamlError("érvénytelen \\u escape", line);
        out += String.fromCharCode(parseInt(hex, 16));
        i += 4;
        break;
      }
      default: throw new YamlError(`ismeretlen escape: \\${n ?? ""}`, line);
    }
  }
  return out;
}

/** Idézett szöveg beolvasása az `s[i]` idézőjeltől; visszaadja a szöveget és a záró idézőjel utáni indexet. */
function readQuoted(s: string, i: number, line: number): { value: string; end: number } {
  const q = s[i];
  let j = i + 1;
  let raw = "";
  for (; j < s.length; j++) {
    const c = s[j];
    if (q === '"' && c === "\\") {
      raw += c + (s[j + 1] ?? "");
      j++;
      continue;
    }
    if (c === q) {
      if (q === "'" && s[j + 1] === "'") {
        raw += "'";
        j++;
        continue;
      }
      return { value: q === '"' ? unescapeDouble(raw, line) : raw, end: j + 1 };
    }
    raw += c;
  }
  throw new YamlError("nincs lezárva az idézőjel", line);
}

/** Sima skalár típusának feloldása. */
function resolvePlain(s: string, line: number): unknown {
  const t = s.trim();
  if (t === "" || t === "~" || t === "null") return null;
  if (t === "true") return true;
  if (t === "false") return false;
  if (/^[&*][A-Za-z0-9_-]+(\s|$)/.test(t)) throw new YamlError(`horgony/alias nem támogatott: ${t}`, line);
  if (/^!{1,2}[A-Za-z]/.test(t)) throw new YamlError(`címke nem támogatott: ${t}`, line);
  if (/^[-+]?(0|[1-9]\d*)(\.\d+)?([eE][-+]?\d+)?$/.test(t)) return Number(t);
  return t;
}

/** Flow-kollekció és idézett / sima skalárok értelmezése egyetlen szövegből. */
class FlowParser {
  private i = 0;
  constructor(private s: string, private line: number) {}

  parse(): unknown {
    this.ws();
    const v = this.value();
    this.ws();
    if (this.i < this.s.length) throw new YamlError(`váratlan szöveg a flow értéke után: "${this.s.slice(this.i)}"`, this.line);
    return v;
  }

  private ws(): void {
    while (this.i < this.s.length && /\s/.test(this.s[this.i])) this.i++;
  }

  private value(): unknown {
    const c = this.s[this.i];
    if (c === "[") return this.seq();
    if (c === "{") return this.map();
    if (c === "'" || c === '"') {
      const { value, end } = readQuoted(this.s, this.i, this.line);
      this.i = end;
      return value;
    }
    return resolvePlain(this.plain(), this.line);
  }

  /** Sima skalár a következő `,` `]` `}` vagy `: ` határig (a `${...}` egyben marad). */
  private plain(): string {
    const start = this.i;
    let depth = 0;
    while (this.i < this.s.length) {
      const c = this.s[this.i];
      if (c === "$" && this.s[this.i + 1] === "{") {
        depth++;
        this.i += 2;
        continue;
      }
      if (depth > 0) {
        if (c === "{") depth++;
        else if (c === "}") depth--;
        this.i++;
        continue;
      }
      if (c === "," || c === "]" || c === "}") break;
      if (c === ":" && (isSpace(this.s[this.i + 1]) || this.i + 1 >= this.s.length)) break;
      this.i++;
    }
    return this.s.slice(start, this.i).trim();
  }

  private seq(): unknown[] {
    this.i++; // [
    const out: unknown[] = [];
    for (;;) {
      this.ws();
      if (this.s[this.i] === "]") { this.i++; return out; }
      out.push(this.value());
      this.ws();
      if (this.s[this.i] === ",") { this.i++; continue; }
      if (this.s[this.i] === "]") { this.i++; return out; }
      throw new YamlError("a flow listában „,” vagy „]” hiányzik", this.line);
    }
  }

  private map(): Record<string, unknown> {
    this.i++; // {
    const out: Record<string, unknown> = {};
    for (;;) {
      this.ws();
      if (this.s[this.i] === "}") { this.i++; return out; }
      let key: string;
      if (this.s[this.i] === "'" || this.s[this.i] === '"') {
        const q = readQuoted(this.s, this.i, this.line);
        key = q.value;
        this.i = q.end;
      } else {
        key = this.plain();
      }
      this.ws();
      let value: unknown = null;
      if (this.s[this.i] === ":") {
        this.i++;
        this.ws();
        if (this.s[this.i] !== "," && this.s[this.i] !== "}") value = this.value();
      }
      if (key in out) throw new YamlError(`ismétlődő kulcs: ${key}`, this.line);
      out[key] = value;
      this.ws();
      if (this.s[this.i] === ",") { this.i++; continue; }
      if (this.s[this.i] === "}") { this.i++; return out; }
      throw new YamlError("a flow térképben „,” vagy „}” hiányzik", this.line);
    }
  }
}

/** Nyitó/záró zárójelek egyensúlya egy flow-értékben (a `${}` és az idézőjelek nem számítanak). */
function flowBalance(s: string): number {
  let bal = 0;
  let quote = "";
  let tpl = 0;
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (quote) {
      if (c === "\\" && quote === '"') i++;
      else if (c === quote) quote = "";
      continue;
    }
    if (opensQuote(s, i)) { quote = c; continue; }
    if (c === "$" && s[i + 1] === "{") { tpl++; i++; continue; }
    if (tpl > 0) {
      if (c === "{") tpl++;
      else if (c === "}") tpl--;
      continue;
    }
    if (c === "[" || c === "{") bal++;
    else if (c === "]" || c === "}") bal--;
  }
  return bal;
}

class Parser {
  private lines: Line[] = [];
  private pos = 0;

  constructor(src: string) {
    const raws = src.replace(/^﻿/, "").split(/\r?\n/);
    raws.forEach((raw, idx) => {
      const no = idx + 1;
      const m = /^( *)/.exec(raw)!;
      if (/^\t/.test(raw.slice(m[1].length)) && raw.trim() !== "") {
        throw new YamlError("tabulátor behúzás nem megengedett (szóközt használj)", no);
      }
      this.lines.push({ indent: m[1].length, text: stripComment(raw.slice(m[1].length)).replace(/\s+$/, ""), raw, no });
    });
  }

  parse(): unknown {
    this.skipBlank();
    if (this.pos < this.lines.length && /^---\s*$/.test(this.lines[this.pos].text)) {
      this.pos++;
      this.skipBlank();
    }
    if (this.pos >= this.lines.length) return null;
    const first = this.lines[this.pos];
    if (/^\.\.\.\s*$/.test(first.text)) return null;
    const value = this.block(first.indent);
    this.skipBlank();
    if (this.pos < this.lines.length) {
      const l = this.lines[this.pos];
      if (/^---\s*$/.test(l.text)) throw new YamlError("több dokumentum nem támogatott", l.no);
      throw new YamlError(`váratlan behúzás vagy tartalom: "${l.text}"`, l.no, l.indent + 1);
    }
    return value;
  }

  private skipBlank(): void {
    while (this.pos < this.lines.length && this.lines[this.pos].text === "") this.pos++;
  }

  private peek(): Line | null {
    this.skipBlank();
    return this.pos < this.lines.length ? this.lines[this.pos] : null;
  }

  private block(indent: number): unknown {
    const line = this.peek()!;
    if (line.indent !== indent) throw new YamlError("hibás behúzás", line.no, line.indent + 1);
    if (/^-(\s|$)/.test(line.text)) return this.seq(indent);
    if (findKeyColon(line.text) >= 0) return this.map(indent);
    // egyetlen skalár
    this.pos++;
    return this.inline(line.text, line);
  }

  private seq(indent: number): unknown[] {
    const out: unknown[] = [];
    for (;;) {
      const line = this.peek();
      if (!line || line.indent !== indent || !/^-(\s|$)/.test(line.text)) {
        if (line && line.indent > indent) throw new YamlError("váratlan behúzás a listában", line.no, line.indent + 1);
        return out;
      }
      const rest = line.text.replace(/^-\s*/, "");
      const contentIndent = indent + (line.text.length - rest.length);
      if (rest === "") {
        this.pos++;
        const next = this.peek();
        out.push(next && next.indent > indent ? this.block(next.indent) : null);
        continue;
      }
      if (/^[|>][+-]?$/.test(rest)) {
        this.pos++;
        out.push(this.blockScalar(rest, indent, line));
        continue;
      }
      if (/^-(\s|$)/.test(rest) || findKeyColon(rest) >= 0) {
        // a lista eleme beágyazott lista vagy térkép: a sor a tartalom oszlopától folytatódik
        this.lines[this.pos] = { ...line, indent: contentIndent, text: rest };
        out.push(this.block(contentIndent));
        continue;
      }
      this.pos++;
      out.push(this.inline(rest, line));
    }
  }

  private map(indent: number): Record<string, unknown> {
    const out: Record<string, unknown> = {};
    for (;;) {
      const line = this.peek();
      if (!line || line.indent < indent) return out;
      if (line.indent > indent) throw new YamlError("váratlan behúzás", line.no, line.indent + 1);
      if (/^-(\s|$)/.test(line.text)) return out; // a szülő listájának következő eleme
      if (/^---\s*$/.test(line.text)) throw new YamlError("több dokumentum nem támogatott", line.no);
      const colon = findKeyColon(line.text);
      if (colon < 0) throw new YamlError(`„kulcs: érték” formát vártam: "${line.text}"`, line.no, indent + 1);

      let key = line.text.slice(0, colon).trim();
      if (key[0] === "'" || key[0] === '"') {
        const q = readQuoted(key, 0, line.no);
        if (q.end !== key.length) throw new YamlError(`érvénytelen kulcs: ${key}`, line.no);
        key = q.value;
      } else if (/^[&*!]/.test(key) && /^[&*][A-Za-z0-9_-]+$|^!{1,2}[A-Za-z]/.test(key)) {
        throw new YamlError(`horgony/alias/címke nem támogatott: ${key}`, line.no);
      }
      if (key in out) throw new YamlError(`ismétlődő kulcs: ${key}`, line.no);

      const rest = line.text.slice(colon + 1).trim();
      this.pos++;
      if (rest === "") {
        const next = this.peek();
        if (next && next.indent > indent) out[key] = this.block(next.indent);
        else if (next && next.indent === indent && /^-(\s|$)/.test(next.text)) out[key] = this.seq(indent);
        else out[key] = null;
      } else if (/^[|>][+-]?$/.test(rest)) {
        out[key] = this.blockScalar(rest, indent, line);
      } else {
        out[key] = this.inline(rest, line);
      }
    }
  }

  /** Egysoros érték: flow-kollekció (akár több sorra tördelve), idézett vagy sima skalár. */
  private inline(text: string, line: Line): unknown {
    const c = text[0];
    if (c === "[" || c === "{") {
      let src = text;
      while (flowBalance(src) > 0) {
        const next = this.pos < this.lines.length ? this.lines[this.pos] : null;
        if (!next) throw new YamlError("a flow érték nincs lezárva", line.no);
        src += " " + next.text.trim();
        this.pos++;
      }
      return new FlowParser(src, line.no).parse();
    }
    if (c === "'" || c === '"') {
      const { value, end } = readQuoted(text, 0, line.no);
      if (text.slice(end).trim() !== "") throw new YamlError(`váratlan szöveg az idézett érték után: "${text.slice(end)}"`, line.no);
      return value;
    }
    return resolvePlain(text, line.no);
  }

  /** `|` (sorok megtartása) és `>` (sorok összefűzése) blokk-skalár. */
  private blockScalar(header: string, parentIndent: number, line: Line): string {
    const style = header[0];
    const chomp = header[1] ?? "";
    const body: string[] = [];
    let blockIndent = -1;
    while (this.pos < this.lines.length) {
      const l = this.lines[this.pos];
      if (l.raw.trim() === "") {
        body.push("");
        this.pos++;
        continue;
      }
      if (l.indent <= parentIndent) break;
      if (blockIndent < 0) blockIndent = l.indent;
      if (l.indent < blockIndent) break;
      body.push(l.raw.slice(blockIndent));
      this.pos++;
    }
    let trailing = 0;
    while (body.length && body[body.length - 1] === "") {
      body.pop();
      trailing++;
    }
    let text: string;
    if (style === "|") text = body.join("\n");
    else {
      text = "";
      body.forEach((ln, i) => {
        if (i === 0) text = ln;
        else if (ln === "") text += "\n";
        else text += (text.endsWith("\n") || body[i - 1] === "" ? "" : " ") + ln;
      });
    }
    if (chomp === "-") return text;
    if (chomp === "+") return text + "\n".repeat(trailing + 1);
    return body.length ? text + "\n" : "";
  }
}

/** YAML (részhalmaz) szöveg → JavaScript érték. Hiba esetén `YamlError` sorszámmal.
 * @group yaml
 */
export function parseYaml(source: string): unknown {
  return new Parser(source).parse();
}
