/**
 * check-i18n — kigyűjti a dokumentációs oldalak minden fordítható szövegét (tr() / t() kulcsok és
 * statikus HTML szövegek), és összeveti az assets/locales/en.json-nal.
 *
 * Futtatás:  node scripts/check-i18n.mjs            (jelentés; hiányzó kulcsnál 1-es kilépési kód)
 *            node scripts/check-i18n.mjs --write-missing out.json   (a hiányzó kulcsok JSON-ba)
 *
 * Előfeltétel: a dist-page legyen felépítve (npm run build:page).
 */
import { JSDOM, VirtualConsole } from "jsdom";
import { readFileSync, readdirSync, writeFileSync, existsSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST = path.join(ROOT, "dist-page");
const EN_PATH = path.join(ROOT, "assets/locales/en.json");

if (!existsSync(DIST)) {
  console.error("A dist-page nem létezik: futtasd előbb az `npm run build:page`-et.");
  process.exit(2);
}

const en = existsSync(EN_PATH) ? JSON.parse(readFileSync(EN_PATH, "utf8")) : {};
const writeIdx = process.argv.indexOf("--write-missing");
const writeMissing = writeIdx > -1 ? process.argv[writeIdx + 1] : null;
const strict = !process.argv.includes("--no-fail");

const memStorage = () => {
  const s = {};
  return { getItem: (k) => (k in s ? s[k] : null), setItem: (k, v) => { s[k] = String(v); } };
};

const pages = readdirSync(DIST).filter((f) => f.endsWith(".html"));
const keysByPage = new Map();

for (const file of pages) {
  const html = readFileSync(path.join(DIST, file), "utf8");
  // átirányító oldalak kihagyása
  if (html.includes('http-equiv="refresh"')) continue;
  const vc = new VirtualConsole();
  const dom = await JSDOM.fromFile(path.join(DIST, file), {
    runScripts: "dangerously",
    resources: "usable",
    pretendToBeVisual: true,
    virtualConsole: vc,
    beforeParse(w) {
      w.__i18nKeys = new Set();
      Object.defineProperty(w, "localStorage", { value: memStorage() });
      // az angol katalógust a lemezről szolgáljuk ki
      w.fetch = async (url) => ({ ok: true, status: 200, json: async () => en });
      w.matchMedia = () => ({ matches: false, addEventListener() {}, removeEventListener() {} });
    },
  });
  await new Promise((r) => setTimeout(r, 900));
  keysByPage.set(file, [...dom.window.__i18nKeys]);
  dom.window.close();
}

const allKeys = new Set();
for (const keys of keysByPage.values()) keys.forEach((k) => allKeys.add(k));

const missing = [...allKeys].filter((k) => !(k in en) && k.trim() !== "");
const unused = Object.keys(en).filter((k) => !allKeys.has(k));

console.log(`Oldalak: ${keysByPage.size} · fordítható kulcs: ${allKeys.size} · angol bejegyzés: ${Object.keys(en).length}`);
if (unused.length) console.log(`Nem használt angol kulcs: ${unused.length} (pl. dinamikus vagy törölt szövegek)`);
if (missing.length) {
  console.log(`\nHIÁNYZÓ angol fordítás: ${missing.length}`);
  for (const k of missing.slice(0, 40)) {
    const pg = [...keysByPage].filter(([, ks]) => ks.includes(k)).map(([f]) => f).slice(0, 2).join(", ");
    console.log(`  - ${JSON.stringify(k).slice(0, 110)}   (${pg})`);
  }
  if (missing.length > 40) console.log(`  … és még ${missing.length - 40}`);
  if (writeMissing) {
    writeFileSync(writeMissing, JSON.stringify(Object.fromEntries(missing.map((k) => [k, ""])), null, 2), "utf8");
    console.log(`\nA hiányzó kulcsok mentve: ${writeMissing}`);
  }
  if (strict) process.exit(1);
} else {
  console.log("Minden szöveghez van angol fordítás.");
}
