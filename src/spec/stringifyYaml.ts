/**
 * JavaScript érték → olvasható YAML (a `parseYaml` által visszaolvasható részhalmaz).
 *
 * Blokk-forma, 2 szóköz behúzás; a rövid, egyszerű tömbök és térképek egysoros (flow) formában kerülnek ki,
 * a többsoros szövegek `|` blokk-szövegként. A `undefined` és a függvény értékű mezők kimaradnak.
 */

export interface StringifyOptions {
  /** Ennél rövidebb (karakterben) egyszerű tömb / térkép egy sorba kerül. Alapból 72. */
  flowLimit?: number;
  /** Behúzás: mindig 2 szóköz (a lista-elemek igazítása miatt nem állítható). */
  indent?: number;
}

const RESERVED = /^(null|true|false|~|yes|no|on|off)$/i;
const NUMBER_LIKE = /^[-+]?(\d[\d_]*\.?\d*|\.\d+)([eE][-+]?\d+)?$/;

/** Kell-e idézőjel egy szöveghez, hogy a YAML visszaolvasva ugyanaz a szöveg legyen. */
function needsQuotes(s: string): boolean {
  if (s === "" || s !== s.trim()) return true;
  if (RESERVED.test(s) || NUMBER_LIKE.test(s) || /^0\d/.test(s)) return true;
  if (/^[-?:,[\]{}#&*!|>'"%@`]/.test(s) && !/^-[A-Za-z0-9]/.test(s)) return true;
  if (/^-(\s|$)/.test(s)) return true;
  if (/: |:$| #|\t/.test(s) || s.includes("${") || s.includes("\n")) return true;
  return false;
}

const quote = (s: string): string => JSON.stringify(s);
const scalar = (v: unknown): string => {
  if (v === null) return "null";
  if (typeof v === "string") return needsQuotes(v) ? quote(v) : v;
  return String(v);
};
const key = (k: string): string => (needsQuotes(k) || /[:#]/.test(k) ? quote(k) : k);

const isScalar = (v: unknown): boolean => v === null || ["string", "number", "boolean"].includes(typeof v);
const isPlainObject = (v: unknown): v is Record<string, unknown> => !!v && typeof v === "object" && !Array.isArray(v);
const clean = (o: Record<string, unknown>): Array<[string, unknown]> =>
  Object.entries(o).filter(([, v]) => v !== undefined && typeof v !== "function");

/** Egysoros (flow) alak, ha csak skalárokat / egyszerű beágyazást tartalmaz; különben `null`. */
function flow(v: unknown, limit: number): string | null {
  if (isScalar(v)) return typeof v === "string" && v.includes("\n") ? null : scalar(v);
  if (Array.isArray(v)) {
    const parts = v.map((x) => flow(x, limit));
    if (parts.some((p) => p === null)) return null;
    const s = `[${parts.join(", ")}]`;
    return s.length <= limit ? s : null;
  }
  if (isPlainObject(v)) {
    const entries = clean(v);
    const parts = entries.map(([k, x]) => {
      const f = flow(x, limit);
      return f === null ? null : `${key(k)}: ${f}`;
    });
    if (parts.some((p) => p === null)) return null;
    const s = entries.length ? `{ ${parts.join(", ")} }` : "{}";
    return s.length <= limit ? s : null;
  }
  return null;
}

function emit(value: unknown, level: number, o: Required<StringifyOptions>, out: string[], prefix: string): void {
  const pad = " ".repeat(level * o.indent);

  if (Array.isArray(value)) {
    if (value.length === 0) {
      out.push(`${pad}${prefix}[]`);
      return;
    }
    value.forEach((item, i) => {
      const lead = i === 0 ? prefix : "";
      emitListItem(item, level, o, out, i === 0 ? pad + lead : pad);
    });
    return;
  }

  if (isPlainObject(value)) {
    const entries = clean(value);
    if (entries.length === 0) {
      out.push(`${pad}${prefix}{}`);
      return;
    }
    entries.forEach(([k, v], i) => emitEntry(k, v, level, o, out, i === 0 ? prefix : ""));
    return;
  }
  out.push(`${pad}${prefix}${scalar(value)}`);
}

function emitListItem(item: unknown, level: number, o: Required<StringifyOptions>, out: string[], pad: string): void {
  const dash = "- ";
  if (isScalar(item) && !(typeof item === "string" && item.includes("\n"))) {
    out.push(`${pad}${dash}${scalar(item)}`);
    return;
  }
  const f = flow(item, o.flowLimit);
  if (f !== null) {
    out.push(`${pad}${dash}${f}`);
    return;
  }
  if (typeof item === "string") {
    out.push(`${pad}${dash}|`);
    item.replace(/\n$/, "").split("\n").forEach((l) => out.push(`${pad}${" ".repeat(o.indent)}${l}`));
    return;
  }
  // beágyazott térkép / lista: az első sor a "- " után, a többi a tartalom oszlopához igazítva
  const inner: string[] = [];
  emit(item, level + 1, o, inner, "");
  if (inner.length === 0) {
    out.push(`${pad}${dash.trimEnd()}`);
    return;
  }
  const childPad = " ".repeat((level + 1) * o.indent);
  inner[0] = `${pad}${dash}${inner[0].slice(childPad.length)}`;
  out.push(...inner);
}

function emitEntry(k: string, v: unknown, level: number, o: Required<StringifyOptions>, out: string[], prefix: string): void {
  const pad = " ".repeat(level * o.indent);
  const head = `${pad}${prefix}${key(k)}:`;
  if (typeof v === "string" && v.includes("\n")) {
    out.push(`${head} |${v.endsWith("\n") ? "" : "-"}`);
    v.replace(/\n$/, "").split("\n").forEach((l) => out.push(`${pad}${" ".repeat(o.indent)}${l}`));
    return;
  }
  const f = flow(v, o.flowLimit);
  if (f !== null) {
    out.push(`${head} ${f}`);
    return;
  }
  out.push(head);
  if (Array.isArray(v) || isPlainObject(v)) emit(v, level + 1, o, out, "");
}

/** JavaScript érték → YAML szöveg (záró sortöréssel).
 * @group yaml
 */
export function stringifyYaml(value: unknown, options: StringifyOptions = {}): string {
  const o: Required<StringifyOptions> = { flowLimit: options.flowLimit ?? 72, indent: 2 };
  const out: string[] = [];
  if (isScalar(value) && !(typeof value === "string" && value.includes("\n"))) return scalar(value) + "\n";
  emit(value, 0, o, out, "");
  return out.join("\n") + "\n";
}
