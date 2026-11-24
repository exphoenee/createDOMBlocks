/**
 * gen-docs: a dokumentáció vázát generálja a forráskódból.
 *
 * A komponens-függvények JSDoc-jából (`createX` a src/ alatt) olvassa:
 *   @category  kategória (forms, buttons, content, navigation, feedback, interactive, overlays)
 *   @menu      a menü és az oldal címe
 *   @order     a sorrend a kategórián belül
 *   @summary   az oldal alcíme (egy mondat)
 *   @page      (opcionális) az oldal neve, ha nem a kebab-case komponensnév
 *
 * Kimenet (a documentation/generated/ mappába, amely nincs verziókezelve):
 *   components.json         a komponens-jegyzék (a menü ebből épül)
 *   pages/<oldal>.html      a komponens-oldalak HTML-je
 *
 * A gen-props.mjs hívja, így minden build / dev indításkor friss.
 */
import { readFileSync, writeFileSync, mkdirSync, readdirSync, rmSync, existsSync, statSync } from "fs";
import { createRequire } from "module";
import path from "path";

const require = createRequire(import.meta.url);
const ts = require("typescript");

const kebab = (name) => name.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();

function walk(dir) {
  return readdirSync(dir).flatMap((f) => {
    const p = path.join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : p.endsWith(".ts") && !p.endsWith(".d.ts") ? [p] : [];
  });
}

/** Az src/ alatti exportált create* függvények JSDoc-címkéi. */
export function readComponentManifest(root) {
  const out = [];
  for (const file of walk(path.join(root, "src"))) {
    const sf = ts.createSourceFile(file, readFileSync(file, "utf-8"), ts.ScriptTarget.ES2020, true);
    sf.forEachChild((node) => {
      if (!ts.isFunctionDeclaration(node) || !node.name || !node.name.text.startsWith("create")) return;
      if (!node.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword)) return;
      const tags = Object.fromEntries(ts.getJSDocTags(node).map((t) => [t.tagName.text, ts.getTextOfJSDocComment(t.comment)?.trim() ?? ""]));
      if (!tags.category) return;
      const name = node.name.text.slice("create".length);
      for (const required of ["menu", "summary"]) {
        if (!tags[required]) throw new Error(`${file}: a ${node.name.text} JSDoc-jából hiányzik a @${required}`);
      }
      out.push({
        name,
        slug: tags.page || kebab(name),
        title: tags.menu,
        category: tags.category,
        order: Number(tags.order || 999),
        summary: tags.summary,
      });
    });
  }
  const slugs = new Set();
  for (const c of out) {
    if (slugs.has(c.slug)) throw new Error(`Ismétlődő oldalnév: ${c.slug}`);
    slugs.add(c.slug);
  }
  return out.sort((a, b) => a.category.localeCompare(b.category) || a.order - b.order);
}

const page = (c) => `<!DOCTYPE html>
<html lang="hu">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${c.title} | createDOMBlocks</title>
  <link rel="stylesheet" href="style.css" />
</head>
<body>
  <div class="page-content">
    <h1 class="page-title">${c.title}</h1>
    <p class="page-subtitle">${c.summary}</p>
  </div>
  <script src="examples/${c.slug}.js"></script>
</body>
</html>
`;

export async function writeDocs(root, props = {}) {
  const manifest = readComponentManifest(root);
  const outDir = path.join(root, "documentation", "generated");
  const pagesDir = path.join(outDir, "pages");
  mkdirSync(pagesDir, { recursive: true });
  // a már nem létező komponensek oldalai ne maradjanak
  if (existsSync(pagesDir)) for (const f of readdirSync(pagesDir)) rmSync(path.join(pagesDir, f));
  writeFileSync(path.join(outDir, "components.json"), JSON.stringify(manifest, null, 2) + "\n", "utf-8");
  for (const c of manifest) {
    if (!existsSync(path.join(root, "documentation", "examples", `${c.slug}.ts`))) {
      console.warn(`[gen-docs] ⚠️  Nincs példafájl a(z) ${c.name} komponenshez: documentation/examples/${c.slug}.ts`);
    }
    writeFileSync(path.join(pagesDir, `${c.slug}.html`), page(c), "utf-8");
  }
  console.log(`[gen-docs] ✅ ${manifest.length} komponens-oldal + components.json`);
  const { writeYamlExamples } = await import("./gen-yaml-examples.mjs");
  await writeYamlExamples(root, manifest, props);
  return manifest;
}

// közvetlen futtatás: node scripts/gen-docs.mjs
const here = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1"));
if (process.argv[1] && path.resolve(process.argv[1]) === path.join(here, "gen-docs.mjs")) {
  const root = path.resolve(here, "..");
  const props = JSON.parse(readFileSync(path.join(root, "documentation", "generated", "props.json"), "utf-8"));
  await writeDocs(root, props);
}
