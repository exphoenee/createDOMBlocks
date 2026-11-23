/**
 * example-loader — a custom webpack loader for the Single-Source-of-Truth DSL.
 *
 * This loader runs BEFORE ts-loader on `documentation/examples/*.ts` files.
 * It finds every call to the `example(meta, renderFn)` helper, extracts the
 * arrow-function body of the render function from the **raw TypeScript source**
 * and injects it as `code` (and `codeLang`) into the meta object.
 *
 * At runtime the `example()` helper reads the injected fields and returns a
 * fully populated `DocSection` — no manual `code` strings needed.
 *
 * ---------------------------------------------------------------------------
 * CRITICAL: Calls are processed in REVERSE source order (last to first).
 * Each injection adds characters to the source, which would shift positions
 * for calls appearing later (i.e. earlier in the source). By processing from
 * last to first, earlier calls keep their original AST positions.
 * ---------------------------------------------------------------------------
 *
 * Transformation example
 * ---------------------------------------------------------------------------
 * Input:
 *   example(
 *     { title: "Foo", description: "Bar" },
 *     (parent) => createButton({ parent, id: "b1" }),
 *   )
 *
 * Output:
 *   example(
 *     { title: "Foo", description: "Bar",
 *       code: "createButton({ parent, id: \"b1\" })",
 *       codeLang: "typescript" },
 *     (parent) => createButton({ parent, id: "b1" }),
 *   )
 *
 * ---------------------------------------------------------------------------
 * What gets extracted
 * ---------------------------------------------------------------------------
 * Expression body `(p) => expr`          → "expr"
 * Block body    `(p) => { stmt1; stmt2 }` → "stmt1;\nstmt2" (dedented, no braces)
 */

import { parse } from "@babel/parser";

const DEFAULT_LANG = "typescript";

/**
 * Check whether the source text appears to contain any `example(` calls.
 * Fast-path to skip parsing for unrelated files.
 */
function hasExampleCalls(source) {
  return /\bexample\s*\(/.test(source);
}

/**
 * Normalize a code body for display.
 *
 * - Expression body: return as-is (one-liner).
 * - Block body: strip the outer `{ }` braces, dedent the inner lines.
 */
function normalizeBody(bodyText) {
  const trimmed = bodyText.replace(/\r\n/g, "\n").trim();

  // Not a block body — return as-is.
  if (!trimmed.startsWith("{")) return dedentContinuation(trimmed);

  // Block body — strip braces.
  const inner = trimmed.slice(1, -1).trim();
  if (!inner) return inner;
  return dedentContinuation(inner);
}

/**
 * Az első sor már trimmelt (nincs behúzása), a további sorokból a közös behúzást vonjuk le,
 * így a szerző formázása (tördelés, belső behúzás) érintetlen marad.
 */
function dedentContinuation(text) {
  const lines = text.split("\n");
  if (lines.length < 2) return text;
  const indent = lines
    .slice(1)
    .filter((l) => l.trim().length > 0)
    .reduce((min, l) => Math.min(min, l.match(/^[ \t]*/)[0].length), Infinity);
  if (!(indent > 0 && indent < Infinity)) return text;
  return [lines[0], ...lines.slice(1).map((l) => (l.trim().length > 0 ? l.slice(indent) : ""))].join("\n");
}

/**
 * Unescape common escape sequences so they render as actual characters
 * in the displayed code block.
 *
 * Example: `\n` becomes a real newline, `\t` becomes a real tab.
 * Preserves already-escaped backslashes (`\\` stays as `\\`).
 */
function unescapeCode(text) {
  return text
    .replace(/\\n/g, "\n")
    .replace(/\\t/g, "\t");
}

/**
 * Egysoros kód olvashatóbbá tétele: a hívás legkülső objektum-argumentumának (`f({ ... })`)
 * minden tulajdonsága külön sorba kerül. A beágyazott objektumok / tömbök / függvények egy sorban
 * maradnak. A már többsoros kódot NEM formázza újra: a szerző tördelését megtartjuk.
 */
function formatExtractedCode(code) {
  if (code.includes("\n")) return code;

  const open = findObjectArgStart(code);
  if (open < 0) return code;

  // a legkülső `{ ... }` tulajdonságainak szétvágása a mélység-1 vesszőknél
  const parts = [];
  let depth = 0;
  let quote = null;
  let partStart = open + 1;
  let close = -1;
  for (let i = open; i < code.length; i++) {
    const c = code[i];
    if (quote) {
      if (c === "\\") i++;
      else if (c === quote) quote = null;
      continue;
    }
    if (c === '"' || c === "'" || c === "`") { quote = c; continue; }
    if (c === "{" || c === "(" || c === "[") depth++;
    else if (c === "}" || c === ")" || c === "]") {
      depth--;
      if (depth === 0) { close = i; break; }
    } else if (c === "," && depth === 1) {
      parts.push(code.slice(partStart, i));
      partStart = i + 1;
    }
  }
  if (close < 0 || code[close] !== "}") return code;
  parts.push(code.slice(partStart, close));

  const props = parts.map((x) => x.trim()).filter(Boolean);
  if (props.length === 0) return code;
  return `${code.slice(0, open)}{\n${props.map((x) => `  ${x}`).join(",\n")}\n}${code.slice(close + 1)}`;
}

/** Az első `({` (hívás objektum-argumentuma) `{` jelének pozíciója stringeken kívül, vagy -1 */
function findObjectArgStart(code) {
  let quote = null;
  for (let i = 0; i < code.length - 1; i++) {
    const c = code[i];
    if (quote) {
      if (c === "\\") i++;
      else if (c === quote) quote = null;
      continue;
    }
    if (c === '"' || c === "'" || c === "`") { quote = c; continue; }
    if (c === "(" && code[i + 1] === "{") return i + 1;
  }
  return -1;
}

/**
 * Inject `code` and `codeLang` into an object-expression node in the source.
 * Operates on the CURRENT (possibly already-modified) source.
 */
function injectCode(source, metaNode, bodyText, lang) {
  const codeStr = JSON.stringify(bodyText);
  const injection = `\n  code: ${codeStr},\n  codeLang: ${JSON.stringify(lang)}`;

  // Find where to insert: just before the closing `}` of the meta object.
  const closePos = metaNode.end - 1; // position of the `}` character

  // Check whether we need a comma delimiter.
  // Walk backwards from before `}` past whitespace.
  // If we hit a property value character (not `{` and not `,`), we need a comma.
  let i = closePos - 1;
  while (i >= 0 && /\s/.test(source[i])) i--;
  const needsDelimiter = i >= 0 && source[i] !== "{" && source[i] !== ",";
  const finalInjection = (needsDelimiter ? "," : "") + injection;

  return (
    source.slice(0, closePos) +
    finalInjection +
    source.slice(closePos)
  );
}

/**
 * Recursively walk the AST and collect all CallExpression nodes
 * that call `example()` with the required arguments.
 */
function collectExampleCalls(node, results) {
  if (!node || typeof node !== "object") return;

  // Check this node
  if (
    node.type === "CallExpression" &&
    node.callee &&
    node.callee.type === "Identifier" &&
    node.callee.name === "example" &&
    Array.isArray(node.arguments) &&
    node.arguments.length >= 2 &&
    node.arguments[0] &&
    node.arguments[0].type === "ObjectExpression" &&
    node.arguments[1] &&
    node.arguments[1].type === "ArrowFunctionExpression"
  ) {
    results.push(node);
    // Continue traversing into the arguments (e.g. nested example calls)
    // but skip traversing deeper into the matched call's arguments
    // to avoid matching nested calls as separate example() calls.
    return;
  }

  // Recurse into arrays
  if (Array.isArray(node)) {
    for (const child of node) {
      collectExampleCalls(child, results);
    }
    return;
  }

  // Recurse into object properties that are AST nodes
  for (const key of Object.keys(node)) {
    if (key === "start" || key === "end" || key === "loc" ||
        key === "leadingComments" || key === "trailingComments" || key === "innerComments") {
      continue;
    }
    const val = node[key];
    if (Array.isArray(val)) {
      for (const child of val) {
        if (child && typeof child === "object" && child.type) {
          collectExampleCalls(child, results);
        }
      }
    } else if (val && typeof val === "object" && val.type) {
      collectExampleCalls(val, results);
    }
  }
}

/**
 * Main loader function.
 */
export default function exampleLoader(source) {
  // Fast-path: skip files that don't use the example() helper.
  if (!hasExampleCalls(source)) return source;

  try {
    const ast = parse(source, {
      sourceType: "module",
      plugins: ["typescript"],
    });

    // Collect all example() calls from the AST.
    const calls = [];
    collectExampleCalls(ast, calls);

    if (calls.length === 0) return source;

    // Sort by descending source position so we process from last to first.
    // Each injection adds characters; processing in reverse means earlier
    // (in-source) positions remain valid after later injections.
    calls.sort((a, b) => b.start - a.start);

    let modifiedSource = source;

    for (const callNode of calls) {
      const metaNode = callNode.arguments[0];
      const fnNode = callNode.arguments[1];
      const bodyNode = fnNode.body;

      let bodyText;
      if (bodyNode.type === "BlockStatement") {
        const rawBody = modifiedSource.slice(bodyNode.start, bodyNode.end);
        bodyText = normalizeBody(rawBody);
      } else {
        bodyText = modifiedSource.slice(bodyNode.start, bodyNode.end);
      }

      bodyText = bodyText.replace(/\r\n/g, "\n");

      // Egysoros hívásnál a legkülső objektum tulajdonságai külön sorba kerülnek;
      // a többsoros (szerző által tördelt) kód változatlan marad
      bodyText = formatExtractedCode(bodyText);

      // Unescape \n, \t etc. so they render as actual line breaks / tabs
      bodyText = unescapeCode(bodyText);

      modifiedSource = injectCode(modifiedSource, metaNode, bodyText, DEFAULT_LANG);
    }

    return modifiedSource;
  } catch (err) {
    console.error(`[example-loader] Error processing file:\n  ${err.message}`);
    // On error, return the source unchanged — failing the build would be worse.
    return source;
  }
}
