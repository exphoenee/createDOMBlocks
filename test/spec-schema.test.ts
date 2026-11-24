import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { SPEC_PARAMS } from "../src/spec/meta.generated";
import { getDef, componentNames } from "../src/spec/registry";

const schema = JSON.parse(readFileSync("assets/createDOMBlocks.schema.json", "utf-8"));
const element = schema.$defs.node.oneOf.find((n: { patternProperties?: unknown }) => n.patternProperties);
const patterns: Record<string, any> = element.patternProperties;

const forComponent = (name: string) => {
  const key = Object.keys(patterns).find((k) => new RegExp(k).test(name) && patterns[k].description?.includes(` ${name} `));
  return key ? patterns[key] : undefined;
};

describe("JSON Schema az oldalleíróhoz", () => {
  it("minden komponensre van minta, és a regisztráció is ismeri", () => {
    for (const name of Object.keys(SPEC_PARAMS)) {
      expect(forComponent(name), name).toBeDefined();
      expect(getDef(name), name).toBeDefined();
    }
    expect(componentNames().length).toBe(Object.keys(SPEC_PARAMS).length);
  });

  it("a paraméterek a típusokból jönnek, a gyerek-paraméterek csomópont-listák", () => {
    const card = forComponent("Card").oneOf.find((o: { type?: string }) => o.type === "object").properties;
    expect(Object.keys(card)).toEqual(expect.arrayContaining(["title", "body", "footer", "class", "id", "t", "args"]));
    expect(card.body).toEqual({ type: "array", items: { $ref: "#/$defs/node" } });
    expect(card.parent).toBeUndefined();
    expect(card.title.description).toBeTruthy();
  });

  it("a visszahívások @kezelő vagy művelet értéket fogadnak, az enumok megmaradnak", () => {
    const btn = forComponent("Button").oneOf.find((o: { type?: string }) => o.type === "object").properties;
    expect(btn.click.anyOf[0]).toEqual({ type: "string", pattern: "^@" });
    const gantt = forComponent("Gantt").oneOf.find((o: { type?: string }) => o.type === "object").properties;
    expect(gantt.barStyle).toEqual(expect.objectContaining({ enum: ["solid", "thin"] }));
    expect(gantt.onMilestoneClick.anyOf).toBeDefined();
    const input = forComponent("TextInput").oneOf.find((o: { type?: string }) => o.type === "object").properties;
    expect(input.bind).toBeDefined();
  });

  it("felső szintű kulcsok és szerkezeti csomópontok", () => {
    expect(Object.keys(schema.properties)).toEqual(["ui", "state", "messages", "theme", "define", "data"]);
    const structural = schema.$defs.node.oneOf.filter((n: { required?: string[] }) => n.required);
    expect(structural.map((n: { required: string[] }) => n.required[0])).toEqual(["each", "if"]);
  });

  it("a Modal a virtuális paramétereivel (title, ok, cancel, close)", () => {
    const modal = forComponent("Modal").oneOf.find((o: { type?: string }) => o.type === "object").properties;
    expect(Object.keys(modal)).toEqual(expect.arrayContaining(["title", "body", "ok", "cancel", "close", "width"]));
    expect(modal.ok.anyOf).toBeDefined();
  });
});
