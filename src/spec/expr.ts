/**
 * `eval`-mentes kifejezés-értelmező a `${...}` sablonokhoz.
 *
 * Támogatott: számok, szövegek (`'..'`, `".."`), `true` / `false` / `null`, útvonalak (`a.b[0].c`, `a[k]`),
 * `! - + * / % < <= > >= == != && || ??`, ternáris `?:`, zárójelek és az engedélyezett függvények
 * (`len`, `upper`, `lower`, `trim`, `join`, `round`, `min`, `max`, `str`, `plural`).
 * Nincs hozzárendelés, nincs metódushívás, nincs globális hozzáférés, a `__proto__` / `constructor` /
 * `prototype` kulcsok tiltottak.
 */

export class ExprError extends Error {
  constructor(message: string, public source: string) {
    super(`Kifejezés hiba: ${message} (${source})`);
    this.name = "ExprError";
  }
}

export type ExprNode =
  | { t: "num" | "str" | "bool" | "null"; v: unknown }
  | { t: "id"; name: string }
  | { t: "member"; obj: ExprNode; key: string }
  | { t: "index"; obj: ExprNode; key: ExprNode }
  | { t: "call"; name: string; args: ExprNode[] }
  | { t: "un"; op: string; a: ExprNode }
  | { t: "bin"; op: string; a: ExprNode; b: ExprNode }
  | { t: "cond"; c: ExprNode; a: ExprNode; b: ExprNode };

/** A kifejezés környezete: a gyökér azonosítók feloldása és az olvasott állapot-útvonalak jelentése. */
export interface ExprEnv {
  /** Gyökér azonosító feloldása. `statePath`: ha állapotból jön, az útvonal kezdete (követéshez). */
  resolve(name: string): { value: unknown; statePath?: string } | undefined;
  /** Egy állapot-útvonal olvasása (függőség-gyűjtéshez). */
  read?(path: string): void;
}

const FORBIDDEN = new Set(["__proto__", "constructor", "prototype"]);

/* ===== Tokenizer ===== */

interface Tok { k: "num" | "str" | "id" | "op" | "end"; v: string; n?: number }

function tokenize(src: string): Tok[] {
  const out: Tok[] = [];
  let i = 0;
  while (i < src.length) {
    const c = src[i];
    if (/\s/.test(c)) { i++; continue; }
    const prev = out[out.length - 1];
    const afterValue = !!prev && (prev.k === "id" || prev.k === "num" || (prev.k === "op" && (prev.v === "]" || prev.v === ")")));
    if (/[0-9]/.test(c) || (c === "." && !afterValue && /[0-9]/.test(src[i + 1] ?? ""))) {
      const m = /^(\d+(\.\d+)?|\.\d+)([eE][-+]?\d+)?/.exec(src.slice(i))!;
      out.push({ k: "num", v: m[0], n: Number(m[0]) });
      i += m[0].length;
      continue;
    }
    if (c === "'" || c === '"') {
      let j = i + 1;
      let s = "";
      for (; j < src.length && src[j] !== c; j++) {
        if (src[j] === "\\") {
          const n = src[++j];
          s += n === "n" ? "\n" : n === "t" ? "\t" : (n ?? "");
        } else s += src[j];
      }
      if (src[j] !== c) throw new ExprError("nincs lezárva az idézőjel", src);
      out.push({ k: "str", v: s });
      i = j + 1;
      continue;
    }
    if (/[A-Za-z_$]/.test(c)) {
      const m = /^[A-Za-z_$][A-Za-z0-9_$]*/.exec(src.slice(i))!;
      out.push({ k: "id", v: m[0] });
      i += m[0].length;
      continue;
    }
    const three = src.slice(i, i + 3);
    const two = src.slice(i, i + 2);
    if (three === "===" || three === "!==") throw new ExprError(`használj ${three.slice(0, 2)} operátort`, src);
    if (["==", "!=", "<=", ">=", "&&", "||", "??"].includes(two)) {
      out.push({ k: "op", v: two });
      i += 2;
      continue;
    }
    if ("+-*/%<>!?:()[].,".includes(c)) {
      out.push({ k: "op", v: c });
      i++;
      continue;
    }
    throw new ExprError(`ismeretlen karakter: "${c}"`, src);
  }
  out.push({ k: "end", v: "" });
  return out;
}

/* ===== Parser (precedencia-mászó) ===== */

const BIN_PREC: Record<string, number> = {
  "??": 1, "||": 2, "&&": 3, "==": 4, "!=": 4, "<": 5, "<=": 5, ">": 5, ">=": 5, "+": 6, "-": 6, "*": 7, "/": 7, "%": 7,
};

class ExprParser {
  private p = 0;
  private toks: Tok[];
  constructor(private src: string) {
    this.toks = tokenize(src);
  }

  parse(): ExprNode {
    const node = this.ternary();
    if (this.toks[this.p].k !== "end") throw new ExprError(`váratlan: "${this.toks[this.p].v}"`, this.src);
    return node;
  }

  private is(v: string): boolean {
    const t = this.toks[this.p];
    return t.k === "op" && t.v === v;
  }

  private eat(v: string): void {
    if (!this.is(v)) throw new ExprError(`"${v}" hiányzik`, this.src);
    this.p++;
  }

  private ternary(): ExprNode {
    const c = this.binary(1);
    if (this.is("?")) {
      this.p++;
      const a = this.ternary();
      this.eat(":");
      const b = this.ternary();
      return { t: "cond", c, a, b };
    }
    return c;
  }

  private binary(minPrec: number): ExprNode {
    let left = this.unary();
    for (;;) {
      const t = this.toks[this.p];
      const prec = t.k === "op" ? BIN_PREC[t.v] : undefined;
      if (!prec || prec < minPrec) return left;
      this.p++;
      const right = this.binary(prec + 1);
      left = { t: "bin", op: t.v, a: left, b: right };
    }
  }

  private unary(): ExprNode {
    if (this.is("!") || this.is("-") || this.is("+")) {
      const op = this.toks[this.p++].v;
      return { t: "un", op, a: this.unary() };
    }
    return this.postfix();
  }

  private postfix(): ExprNode {
    let node = this.primary();
    for (;;) {
      if (this.is(".")) {
        this.p++;
        const t = this.toks[this.p++];
        if (t.k !== "id" && t.k !== "num") throw new ExprError("mezőnév hiányzik a „.” után", this.src);
        if (FORBIDDEN.has(t.v)) throw new ExprError(`tiltott mezőnév: ${t.v}`, this.src);
        node = { t: "member", obj: node, key: t.v };
      } else if (this.is("[")) {
        this.p++;
        const key = this.ternary();
        this.eat("]");
        node = { t: "index", obj: node, key };
      } else return node;
    }
  }

  private primary(): ExprNode {
    const t = this.toks[this.p++];
    if (t.k === "num") return { t: "num", v: t.n };
    if (t.k === "str") return { t: "str", v: t.v };
    if (t.k === "id") {
      if (t.v === "true" || t.v === "false") return { t: "bool", v: t.v === "true" };
      if (t.v === "null") return { t: "null", v: null };
      if (this.is("(")) {
        if (!(t.v in FUNCTIONS)) throw new ExprError(`ismeretlen függvény: ${t.v} (engedélyezett: ${Object.keys(FUNCTIONS).join(", ")})`, this.src);
        this.p++;
        const args: ExprNode[] = [];
        if (!this.is(")")) {
          for (;;) {
            args.push(this.ternary());
            if (this.is(",")) { this.p++; continue; }
            break;
          }
        }
        this.eat(")");
        return { t: "call", name: t.v, args };
      }
      if (FORBIDDEN.has(t.v)) throw new ExprError(`tiltott azonosító: ${t.v}`, this.src);
      return { t: "id", name: t.v };
    }
    if (t.k === "op" && t.v === "(") {
      const inner = this.ternary();
      this.eat(")");
      return inner;
    }
    throw new ExprError(t.k === "end" ? "váratlan kifejezés-vég" : `váratlan: "${t.v}"`, this.src);
  }
}

/** Kifejezés szövegének értelmezése (szintaktikai hiba esetén `ExprError`). */
export function parseExpr(src: string): ExprNode {
  return new ExprParser(src).parse();
}

/* ===== Függvények ===== */

const num = (v: unknown): number => (typeof v === "number" ? v : Number(v));
const FUNCTIONS: Record<string, (...a: unknown[]) => unknown> = {
  len: (v) => (typeof v === "string" || Array.isArray(v) ? v.length : v && typeof v === "object" ? Object.keys(v).length : 0),
  upper: (v) => String(v ?? "").toUpperCase(),
  lower: (v) => String(v ?? "").toLowerCase(),
  trim: (v) => String(v ?? "").trim(),
  join: (v, sep) => (Array.isArray(v) ? v.join(sep === undefined ? ", " : String(sep)) : ""),
  round: (v, digits) => {
    const f = 10 ** (digits === undefined ? 0 : num(digits));
    return Math.round(num(v) * f) / f;
  },
  min: (...a) => Math.min(...a.map(num)),
  max: (...a) => Math.max(...a.map(num)),
  str: (v) => (v === null || v === undefined ? "" : String(v)),
  plural: (n, one, other) => (num(n) === 1 ? one : other),
};

/* ===== Kiértékelés ===== */

const truthy = (v: unknown): boolean => !!v;

interface Ref { value: unknown; path?: string }

function evalRef(node: ExprNode, env: ExprEnv): Ref {
  switch (node.t) {
    case "id": {
      const r = env.resolve(node.name);
      return r ? { value: r.value, path: r.statePath } : { value: undefined };
    }
    case "member": {
      const o = evalRef(node.obj, env);
      if (FORBIDDEN.has(node.key)) return { value: undefined };
      const v = o.value !== null && o.value !== undefined ? (o.value as Record<string, unknown>)[node.key] : undefined;
      return { value: v, path: o.path !== undefined ? `${o.path}.${node.key}` : undefined };
    }
    case "index": {
      const o = evalRef(node.obj, env);
      const k = evalNode(node.key, env);
      const key = String(k);
      if (FORBIDDEN.has(key)) return { value: undefined };
      const v = o.value !== null && o.value !== undefined ? (o.value as Record<string, unknown>)[key] : undefined;
      return { value: v, path: o.path !== undefined ? `${o.path}.${key}` : undefined };
    }
    default:
      return { value: evalNode(node, env) };
  }
}

function evalNode(node: ExprNode, env: ExprEnv): unknown {
  switch (node.t) {
    case "num":
    case "str":
    case "bool":
    case "null":
      return node.v;
    case "id":
    case "member":
    case "index": {
      const r = evalRef(node, env);
      if (r.path !== undefined) env.read?.(r.path);
      return r.value;
    }
    case "call":
      return FUNCTIONS[node.name](...node.args.map((a) => evalNode(a, env)));
    case "un": {
      const v = evalNode(node.a, env);
      if (node.op === "!") return !truthy(v);
      return node.op === "-" ? -num(v) : num(v);
    }
    case "cond":
      return truthy(evalNode(node.c, env)) ? evalNode(node.a, env) : evalNode(node.b, env);
    case "bin": {
      if (node.op === "&&") {
        const a = evalNode(node.a, env);
        return truthy(a) ? evalNode(node.b, env) : a;
      }
      if (node.op === "||") {
        const a = evalNode(node.a, env);
        return truthy(a) ? a : evalNode(node.b, env);
      }
      if (node.op === "??") {
        const a = evalNode(node.a, env);
        return a === null || a === undefined ? evalNode(node.b, env) : a;
      }
      const a = evalNode(node.a, env);
      const b = evalNode(node.b, env);
      switch (node.op) {
        case "+": return typeof a === "string" || typeof b === "string" ? `${a ?? ""}${b ?? ""}` : num(a) + num(b);
        case "-": return num(a) - num(b);
        case "*": return num(a) * num(b);
        case "/": return num(a) / num(b);
        case "%": return num(a) % num(b);
        case "==": return a === b || (a == null && b == null);
        case "!=": return !(a === b || (a == null && b == null));
        case "<": return (a as number) < (b as number);
        case "<=": return (a as number) <= (b as number);
        case ">": return (a as number) > (b as number);
        case ">=": return (a as number) >= (b as number);
      }
      throw new ExprError(`ismeretlen operátor: ${node.op}`, "");
    }
  }
}

/** Kifejezés kiértékelése a megadott környezetben. */
export function evalExpr(node: ExprNode, env: ExprEnv): unknown {
  return evalNode(node, env);
}

/* ===== Sablonok: "szöveg ${kifejezés} szöveg" ===== */

export type TemplatePart = string | { expr: ExprNode; src: string };
export interface Template { parts: TemplatePart[]; whole: boolean }

/** Egy `${...}` záró `}` helye (beágyazott zárójelek és idézőjelek figyelembevételével); -1, ha nincs. */
function findClose(s: string, from: number): number {
  let depth = 1;
  let quote = "";
  for (let i = from; i < s.length; i++) {
    const c = s[i];
    if (quote) {
      if (c === "\\") i++;
      else if (c === quote) quote = "";
      continue;
    }
    if (c === "'" || c === '"') quote = c;
    else if (c === "{") depth++;
    else if (c === "}" && --depth === 0) return i;
  }
  return -1;
}

/** `true`, ha a szöveg tartalmaz `${...}` kifejezést. */
export function hasTemplate(s: string): boolean {
  return /(^|[^$])\$\{/.test(s) || s.startsWith("${");
}

/** Sablon felbontása. `null`, ha nincs benne kifejezés (a `$${` literális `${`). */
export function compileTemplate(s: string): Template | null {
  const parts: TemplatePart[] = [];
  let lit = "";
  let any = false;
  for (let i = 0; i < s.length; i++) {
    if (s[i] === "$" && s[i + 1] === "$" && s[i + 2] === "{") {
      lit += "${";
      i += 2;
      continue;
    }
    if (s[i] === "$" && s[i + 1] === "{") {
      const close = findClose(s, i + 2);
      if (close < 0) throw new ExprError("a ${ nincs lezárva", s);
      if (lit) parts.push(lit);
      lit = "";
      const src = s.slice(i + 2, close).trim();
      parts.push({ expr: parseExpr(src), src });
      any = true;
      i = close;
      continue;
    }
    lit += s[i];
  }
  if (!any) return null;
  if (lit) parts.push(lit);
  return { parts, whole: parts.length === 1 && typeof parts[0] !== "string" };
}

/** Sablon kiértékelése: ha az egész szöveg egyetlen `${}`, a nyers értéket adja, egyébként szöveget. */
export function evalTemplate(tpl: Template, env: ExprEnv): unknown {
  if (tpl.whole) return evalNode((tpl.parts[0] as { expr: ExprNode }).expr, env);
  return tpl.parts
    .map((p) => {
      if (typeof p === "string") return p;
      const v = evalNode(p.expr, env);
      return v === null || v === undefined ? "" : String(v);
    })
    .join("");
}
