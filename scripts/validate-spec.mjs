/**
 * validate-spec: egy YAML oldalleírás ellenőrzése a ténylegesen felépített könyvtárral (jsdom).
 *
 *   node scripts/validate-spec.mjs <leiras.yaml | oldal.html[#id]> [--data adat.json] [--state allapot.json] [--lib build.js] [--strict] [--print]
 *
 * - HTML-fájlnál a `<script type="text/yaml">` blokkot ellenőrzi (`#id`-vel egy adott blokkot); a hibák sorszáma a HTML-beli sor;
 * - felépíti az oldalt a dist/index.js-sel (előtte: npm run build; más helyen lévő buildhez, pl. vendor-fájlhoz: --lib),
 *   és kiírja a hibákat útvonallal és javaslattal;
 * - --strict: az ismeretlen neveket és a hiányzó mezőket is jelzi (a buildUI strict módja), és ezek is hibának számítanak;
 * - a "@név" kezelőket üres függvényekkel pótolja, és kiírja, melyeket kell a JavaScriptben megírni;
 * - kiírja a $név adathivatkozásokat és az állapot-kulcsokat (mi kell még az oldalhoz);
 * - --print: a felépített HTML-t is kiírja.
 *
 * Kilépési kód: 0 rendben, 1 a leírás hibás (vagy --strict mellett figyelmeztetés volt), 2 használati hiba.
 */
import { readFileSync, existsSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { JSDOM } from "jsdom";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

/**
 * A leírás beolvasása. HTML-fájlnál (`oldal.html#page`, alapból az első `<script type="text/yaml">`) a blokk
 * tartalma; a `lineOffset` a blokk kezdősora előtti sorok száma (a hibaüzenetek sorszámát ehhez igazítjuk).
 */
export function readSpec(target) {
  const hashAt = target.lastIndexOf("#");
  const isHtml = /\.html?(#|$)/i.test(target);
  const p = isHtml && hashAt > -1 ? target.slice(0, hashAt) : target;
  const id = isHtml && hashAt > -1 ? target.slice(hashAt + 1) : "";
  const text = readFileSync(p, "utf8");
  if (!isHtml) return { yaml: text, lineOffset: 0, label: p };
  for (const m of text.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
    const attrs = m[1];
    if (!/type\s*=\s*["']text\/yaml["']/i.test(attrs)) continue;
    if (id && !new RegExp(`\\bid\\s*=\\s*["']${id}["']`).test(attrs)) continue;
    const bodyStart = m.index + m[0].indexOf(">") + 1;
    const lineOffset = text.slice(0, bodyStart).split("\n").length - 1;
    return { yaml: m[2], lineOffset, label: `${p}${id ? "#" + id : ""}` };
  }
  throw new Error(`nincs ${id ? `"${id}" azonosítójú ` : ""}<script type="text/yaml"> blokk: ${p}`);
}

/** A YAML-hiba sorszámának átírása a HTML-beli sorra. */
export const shiftLines = (message, offset) => (offset ? message.replace(/\((\d+)\. sor\)/, (_, n) => `(${Number(n) + offset}. sor)`) : message);

function main(args) {
  const VALUE_FLAGS = ["--data", "--state", "--lib"];
  const file = args.find((a, i) => !a.startsWith("--") && !VALUE_FLAGS.includes(args[i - 1]));
  const opt = (name) => (args.includes(name) ? args[args.indexOf(name) + 1] : undefined);
  const strict = args.includes("--strict");

  if (!file) {
    console.error("Használat: node scripts/validate-spec.mjs <leiras.yaml | oldal.html[#id]> [--data adat.json] [--state allapot.json] [--lib build.js] [--strict] [--print]");
    return 2;
  }
  const bundle = opt("--lib") ? path.resolve(opt("--lib")) : path.join(ROOT, "dist", "index.js");
  if (!existsSync(bundle)) {
    console.error(`Hiányzik a könyvtár build (${bundle}): futtasd az \`npm run build\` parancsot, vagy add meg a --lib kapcsolót.`);
    return 2;
  }

  let spec;
  try {
    spec = readSpec(file);
  } catch (e) {
    console.error(`HIBA: ${e.message}`);
    return 2;
  }
  const { yaml, lineOffset, label } = spec;
  const readJson = (p) => (p ? JSON.parse(readFileSync(p, "utf8")) : undefined);

  const dom = new JSDOM('<!doctype html><div id="root"></div>', { runScripts: "outside-only", pretendToBeVisual: true, url: "http://localhost/" });
  const warnings = [];
  dom.window.console.warn = (...a) => warnings.push(a.map(String).join(" "));
  dom.window.eval(readFileSync(bundle, "utf8"));
  const lib = dom.window.CreateDOMBlocks;
  if (!lib?.buildUI) {
    console.error("A könyvtár build nem tartalmazza a buildUI függvényt (régi build?): futtasd az `npm run build` parancsot.");
    return 2;
  }

  // kezelők, adatok
  const handlerNames = [...new Set([...yaml.matchAll(/["']?@([A-Za-z_]\w*)["']?/g)].map((m) => m[1]))];
  const handlers = Object.fromEntries(handlerNames.map((n) => [n, () => undefined]));
  const dataRefs = [...new Set([...yaml.matchAll(/(?<![\w$])\$([A-Za-z_]\w*)/g)].map((m) => m[1]))];

  let ui;
  try {
    ui = lib.buildUI(yaml, { parent: "root", handlers, data: readJson(opt("--data")), state: readJson(opt("--state")), strict });
  } catch (e) {
    console.error(`HIBA (${label}): ${shiftLines(e.message, lineOffset)}`);
    return 1;
  }

  const root = dom.window.document.getElementById("root");
  const count = root.querySelectorAll("*").length;
  const parsed = lib.parseYaml(yaml);
  const stateKeys = parsed && typeof parsed === "object" && !Array.isArray(parsed) && parsed.state ? Object.keys(parsed.state) : [];
  for (const w of warnings) console.warn(`FIGYELMEZTETÉS: ${w.replace(/^\[createDOMBlocks\] /, "")}`);
  console.log(`${warnings.length && strict ? "HIBÁS" : "OK"}: ${label} felépül (${count} elem${warnings.length ? `, ${warnings.length} figyelmeztetés` : ""}).`);
  if (handlerNames.length) console.log(`Megírandó kezelők (handlers): ${handlerNames.map((n) => "@" + n).join(", ")}`);
  if (dataRefs.length) console.log(`Átadandó adatok (data): ${dataRefs.map((n) => "$" + n).join(", ")}`);
  if (stateKeys.length) console.log(`Állapot-kulcsok (state): ${stateKeys.join(", ")}`);
  if (args.includes("--print")) console.log("\n" + root.innerHTML.replace(/></g, ">\n<"));
  ui.destroy();
  return warnings.length && strict ? 1 : 0;
}

// közvetlen futtatás: node scripts/validate-spec.mjs ...
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) process.exitCode = main(process.argv.slice(2));
