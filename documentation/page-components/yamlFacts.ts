/**
 * „YAML-ban” összefoglaló a komponens-oldalakhoz: mi rövidíthető, mi köthető, mi frissül újraépítés nélkül,
 * hová kerülnek a gyerek-csomópontok és melyek a visszahívások.
 *
 * A forrás a leíró saját regisztrációja (src/spec/registry.ts ← overrides.json + a típusokból generált
 * meta.generated.ts) és a src/spec/keywords.json, így a doboz mindig azt mutatja, amit a leíró ténylegesen tud.
 */
import { getDef } from "../../src/spec/registry";
import keywords from "../../src/spec/keywords.json";
import { tr } from "./i18n";
import type { TextRef } from "../../src/index";

const code = (names: string[]): string => names.map((n) => `<code>${n}</code>`).join(", ");

/** Minden komponensen használható leíró-kulcsok (a bind csak a beviteli komponenseken). */
const COMMON = Object.entries(keywords.node as Record<string, { on: string[] }>)
  .filter(([k, kw]) => kw.on.includes("component") && k !== "bind")
  .map(([k]) => k);

/** A komponens YAML-tényei, megjelenítésre kész (nyelvesített, HTML-t tartalmazó) sorokként. */
export function yamlFacts(componentName: string): TextRef[] {
  const def = getDef(componentName);
  if (!def) return [];
  const facts: TextRef[] = [];
  if (def.text) facts.push(tr("Skalár rövidítés: <code>{name}: érték</code> → <code>{param}</code>", { name: componentName, param: def.text }));
  if (def.array) facts.push(tr("Lista rövidítés: <code>{name}: [...]</code> → <code>{param}</code>", { name: componentName, param: def.array }));
  if (def.bind) facts.push(tr("Kétirányú kötés: <code>bind: állapot-kulcs</code> (a komponens {param} értéke)", { param: def.bind === "checked" ? "checked" : def.bind === "radio" ? "radio" : "value" }));
  const live = Object.keys(def.updaters ?? {});
  if (live.length) facts.push(tr("Állapotváltozáskor újraépítés nélkül frissül: {list}", { list: code(live) }));
  const children = [
    ...Object.keys(def.slots ?? {}),
    ...(def.elements ?? []),
    ...Object.entries(def.items ?? {}).map(([k, f]) => `${k}[].${f}`),
  ];
  if (children.length) facts.push(tr("Gyerek-csomópontokat fogad: {list}", { list: code(children) }));
  const fns = [...def.fns].sort();
  if (fns.length) facts.push(tr("Visszahívások (<code>\"@kezelő\"</code> vagy beépített művelet): {list}", { list: code(fns) }));
  // a t / args csak fő szöveg-paraméterrel rendelkező komponensen működik
  const common = def.text ? COMMON : COMMON.filter((k) => k !== "t" && k !== "args");
  facts.push(tr("Minden komponensen használható: {list}", { list: code(common) }));
  return facts;
}
