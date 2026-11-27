import { describe, it, expect, beforeEach } from "vitest";
import { existsSync, readFileSync } from "fs";
import { buildUI } from "../src/index";
import { SPEC_PARAMS } from "../src/spec/meta.generated";
import { YAML_EXAMPLES, YAML_EXAMPLE_HANDLERS, yamlExample, exampleHandlers } from "../documentation/page-components/yamlExamples";
import { yamlFacts } from "../documentation/page-components/yamlFacts";
// @ts-expect-error a szkript sima JavaScript modul
import { HANDLERS_HEADER } from "../scripts/gen-yaml-examples.mjs";

beforeEach(() => {
  document.body.innerHTML = '<div id="root"></div>';
});

describe("a komponens-oldalak YAML mintái", () => {
  it("a kézi minták és kezelők létező komponensekhez tartoznak", () => {
    expect(Object.keys(YAML_EXAMPLES).filter((name) => !SPEC_PARAMS[name])).toEqual([]);
    expect(Object.keys(YAML_EXAMPLE_HANDLERS).filter((name) => !YAML_EXAMPLES[name])).toEqual([]);
  });

  for (const name of Object.keys(YAML_EXAMPLES)) {
    it(`${name}: felépül és megjelenik`, () => {
      document.body.innerHTML = '<div id="root"></div>';
      const source = yamlExample(name)!;
      const ui = buildUI(source, { parent: "root", handlers: exampleHandlers(name, source) });
      const rendered = document.getElementById("root")!.children.length + document.body.querySelectorAll(".modal-portal, .drawer, .drawer-container").length;
      expect(rendered, `${name} nem rajzolt semmit`).toBeGreaterThan(0);
      ui.destroy();
    });
  }
});

describe("a TS példákból generált YAML minták (scripts/gen-yaml-examples.mjs)", () => {
  const file = "documentation/generated/yamlExamples.json";
  const generated: Record<string, string> = existsSync(file) ? JSON.parse(readFileSync(file, "utf-8")) : {};

  it.skipIf(!existsSync(file))("minden komponensnek van kézi vagy generált mintája", () => {
    const missing = Object.keys(SPEC_PARAMS).filter((name) => !YAML_EXAMPLES[name] && !generated[name]);
    expect(missing).toEqual([]);
  });

  it("a kezelő-fejléc formátuma egyezik a docs és a generátor között", () => {
    const sample = `${HANDLERS_HEADER}onChange, click\nui: []\n`;
    expect(Object.keys(exampleHandlers("X", sample)).sort()).toEqual(["click", "onChange"]);
  });

  for (const [name, source] of Object.entries(generated)) {
    it(`${name}: a generált minta felépül`, () => {
      document.body.innerHTML = '<div id="root"></div>';
      const ui = buildUI(source, { parent: "root", handlers: exampleHandlers(name, source) });
      expect(document.getElementById("root")!.children.length + document.body.querySelectorAll(".modal-portal, .drawer, [class*=toast]").length, name).toBeGreaterThan(0);
      ui.destroy();
    });
  }
});

describe("a komponens-oldalak „YAML-ban” összefoglalója (yamlFacts)", () => {
  it("minden komponensre készül, és a leíró tényleges tudását mutatja", () => {
    for (const name of Object.keys(SPEC_PARAMS)) expect(yamlFacts(name).length, name).toBeGreaterThan(0);
    const keys = (name: string) => yamlFacts(name).map((f) => f.key);
    expect(keys("Gantt")).toContain("Állapotváltozáskor újraépítés nélkül frissül: {list}");
    expect(keys("TextInput")).toContain("Kétirányú kötés: <code>bind: állapot-kulcs</code> (a komponens {param} értéke)");
    expect(keys("Tabs")).toContain("Gyerek-csomópontokat fogad: {list}");
    expect(String(yamlFacts("Tabs").find((f) => f.key.startsWith("Gyerek"))!.params!.list)).toContain("tabs[].content");
    expect(yamlFacts("Nincs")).toEqual([]);
  });
});
