/**
 * spec-meta: a props.json-ból generálja a deklaratív leíró (src/spec) komponens-metaadatait.
 * A gen-props.mjs hívja; kimenet: src/spec/meta.generated.ts (ne szerkeszd kézzel).
 */
import { writeFileSync } from "fs";
import { resolve } from "path";

// belső segédfüggvények, nem komponensek
const INTERNAL = new Set(["DOMElem", "InputElem", "InputChildren", "InputContainer", "CalendarHeader", "DayCell", "DayGrid"]);

export function specComponents(props) {
  const out = {};
  for (const [fn, info] of Object.entries(props)) {
    if (!fn.startsWith("create") || !info || !info.paramsType) continue;
    const name = fn.slice("create".length);
    if (INTERNAL.has(name)) continue;
    const entry = props[info.paramsType];
    if (!entry || !Array.isArray(entry.props)) continue;
    out[name] = {
      all: entry.props.map((p) => p.name),
      required: entry.props.filter((p) => p.required).map((p) => p.name),
      // visszahívás-paraméterek (függvény típusúak): ide köthető a "@handler" és a beépített műveletek
      fns: entry.props.filter((p) => /=>|Function/.test(p.type)).map((p) => p.name),
    };
  }
  return out;
}

export function writeSpecMeta(props, root) {
  const comps = specComponents(props);
  const lines = Object.keys(comps)
    .sort()
    .map((k) => `  ${k}: { all: ${JSON.stringify(comps[k].all)}, required: ${JSON.stringify(comps[k].required)}, fns: ${JSON.stringify(comps[k].fns)} },`);
  const src = `// GENERÁLT FÁJL: scripts/gen-props.mjs → scripts/spec-meta.mjs. Ne szerkeszd kézzel.
export const SPEC_PARAMS: Record<string, { all: string[]; required: string[]; fns: string[] }> = {
${lines.join("\n")}
};
`;
  writeFileSync(resolve(root, "src", "spec", "meta.generated.ts"), src, "utf-8");
  console.log(`[spec-meta] ✅ src/spec/meta.generated.ts (${lines.length} komponens)`);
}
