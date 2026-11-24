import { describe, it, expect, beforeEach } from "vitest";
import { buildUI } from "../src/index";
import { SPEC_PARAMS } from "../src/spec/meta.generated";
import { YAML_EXAMPLES, yamlExample } from "../documentation/page-components/yamlExamples";

beforeEach(() => {
  document.body.innerHTML = '<div id="root"></div>';
});

describe("a komponens-oldalak YAML mintái", () => {
  it("minden komponensnek van mintája", () => {
    const missing = Object.keys(SPEC_PARAMS).filter((name) => !YAML_EXAMPLES[name]);
    expect(missing).toEqual([]);
    expect(Object.keys(YAML_EXAMPLES).filter((name) => !SPEC_PARAMS[name])).toEqual([]);
  });

  for (const name of Object.keys(YAML_EXAMPLES)) {
    it(`${name}: felépül és megjelenik`, () => {
      document.body.innerHTML = '<div id="root"></div>';
      const ui = buildUI(yamlExample(name)!, { parent: "root" });
      const rendered = document.getElementById("root")!.children.length + document.body.querySelectorAll(".modal-portal, .drawer, .drawer-container").length;
      expect(rendered, `${name} nem rajzolt semmit`).toBeGreaterThan(0);
      ui.destroy();
    });
  }
});
