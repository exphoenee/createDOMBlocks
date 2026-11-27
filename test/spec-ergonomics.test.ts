import { describe, it, expect, beforeEach, vi } from "vitest";
import { buildUI, SpecError, setLocale } from "../src/index";

beforeEach(() => {
  document.body.innerHTML = '<div id="root"></div>';
  setLocale("hu");
});

const root = () => document.getElementById("root")!;
const build = (yaml: string, options = {}) => buildUI(yaml.replace(/^\n/, ""), { parent: root(), ...options });
const texts = (sel: string) => [...root().querySelectorAll(sel)].map((e) => e.textContent);

describe("A5 – each: tartalom szerinti újrahasznosítás és helyben frissítés", () => {
  const list = `
ui:
  - ul:
      - each: { in: "\${items}", as: item, key: item.id }
        do:
          - li: { text: "\${index}. \${item.name}", data-id: "\${item.id}" }
`;

  it("szerkezetileg egyenlő, de új objektumok: az elemek ugyanazok a DOM-csomópontok", () => {
    const ui = build(list, { state: { items: [{ id: 1, name: "a" }, { id: 2, name: "b" }] } });
    const before = [...root().querySelectorAll("li")];
    ui.state.set("items", [{ id: 1, name: "a" }, { id: 2, name: "b" }]); // új objektumok, ugyanaz a tartalom
    const after = [...root().querySelectorAll("li")];
    expect(after[0]).toBe(before[0]);
    expect(after[1]).toBe(before[1]);
  });

  it("megváltozott elem: helyben frissül (ugyanaz a csomópont, új szöveg)", () => {
    const ui = build(list, { state: { items: [{ id: 1, name: "a" }, { id: 2, name: "b" }] } });
    const before = [...root().querySelectorAll("li")];
    ui.state.set("items", [{ id: 1, name: "a" }, { id: 2, name: "B!" }]);
    const after = [...root().querySelectorAll("li")];
    expect(after[1]).toBe(before[1]);
    expect(texts("li")).toEqual(["0. a", "1. B!"]);
  });

  it("átrendezés: a csomópontok mozognak, az index helyben frissül", () => {
    const ui = build(list, { state: { items: [{ id: 1, name: "a" }, { id: 2, name: "b" }, { id: 3, name: "c" }] } });
    const [a, b, c] = [...root().querySelectorAll("li")];
    ui.state.set("items", [{ id: 3, name: "c" }, { id: 1, name: "a" }, { id: 2, name: "b" }]);
    const now = [...root().querySelectorAll("li")];
    expect(now).toEqual([c, a, b]);
    expect(texts("li")).toEqual(["0. c", "1. a", "2. b"]);
  });

  it("törlés és beszúrás; a törölt elem helye eltűnik az állapotból", () => {
    const ui = build(list, { state: { items: [{ id: 1, name: "a" }, { id: 2, name: "b" }] } });
    ui.state.set("items", [{ id: 2, name: "b" }, { id: 4, name: "d" }]);
    expect(texts("li")).toEqual(["0. b", "1. d"]);
    const slots = Object.values((ui.state.get("$each") as Record<string, Record<string, unknown>>) ?? {}).flatMap((e) => Object.keys(e));
    expect(slots.length).toBe(2);
  });

  it("az elembe ágyazott komponens és if is frissül, újraépítés nélkül ahol lehet", () => {
    const ui = build(`
ui:
  - each: { in: "\${tasks}", as: task, key: task.id }
    do:
      - div.task:
          - Badge: { text: "\${task.title}", attrs: { data-done: "\${task.done}" } }
          - if: "\${task.done}"
            then: [ { span.done: kész } ]
`, { state: { tasks: [{ id: 1, title: "Írás", done: false }] } });
    const box = root().querySelector(".task")!;
    expect(root().querySelector(".done")).toBeNull();
    ui.state.set("tasks", [{ id: 1, title: "Írás", done: true }]);
    expect(root().querySelector(".task")).toBe(box);
    expect(root().querySelector(".done")!.textContent).toBe("kész");
    expect(root().querySelector(".badge")!.hasAttribute("data-done")).toBe(true);
  });

  it("kulcs nélkül (index szerint) is helyben frissül", () => {
    const ui = build(`
ui:
  - each: { in: "\${names}", as: n }
    do: [ { p: "\${n}" } ]
`, { state: { names: ["x", "y"] } });
    const first = root().querySelector("p");
    ui.state.set("names", ["X", "y"]);
    expect(root().querySelector("p")).toBe(first);
    expect(texts("p")).toEqual(["X", "y"]);
  });

  it("a destroy után nem marad elem-hely az állapotban", () => {
    const ui = build(list, { state: { items: [{ id: 1, name: "a" }] } });
    ui.destroy();
    const each = ui.state.get("$each") as Record<string, Record<string, unknown>>;
    expect(Object.values(each).every((e) => Object.keys(e).length === 0)).toBe(true);
  });
});

describe("A6 – derive: származtatott állapot", () => {
  const yaml = `
state: { todos: [ { id: 1, done: false }, { id: 2, done: true } ], filter: all }
ui:
  - p#count: "\${open} nyitott"
  - each: { in: "\${visible}", as: t, key: t.id }
    do: [ { li: "\${t.id}" } ]
`;
  const derive = {
    open: { deps: ["todos"], fn: (s: any) => s.todos.filter((t: any) => !t.done).length },
    visible: { deps: ["todos", "filter"], fn: (s: any) => (s.filter === "open" ? s.todos.filter((t: any) => !t.done) : s.todos) },
  };

  it("kezdeti számítás és újraszámolás a forrás változásakor", () => {
    const ui = build(yaml, { derive });
    expect(document.getElementById("count")!.textContent).toBe("1 nyitott");
    expect(texts("li")).toEqual(["1", "2"]);
    ui.state.set("filter", "open");
    expect(texts("li")).toEqual(["1"]);
    ui.state.set("todos", [{ id: 1, done: true }, { id: 2, done: true }]);
    expect(document.getElementById("count")!.textContent).toBe("0 nyitott");
    expect(texts("li")).toEqual([]);
  });

  it("származtatott kulcsra épülő származtatott kulcs (függőségi sorrend)", () => {
    const ui = build(`
state: { n: 2 }
ui: [ { p#q: "\${quad}" } ]
`, { derive: { quad: { deps: ["double"], fn: (s: any) => s.double * 2 }, double: { deps: ["n"], fn: (s: any) => s.n * 2 } } });
    expect(document.getElementById("q")!.textContent).toBe("8");
    ui.state.set("n", 3);
    expect(document.getElementById("q")!.textContent).toBe("12");
  });

  it("csak szerkezeti változásnál ír (nincs fölösleges frissítés)", () => {
    const fn = vi.fn((s: any) => ({ total: s.items.length }));
    const ui = build("ui: []", { state: { items: [1, 2], other: 0 }, derive: { summary: { deps: ["items"], fn } } });
    const first = ui.state.get("summary");
    ui.state.set("items", [3, 4]); // a hossz nem változik → az eredmény szerkezetileg ugyanaz
    expect(ui.state.get("summary")).toBe(first);
    ui.state.set("other", 1); // nem forrás → nem számol
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it("a származtatott kulcs kézzel nem írható (az érték nem változik)", () => {
    const ui = build("ui: []", { state: { n: 1 }, derive: { double: { deps: ["n"], fn: (s: any) => s.n * 2 } } });
    expect(() => ui.state.set("double", 3)).toThrow(/kézzel nem írható/);
    expect(() => ui.state.set("double.x", 3)).toThrow(/származtatott/);
    expect(ui.state.get("double")).toBe(2);
  });

  it("hibák: körkörös függés, saját magától függés, kezdőállapot, hibás szabály", () => {
    expect(() => build("ui: []", { derive: { a: { deps: ["b"], fn: () => 1 }, b: { deps: ["a"], fn: () => 2 } } })).toThrow(/körkörös/);
    expect(() => build("ui: []", { derive: { a: { deps: ["a.x"], fn: () => 1 } } })).toThrow(/saját magától/);
    expect(() => build("ui: []", { state: { a: 1 }, derive: { a: { deps: ["n"], fn: () => 1 } } })).toThrow(/kezdőállapota/);
    expect(() => build("ui: []", { derive: { a: { deps: "n" } as any } })).toThrow(SpecError);
  });

  it("a destroy után nem számol újra", () => {
    const fn = vi.fn((s: any) => s.n);
    const ui = build("ui: []", { state: { n: 1 }, derive: { copy: { deps: ["n"], fn } } });
    ui.destroy();
    ui.state.set("n", 2);
    expect(fn).toHaveBeenCalledTimes(1);
  });
});

describe("A7 – strict mód", () => {
  it("ismeretlen név és hiányzó mező: figyelmeztetés útvonallal és javaslattal, egyszer", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const ui = build(`
state: { count: 1, event: { hasLink: true } }
ui:
  - p: "\${cuont}"
  - p: "\${event.hasLnk ? 'van' : 'nincs'}"
`, { strict: true });
    const messages = warn.mock.calls.map((c) => String(c[0]));
    expect(messages.some((m) => m.includes('ismeretlen név: "cuont"') && m.includes("count") && m.includes("ui[0]"))).toBe(true);
    expect(messages.some((m) => m.includes('ismeretlen mező: "hasLnk"') && m.includes("hasLink"))).toBe(true);
    const n = warn.mock.calls.length;
    ui.state.set("count", 2);
    expect(warn.mock.calls.length).toBe(n);
    warn.mockRestore();
  });

  it("a helyes leírás nem ad figyelmeztetést; strict nélkül sincs figyelmeztetés", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    build(`
state: { count: 1, items: [ { id: 1, name: a } ] }
ui:
  - p: "\${count} \${locale}"
  - each: { in: "\${items}", as: item, key: item.id }
    do: [ { span: "\${index} \${item.name}" } ]
`, { strict: true, data: { title: "x" } });
    build(`ui: [ { p: "\${nincs.ilyen}" } ]`);
    expect(warn).not.toHaveBeenCalled();
    warn.mockRestore();
  });
});

describe("A8 – validate-spec: beágyazott YAML", () => {
  it("a <script type=\"text/yaml\"> blokk kiolvasása és a HTML-beli sorszám", async () => {
    const { mkdtempSync, writeFileSync } = await import("fs");
    const { join } = await import("path");
    const { tmpdir } = await import("os");
    // @ts-expect-error a szkript sima JavaScript modul
    const { readSpec, shiftLines } = await import("../scripts/validate-spec.mjs");
    const dir = mkdtempSync(join(tmpdir(), "cdb-"));
    const file = join(dir, "page.html");
    writeFileSync(file, '<!doctype html>\n<script type="text/yaml" id="other">\nui: []\n</script>\n<p>x</p>\n<script type="text/yaml" id="page">\nui:\n  - p: szia\n</script>\n');
    const byId = readSpec(`${file}#page`);
    expect(byId.yaml).toContain("- p: szia");
    expect(byId.lineOffset).toBe(5);
    expect(readSpec(file).yaml.trim()).toBe("ui: []");
    expect(() => readSpec(`${file}#nincs`)).toThrow(/nincs "nincs" azonosítójú/);
    expect(shiftLines("YAML hiba (3. sor): x", 5)).toBe("YAML hiba (8. sor): x");
    expect(readSpec(file.replace(".html", ".html")).label).toBe(file);
  });
});

describe("A5 – define: állapot-útvonal paraméter hivatkozásként (helyben frissül)", () => {
  const yaml = `
define:
  Row:
    params: [item, label]
    body:
      - li:
          class: "\${item.done ? 'kesz' : ''}"
          text: "\${label}: \${item.name}"
ui:
  - ul:
      - each: { in: "\${items}", as: item, key: item.id }
        do:
          - Row: { item: "\${item}", label: Elem }
  - div#sel:
      - Row: { item: "\${selected}", label: Kijelölt }
`;

  it("az each-elemből átadott paraméter: a részlet nem rajzolódik újra, csak a kötései frissülnek", () => {
    const ui = build(yaml, { state: { items: [{ id: 1, name: "a", done: false }], selected: { name: "x", done: false } } });
    const li = root().querySelector("ul li")!;
    ui.state.set("items", [{ id: 1, name: "a!", done: true }]);
    expect(root().querySelector("ul li")).toBe(li);
    expect(li.textContent).toBe("Elem: a!");
    expect(li.className).toBe("kesz");
  });

  it("állapot-kulcs paraméter: ugyanígy helyben frissül", () => {
    const ui = build(yaml, { state: { items: [], selected: { name: "x", done: false } } });
    const li = root().querySelector("#sel li")!;
    ui.state.set("selected", { name: "y", done: true });
    expect(root().querySelector("#sel li")).toBe(li);
    expect(li.textContent).toBe("Kijelölt: y");
  });

  it("nem útvonal kifejezés (számítás) továbbra is kiértékelt értékként megy át", () => {
    const ui = build(`
define:
  Num: { params: [n], body: [ { span#n: "\${n}" } ] }
ui:
  - Num: { n: "\${count * 2}" }
`, { state: { count: 2 } });
    expect(document.getElementById("n")!.textContent).toBe("4");
    ui.state.set("count", 5);
    expect(document.getElementById("n")!.textContent).toBe("10");
  });
});
