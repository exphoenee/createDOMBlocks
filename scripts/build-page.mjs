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

// A téma már a CSS betöltése előtt beáll (nincs világos villanás sötét módban).
// A logika megegyezik a documentation/page-components/theme.ts-ével.
const THEME_BOOT_SCRIPT = `  <script>(function(){try{var t=localStorage.getItem("theme");if(t!=="light"&&t!=="dark"){t=window.matchMedia&&matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}document.documentElement.setAttribute("data-theme",t)}catch(e){}})();</script>`;

function injectMeta(html, filename) {
  const title = extractTitle(html);
  const description = extractDescription(html);
  const pageUrl = filename === "index.html" ? SITE_URL : `${SITE_URL}${filename}`;
  const metaTags = buildMetaTags(title, description, pageUrl);
  return html.replace(/(<\/title>)/, `$1\n${THEME_BOOT_SCRIPT}\n${metaTags}`);
}

mkdirp(DIST_PAGE);

// Kézzel írt oldalak (documentation/*.html) és a kódból generált komponens-oldalak
// (documentation/generated/pages/*.html, lásd scripts/gen-docs.mjs)
const docDir = path.resolve(PROJECT_ROOT, "documentation");
const generatedPagesDir = path.join(docDir, "generated", "pages");
for (const dir of [docDir, generatedPagesDir]) {
  if (!existsSync(dir)) continue;
  for (const file of readdirSync(dir)) {
    if (file.endsWith(".html")) {
      const src = readFileSync(path.join(dir, file), "utf-8");
      writeFileSync(path.join(DIST_PAGE, file), injectMeta(src, file));
    }
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

// Régi, többkomponenses oldalak címei: átirányítás az adott kategória első komponens-oldalára,
// hogy a meglévő linkek / könyvjelzők ne adjanak 404-et.
const LEGACY_REDIRECTS = {
  "forms.html": "text-input.html",
  "selection.html": "select.html",
  "customInputs.html": "custom-date-picker.html",
  "draganddrop.html": "drag-and-drop-file-input.html",
  "buttons.html": "button.html",
  "content.html": "card.html",
  "lists.html": "unordered-list.html",
  "tables.html": "table.html",
  "avatars.html": "avatar.html",
  "navigation.html": "nav.html",
  "feedback.html": "alert.html",
  "interactive.html": "accordion.html",
};
for (const [oldPage, target] of Object.entries(LEGACY_REDIRECTS)) {
  if (!existsSync(path.join(DIST_PAGE, target))) continue;
  writeFileSync(
    path.join(DIST_PAGE, oldPage),
    `<!DOCTYPE html>
<html lang="hu">
<head>
  <meta charset="UTF-8" />
  <title>Átirányítás | ${SITE_NAME}</title>
  <meta http-equiv="refresh" content="0; url=${target}" />
  <link rel="canonical" href="${SITE_URL}${target}" />
  <meta name="robots" content="noindex" />
</head>
<body>
  <p>Az oldal áthelyezve: <a href="${target}">${target}</a></p>
  <script>location.replace(${JSON.stringify(target)} + location.hash);</script>
</body>
</html>
`,
  );
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
