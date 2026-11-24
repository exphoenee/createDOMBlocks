/**
 * dev-page — nodemon-szerű watch + szerver a dokumentációs oldalhoz.
 *
 * - webpack watch a `documentation` konfigra (példák, demók, src importok)
 * - a HTML-ek, style.css, assets, demo css változására újra lefuttatja a build-page.mjs-t
 * - a src/ változására újragenerálja a props.json-t
 * - kiszolgálja a dist-page/ mappát, és minden build után újratölti a böngészőt
 *
 * Használat: npm run dev:page   (PORT=4000 npm run dev:page)
 */
import http from "http";
import path from "path";
import { fileURLToPath } from "url";
import { readFile, stat } from "fs/promises";
import { watch, existsSync } from "fs";
import { spawn } from "child_process";
import webpack from "webpack";
import configs from "../webpack.config.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST = path.join(ROOT, "dist-page");
const PORT = Number(process.env.PORT) || 3000;

const MIME = {
  ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8",
  ".json": "application/json", ".map": "application/json", ".png": "image/png", ".jpg": "image/jpeg",
  ".ico": "image/x-icon", ".svg": "image/svg+xml", ".webmanifest": "application/manifest+json",
};

const log = (msg) => console.log(`\x1b[36m[dev-page]\x1b[0m ${msg}`);

function run(script, quiet = true) {
  return new Promise((resolve) => {
    const p = spawn(process.execPath, [path.join(ROOT, "scripts", script)], { cwd: ROOT, stdio: quiet ? "ignore" : "inherit" });
    p.on("close", (code) => resolve(code === 0));
  });
}

// ---- live reload (SSE) ----
const clients = new Set();
const reload = () => clients.forEach((res) => res.write("data: reload\n\n"));
const RELOAD_SNIPPET = `<script>new EventSource("/__reload").onmessage=()=>location.reload();</script>`;

// ---- statikus szerver ----
const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, "http://localhost");
  if (url.pathname === "/__reload") {
    res.writeHead(200, { "Content-Type": "text/event-stream", "Cache-Control": "no-cache", Connection: "keep-alive" });
    res.write("\n");
    clients.add(res);
    req.on("close", () => clients.delete(res));
    return;
  }
  let rel = decodeURIComponent(url.pathname);
  if (rel.endsWith("/")) rel += "index.html";
  const file = path.normalize(path.join(DIST, rel));
  if (!file.startsWith(DIST)) { res.writeHead(403).end(); return; }
  try {
    if (!(await stat(file)).isFile()) throw new Error("not a file");
    let body = await readFile(file);
    const ext = path.extname(file);
    if (ext === ".html") body = Buffer.from(body.toString("utf-8").replace("</body>", `${RELOAD_SNIPPET}</body>`));
    res.writeHead(200, { "Content-Type": MIME[ext] || "application/octet-stream", "Cache-Control": "no-store" });
    res.end(body);
  } catch {
    res.writeHead(404, { "Content-Type": "text/plain" }).end("404");
  }
});

// ---- debounce-olt feladatok ----
function debounced(fn, ms = 150) {
  let t;
  return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); };
}

const rebuildStatic = debounced(async () => {
  if (await run("build-page.mjs")) { log("statikus fájlok frissítve"); reload(); }
  else log("\x1b[31mbuild-page.mjs hiba\x1b[0m");
});

const regenProps = debounced(async () => {
  await run("gen-props.mjs");
  log("props.json újragenerálva");
});

function watchDir(dir, onChange) {
  if (!existsSync(dir)) return;
  watch(dir, { recursive: true }, (_evt, name) => {
    if (name && /(^|[\/])(generated|examples)[\/]/.test(name) && dir.endsWith("documentation")) {
      if (/generated/.test(name) || name.endsWith(".ts")) return; // webpack kezeli
    }
    onChange(name);
  });
}

// ---- indulás ----
await run("gen-props.mjs");

const docConfig = configs.find((c) => c.name === "documentation");
const compiler = webpack(docConfig);

let first = true;
compiler.watch({ ignored: /node_modules|dist-page/ }, async (err, stats) => {
  if (err) { log(`\x1b[31m${err.message}\x1b[0m`); return; }
  if (stats.hasErrors()) {
    console.log(stats.toString({ colors: true, all: false, errors: true }));
    log("\x1b[31mfordítási hiba — javítsd, és újraépül\x1b[0m");
    return;
  }
  await run("build-page.mjs");
  log(`build kész (${stats.endTime - stats.startTime} ms)`);
  if (first) { first = false; return; }
  reload();
});

// HTML / demo css / assets: a documentation mappa (a .ts-eket a webpack figyeli)
watchDir(path.join(ROOT, "documentation"), (name) => {
  if (name && /\.(html|css)$/.test(name)) rebuildStatic();
});
// a generált fájlok (séma, meta) nem indítanak újabb kört: a gen-props maga írja őket
const GENERATED = /\.generated\.ts$|createDOMBlocks\.schema\.json$/;
watchDir(path.join(ROOT, "assets"), (name) => { if (!name || !GENERATED.test(name)) rebuildStatic(); });
watch(path.join(ROOT, "style.css"), rebuildStatic);
// src: a webpack újrafordít, a props.json-t külön újragenerálja
watchDir(path.join(ROOT, "src"), (name) => { if (name && name.endsWith(".ts") && !GENERATED.test(name)) regenProps(); });

server.listen(PORT, () => log(`http://localhost:${PORT}  (Ctrl+C a kilépéshez)`));
