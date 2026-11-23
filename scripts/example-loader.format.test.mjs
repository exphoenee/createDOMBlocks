/**
 * Az example-loader formázásának tesztjei: a szerző tördelése megmarad, nincs felesleges üres sor.
 *
 * Futtatás: node --test scripts/example-loader.format.test.mjs
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import exampleLoader from "./example-loader.mjs";

function getCode(output) {
  const match = output.match(/code:\s*"((?:[^"\\]|\\.)*)"/);
  return match ? JSON.parse(`"${match[1]}"`) : null;
}

describe("example-loader formatting", () => {
  it("többsoros kódnál nincs plusz üres sor, a behúzás a legfelső szintre normalizált", () => {
    const source = `
example(
  { title: "Multi", description: "Already formatted." },
  (parent) => {
    const rows = [1, 2, 3];
    return createTable(rows, {
      parent,
      id: "t",
      pageSize: 10,
      pageSizeOptions: [10, 25, "all"],
    });
  },
);
`;
    const code = getCode(exampleLoader(source));
    assert.equal(
      code,
      'const rows = [1, 2, 3];\nreturn createTable(rows, {\n  parent,\n  id: "t",\n  pageSize: 10,\n  pageSizeOptions: [10, 25, "all"],\n});',
    );
    assert.ok(!/\n\s*\n/.test(code), "nincs üres sor");
  });

  it("CRLF forrásnál sem keletkezik felesleges üres sor vagy \\r", () => {
    const source = [
      "example(",
      '  { title: "Crlf", description: "x" },',
      "  (parent) => {",
      "    a();",
      "    b({",
      "      x: 1,",
      "    });",
      "  },",
      ");",
    ].join("\r\n");
    const code = getCode(exampleLoader(source));
    assert.equal(code, "a();\nb({\n  x: 1,\n});");
    assert.ok(!code.includes("\r"));
  });

  it("egysoros hívásnál csak a legkülső objektum bomlik tulajdonságokra, a beágyazottak egy sorban maradnak", () => {
    const source = `
example(
  { title: "One", description: "x" },
  (parent) => makeThing({ parent, id: "a", items: [1, 2, 3], style: { width: "10px", height: "5px" }, fn: (a, b) => a + b }),
);
`;
    const code = getCode(exampleLoader(source));
    assert.equal(
      code,
      'makeThing({\n  parent,\n  id: "a",\n  items: [1, 2, 3],\n  style: { width: "10px", height: "5px" },\n  fn: (a, b) => a + b\n})',
    );
  });

  it("a stringekben lévő vesszők és kapcsos zárójelek nem bontják szét a kódot", () => {
    const source = `
example(
  { title: "Str", description: "x" },
  (parent) => makeThing({ parent, text: "a, b, {c}", other: 'x, y' }),
);
`;
    const code = getCode(exampleLoader(source));
    assert.equal(code, 'makeThing({\n  parent,\n  text: "a, b, {c}",\n  other: \'x, y\'\n})');
  });

  it("objektum-argumentum nélküli egysoros hívás változatlan", () => {
    const source = `
example(
  { title: "Plain", description: "x" },
  (parent) => makeThing(parent, 1, 2),
);
`;
    assert.equal(getCode(exampleLoader(source)), "makeThing(parent, 1, 2)");
  });
});
