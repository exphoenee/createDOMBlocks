/**
 * merge-i18n — index szerinti fordítás-darabokat (keys.json + tr/*.json) egyesít az assets/locales/en.json-ba.
 * Egyszeri munkafolyamat-segéd a fordítások bevitelére; a kulcs (magyar szöveg) a keys.json, az érték a darabokban.
 * "=" érték: a fordítás megegyezik a kulccsal (identitás).
 *
 *   node scripts/merge-i18n.mjs <keys.json> <chunk1.json> [chunk2.json ...]
 */
import { readFileSync, writeFileSync, existsSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const EN = path.join(ROOT, "assets/locales/en.json");
const [keysFile, ...chunks] = process.argv.slice(2);
if (!keysFile || chunks.length === 0) {
  console.error("Használat: node scripts/merge-i18n.mjs <keys.json> <chunk.json> [...]");
  process.exit(2);
}

const keys = JSON.parse(readFileSync(keysFile, "utf8"));
const en = existsSync(EN) ? JSON.parse(readFileSync(EN, "utf8")) : {};
let added = 0;
for (const f of chunks) {
  const part = JSON.parse(readFileSync(f, "utf8"));
  for (const [idx, value] of Object.entries(part)) {
    const key = keys[Number(idx)];
    if (key === undefined) throw new Error(`${f}: nincs ${idx}. kulcs`);
    en[key] = value === "=" ? key : value;
    added++;
  }
}
const sorted = Object.fromEntries(Object.entries(en).sort(([a], [b]) => a.localeCompare(b, "hu")));
writeFileSync(EN, JSON.stringify(sorted, null, 2) + "\n", "utf8");
console.log(`${added} bejegyzés egyesítve, összesen: ${Object.keys(sorted).length}`);
