/**
 * gen-api: a nem-komponens publikus API (függvények, osztályok, konstansok) referenciája a forráskód JSDoc-jából.
 *
 * A src/index.ts exportjait a TypeScript-fordító ellenőrzőjével járja végig; a `@group` címkével ellátott
 * elemek kerülnek a referenciába (i18n, yaml, overlays, utils). Az aláírást a típusrendszer adja,
 * a leírást a JSDoc első bekezdése.
 *
 * Kimenet: documentation/generated/api.json
 *   [{ group, name, kind, signatures: [..], summary, members: [{ name, signature, summary }] }]
 */
import { writeFileSync, mkdirSync } from "fs";
import { createRequire } from "module";
import path from "path";

const require = createRequire(import.meta.url);
const ts = require("typescript");

const FLAGS = ts.TypeFormatFlags.NoTruncation | ts.TypeFormatFlags.UseAliasDefinedOutsideCurrentScope | ts.TypeFormatFlags.WriteArrowStyleSignature;

const summaryOf = (symbol, checker) => ts.displayPartsToString(symbol.getDocumentationComment(checker)).replace(/\s*\n\s*/g, " ").trim();
const groupOf = (symbol) => symbol.getJsDocTags().find((t) => t.name === "group")?.text?.map((p) => p.text).join("").trim();

function signaturesOf(symbol, name, checker, decl) {
  const type = checker.getTypeOfSymbolAtLocation(symbol, decl);
  return type.getCallSignatures().map((sig) => `function ${name}${checker.signatureToString(sig, decl, FLAGS).replace(/\s*=>\s*/, ": ")}`);
}

export function writeApi(root) {
  const cfg = ts.readConfigFile(path.join(root, "tsconfig.json"), ts.sys.readFile);
  const parsed = ts.parseJsonConfigFileContent(cfg.config, ts.sys, root);
  const program = ts.createProgram([path.join(root, "src", "index.ts")], parsed.options);
  const checker = program.getTypeChecker();
  const mod = checker.getSymbolAtLocation(program.getSourceFile(path.join(root, "src", "index.ts")));
  const out = [];

  for (const exported of checker.getExportsOfModule(mod)) {
    const symbol = exported.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(exported) : exported;
    const group = groupOf(symbol);
    if (!group) continue;
    const decl = symbol.declarations?.[0];
    const entry = { group, name: exported.name, kind: "const", signatures: [], summary: summaryOf(symbol, checker), members: [] };
    const fnDecl = decl && (ts.isFunctionDeclaration(decl) ? decl : null);

    if (symbol.flags & ts.SymbolFlags.Class) {
      entry.kind = "class";
      const instance = checker.getDeclaredTypeOfSymbol(symbol);
      const ctor = checker.getTypeOfSymbolAtLocation(symbol, decl).getConstructSignatures()[0];
      entry.signatures = [ctor ? `new ${exported.name}${checker.signatureToString(ctor, decl, FLAGS).replace(/\s*=>\s*\S+$/, "")}` : `class ${exported.name}`];
      for (const m of instance.getProperties()) {
        const md = m.declarations?.[0];
        if (!md || md.modifiers?.some((x) => x.kind === ts.SyntaxKind.PrivateKeyword || x.kind === ts.SyntaxKind.ProtectedKeyword)) continue;
        const mt = checker.getTypeOfSymbolAtLocation(m, md);
        const sig = mt.getCallSignatures()[0];
        entry.members.push({
          name: m.name,
          signature: sig ? `${m.name}${checker.signatureToString(sig, md, FLAGS).replace(/\s*=>\s*/, ": ")}` : `${m.name}: ${checker.typeToString(mt, md, FLAGS)}`,
          summary: summaryOf(m, checker),
        });
      }
    } else if (fnDecl || symbol.flags & ts.SymbolFlags.Function) {
      entry.kind = "function";
      entry.signatures = signaturesOf(symbol, exported.name, checker, decl);
    } else {
      entry.signatures = [`const ${exported.name}: ${checker.typeToString(checker.getTypeOfSymbolAtLocation(symbol, decl), decl, FLAGS)}`];
    }
    out.push(entry);
  }

  const dir = path.join(root, "documentation", "generated");
  mkdirSync(dir, { recursive: true });
  writeFileSync(path.join(dir, "api.json"), JSON.stringify(out, null, 2) + "\n", "utf-8");
  console.log(`[gen-api] ✅ ${out.length} API-elem (${[...new Set(out.map((e) => e.group))].join(", ")})`);
  return out;
}

// közvetlen futtatás: node scripts/gen-api.mjs
const here = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1"));
if (process.argv[1] && path.resolve(process.argv[1]) === path.join(here, "gen-api.mjs")) writeApi(path.resolve(here, ".."));
