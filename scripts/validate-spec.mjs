/**
 * validate-spec: egy YAML oldalleírás ellenőrzése a ténylegesen felépített könyvtárral (jsdom).
 *
 *   node scripts/validate-spec.mjs <leiras.yaml> [--data adat.json] [--state allapot.json] [--lib build.js] [--print]
 *
 * - felépíti az oldalt a dist/index.js-sel (előtte: npm run build; más helyen lévő buildhez: --lib), és kiírja a hibákat útvonallal és javaslattal;
 * - a "@név" kezelőket üres függvényekkel pótolja, és kiírja, melyeket kell a JavaScriptben megírni;
 * - kiírja a $név adathivatkozásokat és az állapot-kulcsokat (mi kell még az oldalhoz);
 * - --print: a felépített HTML-t is kiírja.
 */
import { readFileSync, existsSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { JSDOM } from "jsdom";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const VALUE_FLAGS = ["--data", "--state", "--lib"];
const file = args.find((a, i) => !a.startsWith("--") && !VALUE_FLAGS.includes(args[i - 1]));
const opt = (name) => (args.includes(name) ? args[args.indexOf(name) + 1] : undefined);

if (!file) {
  console.error("Használat: node scripts/validate-spec.mjs <leiras.yaml> [--data adat.json] [--state allapot.json] [--print]");
  process.exit(2);
}
const bundle = opt("--lib") ? path.resolve(opt("--lib")) : path.join(ROOT, "dist", "index.js");
if (!existsSync(bundle)) {
  console.error(`Hiányzik a könyvtár build (${bundle}): futtasd az \`npm run build\` parancsot, vagy add meg a --lib kapcsolót.`);
  process.exit(2);
}

const yaml = readFileSync(file, "utf8");
const readJson = (p) => (p ? JSON.parse(readFileSync(p, "utf8")) : undefined);

const dom = new JSDOM('<!doctype html><div id="root"></div>', { runScripts: "outside-only", pretendToBeVisual: true, url: "http://localhost/" });
dom.window.eval(readFileSync(bundle, "utf8"));
const lib = dom.window.CreateDOMBlocks;
if (!lib?.buildUI) {
  console.error("A dist/index.js nem tartalmazza a buildUI függvényt (régi build?): futtasd az `npm run build` parancsot.");
  process.exit(2);
}

// kezelők, adatok
const handlerNames = [...new Set([...yaml.matchAll(/["']?@([A-Za-z_]\w*)["']?/g)].map((m) => m[1]))];
const handlers = Object.fromEntries(handlerNames.map((n) => [n, () => undefined]));
const dataRefs = [...new Set([...yaml.matchAll(/(?<![\w$])\$([A-Za-z_]\w*)/g)].map((m) => m[1]))];

let ui;
try {
  ui = lib.buildUI(yaml, { parent: "root", handlers, data: readJson(opt("--data")), state: readJson(opt("--state")) });
} catch (e) {
  console.error(`HIBA: ${e.message}`);
  process.exit(1);
}

const root = dom.window.document.getElementById("root");
const count = root.querySelectorAll("*").length;
const parsed = lib.parseYaml(yaml);
const stateKeys = parsed && typeof parsed === "object" && !Array.isArray(parsed) && parsed.state ? Object.keys(parsed.state) : [];
console.log(`OK: a leírás felépül (${count} elem).`);
if (handlerNames.length) console.log(`Megírandó kezelők (handlers): ${handlerNames.map((n) => "@" + n).join(", ")}`);
if (dataRefs.length) console.log(`Átadandó adatok (data): ${dataRefs.map((n) => "$" + n).join(", ")}`);
if (stateKeys.length) console.log(`Állapot-kulcsok (state): ${stateKeys.join(", ")}`);
if (args.includes("--print")) console.log("\n" + root.innerHTML.replace(/></g, ">\n<"));
ui.destroy();
