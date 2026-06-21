import { mkdirSync, copyFileSync, readdirSync, statSync, existsSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, "..");

const DIST_PAGE = path.resolve(PROJECT_ROOT, "dist-page");

function mkdirp(dir) {
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
}

mkdirp(DIST_PAGE);

const docDir = path.resolve(PROJECT_ROOT, "documentation");
for (const file of readdirSync(docDir)) {
  if (file.endsWith(".html")) {
    copyFileSync(path.join(docDir, file), path.join(DIST_PAGE, file));
  }
}

copyFileSync(path.resolve(PROJECT_ROOT, "style.css"), path.join(DIST_PAGE, "style.css"));

console.log("dist-page/ created successfully!");
console.log("Contents:");
for (const file of readdirSync(DIST_PAGE)) {
  const s = statSync(path.join(DIST_PAGE, file));
  console.log(`  ${s.isDirectory() ? "[dir]  " : "       "}${file}`);
}
