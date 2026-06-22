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
  const trimmed = bodyText.trim();

  // Not a block body — return as-is.
  if (!trimmed.startsWith("{")) return trimmed;

  // Block body — strip braces.
  const inner = trimmed.slice(1, -1).trim();
  if (!inner) return inner;

  // Dedent: find minimum leading whitespace among non-empty lines.
  const lines = inner.split("\n");
  const indent = lines
    .filter((l) => l.trim().length > 0)
    .reduce((min, l) => {
      const ws = l.match(/^[ \t]*/);
      return ws ? Math.min(min, ws[0].length) : min;
    }, Infinity);

  if (indent > 0 && indent < Infinity) {
    return lines
      .map((l) => (l.trim().length > 0 ? l.slice(indent) : ""))
      .join("\n");
  }

  return inner;
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
 * Format extracted code with proper line breaks and indentation.
 *
 * - After `({` each comma-separated property gets its own line (indented)
 * - Nested objects `{ }` are also expanded
 * - Strings and template literals are preserved as-is
 */
function formatExtractedCode(code) {
  let depth = 0;
  let inString = false;
  let strChar = null;
  let inTemplate = false;
  let result = "";
  let i = 0;

  while (i < code.length) {
    const c = code[i];
    const n = code[i + 1];

    // --- Track string / template literal state ---
    if ((c === '"' || c === "'") && !inTemplate) {
      const isEscaped = i > 0 && code[i - 1] === "\\";
      if (inString && strChar === c && !isEscaped) {
        inString = false;
        strChar = null;
      } else if (!inString) {
        inString = true;
        strChar = c;
      }
      result += c;
      i++;
      continue;
    }

    if (c === "`" && !inString) {
      inTemplate = !inTemplate;
    }

    if (inString || inTemplate) {
      // Consume escape sequences whole
      if (c === "\\" && n) {
        result += c + n;
        i += 2;
      } else {
        result += c;
        i++;
      }
      continue;
    }

    // --- Formatting: `({` opens an object block ---
    if (c === "(" && n === "{") {
      depth++;
      result += "({\n";
      result += "  ".repeat(depth);
      i += 2;
      continue;
    }

    // --- Standalone `{` (nested object) ---
    if (c === "{") {
      depth++;
      result += "{\n";
      result += "  ".repeat(depth);
      i++;
      continue;
    }

    // --- Closing `})` ---
    if (c === "}" && n === ")") {
      depth--;
      result += "\n";
      result += "  ".repeat(depth);
      result += "})";
      i += 2;
      continue;
    }

    // --- Standalone `}` ---
    if (c === "}") {
      depth--;
      result += "\n";
      result += "  ".repeat(depth);
      result += "}";
      i++;
      continue;
    }

    // --- Comma → inside objects: newline + indent; elsewhere: stay on same line ---
    if (c === ",") {
      if (depth > 0) {
        result += ",\n";
        result += "  ".repeat(depth);
      } else {
        result += ", ";
      }
      i++;
      continue;
    }

    // --- Collapse consecutive spaces ---
    if (c === " " && result.endsWith(" ")) {
      i++;
      continue;
    }

    result += c;
    i++;
  }

  return result.trim();
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

      // Unescape \n, \t etc. so they render as actual line breaks / tabs
      bodyText = unescapeCode(bodyText);

      // Format: expand `({ ... })` blocks to multiple lines
      bodyText = formatExtractedCode(bodyText);

      modifiedSource = injectCode(modifiedSource, metaNode, bodyText, DEFAULT_LANG);
    }

    return modifiedSource;
  } catch (err) {
    console.error(`[example-loader] Error processing file:\n  ${err.message}`);
    // On error, return the source unchanged — failing the build would be worse.
    return source;
  }
}
