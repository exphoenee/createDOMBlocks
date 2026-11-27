import { readFileSync, writeFileSync, existsSync } from "fs";

/**
 * Csak akkor ír, ha a tartalom változott. A generált fájlok így nem kapnak új időbélyeget, és a figyelők
 * (dev:page, webpack watch) nem indítanak feleslegesen újabb buildet.
 * @returns {boolean} true, ha a fájl módosult
 */
export function writeIfChanged(file, content, _encoding) {
  if (existsSync(file) && readFileSync(file, "utf-8") === content) return false;
  writeFileSync(file, content, "utf-8");
  return true;
}
