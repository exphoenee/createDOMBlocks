/**
 * spec-catalog: a YAML leíróban használható komponensek és paramétereik, a generált típusinfókból.
 *
 *   node scripts/spec-catalog.mjs                 # az összes komponens neve
 *   node scripts/spec-catalog.mjs Card Gantt      # a megadott komponensek paraméterei (típus, kötelező, leírás)
 *   node scripts/spec-catalog.mjs --find tábla    # keresés név / leírás alapján
 */
import { readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { specComponents } from "./spec-meta.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const props = JSON.parse(readFileSync(path.join(ROOT, "documentation", "generated", "props.json"), "utf8"));
const overrides = JSON.parse(readFileSync(path.join(ROOT, "src", "spec", "overrides.json"), "utf8"));
const comps = specComponents(props);
const args = process.argv.slice(2);

const SCALAR = ["text", "title", "message", "label", "labelText"];
const info = (name) => {
  const o = overrides[name] ?? {};
  const all = [...comps[name].all.filter((p) => p !== "parent"), ...(o.extra ?? [])];
  const lines = [];
  const text = o.text ?? SCALAR.find((t) => all.includes(t));
  lines.push(`skalár rövidítés (${name}: szöveg) → ${text ?? "nincs"}`);
  lines.push(`lista rövidítés (${name}: [..]) → ${o.array ?? "children"}`);
  if (o.slots) lines.push(`gyerek-tárolók (csomópont-listák): ${Object.keys(o.slots).join(", ")}`);
  if (o.elements) lines.push(`statikus elemlista: ${o.elements.join(", ")}`);
  if (o.items) lines.push(`tartalmas elemek: ${Object.entries(o.items).map(([k, v]) => `${k}[].${v}`).join(", ")}`);
  if (o.bind) lines.push(`bind: igen (${o.bind})`);
  if (o.updaters) lines.push(`állapotból frissül újraépítés nélkül: ${Object.keys(o.updaters).join(", ")}`);
  return lines;
};

if (args[0] === "--find") {
  const q = (args[1] ?? "").toLowerCase();
  for (const name of Object.keys(comps)) {
    const typeName = props[`create${name}`].paramsType;
    const hay = [name, ...(props[typeName]?.props ?? []).map((p) => `${p.name} ${p.description}`)].join(" ").toLowerCase();
    if (hay.includes(q)) console.log(name);
  }
} else if (args.length === 0) {
  console.log(Object.keys(comps).join("\n"));
} else {
  for (const name of args) {
    if (!comps[name]) {
      console.error(`Ismeretlen komponens: ${name}`);
      continue;
    }
    const typeName = props[`create${name}`].paramsType;
    console.log(`## ${name}\n${info(name).map((l) => "  " + l).join("\n")}`);
    for (const p of props[typeName].props.filter((x) => x.name !== "parent")) {
      const fn = /=>|Function/.test(p.type) ? "  [visszahívás: \"@kezelő\" vagy művelet]" : "";
      console.log(`- ${p.name}${p.required ? " (kötelező)" : ""}: ${p.type.replace(/ \| undefined$/, "")}${p.default ? ` = ${p.default}` : ""}${fn}\n    ${p.description}`);
    }
    for (const x of overrides[name]?.extra ?? []) console.log(`- ${x}: (a leíró saját paramétere)`);
    console.log("");
  }
}
