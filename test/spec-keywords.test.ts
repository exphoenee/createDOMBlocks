import { describe, it, expect, beforeEach, vi } from "vitest";
import { readFileSync } from "fs";
import { buildUI, SpecError, setLocale, registerMessages } from "../src/index";
import { EXPR_FUNCTION_NAMES } from "../src/spec/expr";
import keywords from "../src/spec/keywords.json";

beforeEach(() => {
  document.body.innerHTML = '<div id="root"></div>';
  registerMessages("hu", { logo: "<b>VB</b> portfólió", hello: "Szia {name}!" });
  registerMessages("en", { logo: "<b>VB</b> portfolio", hello: "Hi {name}!" });
  setLocale("hu");
});

const root = () => document.getElementById("root")!;
const build = (yaml: string, options = {}) => buildUI(yaml.replace(/^\n/, ""), { parent: root(), ...options });
const tick = () => new Promise<void>((r) => queueMicrotask(r));

describe("A1 – attrs komponensen és nyers elemen", () => {
  it("statikus attribútumok a komponens gyökerén", () => {
    build(`
ui:
  - Button#send:
      text: Küldés
      attrs: { data-testid: send, aria-label: Üzenet küldése, data-open-hire: true }
`);
    const btn = document.getElementById("send")!;
    expect(btn.getAttribute("data-testid")).toBe("send");
    expect(btn.getAttribute("aria-label")).toBe("Üzenet küldése");
    expect(btn.hasAttribute("data-open-hire")).toBe(true);
  });

  it("állapotfüggő attribútum helyben frissül, a komponens nem épül újra", () => {
    const ui = build(`
state: { n: 1 }
ui:
  - Button#b: { text: Gomb, attrs: { data-count: "\${n}", aria-pressed: "\${n > 1}" } }
`);
    const before = document.getElementById("b")!;
    expect(before.getAttribute("data-count")).toBe("1");
    ui.state.set("n", 2);
    const after = document.getElementById("b")!;
    expect(after).toBe(before);
    expect(after.getAttribute("data-count")).toBe("2");
    expect(after.getAttribute("aria-pressed")).toBe("true");
  });

  it("false / null érték eltávolítja az attribútumot", () => {
    const ui = build(`
state: { on: true }
ui:
  - Badge#x: { text: Új, attrs: { data-on: "\${on}" } }
`);
    expect(document.getElementById("x")!.hasAttribute("data-on")).toBe(true);
    ui.state.set("on", false);
    expect(document.getElementById("x")!.hasAttribute("data-on")).toBe(false);
  });

  it("újraépüléskor az attribútumok az új elemre is rákerülnek", () => {
    const ui = build(`
state: { label: A }
ui:
  - Badge#x: { text: "\${label}", attrs: { data-kind: tag } }
`);
    ui.state.set("label", "B");
    const el = document.getElementById("x")!;
    expect(el.textContent).toBe("B");
    expect(el.getAttribute("data-kind")).toBe("tag");
  });

  it("on* attribútum tiltott (komponensen és nyers elemen is)", () => {
    expect(() => build(`
ui:
  - Button: { text: x, attrs: { onclick: "alert(1)" } }
`)).toThrow(/eseménykezelő nem adható meg attribútumként/);
    expect(() => build(`
ui:
  - div: { attrs: { onMouseOver: "x()" } }
`)).toThrow(SpecError);
  });

  it("az attrs térkép kell legyen", () => {
    expect(() => build(`
ui:
  - Button: { text: x, attrs: [a] }
`)).toThrow(/az attrs térkép kell legyen/);
  });
});

describe("A2 – t + html: true", () => {
  it("a fordítás HTML-ként kerül be, és nyelvváltáskor frissül", () => {
    build(`
ui:
  - a#logo: { t: logo, html: true, href: "#home" }
`);
    const a = document.getElementById("logo")!;
    expect(a.querySelector("b")!.textContent).toBe("VB");
    expect(a.textContent).toBe("VB portfólió");
    setLocale("en");
    expect(a.textContent).toBe("VB portfolio");
  });

  it("paraméterekkel", () => {
    build(`
ui:
  - p#h: { t: hello, html: true, args: { name: Éva } }
`);
    expect(document.getElementById("h")!.textContent).toBe("Szia Éva!");
  });

  it("t mellett a html csak true lehet", () => {
    expect(() => build(`
ui:
  - p: { t: logo, html: "<i>x</i>" }
`)).toThrow(/csak true lehet/);
  });

  it("html: true nélkül a t szövegként kerül be", () => {
    build(`
ui:
  - p#plain: { t: logo }
`);
    expect(document.getElementById("plain")!.querySelector("b")).toBeNull();
    expect(document.getElementById("plain")!.textContent).toBe("<b>VB</b> portfólió");
  });
});

describe("A3 – locale a kifejezésekben", () => {
  it("az aktuális nyelv, nyelvváltáskor frissül", () => {
    build(`
ui:
  - p#lang: "Nyelv: \${locale}"
  - each: { in: $projects, as: p, key: p.id }
    do:
      - p.desc: "\${p.desc[locale]}"
`, { data: { projects: [{ id: 1, desc: { hu: "Könyvtár", en: "Library" } }] } });
    expect(document.getElementById("lang")!.textContent).toBe("Nyelv: hu");
    expect(root().querySelector(".desc")!.textContent).toBe("Könyvtár");
    setLocale("en");
    expect(document.getElementById("lang")!.textContent).toBe("Nyelv: en");
    expect(root().querySelector(".desc")!.textContent).toBe("Library");
  });

  it("a locale foglalt név, állapot-kulcs nem lehet", () => {
    expect(() => build(`
state: { locale: hu }
ui: []
`)).toThrow(/foglalt/);
    expect(() => build("ui: []", { state: { locale: "hu" } })).toThrow(/foglalt/);
  });

  it("az each változója elfedheti", () => {
    build(`
ui:
  - each: { in: [x, y], as: locale }
    do: [ { span.v: "\${locale}" } ]
`);
    expect([...root().querySelectorAll(".v")].map((e) => e.textContent)).toEqual(["x", "y"]);
  });

  it("a destroy után a nyelvváltás nem ír az állapotba", () => {
    const ui = build("ui: []");
    ui.destroy();
    setLocale("en");
    expect(ui.state.get("$locale")).toBe("hu");
  });
});

describe("A4 – onMount", () => {
  it("nyers elemen és komponensen, a felépült elemmel, egyszer", async () => {
    const seen: string[] = [];
    build(`
ui:
  - div#box: { onMount: "@mounted", children: [ { span: a } ] }
  - Button#btn: { text: B, onMount: "@mounted" }
`, { handlers: { mounted: ({ el }: { el: Element }) => seen.push(`${el.id}:${el.isConnected}`) } });
    expect(seen).toEqual([]);
    await tick();
    expect(seen).toEqual(["box:true", "btn:true"]);
  });

  it("az each minden új elemére lefut, a megmaradóra nem", async () => {
    const mounted = vi.fn();
    const ui = build(`
state: { items: [ { id: 1 }, { id: 2 } ] }
ui:
  - each: { in: "\${items}", as: it, key: it.id }
    do: [ { li: { text: "\${it.id}", onMount: "@m" } } ]
`, { handlers: { m: mounted } });
    await tick();
    expect(mounted).toHaveBeenCalledTimes(2);
    const items = ui.state.get("items") as unknown[];
    ui.state.set("items", [...items, { id: 3 }]);
    await tick();
    expect(mounted).toHaveBeenCalledTimes(3);
  });

  it("komponens újraépülésekor újra lefut", async () => {
    const mounted = vi.fn();
    const ui = build(`
state: { label: A }
ui:
  - Badge: { text: "\${label}", onMount: "@m" }
`, { handlers: { m: mounted } });
    await tick();
    ui.state.set("label", "B");
    await tick();
    expect(mounted).toHaveBeenCalledTimes(2);
  });

  it("beépített művelet is lehet", async () => {
    const ui = build(`
state: { ready: false }
ui:
  - div: { onMount: { set: { ready: true } } }
`);
    await tick();
    expect(ui.state.get("ready")).toBe(true);
  });

  it("ha a csomópont a mikrofeladat előtt lebomlik, nem fut le", async () => {
    const mounted = vi.fn();
    const ui = build(`
ui:
  - div: { onMount: "@m" }
`, { handlers: { m: mounted } });
    ui.destroy();
    await tick();
    expect(mounted).not.toHaveBeenCalled();
  });

  it("ismeretlen kezelő építéskor hibát ad", () => {
    expect(() => build(`
ui:
  - div: { onMount: "@nincs" }
`)).toThrow(/ismeretlen eseménykezelő/);
  });
});

describe("keywords.json – egyetlen forrás", () => {
  it("minden bejegyzésnek van leírása és példája", () => {
    for (const group of ["node", "structure", "actions", "functions", "variables"] as const) {
      for (const [name, kw] of Object.entries(keywords[group] as Record<string, { summary: string; example: string }>)) {
        expect(kw.summary, `${group}.${name}`).toBeTruthy();
        expect(kw.example, `${group}.${name}`).toBeTruthy();
      }
    }
  });

  it("a függvénylista egyezik a kifejezés-értelmezőével", () => {
    expect(Object.keys(keywords.functions).sort()).toEqual([...EXPR_FUNCTION_NAMES].sort());
  });

  it("a műveletek mind működnek (ismeretlen művelet hibát ad)", () => {
    expect(() => build(`
ui:
  - Button: { text: x, click: { nemletezik: 1 } }
`)).toThrow(/ismeretlen művelet/);
    for (const op of Object.keys(keywords.actions)) {
      const arg = op === "set" || op === "push" ? "{ a: 1 }" : op === "inc" ? "a" : op === "toggle" ? "a" : "x";
      expect(() => build(`
ui:
  - Button: { text: x, click: { ${op}: ${arg} } }
`), op).not.toThrow();
    }
  });

  it("a JSON Schema minden komponensnél ismeri az attrs és az onMount kulcsot", () => {
    const schema = JSON.parse(readFileSync("assets/createDOMBlocks.schema.json", "utf-8"));
    const element = schema.$defs.node.oneOf.find((n: { patternProperties?: unknown }) => n.patternProperties);
    const components = Object.entries(element.patternProperties as Record<string, any>).filter(([, v]) => v.description?.startsWith("createDOMBlocks "));
    expect(components.length).toBeGreaterThan(30);
    for (const [key, v] of components) {
      const props = v.oneOf.find((o: { type?: string }) => o.type === "object").properties;
      expect(props.attrs, key).toBeDefined();
      expect(props.onMount, key).toBeDefined();
      expect(props.attrs.description, key).toMatch(/Attribútumok/);
    }
  });
});

describe("t sablon és { t: kulcs } a komponens-paraméterekben", () => {
  it("a t kulcs sablon is lehet (each változóból)", () => {
    registerMessages("hu", { "filters.game": "Játék", "filters.api": "API" });
    build(`
ui:
  - each: { in: [game, api], as: kind }
    do:
      - span.f: { t: "filters.\${kind}" }
      - Badge: { t: "filters.\${kind}" }
`);
    expect([...root().querySelectorAll(".f")].map((e) => e.textContent)).toEqual(["Játék", "API"]);
    expect([...root().querySelectorAll(".badge")].map((e) => e.textContent)).toEqual(["Játék", "API"]);
  });

  it("{ t: kulcs } objektum élő fordítás bármilyen mélységben (pl. Carousel labels)", () => {
    registerMessages("hu", { "my.prev": "Vissza" });
    registerMessages("en", { "my.prev": "Back" });
    build(`
ui:
  - Carousel#c:
      labels: { prev: { t: my.prev } }
      slides: [ { title: A }, { title: B } ]
`);
    const prev = document.querySelector("#c .carousel-prev")!;
    expect(prev.getAttribute("aria-label")).toBe("Vissza");
    setLocale("en");
    expect(prev.getAttribute("aria-label")).toBe("Back");
  });
});
