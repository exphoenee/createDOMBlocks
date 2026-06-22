import { mkdirSync, copyFileSync, readFileSync, writeFileSync, readdirSync, statSync, existsSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, "..");

const DIST_PAGE = path.resolve(PROJECT_ROOT, "dist-page");

function mkdirp(dir) {
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
}

function copyDirSync(src, dest) {
  mkdirp(dest);
  for (const file of readdirSync(src)) {
    const srcPath = path.join(src, file);
    const destPath = path.join(dest, file);
    if (statSync(srcPath).isDirectory()) {
      copyDirSync(srcPath, destPath);
    } else {
      copyFileSync(srcPath, destPath);
    }
  }
}

function extractTitle(html) {
  const m = html.match(/<title>(.*?)<\/title>/);
  return m ? m[1] : "createDOMBlocks";
}

function extractDescription(html) {
  const m = html.match(/<p class="page-subtitle">(.*?)<\/p>/);
  return m ? m[1] : "TypeScript könyvtár komplex HTML blokkok és űrlapelemek létrehozásához.";
}

function buildMetaTags(title, description) {
  return `  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${description}" />
  <meta property="og:image" content="assets/og.png" />
  <meta property="og:type" content="website" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${title}" />
  <meta name="twitter:description" content="${description}" />
  <meta name="twitter:image" content="assets/og.png" />
  <link rel="apple-touch-icon" sizes="180x180" href="assets/apple-touch-icon.png">
  <link rel="icon" type="image/png" sizes="32x32" href="assets/favicon-32x32.png">
  <link rel="icon" type="image/png" sizes="16x16" href="assets/favicon-16x16.png">
  <link rel="manifest" href="assets/site.webmanifest">`;
}

function injectMeta(html) {
  const title = extractTitle(html);
  const description = extractDescription(html);
  const metaTags = buildMetaTags(title, description);
  return html.replace(/(<\/title>)/, `$1\n${metaTags}`);
}

mkdirp(DIST_PAGE);

const docDir = path.resolve(PROJECT_ROOT, "documentation");
for (const file of readdirSync(docDir)) {
  if (file.endsWith(".html")) {
    const src = readFileSync(path.join(docDir, file), "utf-8");
    const out = injectMeta(src);
    writeFileSync(path.join(DIST_PAGE, file), out);
  }
}

mkdirp(path.join(DIST_PAGE, "demos"));

const demosDir = path.resolve(PROJECT_ROOT, "documentation", "demos");
if (existsSync(demosDir)) {
  for (const file of readdirSync(demosDir)) {
    if (file.endsWith(".css")) {
      copyFileSync(path.join(demosDir, file), path.join(DIST_PAGE, "demos", file));
    }
  }
}

copyFileSync(path.resolve(PROJECT_ROOT, "style.css"), path.join(DIST_PAGE, "style.css"));

const assetsDir = path.resolve(PROJECT_ROOT, "assets");
if (existsSync(assetsDir)) {
  copyDirSync(assetsDir, path.join(DIST_PAGE, "assets"));
  console.log("  assets/ copied");
}

console.log("dist-page/ created successfully!");
console.log("Contents:");
for (const file of readdirSync(DIST_PAGE)) {
  const s = statSync(path.join(DIST_PAGE, file));
  console.log(`  ${s.isDirectory() ? "[dir]  " : "       "}${file}`);
}
