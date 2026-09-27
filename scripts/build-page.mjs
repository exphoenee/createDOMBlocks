import { mkdirSync, copyFileSync, readFileSync, writeFileSync, readdirSync, statSync, existsSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, "..");

const DIST_PAGE = path.resolve(PROJECT_ROOT, "dist-page");

const SITE_URL = "https://exphoenee.github.io/createDOMBlocks/";
const SITE_NAME = "createDOMBlocks";
const OG_IMAGE_URL = `${SITE_URL}assets/og.jpg`;

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

function escapeAttr(str) {
  return str.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
}

function buildMetaTags(title, description, pageUrl) {
  const safeTitle = escapeAttr(title);
  const safeDescription = escapeAttr(description);
  return `  <meta property="og:title" content="${safeTitle}" />
  <meta property="og:description" content="${safeDescription}" />
  <meta property="og:image" content="${OG_IMAGE_URL}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:alt" content="${safeTitle}" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="${pageUrl}" />
  <meta property="og:site_name" content="${SITE_NAME}" />
  <meta property="og:locale" content="hu_HU" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${safeTitle}" />
  <meta name="twitter:description" content="${safeDescription}" />
  <meta name="twitter:image" content="${OG_IMAGE_URL}" />
  <meta name="twitter:image:alt" content="${safeTitle}" />
  <link rel="apple-touch-icon" sizes="180x180" href="assets/apple-touch-icon.png">
  <link rel="icon" type="image/png" sizes="32x32" href="assets/favicon-32x32.png">
  <link rel="icon" type="image/png" sizes="16x16" href="assets/favicon-16x16.png">
  <link rel="manifest" href="assets/site.webmanifest">`;
}

function injectMeta(html, filename) {
  const title = extractTitle(html);
  const description = extractDescription(html);
  const pageUrl = filename === "index.html" ? SITE_URL : `${SITE_URL}${filename}`;
  const metaTags = buildMetaTags(title, description, pageUrl);
  return html.replace(/(<\/title>)/, `$1\n${metaTags}`);
}

mkdirp(DIST_PAGE);

const docDir = path.resolve(PROJECT_ROOT, "documentation");
for (const file of readdirSync(docDir)) {
  if (file.endsWith(".html")) {
    const src = readFileSync(path.join(docDir, file), "utf-8");
    const out = injectMeta(src, file);
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
