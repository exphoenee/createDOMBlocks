import { describe, it, expect, beforeEach, vi } from "vitest";
import { buildUI, mountYaml, SpecError, setLocale, registerMessages } from "../src/index";

beforeEach(() => {
  document.body.innerHTML = '<div id="root"></div>';
  setLocale("hu");
});

const root = () => document.getElementById("root")!;
const build = (yaml: string, options = {}) => buildUI(yaml.replace(/^\n/, ""), { parent: root(), ...options });

describe("buildUI – csomópontok és rövidítések", () => {
  it("skalár = fő szöveg, #id és .osztály, automatikus azonosító", () => {
    build(`
ui:
  - Button#save.primary.wide: Mentés
  - Paragraph: Szöveg
  - Badge: Új
`);
    const btn = document.getElementById("save")!;
    expect(btn.tagName).toBe("BUTTON");
    expect(btn.textContent).toBe("Mentés");
    expect(btn.classList.contains("primary")).toBe(true);
    expect(btn.classList.contains("wide")).toBe(true);
    expect(root().querySelector("p")!.textContent).toBe("Szöveg");
    expect(root().querySelector(".badge")!.textContent).toBe("Új");
    expect(root().querySelector("p")!.id).toMatch(/^paragraph-\d+$/);
  });

  it("Title(szint) és lista-rövidítés a listáknál", () => {
    build(`
ui:
  - Title(3): Cím
  - UnorderedList: [egy, kettő, három]
  - OrderedList: { items: [a, b], start: 2 }
`);
    expect(root().querySelector("h3")!.textContent).toBe("Cím");
    expect([...root().querySelectorAll("ul li")].map((l) => l.textContent)).toEqual(["egy", "kettő", "három"]);
    expect(root().querySelector("ol")!.getAttribute("start")).toBe("2");
  });

  it("nyers HTML elemek: szöveg, gyerekek, attribútumok, stílus", () => {
    build(`
ui:
  - div#box.row:
      - span: bal
      - a: { href: "https://x.hu", text: link, target: _blank }
      - section: { style: { color: red, --tone: "#123" }, text: stílusos }
`);
    const box = document.getElementById("box")!;
    expect(box.className).toBe("row");
    expect(box.querySelector("span")!.textContent).toBe("bal");
    const a = box.querySelector("a")!;
    expect(a.getAttribute("href")).toBe("https://x.hu");
    expect(a.getAttribute("target")).toBe("_blank");
    const sec = box.querySelector("section") as HTMLElement;
    expect(sec.style.color).toBe("red");
    expect(sec.style.getPropertyValue("--tone")).toBe("#123");
  });

  it("Card: a body és footer élő tárolókba épül, a lista-rövidítés a body", () => {
    build(`
ui:
  - Card#c:
      title: Kártya
      body:
        - Paragraph: törzs
      footer:
        - Button: gomb
  - Card#d:
      - Paragraph: rövidített törzs
`);
    const c = document.getElementById("c")!;
    expect(c.querySelector(".card-header h3")!.textContent).toBe("Kártya");
    expect(c.querySelector(".card-body p")!.textContent).toBe("törzs");
    expect(c.querySelector(".card-footer button")!.textContent).toBe("gomb");
    expect(document.querySelector("#d .card-body p")!.textContent).toBe("rövidített törzs");
  });

  it("Container és Grid gyerekei, szöveg-csomópont a listában", () => {
    build(`
ui:
  - Container#k:
      - Paragraph: egy
      - Paragraph: kettő
  - div#t:
      - szöveg csomópont
`);
    expect(document.querySelectorAll("#k p")).toHaveLength(2);
    expect(document.getElementById("t")!.textContent).toBe("szöveg csomópont");
  });

  it("Tabs és Accordion tartalma elemekként kerül be", () => {
    build(`
ui:
  - Tabs#tb:
      - { id: a, label: Első, content: [ { Paragraph: tartalom A } ] }
      - { id: b, label: Második, content: [ { Paragraph: tartalom B } ] }
`);
    expect(document.getElementById("tb")!.textContent).toContain("tartalom A");
  });

  it("a parent megadható azonosítóval, és nélküle új div készül", () => {
    const ui = buildUI("ui:\n  - Paragraph: x", { parent: "root" });
    expect(ui.root).toBe(root());
    expect(buildUI("ui:\n  - Paragraph: x").root.tagName).toBe("DIV");
  });

  it("mountYaml: szöveg és #script-azonosító", () => {
    document.body.insertAdjacentHTML("beforeend", '<script type="text/yaml" id="spec">ui:\n  - Paragraph: scriptből</script>');
    mountYaml(root(), "#spec");
    expect(root().textContent).toBe("scriptből");
    const ui = mountYaml(root(), "ui:\n  - Badge: másik");
    expect(ui.get("badge-2") ?? root().querySelector(".badge")).toBeTruthy();
    expect(() => mountYaml(root(), "#nincs")).toThrow(SpecError);
  });
});

describe("buildUI – nyelvesítés és témák", () => {
  it("t: a meglévő tr() rétegre épül, nyelvváltáskor frissül", () => {
    build(`
messages:
  hu: { form: { save: Mentés, count_one: "{count} elem", count_other: "{count} elem" } }
  en: { form: { save: Save, count_one: "{count} item", count_other: "{count} items" } }
ui:
  - Button#b: { t: form.save }
  - Paragraph#p: { t: form.count, args: { count: 2 } }
  - span#s: { t: form.save }
`);
    expect(document.getElementById("b")!.textContent).toBe("Mentés");
    expect(document.getElementById("p")!.textContent).toBe("2 elem");
    expect(document.getElementById("s")!.textContent).toBe("Mentés");
    setLocale("en");
    expect(document.getElementById("b")!.textContent).toBe("Save");
    expect(document.getElementById("p")!.textContent).toBe("2 items");
    expect(document.getElementById("s")!.textContent).toBe("Save");
  });

  it("theme: CSS-változók a :root-ra, dark kulccsal a sötét témára; destroy eltávolítja", () => {
    const ui = build(`
theme:
  primary: "#112233"
  cardRadius: 8px
  dark: { primary: "#ffeedd" }
ui: []
`);
    const css = document.querySelector("style[data-spec-theme]")!.textContent!;
    expect(css).toContain(":root{--primary:#112233;--card-radius:8px;}");
    expect(css).toContain(':root[data-theme="dark"]{--primary:#ffeedd;}');
    ui.destroy();
    expect(document.querySelector("style[data-spec-theme]")).toBeNull();
  });
});

describe("buildUI – események és műveletek", () => {
  it("@handler a komponens visszahívásán és a nyers elem eseményén, kontextussal", () => {
    const save = vi.fn();
    const hover = vi.fn();
    build(`
ui:
  - Button#b: { text: Mentés, click: "@save" }
  - div#d: { text: x, mouseover: "@hover" }
`, { handlers: { save, hover } });
    document.getElementById("b")!.click();
    expect(save).toHaveBeenCalledTimes(1);
    const ctx = save.mock.calls[0][0];
    expect(ctx.event).toBeInstanceOf(Event);
    expect(ctx.state).toBeDefined();
    expect(ctx.ui.get("b")).toBe(document.getElementById("b"));
    document.getElementById("d")!.dispatchEvent(new Event("mouseover"));
    expect(hover).toHaveBeenCalledTimes(1);
  });

  it("beépített műveletek: set, toggle, inc, push, több egymás után", () => {
    const ui = build(`
state: { open: false, n: 0, list: [], name: "" }
ui:
  - Button#a: { text: a, click: { toggle: open } }
  - Button#b: { text: b, click: [ { inc: n }, { inc: { n: 10 } } ] }
  - Button#c: { text: c, click: { push: { list: "x" } } }
  - Button#d: { text: d, click: { set: { name: "új", n: 100 } } }
`);
    document.getElementById("a")!.click();
    document.getElementById("b")!.click();
    document.getElementById("c")!.click();
    expect(ui.state.get("open")).toBe(true);
    expect(ui.state.get("n")).toBe(11);
    expect(ui.state.get("list")).toEqual(["x"]);
    document.getElementById("d")!.click();
    expect(ui.state.get("name")).toBe("új");
    expect(ui.state.get("n")).toBe(100);
  });

  it("open / close a modálra", () => {
    build(`
ui:
  - Modal#m: { title: Cím, body: [ { Paragraph: tartalom } ] }
  - Button#o: { text: nyit, click: { open: m } }
  - Button#x: { text: zár, click: { close: m } }
`);
    const portal = document.getElementById("m-portal")!;
    expect(portal.querySelector(".modal-body p")!.textContent).toBe("tartalom");
    document.getElementById("o")!.click();
    expect(portal.style.display).toBe("flex");
    document.getElementById("x")!.click();
    expect(portal.classList.contains("hidden")).toBe(true);
  });
});

describe("buildUI – állapot és reaktivitás", () => {
  it("szöveg: ${} kifejezés helyben frissül (nem épül újra az elem)", () => {
    const ui = build(`
state: { n: 1, name: Éva }
ui:
  - Paragraph#p: "Szia \${upper(name)}, \${n} \${n == 1 ? 'alma' : 'alma'}"
  - span#s: { text: "\${n * 2}" }
`);
    const p = document.getElementById("p")!;
    const s = document.getElementById("s")!;
    expect(p.textContent).toBe("Szia ÉVA, 1 alma");
    ui.state.set("n", 5);
    ui.state.set("name", "Béla");
    expect(document.getElementById("s")).toBe(s); // nyers elem: helyben frissül
    expect(s.textContent).toBe("10");
    expect(document.getElementById("p")!.textContent).toBe("Szia BÉLA, 5 alma");
  });

  it("raw attribútum, class és style állapotfüggő", () => {
    const ui = build(`
state: { on: false, color: red }
ui:
  - div#d.box: { class: "\${on ? 'active' : ''}", title: "\${on ? 'be' : 'ki'}", style: { color: "\${color}" }, hidden: "\${!on}" }
`);
    const d = document.getElementById("d")!;
    expect(d.className).toBe("box");
    expect(d.hasAttribute("hidden")).toBe(true);
    ui.state.set("on", true);
    ui.state.set("color", "blue");
    expect(d.className).toBe("box active");
    expect(d.getAttribute("title")).toBe("be");
    expect(d.hasAttribute("hidden")).toBe(false);
    expect(d.style.color).toBe("blue");
  });

  it("komponens: állapotfüggő paraméternél újraépül ugyanazzal az azonosítóval", () => {
    const ui = build(`
state: { label: Első }
ui:
  - Button#b: "\${label}"
`);
    const before = document.getElementById("b")!;
    ui.state.set("label", "Második");
    const after = document.getElementById("b")!;
    expect(after.textContent).toBe("Második");
    expect(after).not.toBe(before);
    expect(root().querySelectorAll("#b")).toHaveLength(1);
    expect(ui.get("b")).toBe(after);
  });

  it("if: felépül és lebomlik, else ág", () => {
    const ui = build(`
state: { show: true }
ui:
  - if: "\${show}"
    then:
      - Paragraph#yes: igen
    else:
      - Paragraph#no: nem
`);
    expect(document.getElementById("yes")).not.toBeNull();
    expect(document.getElementById("no")).toBeNull();
    ui.state.toggle("show");
    expect(document.getElementById("yes")).toBeNull();
    expect(document.getElementById("no")!.textContent).toBe("nem");
    ui.state.toggle("show");
    expect(document.getElementById("yes")).not.toBeNull();
    expect(ui.get("no")).toBeUndefined();
  });

  it("each: adatból és állapotból, kulcsolt átrendezés megtartja az elemeket", () => {
    const ui = build(`
state:
  items:
    - { id: a, name: Alfa }
    - { id: b, name: Béta }
ui:
  - ul#list:
      - each: { in: "\${items}", as: it, key: it.id }
        do:
          - li: "\${it.name}"
`);
    const names = () => [...document.querySelectorAll("#list li")].map((l) => l.textContent);
    expect(names()).toEqual(["Alfa", "Béta"]);
    const [la, lb] = [...document.querySelectorAll("#list li")];
    ui.state.set("items", [ui.state.get("items.1"), ui.state.get("items.0")]);
    expect(names()).toEqual(["Béta", "Alfa"]);
    expect([...document.querySelectorAll("#list li")]).toEqual([lb, la]); // ugyanazok az elemek
    ui.state.push("items", { id: "c", name: "Gamma" });
    expect(names()).toEqual(["Béta", "Alfa", "Gamma"]);
    ui.state.set("items.0", { id: "b", name: "Béta2" }); // új azonosságú elem: újrarajzolódik
    expect(names()).toEqual(["Béta2", "Alfa", "Gamma"]);
    ui.state.set("items", []);
    expect(names()).toEqual([]);
  });

  it("each: statikus adat a $név hivatkozással és index", () => {
    build(`
ui:
  - each: { in: $nums, as: n }
    do:
      - span.n: "\${index}:\${n}"
`, { data: { nums: [10, 20, 30] } });
    expect([...root().querySelectorAll(".n")].map((e) => e.textContent)).toEqual(["0:10", "1:20", "2:30"]);
  });

  it("bind: kétirányú kötés beviteli komponensen és checkboxon", () => {
    const ui = build(`
state: { q: kezdő, ok: true }
ui:
  - TextInput#q: { bind: q }
  - Checkbox#ok: { labelText: rendben, bind: ok }
  - Paragraph#out: "\${q}"
`);
    const input = document.querySelector("#q input, input#q") as HTMLInputElement;
    expect(input.value).toBe("kezdő");
    input.value = "új szöveg";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    expect(ui.state.get("q")).toBe("új szöveg");
    expect(document.getElementById("out")!.textContent).toBe("új szöveg");
    ui.state.set("q", "kívülről");
    expect(input.value).toBe("kívülről");
    const cb = document.querySelector("input[type=checkbox]") as HTMLInputElement;
    expect(cb.checked).toBe(true);
    cb.checked = false;
    cb.dispatchEvent(new Event("change", { bubbles: true }));
    expect(ui.state.get("ok")).toBe(false);
  });

  it("bind közben a beviteli mező nem épül újra (a fókusz megmarad)", () => {
    const ui = build(`
state: { q: "" }
ui:
  - TextInput#q: { bind: q }
`);
    const input = document.querySelector("input")!;
    input.focus();
    input.value = "a";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    expect(document.querySelector("input")).toBe(input);
    expect(document.activeElement).toBe(input);
    ui.state.set("q", "b");
    expect(document.querySelector("input")).toBe(input);
  });

  it("Gantt: a rows állapotfüggő paraméter a setRows-t hívja (nem épül újra)", () => {
    const ui = build(`
state:
  rows:
    - { id: a, label: Alfa, start: "2024-01", end: "2024-03" }
ui:
  - Gantt#g: { rows: "\${rows}", today: "2024-02-01" }
`);
    const g = document.getElementById("g")!;
    expect(g.querySelectorAll(".gantt-row")).toHaveLength(1);
    ui.state.push("rows", { id: "b", label: "Béta", start: "2024-02", end: "2024-04" });
    expect(document.getElementById("g")).toBe(g);
    expect(g.querySelectorAll(".gantt-row")).toHaveLength(2);
  });

  it("define: paraméterezhető saját részlet", () => {
    build(`
define:
  Doc:
    params: [title, href]
    body:
      - div.doc:
          - span: "\${title}"
          - a: { href: "\${href}", text: Megnézés }
ui:
  - Doc: { title: Felhívás, href: a.pdf }
  - Doc: { title: Szabályzat, href: b.pdf }
`);
    const docs = [...root().querySelectorAll(".doc")];
    expect(docs.map((d) => d.querySelector("span")!.textContent)).toEqual(["Felhívás", "Szabályzat"]);
    expect(docs[1].querySelector("a")!.getAttribute("href")).toBe("b.pdf");
  });

  it("destroy: leiratkozik, az elemek eltűnnek, a további állapotváltozás hatástalan", () => {
    const ui = build(`
state: { n: 1 }
ui:
  - span#s: "\${n}"
  - Modal#m: { title: x, body: [] }
`);
    const s = document.getElementById("s")!;
    ui.destroy();
    expect(root().children).toHaveLength(0);
    expect(document.getElementById("m-portal")).toBeNull();
    ui.state.set("n", 2);
    expect(s.textContent).toBe("1");
  });
});

describe("buildUI – hibák", () => {
  const fail = (yaml: string, re: RegExp, options = {}) => {
    try {
      build(yaml, options);
    } catch (e) {
      expect(e).toBeInstanceOf(SpecError);
      expect((e as Error).message).toMatch(re);
      return;
    }
    throw new Error("nem dobott hibát");
  };

  it("ismeretlen komponens javaslattal és útvonallal", () => {
    fail("ui:\n  - Buton: Mentés", /ui\[0\]\.Buton: ismeretlen komponens: Buton, erre gondoltál: "Button"\?/);
  });

  it("ismeretlen paraméter javaslattal", () => {
    fail("ui:\n  - Card:\n      tite: x", /ui\[0\]\.Card\.tite: ismeretlen paraméter: "tite", erre gondoltál: "title"\?/);
  });

  it("ismeretlen @kezelő javaslattal", () => {
    fail("ui:\n  - Button: { text: x, click: '@sav' }", /ismeretlen eseménykezelő: "@sav", erre gondoltál: "@?save"\?/, { handlers: { save: () => {} } });
  });

  it("hiányzó kötelező paraméter", () => {
    fail("ui:\n  - Link: { text: x }", /hiányzó kötelező paraméter: "href"/);
  });

  it("több kulcs egy csomópontban (rossz behúzás)", () => {
    fail("ui:\n  - Button: x\n    Paragraph: y", /egy csomópont egy kulcsot tartalmazhat/);
  });

  it("ismétlődő azonosító", () => {
    fail("ui:\n  - Button#x: a\n  - Paragraph#x: b", /ismétlődő azonosító: "x"/);
  });

  it("hibás kifejezés, ismeretlen művelet, ismeretlen felső kulcs", () => {
    fail("ui:\n  - Paragraph: \"${1 +}\"", /Kifejezés hiba/);
    fail("ui:\n  - Button: { text: x, click: { fly: 1 } }", /ismeretlen művelet/);
    fail("uii: []", /ismeretlen felső szintű kulcs: "uii", erre gondoltál: "ui"\?/);
  });

  it("bind nem bemeneten, each/if hibák", () => {
    fail("ui:\n  - Paragraph: { text: x, bind: a }", /ismeretlen paraméter: "bind"|nem használható a bind/);
    fail("ui:\n  - each: { in: [], as: x }", /hiányzik a "do" lista/);
    fail("ui:\n  - if: true", /hiányzik a "then" lista/);
  });

  it("define név ütközik a komponenssel", () => {
    fail("define:\n  Card:\n    body: []\nui: []", /könyvtári komponensé/);
  });

  it("a hibás YAML YamlError, sorszámmal", () => {
    expect(() => buildUI("ui:\n\t- x")).toThrow(/YAML hiba \(2\. sor\)/);
  });
});

describe("buildUI – egyéb", () => {
  it("a nyelvi katalógus a messages: kulcsból regisztrálódik", () => {
    registerMessages("hu", { "külső.kulcs": "külső" });
    build(`ui:\n  - Paragraph#p: { t: külső.kulcs }`);
    expect(document.getElementById("p")!.textContent).toBe("külső");
  });
});
