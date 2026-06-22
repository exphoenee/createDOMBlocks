/**
 * gen-props.mjs — TypeScript Compiler API alapú props-kinyerő.
 *
 * Kimenet: documentation/generated/props.json
 *
 * Használat: node scripts/gen-props.mjs
 */

import { createRequire } from "module";
import { existsSync, mkdirSync, writeFileSync, readdirSync, statSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = resolve(__dirname, "..");

const require = createRequire(import.meta.url);
const ts = require("typescript");

// ── Helper: typeToString rövidítésekkel ──────────────────────────────
function typeToString(checker, type) {
  let str = checker.typeToString(type);
  str = str.replace(/import\("domelemjs"\)\./g, "");
  str = str.replace(/import\("[^"]+"\)\./g, "");
  return str;
}

// ── Helper: JSDoc leírás kiszedése ────────────────────────────────────
function getJsDocDescription(symbol, checker) {
  const comments = symbol.getDocumentationComment(checker);
  if (comments && comments.length > 0) {
    return comments.map((c) => c.text).join("").trim();
  }
  return "";
}

// ── Helper: @default érték kiszedése ──────────────────────────────────
function getJsDocDefault(symbol, _checker) {
  const tags = symbol.getJsDocTags();
  if (!tags) return null;
  for (const tag of tags) {
    if (tag.name === "default") {
      if (typeof tag.text === "string") return tag.text.trim();
      if (Array.isArray(tag.text) && tag.text.length > 0) {
        return tag.text.map((p) => p.text).join("").trim();
      }
      return "";
    }
  }
  return null;
}

// ── TS fájlok gyűjtése rekurzívan ────────────────────────────────────
function collectTsFiles(dir, acc) {
  for (const entry of readdirSync(dir)) {
    const full = resolve(dir, entry);
    if (statSync(full).isDirectory()) {
      collectTsFiles(full, acc);
    } else if (entry.endsWith(".ts") && !entry.endsWith(".d.ts")) {
      acc.push(full);
    }
  }
}

// ── Főlétra ──────────────────────────────────────────────────────────
function main() {
  const srcDir = resolve(PROJECT_ROOT, "src");
  const fileNames = [];
  collectTsFiles(srcDir, fileNames);

  if (fileNames.length === 0) {
    console.error("[gen-props] No TypeScript files found in src/");
    process.exit(1);
  }

  const program = ts.createProgram({
    rootNames: fileNames,
    options: {
      target: ts.ScriptTarget.ES2020,
      module: ts.ModuleKind.ESNext,
      moduleResolution: ts.ModuleResolutionKind.Bundler,
      strict: true,
      esModuleInterop: true,
      skipLibCheck: true,
      noEmit: true,
      resolveJsonModule: true,
    },
  });

  const checker = program.getTypeChecker();
  const sourceFiles = program.getSourceFiles().filter((sf) => {
    const f = sf.fileName;
    return f.includes("/src/") && !f.includes("node_modules");
  });

  const result = {};

  // 1. Összegyűjtjük az összes exportált createX függvényt
  for (const sf of sourceFiles) {
    sf.statements?.forEach((stmt) => {
      // export function createX(...)
      if (ts.isFunctionDeclaration(stmt) &&
          stmt.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword) &&
          stmt.name?.text?.startsWith("create")) {
        const funcName = stmt.name.text;
        const sig = checker.getSignatureFromDeclaration(stmt);
        if (sig) {
          const resolved = resolveParamsType(sig, stmt, checker);
          if (resolved) {
            result[funcName] = { paramsType: resolved.typeName };
            if (!result[resolved.typeName]?.props) {
              processType(resolved.typeName, resolved.type, checker, program, result, new Set());
            }
          }
        }
        return;
      }

      // export const createX = ...
      if (ts.isVariableStatement(stmt) &&
          stmt.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword)) {
        stmt.declarationList?.declarations?.forEach((decl) => {
          if (!decl.name || !ts.isIdentifier(decl.name) || !decl.name.text.startsWith("create")) return;
          const funcName = decl.name.text;
          const init = decl.initializer;
          if (!init) return;
          const sig = checker.getSignatureFromDeclaration(init);
          if (!sig) return;
          const resolved = resolveParamsType(sig, init, checker);
          if (resolved) {
            result[funcName] = { paramsType: resolved.typeName };
            if (!result[resolved.typeName]?.props) {
              processType(resolved.typeName, resolved.type, checker, program, result, new Set());
            }
          }
        });
        return;
      }


    });
  }

  // 2. Figyelmeztetések hiányzó leírásokra
  for (const [typeName, data] of Object.entries(result)) {
    if (data && typeof data === "object" && "props" in data && Array.isArray(data.props)) {
      for (const prop of data.props) {
        if (!prop.description && prop.name !== "parent") {
          console.warn(`[gen-props] ⚠️  Hiányzó JSDoc leírás: ${typeName}.${prop.name}`);
        }
      }
    }
  }

  // 3. Kimenet írása
  const outDir = resolve(PROJECT_ROOT, "documentation", "generated");
  const outFile = resolve(outDir, "props.json");
  if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });
  writeFileSync(outFile, JSON.stringify(result, null, 2), "utf-8");
  console.log(`[gen-props] ✅ ${outFile} (${Object.keys(result).length} típusbejegyzés)`);
}

// ── Helper: paraméterből kinyeri a props típus infót ────────────────
// Egyes függvényeknél (pl. createTable) az első paraméter az adat,
// a második a *Params típus. Megnézzük az összes paramétert, és
// azt használjuk, amelynek a típusa „Params"-ra végződik, vagy
// parent + id property-kkel rendelkezik.
function resolveParamsType(sig, decl, checker) {
  const params = sig.getParameters();
  if (params.length === 0) return null;

  // 1. Próbáljuk az első paramétert
  let bestParam = params[0];
  let bestType = checker.getTypeOfSymbolAtLocation(bestParam, decl);
  let bestTypeName = typeToString(checker, bestType);

  // Ha az első paraméter nem „Params" típus és van több paraméter,
  // nézzük meg a többit
  if (params.length > 1 && !bestTypeName.endsWith("Params")) {
    for (let i = 1; i < params.length; i++) {
      const p = params[i];
      const t = checker.getTypeOfSymbolAtLocation(p, decl);
      const tn = typeToString(checker, t);
      if (tn.endsWith("Params")) {
        bestParam = p;
        bestType = t;
        bestTypeName = tn;
        break;
      }
      // Ha van "parent" property-je, valószínűleg az a params
      if (t.getProperties?.()?.some((prop) => prop.getName() === "parent")) {
        bestParam = p;
        bestType = t;
        bestTypeName = tn;
        break;
      }
    }
  }

  return { type: bestType, typeName: bestTypeName };
}

// ── Típus property-inek feldolgozása ──────────────────────────────────
function processType(typeName, type, checker, program, result, visited) {
  if (visited.has(typeName)) return;
  visited.add(typeName);

  const props = [];
  const refs = [];

  if (type.isUnionOrIntersection()) {
    for (const part of type.types) {
      collectRefs(part, checker, program, refs);
      const partProps = extractProps(part, checker, program, refs);
      props.push(...partProps);
    }
  } else {
    collectRefs(type, checker, program, refs);
    const extracted = extractProps(type, checker, program, refs);
    props.push(...extracted);
  }

  const uniqueRefs = [...new Set(refs)].filter((r) => r !== typeName);

  if (props.length > 0 || uniqueRefs.length > 0) {
    result[typeName] = { props, refs: uniqueRefs };

    for (const ref of uniqueRefs) {
      if (result[ref]?.props) continue;
      const refSymbol = findTypeSymbol(ref, checker, program);
      if (refSymbol) {
        const refType = checker.getTypeOfSymbolAtLocation(refSymbol, refSymbol.declarations[0]);
        processType(ref, refType, checker, program, result, visited);
      }
    }
  }
}

// ── Property-k kinyerése egy típusból ─────────────────────────────────
function extractProps(type, checker, program, refs) {
  const props = [];
  const members = type.getProperties();
  if (!members || members.length === 0) return props;

  for (const member of members) {
    const name = member.getName();
    if (name.startsWith("__")) continue;

    const decl = member.declarations?.[0] || type.symbol?.declarations?.[0];
    const memberType = checker.getTypeOfSymbolAtLocation(member, decl);
    const memberTypeStr = typeToString(checker, memberType);

    const isOptional = !!(member.flags & ts.SymbolFlags.Optional);
    const description = getJsDocDescription(member, checker);
    const defaultVal = getJsDocDefault(member, checker);

    props.push({
      name,
      type: memberTypeStr,
      required: !isOptional,
      default: defaultVal,
      description,
    });

    collectRefs(memberType, checker, program, refs);
  }

  return props;
}

// ── Hivatkozott típusok gyűjtése ──────────────────────────────────────
function collectRefs(type, checker, program, refs) {
  if (type.isUnionOrIntersection()) {
    for (const part of type.types) {
      collectRefs(part, checker, program, refs);
    }
    return;
  }

  if (checker.isArrayType(type)) {
    const elemType = checker.getTypeArguments(type)?.[0];
    if (elemType) collectRefs(elemType, checker, program, refs);
    return;
  }

  if (type.symbol?.declarations) {
    const sourceFile = type.symbol.declarations[0];
    const fileName = sourceFile.getSourceFile?.().fileName ?? sourceFile.fileName;
    if (fileName && fileName.includes("/src/") && !fileName.includes("node_modules") && type.symbol.name) {
      const name = type.symbol.name;
      if (name && !name.startsWith("__") && !name.includes("<")) {
        refs.push(name);
      }
    }
  }

  const typeArgs = checker.getTypeArguments(type);
  if (typeArgs) {
    for (const arg of typeArgs) {
      collectRefs(arg, checker, program, refs);
    }
  }
}

// ── Típus szimbólum keresése név alapján ──────────────────────────────
function findTypeSymbol(name, checker, program) {
  for (const sf of program.getSourceFiles()) {
    if (!sf.fileName.includes("/src/") || sf.fileName.includes("node_modules")) continue;
    const localSymbols = checker.getSymbolsInScope(sf, ts.SymbolFlags.Interface | ts.SymbolFlags.TypeAlias);
    for (const sym of localSymbols) {
      if (sym.name === name) return sym;
    }
  }
  return null;
}

main();
