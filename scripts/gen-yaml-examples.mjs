/**
 * gen-yaml-examples: a komponens-oldalak TypeScript példáiból YAML mintát készít.
 *
 * Minden documentation/examples/<oldal>.ts első `createX({...})` hívásának paraméter-objektumát
 * (csak a literál értékeket) átalakítja YAML leíró csomóponttá, és a src/spec/stringifyYaml.ts-sel kiírja.
 * A függvény-értékű paraméterek (eseménykezelők) és a nem literál értékek kimaradnak.
 *
 * Kimenet: documentation/generated/yamlExamples.json   { "Card": "ui:\n  - Card: ...", ... }
 * A docs a kézzel írt mintát (documentation/page-components/yamlExamples.ts) részesíti előnyben,
 * a generált csak azokhoz kell, amelyekhez nincs kézi minta (pl. új komponens).
 */
import { readFileSync, writeFileSync, existsSync } from "fs";
import { createRequire } from "module";
import path from "path";
import { parse } from "@babel/parser";

const require = createRequire(import.meta.url);
const ts = require("typescript");

/** A TypeScript forrású stringifyYaml betöltése futásidőben (nincs másolat, egy az igazság). */
async function loadStringify(root) {
  const src = readFileSync(path.join(root, "src", "spec", "stringifyYaml.ts"), "utf-8");
  const js = ts.transpileModule(src, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 } }).outputText;
  return (await import("data:text/javascript;base64," + Buffer.from(js).toString("base64"))).stringifyYaml;
}

const NO = Symbol("nem literál");

/** Igaz, ha egy nem literál (és nem függvény) érték kimaradt: ilyenkor a minta félrevezető lenne. */
let incomplete = false;

function lit(node) {
  switch (node.type) {
    case "StringLiteral":
    case "NumericLiteral":
    case "BooleanLiteral":
      return node.value;
    case "NullLiteral":
      return null;
    case "UnaryExpression": {
      const v = node.operator === "-" ? lit(node.argument) : NO;
      return typeof v === "number" ? -v : NO;
    }
    case "TemplateLiteral":
      return node.expressions.length === 0 ? node.quasis.map((q) => q.value.cooked).join("") : NO;
    case "ArrayExpression": {
      const out = [];
      for (const el of node.elements) {
        const v = el ? lit(el) : NO;
        if (v === NO) return NO;
        out.push(v);
      }
      return out;
    }
    case "ObjectExpression": {
      const out = {};
      for (const p of node.properties) {
        if (p.type !== "ObjectProperty" || p.computed) return NO;
        const k = p.key.type === "Identifier" ? p.key.name : p.key.type === "StringLiteral" ? p.key.value : null;
        if (k === null) return NO;
        if (k === "parent") continue; // a szülő a beágyazásból adódik
        const v = lit(p.value);
        if (v !== NO) out[k] = v;
        else if (!/Function/.test(p.value.type)) incomplete = true; // a kezelő függvények kimaradhatnak, minden más nem
      }
      return out;
    }
    default:
      return NO;
  }
}

/** Az első `name(...)` hívás az AST-ben. */
function findCall(node, name) {
  if (!node || typeof node.type !== "string") return null;
  if (node.type === "CallExpression" && node.callee.type === "Identifier" && node.callee.name === name) return node;
  for (const key of Object.keys(node)) {
    if (key === "loc" || key === "start" || key === "end") continue;
    const v = node[key];
    const kids = Array.isArray(v) ? v : [v];
    for (const k of kids) {
      const r = k && typeof k === "object" ? findCall(k, name) : null;
      if (r) return r;
    }
  }
  return null;
}

/** DOMOptions literál → leíró csomópont (nyers HTML elem). */
function domNode(o) {
  if (typeof o === "string") return o;
  if (!o || typeof o !== "object" || !o.tag) return null;
  const classes = typeof o.attrs?.class === "string" ? o.attrs.class.split(/\s+/).filter(Boolean) : [];
  const key = o.tag + (o.attrs?.id ? `#${o.attrs.id}` : "") + classes.map((c) => `.${c}`).join("");
  const body = {};
  if (o.text !== undefined) body.text = o.text;
  for (const [k, v] of Object.entries(o.attrs ?? {})) if (k !== "class" && k !== "id") body[k] = v;
  if (o.style) body.style = o.style;
  if (Array.isArray(o.children)) body.children = o.children.map(domNode).filter((x) => x !== null);
  const keys = Object.keys(body);
  return { [key]: keys.length === 0 ? null : keys.length === 1 && keys[0] === "text" ? body.text : body };
}

const toNodes = (v) => (Array.isArray(v) ? v : [v]).map(domNode).filter((x) => x !== null);
const SCALAR_TARGETS = ["text", "title", "message", "label", "labelText"];

export async function writeYamlExamples(root, manifest, props) {
  const stringifyYaml = await loadStringify(root);
  const overrides = JSON.parse(readFileSync(path.join(root, "src", "spec", "overrides.json"), "utf-8"));
  const out = {};
  const skipped = [];

  for (const c of manifest) {
    const file = path.join(root, "documentation", "examples", `${c.slug}.ts`);
    if (!existsSync(file)) continue;
    const ast = parse(readFileSync(file, "utf-8"), { sourceType: "module", plugins: ["typescript"] }).program;
    const call = findCall(ast, `create${c.name}`);
    if (!call || call.arguments.length === 0 || c.name === "Modal") {
      skipped.push(c.name);
      continue;
    }
    const o = overrides[c.name] ?? {};
    incomplete = false;

    let params;
    let key = c.name;
    if (["UnorderedList", "OrderedList", "Table"].includes(c.name)) {
      // createX(adat, params): az adat a lista-rövidítés
      const data = lit(call.arguments[0]);
      if (data === NO || !Array.isArray(data)) {
        skipped.push(c.name);
        continue;
      }
      params = data;
    } else {
      const first = call.arguments[0];
      params = first.type === "ObjectExpression" ? lit(first) : NO;
      if (params === NO) {
        skipped.push(c.name);
        continue;
      }
      delete params.parent;
      delete params.id;
      if (c.name === "Title" && call.arguments[1]) {
        const level = lit(call.arguments[1]);
        if (typeof level === "number") key = `Title(${level})`;
      }
      for (const k of [...Object.keys(o.slots ?? {}), ...(o.elements ?? [])]) if (params[k] !== undefined) params[k] = toNodes(params[k]);
      for (const [k, field] of Object.entries(o.items ?? {})) {
        if (Array.isArray(params[k])) params[k] = params[k].map((it) => (it[field] !== undefined ? { ...it, [field]: toNodes(it[field]) } : it));
      }
      // skalár rövidítés, ha csak a fő szöveg van
      const typeName = props[`create${c.name}`]?.paramsType;
      const known = (props[typeName]?.props ?? []).map((p) => p.name);
      const textKey = o.text ?? SCALAR_TARGETS.find((t) => known.includes(t));
      const keys = Object.keys(params);
      if (keys.length === 1 && keys[0] === textKey && typeof params[textKey] === "string") params = params[textKey];
    }
    if (incomplete) {
      skipped.push(c.name);
      continue;
    }
    out[c.name] = stringifyYaml({ ui: [{ [key]: params }] });
  }

  writeFileSync(path.join(root, "documentation", "generated", "yamlExamples.json"), JSON.stringify(out, null, 2) + "\n", "utf-8");
  console.log(`[gen-yaml-examples] ✅ ${Object.keys(out).length} YAML minta a TS példákból` + (skipped.length ? ` (kihagyva: ${skipped.join(", ")})` : ""));
  return out;
}
