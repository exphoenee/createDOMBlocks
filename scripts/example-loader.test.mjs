/**
 * Unit tests for the example-loader webpack loader.
 *
 * Run with: node --test scripts/example-loader.test.mjs
 *
 * Tests cover:
 *   - Expression body (single-line call)
 *   - Expression body multiline (nested objects, arrays)
 *   - Block body (multiple statements)
 *   - Template literals in body
 *   - Meta with / without trailing comma
 *   - Empty meta object
 *   - Multiple example() calls in one file
 *   - No example() calls (fast-path passthrough)
 *   - Strings containing braces
 */

import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { parse } from "@babel/parser";

// ── Import loader internals ──────────────────────────────────────────────
// We import the default export (the loader function) plus internal helpers
// for granular unit-testing.
import exampleLoader from "./example-loader.mjs";

// Helper: parse source and return the first example() call's AST node.
function getExampleCallNode(source) {
  const ast = parse(source, { sourceType: "module", plugins: ["typescript"] });
  const calls = [];
  walkAST(ast, calls);
  return calls[0] ?? null;
}

function walkAST(node, results) {
  if (!node || typeof node !== "object") return;
  if (
    node.type === "CallExpression" &&
    node.callee?.type === "Identifier" &&
    node.callee.name === "example" &&
    Array.isArray(node.arguments) &&
    node.arguments.length >= 2 &&
    node.arguments[0]?.type === "ObjectExpression" &&
    node.arguments[1]?.type === "ArrowFunctionExpression"
  ) {
    results.push(node);
    return;
  }
  if (Array.isArray(node)) {
    for (const c of node) walkAST(c, results);
    return;
  }
  for (const key of Object.keys(node)) {
    if (["start", "end", "loc", "leadingComments", "trailingComments", "innerComments"].includes(key)) continue;
    const val = node[key];
    if (Array.isArray(val)) {
      for (const c of val) {
        if (c && typeof c === "object" && c.type) walkAST(c, results);
      }
    } else if (val && typeof val === "object" && val.type) {
      walkAST(val, results);
    }
  }
}

// ── Helper: extract the `code` value from the loader output ─────────────
function getCodeFromOutput(output) {
  const match = output.match(/code:\s*"((?:[^"\\]|\\.)*)"/);
  return match ? JSON.parse(`"${match[1]}"`) : null;
}

function getCodeLangFromOutput(output) {
  const match = output.match(/codeLang:\s*"([^"]+)"/);
  return match ? match[1] : null;
}

// ─────────────────────────────────────────────────────────────────────────
// Tests
// ─────────────────────────────────────────────────────────────────────────

describe("example-loader", () => {

  // ═════════════════════════════════════════════════════════════════════
  // 1. Expression body (single-line)
  // ═════════════════════════════════════════════════════════════════════
  describe("expression body (single-line)", () => {
    it("extracts a simple function call", () => {
      const source = `
import { example } from "../page-components/index";
import { createButton } from "../../src/index";

const sections = [
  example(
    { title: "createButton", description: "Single line call." },
    (parent) => createButton({ parent, id: "b1", text: "Button" }),
  ),
];
renderSections(sections);
`;
      const result = exampleLoader(source);
      const code = getCodeFromOutput(result);
      assert.ok(code, "code should be extracted");
      assert.equal(code, `createButton({ parent, id: "b1", text: "Button" })`);
      assert.equal(getCodeLangFromOutput(result), "typescript");
      // The render function should still be intact
      assert.ok(result.includes("(parent) => createButton({ parent, id: \"b1\", text: \"Button\" })"),
        "render function should be preserved");
    });

    it("adds comma delimiter when meta has no trailing comma", () => {
      const source = `
example(
  { title: "Foo", description: "Bar" },
  (parent) => someFunc({ parent }),
);
`;
      const result = exampleLoader(source);
      // Should NOT have double commas
      assert.ok(!result.includes(",,"), "should not contain double comma");
      // code and codeLang should be injected
      assert.ok(result.includes("code:"), "code should be injected");
      assert.ok(result.includes("codeLang:"), "codeLang should be injected");
      // The render function should be preserved
      assert.ok(result.includes("someFunc({ parent })"), "render function preserved");
    });
  });

  // ═════════════════════════════════════════════════════════════════════
  // 2. Expression body (multi-line, nested objects)
  // ═════════════════════════════════════════════════════════════════════
  describe("expression body (multi-line)", () => {
    it("extracts a multi-line call with nested objects", () => {
      const source = `
example(
  { title: "createAccordion", description: "Multi-line accordion." },
  (parent) =>
    createAccordion({
      parent,
      id: "acc1",
      multiple: true,
      items: [
        { id: "a1", title: "Section 1", content: { tag: "p", text: "Hello" }, open: true },
        { id: "a2", title: "Section 2", content: { tag: "p", text: "World" } },
      ],
    }),
);
`;
      const result = exampleLoader(source);
      const code = getCodeFromOutput(result);
      assert.ok(code, "code should be extracted");
      assert.ok(code.includes("createAccordion({"), "should contain the function name");
      assert.ok(code.includes("parent,"), "should contain shorthand parent property");
      assert.ok(code.includes('"Section 1"'), "should contain string literals");
      // Ensure braces are balanced
      const openBraces = (code.match(/\{/g) || []).length;
      const closeBraces = (code.match(/\}/g) || []).length;
      assert.equal(openBraces, closeBraces, "braces should be balanced in extracted code");
    });

    it("handles nested example calls inside the same file", () => {
      // This test reproduces the actual multi-call scenario from forms.ts
      const source = `
example(
  { title: "createNumberInput", description: "Number input." },
  (parent) => createNumberInput({ parent, id: "t7", labelText: "Szám:", value: "42", min: 0, max: 100, step: 5 }),
);
example(
  { title: "createDateInput", description: "Date input." },
  (parent) => createDateInput({ parent, id: "t8", labelText: "Dátum:", value: "2024-01-15" }),
);
`;
      const result = exampleLoader(source);
      // Both calls should be transformed
      assert.ok(result.includes("createNumberInput({ parent, id: \"t7\""), "first call code should be present");
      assert.ok(result.includes("createDateInput({ parent, id: \"t8\""), "second call code should be present");
      // Both codeLang should be present
      const langs = result.match(/codeLang:\s*"typescript"/g);
      assert.equal(langs?.length, 2, "both calls should have codeLang");
      // No double commas
      assert.ok(!result.includes(",,"), "no double commas");
    });
  });

  // ═════════════════════════════════════════════════════════════════════
  // 3. Block body (multiple statements)
  // ═════════════════════════════════════════════════════════════════════
  describe("block body", () => {
    it("extracts and dedents body without braces", () => {
      const source = `
example(
  { title: "createAlert", description: "Block body test." },
  (parent) => {
    createAlert({ parent, id: "a1", type: "success", message: "OK" });
    createAlert({ parent, id: "a2", type: "error", message: "Hiba" });
  },
);
`;
      const result = exampleLoader(source);
      const code = getCodeFromOutput(result);
      assert.ok(code, "code should be extracted");
      // Should NOT include the outer braces
      assert.ok(!code.startsWith("{"), "code should not start with opening brace");
      assert.ok(!code.endsWith("}"), "code should not end with closing brace");
      // Should contain both statements
      assert.ok(code.includes('createAlert({ parent, id: "a1"'), "first statement present");
      assert.ok(code.includes('createAlert({ parent, id: "a2"'), "second statement present");
      // Should have proper newlines between statements
      assert.ok(code.includes(");\n"), "statements should be separated by newline");
    });

    it("handles block body with leading/trailing whitespace", () => {
      const source = `
example(
  { title: "Multi-line block", description: "With extra spacing." },
  (parent) => {
    doSomething({ parent });
  },
);
`;
      const result = exampleLoader(source);
      const code = getCodeFromOutput(result);
      assert.ok(code, "code should be extracted");
      assert.ok(code.includes("doSomething"), "should contain the function call");
      // No excessive indentation
      assert.ok(!code.includes("\n      "), "no excessive indentation");
    });
  });

  // ═════════════════════════════════════════════════════════════════════
  // 4. Template literals in body
  // ═════════════════════════════════════════════════════════════════════
  describe("template literals", () => {
    it("preserves template literal syntax in extracted code", () => {
      const source = `
example(
  { title: "createTitle", description: "Template literal test." },
  (parent) => { for (let i = 1; i <= 3; i++) createTitle({ parent, id: \`title\${i}\`, text: \`Header \${i}\` }, i); },
);
`;
      const result = exampleLoader(source);
      const code = getCodeFromOutput(result);
      assert.ok(code, "code should be extracted");
      // The extracted code should contain template literal syntax
      assert.ok(code.includes("`title${i}`") || code.includes("\\`title\\${i}\\`"),
        "template literals should be preserved");
    });
  });

  // ═════════════════════════════════════════════════════════════════════
  // 5. Meta with trailing comma
  // ═════════════════════════════════════════════════════════════════════
  describe("meta with trailing comma", () => {
    it("does not produce double comma when meta has trailing comma", () => {
      const source = `
example(
  { title: "Foo", description: "Bar", },
  (parent) => someFunc({ parent }),
);
`;
      const result = exampleLoader(source);
      assert.ok(!result.includes(",,"), "should not contain double comma");
      assert.ok(result.includes("code:"), "code should be injected");
    });
  });

  // ═════════════════════════════════════════════════════════════════════
  // 6. Empty meta object
  // ═════════════════════════════════════════════════════════════════════
  describe("empty meta object", () => {
    it("handles empty meta object", () => {
      const source = `
example(
  { },
  (parent) => simpleFunc({ parent }),
);
`;
      const result = exampleLoader(source);
      const code = getCodeFromOutput(result);
      assert.equal(code, "simpleFunc({ parent })");
      // Should not have double comma
      assert.ok(!result.includes(",,}"), "no erroneous double comma at end");
    });
  });

  // ═════════════════════════════════════════════════════════════════════
  // 7. Multiple example() calls in one file
  // ═════════════════════════════════════════════════════════════════════
  describe("multiple example() calls", () => {
    it("transforms all calls correctly (reverse-order safety)", () => {
      // Simulates a file with 5+ calls — like forms.ts
      const source = `
import { example } from "../page/index";

const sections = [
  example({ title: "A", description: "a" }, (p) => funcA({ parent: p })),
  example({ title: "B", description: "b" }, (p) => funcB({ parent: p })),
  example({ title: "C", description: "c" }, (p) => funcC({ parent: p })),
  example({ title: "D", description: "d" }, (p) => funcD({ parent: p })),
  example({ title: "E", description: "e" }, (p) => funcE({ parent: p })),
];
renderSections(sections);
`;
      const result = exampleLoader(source);
      // All 5 code snippets should be present
      assert.ok(result.includes("funcA({ parent: p })"), "funcA extracted");
      assert.ok(result.includes("funcB({ parent: p })"), "funcB extracted");
      assert.ok(result.includes("funcC({ parent: p })"), "funcC extracted");
      assert.ok(result.includes("funcD({ parent: p })"), "funcD extracted");
      assert.ok(result.includes("funcE({ parent: p })"), "funcE extracted");
      // All 5 renders should be intact
      assert.equal((result.match(/\(p\) => func/g) || []).length, 5, "all render functions preserved");
      // All 5 codeLang
      assert.equal((result.match(/codeLang:\s*"typescript"/g) || []).length, 5, "all calls have codeLang");
      // No double commas
      assert.ok(!result.includes(",,"), "no double commas");
    });
  });

  // ═════════════════════════════════════════════════════════════════════
  // 8. No example() calls
  // ═════════════════════════════════════════════════════════════════════
  describe("no example() calls", () => {
    it("passes through unchanged", () => {
      const source = `const x = 42;\nconsole.log(x);\n`;
      const result = exampleLoader(source);
      assert.equal(result, source, "should be identical to input");
    });

    it("passes through when example is not a function call", () => {
      const source = `const example = "just a string";\n`;
      const result = exampleLoader(source);
      assert.equal(result, source, "should be identical to input");
    });
  });

  // ═════════════════════════════════════════════════════════════════════
  // 9. Strings containing braces
  // ═════════════════════════════════════════════════════════════════════
  describe("strings with special characters", () => {
    it("handles string values containing braces in the code body", () => {
      const source = `
example(
  { title: "CodeBlock", description: "With braces in string." },
  (parent) => createCodeBlock({ parent, id: "cb1", code: 'const x: number = 42;\\nconsole.log(x);' }),
);
`;
      const result = exampleLoader(source);
      const code = getCodeFromOutput(result);
      assert.ok(code, "code should be extracted");
      assert.ok(code.includes("createCodeBlock"), "function name present");
      // The escaped newline in the original should be preserved
      assert.ok(code.includes("\\\\n") || code.includes("\\n"),
        "escaped newlines should be preserved");
    });
  });

  // ═════════════════════════════════════════════════════════════════════
  // 10. Source-integrity: render function position
  // ═════════════════════════════════════════════════════════════════════
  describe("source integrity", () => {
    it("keeps the render function callable (syntax valid)", () => {
      // Run the loader output back through babel to verify it's valid TS
      const source = `
import { example } from "../page/index";
import { createButton } from "../../src/index";

example(
  { title: "Valid syntax", description: "Check output is parseable." },
  (parent) => createButton({ parent, id: "b1", text: "Button" }),
);
`;
      const result = exampleLoader(source);
      // Should parse as valid TypeScript
      assert.doesNotThrow(() => {
        parse(result, { sourceType: "module", plugins: ["typescript"] });
      }, "loader output should be valid TypeScript");
    });

    it("preserves all original code outside example() calls", () => {
      const source = `
import { example } from "../page/index";
import { createCard } from "../../src/index";

// Some setup
const app = document.getElementById("app") as HTMLElement;

createCard({ parent: app, id: "info", title: "Info" });

const sections = [
  example(
    { title: "Test", description: "Check extras preserved." },
    (parent) => someFunc({ parent }),
  ),
];

renderSections(sections);

createCard({ parent: app, id: "footer", title: "Footer" });
`;
      const result = exampleLoader(source);
      // Extra code outside example() calls should be intact
      assert.ok(result.includes('createCard({ parent: app, id: "info"'), "first createCard preserved");
      assert.ok(result.includes('createCard({ parent: app, id: "footer"'), "second createCard preserved");
      assert.ok(result.includes("const app = document.getElementById"), "setup code preserved");
      assert.ok(result.includes("renderSections(sections)"), "renderSections call preserved");
    });
  });
});
