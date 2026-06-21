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

function copyRecursive(src, dest) {
  const stat = statSync(src);
  if (stat.isDirectory()) {
    mkdirp(dest);
    for (const entry of readdirSync(src)) {
      copyRecursive(path.join(src, entry), path.join(dest, entry));
    }
  } else {
    copyFileSync(src, dest);
  }
}

// Create dist-page directory
mkdirp(DIST_PAGE);

// Copy documentation HTML files
const docDir = path.resolve(PROJECT_ROOT, "documentation");
for (const file of readdirSync(docDir)) {
  if (file.endsWith(".html")) {
    copyFileSync(path.join(docDir, file), path.join(DIST_PAGE, file));
  }
}

// Copy style.css to dist-page root
copyFileSync(path.resolve(PROJECT_ROOT, "style.css"), path.join(DIST_PAGE, "style.css"));

// Copy dist/ to dist-page/dist/ (library bundles + documentation bundles)
const distDir = path.resolve(PROJECT_ROOT, "dist");
copyRecursive(distDir, path.join(DIST_PAGE, "dist"));

console.log("dist-page/ created successfully!");
console.log("Contents:");
for (const file of readdirSync(DIST_PAGE)) {
  const s = statSync(path.join(DIST_PAGE, file));
  console.log(`  ${s.isDirectory() ? "[dir]  " : "       "}${file}`);
}
