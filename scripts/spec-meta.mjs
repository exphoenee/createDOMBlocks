/**
 * spec-meta: a props.json-ból generálja a deklaratív leíró (src/spec) komponens-metaadatait.
 * A gen-props.mjs hívja; kimenet: src/spec/meta.generated.ts (ne szerkeszd kézzel).
 */
import { writeIfChanged } from "./fs-utils.mjs";
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
  writeIfChanged(resolve(root, "src", "spec", "meta.generated.ts"), src, "utf-8");
  console.log(`[spec-meta] ✅ src/spec/meta.generated.ts (${lines.length} komponens)`);
}

/* ===== JSON Schema a szerkesztők automatikus kiegészítéséhez ===== */

import { readFileSync } from "fs";

const CALLBACK = { anyOf: [{ type: "string", pattern: "^@" }, { type: "object" }, { type: "array" }], description: "@kezelő vagy beépített művelet (set, toggle, inc, push, open, close)" };

function typeSchema(raw) {
  const t = String(raw).replace(/\s*\|\s*undefined$/, "").trim();
  if (/=>|\bFunction\b/.test(t)) return CALLBACK;
  if (/^("[^"]*"|'[^']*')(\s*\|\s*("[^"]*"|'[^']*'))*$/.test(t)) {
    return { enum: t.split("|").map((x) => x.trim().replace(/^["']|["']$/g, "")) };
  }
  if (t === "boolean") return { type: "boolean" };
  if (t === "number") return { type: "number" };
  if (t === "string" || t === "TextValue") return { type: ["string", "number"] };
  if (/\[\]$/.test(t)) return { type: "array" };
  return {};
}

export function writeSpecSchema(props, root) {
  const comps = specComponents(props);
  const overrides = JSON.parse(readFileSync(resolve(root, "src", "spec", "overrides.json"), "utf-8"));
  const nodeRef = { $ref: "#/$defs/node" };
  const nodeList = { type: "array", items: nodeRef };
  const patternProperties = {};

  for (const [name, meta] of Object.entries(comps)) {
    const o = overrides[name] ?? {};
    const typeName = props[`create${name}`].paramsType;
    const byName = Object.fromEntries((props[typeName]?.props ?? []).map((p) => [p.name, p]));
    const properties = {};
    for (const n of meta.all) {
      if (n === "parent") continue;
      const p = byName[n];
      properties[n] = { ...typeSchema(p?.type ?? ""), ...(p?.description ? { description: p.description } : {}) };
    }
    for (const n of o.extra ?? []) properties[n] ??= o.extraFns?.includes(n) ? CALLBACK : {};
    for (const k of [...Object.keys(o.slots ?? {}), ...(o.elements ?? [])]) properties[k] = nodeList;
    for (const [k, field] of Object.entries(o.items ?? {})) {
      properties[k] = { type: "array", items: { type: "object", properties: { [field]: nodeList } } };
    }
    Object.assign(properties, {
      t: { type: "string", description: "nyelvi kulcs (tr)" },
      args: { type: "object", description: "a nyelvi szöveg paraméterei" },
      ...(o.bind ? { bind: { type: "string", description: "állapot-kulcs: kétirányú kötés" } } : {}),
    });
    patternProperties[`^${name}(\(\d+\))?([#.].*)?$`] = {
      description: `createDOMBlocks ${name} komponens`,
      oneOf: [{ type: ["string", "number", "boolean", "null"] }, nodeList, { type: "object", properties, additionalProperties: false }],
    };
  }
  // nyers HTML elem
  patternProperties["^[a-z][a-z0-9-]*(\(\d+\))?([#.].*)?$"] = { oneOf: [{ type: ["string", "number", "boolean", "null"] }, nodeList, { type: "object" }] };
  // saját (define) részletek: nagybetűs névvel, bármilyen értékkel
  patternProperties["^[A-Z][A-Za-z0-9]*([#.].*)?$"] = {};

  const schema = {
    $schema: "http://json-schema.org/draft-07/schema#",
    title: "createDOMBlocks oldalleíró",
    description: "Deklaratív oldalleíró a createDOMBlocks buildUI / mountYaml függvényeihez",
    type: "object",
    additionalProperties: false,
    properties: {
      ui: nodeList,
      state: { type: "object", description: "kezdőállapot" },
      messages: { type: "object", description: "nyelvi szövegek: { hu: {...}, en: {...} }" },
      theme: { type: "object", description: "CSS-változók a :root-ra (dark: a sötét témára)" },
      define: { type: "object", description: "saját, paraméterezhető részletek: { Név: { params: [...], body: [...] } }" },
      data: { type: "object", description: "statikus adatok" },
    },
    $defs: {
      node: {
        oneOf: [
          { type: ["string", "number", "boolean"] },
          {
            type: "object",
            required: ["each"],
            properties: {
              each: { type: "object", required: ["in", "as"], properties: { in: {}, as: { type: "string" }, key: {} } },
              do: nodeList,
            },
            additionalProperties: false,
          },
          {
            type: "object",
            required: ["if"],
            properties: { if: {}, then: nodeList, else: nodeList },
            additionalProperties: false,
          },
          { type: "object", minProperties: 1, maxProperties: 1, patternProperties, additionalProperties: false },
        ],
      },
    },
  };
  writeIfChanged(resolve(root, "assets", "createDOMBlocks.schema.json"), JSON.stringify(schema, null, 2) + "\n", "utf-8");
  console.log(`[spec-meta] ✅ assets/createDOMBlocks.schema.json (${Object.keys(comps).length} komponens)`);
}
