import { describe, it, expect } from "vitest";
import { stringifyYaml, parseYaml } from "../src/index";

const round = (v: unknown) => parseYaml(stringifyYaml(v));

describe("stringifyYaml", () => {
  it("visszaolvasva ugyanazt adja (térkép, lista, beágyazás)", () => {
    const value = {
      state: { count: 0, name: "", on: true, none: null, ratio: 1.5 },
      ui: [
        { Card: { title: "Cím", body: [{ Paragraph: "Szöveg" }, { Button: { text: "Gomb", click: { inc: "count" } } }] } },
        { "Title(2)#t.big": "Alcím" },
        { each: { in: "${items}", as: "item", key: "item.id" }, do: [{ span: "${item.name}" }] },
      ],
    };
    expect(round(value)).toEqual(value);
  });

  it("speciális szövegeket idéz, hogy ne változzon a típusuk", () => {
    const value = {
      a: "true", b: "null", c: "123", d: "007", e: "1.5", f: " szóköz ", g: "kettőspont: igen", h: "# nem megjegyzés", i: "@kezelő",
      j: "- kötőjel", k: "${x}", l: "", m: "[lista]", n: "{térkép}", o: "*alias", p: "&horgony", q: "x #y", r: "-5x", s: "Éva",
    };
    expect(round(value)).toEqual(value);
  });

  it("többsoros szöveg blokk-szövegként", () => {
    const value = { code: "const x = 1;\nconsole.log(x);\n", short: "egy\nkettő" };
    const text = stringifyYaml(value);
    expect(text).toContain("code: |");
    expect(text).toContain("short: |-");
    expect(round(value)).toEqual(value);
  });

  it("rövid egyszerű tömb / térkép egy sorban, hosszú blokkban", () => {
    expect(stringifyYaml({ a: [1, 2, 3], b: { x: 1, y: "z" } })).toBe("a: [1, 2, 3]\nb: { x: 1, y: z }\n");
    const long = { items: Array.from({ length: 8 }, (_, i) => `hosszú szöveg száma ${i}`) };
    const text = stringifyYaml(long);
    expect(text.split("\n").length).toBeGreaterThan(8);
    expect(round(long)).toEqual(long);
  });

  it("lista elemei: térképek és beágyazott listák", () => {
    const value = [{ id: "a", label: "Alfa", tags: ["x", "y"], meta: { k: { deep: [1, { z: "w" }] } } }, [1, 2], "szöveg", 5];
    expect(round(value)).toEqual(value);
  });

  it("kihagyja az undefined és a függvény mezőket, kezeli az üres kollekciókat", () => {
    const value = { a: undefined, b: () => 1, c: [], d: {}, e: 1 };
    expect(stringifyYaml(value)).toBe("c: []\nd: {}\ne: 1\n");
  });

  it("nem skalár gyökér és skalár gyökér", () => {
    expect(stringifyYaml("szöveg")).toBe("szöveg\n");
    expect(stringifyYaml(42)).toBe("42\n");
    expect(round([{ a: 1 }, { b: 2 }])).toEqual([{ a: 1 }, { b: 2 }]);
  });
});
