import { initDocPage } from "../page-components/index";
import { createCard, createCodeBlock, createTextarea, createBadge, buildUI, createLocalizedElem as createDOMElem } from "../../src/index";
import type { UI, DOMOptions, Handler } from "../../src/index";
import { tr } from "../page-components/i18n";

const done = initDocPage();
const app = document.getElementById("app") as HTMLElement;

/* ---------------------------------------------------------------- segédek */

const bodyOf = (id: string) => document.querySelector(`#${id} .card-body`) as HTMLElement;
const card = (id: string, title: string) => {
  createCard({ parent: app, id, title: tr(title), body: { tag: "div", attrs: { class: "card-content" } } });
  return bodyOf(id);
};
const text = (parent: HTMLElement, html: string, style: Record<string, string> = {}) =>
  createDOMElem({ tag: "p", parent, content: tr(html), style: { margin: "0.5rem 0", ...style } });
const heading = (parent: HTMLElement, label: string) =>
  createDOMElem({ tag: "h4", parent, text: tr(label), style: { margin: "1.25rem 0 0.25rem", fontSize: "0.95rem" } });
const code = (parent: HTMLElement, id: string, language: string, src: string) => createCodeBlock({ parent, id, language, code: src });

/** A mintákban `§{` helyett írhatunk `${`-t (így nem kell a sablonszövegben escape-elni). */
const y = (s: string): string => s.replace(/§\{/g, "${").replace(/^\n/, "");

interface DemoOptions {
  state?: Record<string, unknown>;
  data?: Record<string, unknown>;
  handlers?: Record<string, Handler>;
  /** a megjelenített JavaScript (opcionális) */
  js?: string;
}

/** Egy minta: a megjelenített YAML ugyanaz a szöveg, amelyből az eredmény élőben felépül. */
function demo(parent: HTMLElement, id: string, yamlSrc: string, o: DemoOptions = {}): UI | null {
  const src = y(yamlSrc);
  if (o.js) code(parent, `${id}-js`, "javascript", o.js);
  code(parent, `${id}-yaml`, "yaml", src);
  createDOMElem({ tag: "div", parent, attrs: { class: "doc-result-label" }, text: tr("Eredmény:"), style: { fontSize: "0.8rem", fontWeight: "600", margin: "0.5rem 0 0.25rem" } });
  const box = createDOMElem({
    tag: "div",
    parent,
    attrs: { id: `${id}-out`, class: "yaml-demo" },
    style: { border: "1px dashed var(--border)", borderRadius: "var(--radius)", padding: "1rem", marginBottom: "1rem" },
  });
  try {
    return buildUI(src, { parent: box, state: o.state, data: o.data, handlers: o.handlers });
  } catch (e) {
    createDOMElem({ tag: "pre", parent: box, attrs: { class: "yaml-demo-error" }, text: (e as Error).message, style: { color: "var(--error)", whiteSpace: "pre-wrap", margin: "0" } });
    return null;
  }
}

/** Táblázat: az első oszlop kód, a többi (nyelvesíthető) leírás. */
function table(parent: HTMLElement, id: string, head: string[], rows: string[][]): void {
  createDOMElem({
    tag: "table",
    parent,
    attrs: { id, class: "table" },
    style: { width: "100%", margin: "0.75rem 0", borderCollapse: "collapse" },
    children: [
      { tag: "thead", children: [{ tag: "tr", children: head.map((h): DOMOptions => ({ tag: "th", text: tr(h), style: { textAlign: "left", padding: "0.4rem" } })) }] },
      {
        tag: "tbody",
        children: rows.map(
          (r): DOMOptions => ({
            tag: "tr",
            style: { borderTop: "1px solid var(--border)" },
            children: r.map(
              (c, i): DOMOptions =>
                i === 0
                  ? { tag: "td", text: c, style: { padding: "0.4rem", fontFamily: "ui-monospace,Consolas,monospace", fontSize: "0.85rem", whiteSpace: "nowrap", verticalAlign: "top" } }
                  : { tag: "td", content: tr(c), style: { padding: "0.4rem", verticalAlign: "top" } },
            ),
          }),
        ),
      },
    ],
  });
}

/* ---------------------------------------------------------------- 1. Mi ez */
{
  const body = card("yaml-intro", "Mi ez, és mikor érdemes használni?");
  text(body, "A YAML leíró a createDOMBlocks <strong>opcionális</strong> rétege. Ugyanazokat a komponenseket hívja, mint a <code>createX</code> függvények, csak a szerkezetet adatként írod le: egy helyen látszik, mi mibe van ágyazva, hol vannak a szövegek, és mi az állapot. A meglévő <code>createX</code> hívások változatlanul működnek, a két mód keverhető.");
  text(body, "Akkor kényelmes, ha sok egymásba ágyazott elemből áll az oldal, ha a szerkezetet külön szerkesztőben szeretnéd karbantartani (automatikus kiegészítéssel), vagy ha az állapotot, a szövegeket és a nézetet egy helyen akarod látni. Ugyanaz a kártya, kétféleképpen:");
  demo(
    body,
    "yd-compare",
    `
ui:
  - Card#yd-info:
      title: Kártya
      body:
        - Paragraph: Egy bekezdés
        - Button: Gomb
`,
    {
      js: `// createX hívásokkal
const card = createCard({ parent: "app", id: "yd-info", title: "Kártya", body: [] });
const body = card.querySelector(".card-body");
createParagraph({ parent: body, id: "yd-p", text: "Egy bekezdés" });
createButton({ parent: body, id: "yd-b", text: "Gomb" });

// YAML leíróval: lásd alább`,
    },
  );
}

/* ---------------------------------------------------------------- 2. Gyors kezdés */
{
  const body = card("yaml-quickstart", "Gyors kezdés");
  text(body, "A leírásból a <code>mountYaml</code> / <code>buildUI</code> építi fel az oldalt. A <code>&lt;script type=\"text/yaml\"&gt;</code> elem <code>file://</code> alól is működik (a <code>fetch</code> ott nem).");
  code(body, "yq-html", "html", `<div id="app"></div>
<script type="text/yaml" id="page">
state:
  count: 0
ui:
  - Card:
      title: Számláló
      body:
        - Paragraph: "Kattintások: \${count}"
        - Button: { text: Növelés, click: { inc: count } }
</script>
<script src="https://unpkg.com/createdomblocks/dist/index.js"></script>
<script>
  CreateDOMBlocks.mountYaml("#app", "#page");
</script>`);
  text(body, "Modulokkal és kész JavaScript objektummal is használható (ugyanazokkal a szabályokkal):", { marginTop: "1rem" });
  code(body, "yq-esm", "javascript", `import { buildUI, mountYaml } from "createdomblocks";

// YAML szövegből
const ui = buildUI(yamlText, { parent: document.getElementById("app") });

// objektumból
buildUI({ ui: [{ Paragraph: "Objektumként is megadható" }] }, { parent: "app" });

// <script type="text/yaml" id="page"> elemből
mountYaml("#app", "#page");

ui.destroy(); // leiratkozik és eltávolítja a felépített elemeket`);
  text(body, "Az első paramétert a következő kulcsok alkothatják: <code>ui</code> (a csomópontok listája), <code>state</code>, <code>messages</code>, <code>theme</code>, <code>define</code>. Csak lista is megadható (ekkor ez a <code>ui</code>).");
}

/* ---------------------------------------------------------------- 3. Élő szerkesztő */
{
  const body = card("yaml-live", "Élő szerkesztő");
  text(body, "Írd át a leírást: a jobb oldali eredmény gépelés közben újraépül, a hibák sorszámmal és javaslattal jelennek meg.");

  const SAMPLE = y(`state:
  count: 0
  name: ""
ui:
  - Card#demo:
      title: Számláló és üdvözlés
      body:
        - Paragraph: "Kattintások: §{count}"
        - Button: { text: Növelés, click: { inc: count } }
        - TextInput: { bind: name, placeholder: A neved }
        - if: "§{name}"
          then:
            - Paragraph: "Szia, §{name}! (§{upper(name)})"
`);
  const wrap = createDOMElem({ tag: "div", parent: body, style: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem", marginTop: "0.75rem" } });
  const left = createDOMElem({ tag: "div", parent: wrap });
  const right = createDOMElem({ tag: "div", parent: wrap, attrs: { id: "yaml-live-preview" }, style: { border: "1px dashed var(--border)", borderRadius: "var(--radius)", padding: "1rem", minHeight: "8rem" } });
  const status = createDOMElem({ tag: "div", parent: right, attrs: { id: "yaml-live-status", role: "status" }, style: { color: "var(--error)", fontSize: "0.85rem", whiteSpace: "pre-wrap", marginBottom: "0.5rem" } });
  const out = createDOMElem({ tag: "div", parent: right, attrs: { id: "yaml-live-out" } });

  const area = createTextarea({ parent: left, id: "yaml-live-input", rows: 17, value: SAMPLE, class: "yaml-live-input" }) as HTMLElement;
  const textarea = area.querySelector("textarea") ?? (area as HTMLTextAreaElement);
  textarea.style.cssText = "width:100%;font-family:ui-monospace,Consolas,monospace;font-size:0.8rem;line-height:1.45;tab-size:2;";
  textarea.spellcheck = false;

  let ui: UI | null = null;
  let timer: number | undefined;
  const render = () => {
    ui?.destroy();
    ui = null;
    out.textContent = "";
    try {
      ui = buildUI(textarea.value, { parent: out });
      status.textContent = "";
    } catch (e) {
      status.textContent = (e as Error).message;
    }
  };
  textarea.addEventListener("input", () => {
    window.clearTimeout(timer);
    timer = window.setTimeout(render, 150);
  });
  render();
}

/* ---------------------------------------------------------------- 4. Csomópont */
{
  const body = card("yaml-nodes", "A csomópont szintaxisa");
  text(body, "Egy csomópont egyetlen kulcsból áll: a kulcs a komponens neve (a <code>create</code> nélkül, <strong>nagybetűvel</strong>), az érték a paraméterei. Ami előre kitalálható, rövidíthető:");
  table(body, "yaml-n-table", ["Forma", "Jelentés"], [
    ["Button: Mentés", "skalár érték: a komponens fő szövege (<code>text</code>; a Cardnál, Modalnál <code>title</code>, az Alertnél <code>message</code>)"],
    ["Card#id.a.b", "<code>#id</code> az azonosító, <code>.a.b</code> az osztályok; id nélkül automatikus"],
    ["Title(2)", "a zárójeles szám a <code>level</code> paraméter"],
    ["Card: [ ... ]", "lista érték: a gyerekek (Cardnál a <code>body</code>, Tabsnál a <code>tabs</code>, listáknál az <code>items</code>, Tablenél a <code>data</code>)"],
    ["div, section, a", "kisbetűs név: nyers HTML elem; ismeretlen kulcs attribútum, az <code>click</code>, <code>input</code>, <code>change</code> stb. esemény"],
    ["\"szöveg ${x}\"", "a <code>${...}</code> kifejezés az állapotból / adatból olvas; ha az egész érték egyetlen kifejezés, a nyers értéket (szám, lista) kapod"],
    ["@kezelő", "visszahívás-paraméterben (<code>click</code>, <code>onChange</code>, ...) a JavaScript <code>handlers</code> egy függvénye"],
    ["$adat", "a <code>data</code> beállításban átadott kész adat (pl. <code>in: $people</code>)"],
  ]);
  heading(body, "Rövidítések");
  demo(
    body,
    "yd-short",
    `
ui:
  - Title(3): Szint a zárójelben
  - Badge#yd-badge.sajat-osztaly: Azonosító és osztály
  - Button: Skalár = a gomb szövege
  - Paragraph: { text: Térkép forma, class: kiemelt }
  - UnorderedList: [első, második, harmadik]
`,
  );
  heading(body, "Nyers HTML elemek");
  text(body, "A kisbetűs nevek nyers HTML elemek: a <code>text</code> a szöveg, a <code>children</code> (vagy a lista érték) a gyerekek, a <code>style</code> szöveg vagy térkép, a többi kulcs attribútum, az eseménynevek pedig eseménykezelők.");
  demo(
    body,
    "yd-raw",
    `
ui:
  - div.keret:
      style: { padding: 0.75rem, border: 1px solid var(--border), borderRadius: 8px }
      children:
        - h4: { text: Nyers elem, style: { margin: 0 } }
        - a: { href: "https://example.com", target: _blank, text: egy hivatkozás }
        - ul:
            - li: első
            - li: második
`,
  );
}

/* ---------------------------------------------------------------- 5. Komponensek */
{
  const body = card("yaml-components", "Komponens-példák");
  text(body, "Minden könyvtári komponens használható; a paraméterek ugyanazok, mint a dokumentáció komponens-oldalain. A beágyazott gyerekek komponensenként más-más paraméterben vannak (<code>body</code>, <code>footer</code>, <code>children</code>, <code>tabs[].content</code>, <code>items[].content</code>).");

  heading(body, "Card, Badge, Alert, ProgressBar");
  demo(
    body,
    "yd-card",
    `
ui:
  - Card#yd-c1:
      title: Kártya fejléccel és lábléccel
      body:
        - Paragraph: A törzs tetszőleges csomópontokat tartalmaz.
        - div:
            style: { display: flex, gap: 0.5rem }
            children:
              - Badge: { text: új, type: success }
              - Badge: { text: figyelem, type: warning }
        - ProgressBar: { value: 65, label: Haladás, showPercentage: true }
      footer:
        - Button: Mentés
  - Alert: { type: info, title: Tudnivaló, message: Az Alert fő szövege a message. }
`,
  );

  heading(body, "Tabs és Accordion");
  demo(
    body,
    "yd-tabs",
    `
ui:
  - Tabs#yd-t1:
      - { id: elso, label: Első, content: [ { Paragraph: Az első fül tartalma } ] }
      - { id: masodik, label: Második, content: [ { Paragraph: A második fül tartalma }, { Badge: ok } ] }
  - Accordion#yd-a1:
      - { id: a, title: Első szakasz, content: [ { Paragraph: Összecsukható tartalom } ], open: true }
      - { id: b, title: Második szakasz, content: [ { Paragraph: Még egy } ] }
`,
  );

  heading(body, "Listák, Table, Blockquote");
  demo(
    body,
    "yd-lists",
    `
ui:
  - OrderedList: [Tervezés, Megvalósítás, Tesztelés]
  - Table#yd-tbl:
      - { Név: Alma, Ár: 120 }
      - { Név: Körte, Ár: 180 }
      - { Név: Szilva, Ár: 90 }
  - Blockquote: { text: Az egyszerűség a kifinomultság csúcsa., author: Leonardo }
`,
  );

  heading(body, "Elrendezés: Grid és Container");
  demo(
    body,
    "yd-grid",
    `
ui:
  - Grid#yd-g1:
      columns: 3
      gap: 0.75rem
      children:
        - Card: { title: Egy, body: [ { Paragraph: bal } ] }
        - Card: { title: Kettő, body: [ { Paragraph: közép } ] }
        - Card: { title: Három, body: [ { Paragraph: jobb } ] }
`,
  );

  heading(body, "Gantt");
  demo(
    body,
    "yd-gantt",
    `
ui:
  - Gantt#yd-gt:
      today: "2026-02-10"
      monthWidth: 0
      axis: months
      barStyle: thin
      groups:
        - { id: dev, label: Fejlesztés }
      rows:
        - id: a
          label: Tervezés
          group: dev
          start: "2026-01"
          end: "2026-02"
          color: "#6366f1"
          milestones:
            - { date: "2026-01-20", label: Specifikáció, caption: jan. 20., placement: above }
        - id: b
          label: Megvalósítás
          group: dev
          start: "2026-02"
          end: "2026-04"
          color: "#22c55e"
          milestones:
            - { date: "2026-04-15", label: Kiadás, caption: ápr. 15., placement: below, shape: diamond }
`,
  );

  heading(body, "Beviteli komponensek");
  demo(
    body,
    "yd-inputs",
    `
ui:
  - TextInput#yd-i1: { labelText: Név, placeholder: Írj ide }
  - Select#yd-i2:
      labelText: Város
      options:
        - { text: Pécs, value: pecs }
        - { text: Szeged, value: szeged }
  - Checkbox#yd-i3: { labelText: Elfogadom }
  - RangeInput#yd-i4: { labelText: Hangerő, min: 0, max: 10, value: 4 }
  - Textarea#yd-i5: { labelText: Megjegyzés, rows: 3 }
`,
  );
}

/* ---------------------------------------------------------------- 6. Nyelvesítés */
{
  const body = card("yaml-i18n", "Szövegek és nyelvesítés");
  text(body, "A <code>messages</code> kulcs a nyelvi szövegeket a meglévő <code>defineMessages</code> / <code>tr()</code> rétegbe regisztrálja (egymásba ágyazott is lehet). A <code>t:</code> kulccsal hivatkozhatsz rájuk, az <code>args</code> a paramétereket adja (a <code>count</code> a többes számot is választja). A szövegek a nyelv váltásakor maguktól frissülnek, az állapot megmarad. Váltsd az oldal nyelvét a fejlécben a HU / EN gombbal, és nézd a mintát:");
  demo(
    body,
    "yd-i18n",
    `
messages:
  hu:
    yd:
      hello: Szia, {name}!
      files_one: "{count} fájl"
      files_other: "{count} fájl"
  en:
    yd:
      hello: Hello, {name}!
      files_one: "{count} file"
      files_other: "{count} files"
ui:
  - Paragraph: { t: yd.hello, args: { name: Éva } }
  - Paragraph: { t: yd.files, args: { count: 1 } }
  - Paragraph: { t: yd.files, args: { count: 5 } }
  - span: { t: yd.hello, args: { name: Béla }, style: { fontWeight: 700 } }
`,
  );
  text(body, "A <code>t:</code> az a paraméter szövege lesz, amelyik a komponens fő szövege (Buttonnál <code>text</code>, Cardnál <code>title</code>); nyers elemnél az elem szövege.");
}

/* ---------------------------------------------------------------- 7. Események */
{
  const body = card("yaml-events", "Események és műveletek");
  text(body, "Az eseménykezelők JavaScriptben maradnak: a <code>\"@név\"</code> a <code>handlers</code> térkép függvényére mutat. A függvény első paramétere a <code>{ state, ui, event, el, args }</code> kontextus, utána a komponens saját argumentumai jönnek. Ismeretlen név hibát ad, javaslattal.");
  heading(body, "Saját kezelő (@név)");
  demo(
    body,
    "yd-handler",
    `
state: { name: "", greeting: "" }
ui:
  - TextInput#yd-h-name: { bind: name, placeholder: A neved }
  - Button: { text: Köszönts, click: "@greet" }
  - Paragraph#yd-h-out: "§{greeting}"
`,
    {
      js: `buildUI(spec, {
  parent: "app",
  handlers: {
    greet: ({ state }) => state.set("greeting", "Szia, " + state.get("name") + "!"),
  },
});`,
      handlers: { greet: ({ state }) => state.set("greeting", "Szia, " + (state.get("name") || "ismeretlen") + "!") },
    },
  );
  heading(body, "Beépített műveletek");
  text(body, "Kezelő nélkül is szerkeszthető az állapot: <code>set</code>, <code>toggle</code>, <code>inc</code>, <code>push</code>, <code>open</code>, <code>close</code>. Listában egymás után futnak, az útvonal <code>${...}</code> sablon is lehet (pl. <code>toggle: \"active.${c.id}\"</code>).");
  demo(
    body,
    "yd-actions",
    `
state: { n: 0, open: false, log: [] }
ui:
  - div:
      style: { display: flex, gap: 0.5rem, flexWrap: wrap }
      children:
        - Button: { text: "+1", click: { inc: n } }
        - Button: { text: "+10", click: { inc: { n: 10 } } }
        - Button: { text: Nullázás, click: { set: { n: 0 } } }
        - Button: { text: Váltás, click: { toggle: open } }
        - Button: { text: Naplóz, click: [ { push: { log: "n=§{n}" } }, { inc: n } ] }
  - Paragraph: "n = §{n}, nyitva: §{open ? 'igen' : 'nem'}, napló: §{join(log, ', ')}"
`,
  );
  heading(body, "Felugró ablak megnyitása");
  demo(
    body,
    "yd-modal",
    `
ui:
  - Button: { text: Ablak megnyitása, click: { open: yd-modal-1 } }
  - Modal#yd-modal-1:
      title: Üdvözlet
      footer: false
      closeOnBackdrop: true
      closeOnEscape: true
      body:
        - Paragraph: Ez a Modal törzse, bármilyen csomópontot tartalmazhat.
        - Button: { text: Bezárás, click: { close: yd-modal-1 } }
`,
  );
}

/* ---------------------------------------------------------------- 8. Adatok, ismétlés, feltétel, részletek */
{
  const body = card("yaml-data", "Adatok, ismétlés, feltétel és saját részletek");
  text(body, "A <code>data</code> beállításban átadott kész adatok <code>$név</code> vagy <code>${név}</code> formában érhetők el. Az <code>each</code> listából csomópontokat készít (a <code>key</code> azonosítja az elemeket, az <code>index</code> a sorszám), az <code>if</code> feltételtől függően építi fel az egyik ágat, a <code>define</code> saját, paraméterezhető részletet ad.");
  heading(body, "each: ismétlés adatból");
  demo(
    body,
    "yd-each",
    `
ui:
  - Grid:
      columns: 3
      gap: 0.75rem
      children:
        - each: { in: $people, as: person, key: person.id }
          do:
            - Card:
                title: "§{index + 1}. §{person.name}"
                body:
                  - Paragraph: "§{person.role}"
`,
    {
      data: {
        people: [
          { id: 1, name: "Éva", role: "fejlesztő" },
          { id: 2, name: "Béla", role: "tervező" },
          { id: 3, name: "Cili", role: "tesztelő" },
        ],
      },
      js: `buildUI(spec, {
  parent: "app",
  data: { people: [{ id: 1, name: "Éva", role: "fejlesztő" }, /* ... */] },
});`,
    },
  );
  heading(body, "if / else");
  demo(
    body,
    "yd-if",
    `
state: { admin: false }
ui:
  - Button: { text: Szerepkör váltása, click: { toggle: admin } }
  - if: "§{admin}"
    then:
      - Alert: { type: success, message: Adminisztrátor vagy. }
    else:
      - Alert: { type: info, message: Sima felhasználó vagy. }
`,
  );
  heading(body, "define: saját részlet");
  demo(
    body,
    "yd-define",
    `
define:
  Stat:
    params: [label, value]
    body:
      - div:
          style: { display: flex, justifyContent: space-between, padding: 0.4rem 0, borderBottom: 1px solid var(--border) }
          children:
            - span: "§{label}"
            - strong: "§{value}"
ui:
  - Stat: { label: Látogatók, value: 1280 }
  - Stat: { label: Letöltések, value: 342 }
  - Stat: { label: Értékelés, value: 4.8 }
`,
  );
}

/* ---------------------------------------------------------------- 9. Állapot */
{
  const body = card("yaml-state", "Állapot és reaktivitás");
  text(body, "A <code>state</code> kezdőértéke a leírásban adható meg. A <code>${...}</code> kifejezések automatikusan követik, mely állapotot olvasták, és csak azok változásakor frissülnek. A nyers HTML elemek szövege, attribútuma, osztálya és stílusa <strong>helyben</strong> frissül; az <code>if</code> és az <code>each</code> felépíti / lebontja a részfát; a komponensek <strong>újraépülnek</strong> ugyanazzal az azonosítóval, kivéve ahol frissítő metódus van (a Gantt <code>rows</code> paramétere a <code>setRows</code>-t hívja).");
  heading(body, "Kötés beviteli mezőkhöz (bind)");
  text(body, "A <code>bind</code> kétirányú: az állapotból tölti a mezőt, beíráskor visszaírja. Nem épít újra, így a fókusz megmarad. Működik a beviteli komponenseken (TextInput, Textarea, Select, Checkbox, Radio, RangeInput, NumberInput, DateInput stb.) és nyers <code>input</code> elemen is.");
  demo(
    body,
    "yd-bind",
    `
state: { name: "", agree: false, color: kek, size: 3 }
ui:
  - TextInput#yd-b-name: { bind: name, labelText: Név }
  - Checkbox#yd-b-agree: { bind: agree, labelText: Elfogadom }
  - Select#yd-b-color:
      bind: color
      labelText: Szín
      options: [ { text: Kék, value: kek }, { text: Piros, value: piros } ]
  - RangeInput#yd-b-size: { bind: size, min: 1, max: 10, labelText: Méret }
  - Paragraph: "Név: §{name || '-'}, elfogadva: §{agree ? 'igen' : 'nem'}, szín: §{color}, méret: §{size}"
`,
  );
  heading(body, "Kifejezések");
  table(body, "yaml-expr-table", ["Kifejezés", "Leírás"], [
    ["1  2.5  'szöveg'  true  null", "literálok"],
    ["a.b[0].c   list[i]", "útvonalak (az állapotból, az adatból vagy az each változójából)"],
    ["+  -  *  /  %", "aritmetika; a <code>+</code> szöveg esetén összefűz"],
    ["==  !=  <  <=  >  >=", "összehasonlítás (az <code>==</code> a null és az undefined között nem tesz különbséget)"],
    ["!  &&  ||  ??", "logika; a <code>??</code> csak null / undefined esetén ad alapértéket"],
    ["x ? 'igen' : 'nem'", "feltételes kifejezés, egymásba ágyazható"],
    ["len(x)  upper(x)  lower(x)  trim(x)", "szöveg és lista függvények"],
    ["join(l, ', ')  round(n, 2)  min(..)  max(..)  str(x)  plural(n, 'db', 'db')", "további függvények; más függvény nem hívható"],
  ]);
  demo(
    body,
    "yd-expr",
    `
state: { n: 7, word: alma }
ui:
  - RangeInput#yd-e-n: { bind: n, min: 0, max: 20, labelText: n }
  - TextInput#yd-e-w: { bind: word, labelText: szó }
  - ul:
      - li: "n * 2 = §{n * 2},  n % 3 = §{n % 3},  n / 3 = §{round(n / 3, 2)}"
      - li: "§{n > 10 ? 'nagy' : 'kicsi'} szám, §{n == 7 ? 'éppen hét' : 'nem hét'}"
      - li: "§{upper(word)}, hossza §{len(word)}, §{word + '!' + n}"
      - li: "min/max: §{min(n, 10)} / §{max(n, 10)}, alapérték: §{missing ?? 'nincs'}"
`,
  );
  heading(body, "Állapot JavaScriptből");
  code(body, "yd-store-js", "javascript", `const ui = buildUI(spec, { parent: "app" });

ui.state.set("count", 5);               // beállítás
ui.state.push("todos", { title: "x" }); // lista bővítése
ui.state.batch(() => {                  // több írás, egyetlen frissítés
  ui.state.set("a", 1);
  ui.state.set("b", 2);
});
const off = ui.state.subscribe(["count"], () => console.log(ui.state.get("count")));
off(); // leiratkozás`);
  text(body, "Tömbök és objektumok elemét <strong>cseréld</strong> (<code>set(\"rows.1\", ujSor)</code>), ne módosítsd helyben, így a változás felismerhető. Az állapot JSON-szerű adat legyen (a kezdőértéket a tár másolja).");
}

/* ---------------------------------------------------------------- 10. Téma */
{
  const body = card("yaml-theme", "Téma és stílus");
  text(body, "A <code>theme</code> kulcs CSS-változókat állít be a <code>:root</code>-ra (a <code>dark</code> alkulcs a sötét témára), a camelCase kulcsok kötőjelessé alakulnak. Egy részre szűkítve elég a változókat a konténer <code>style</code>-jára írni:");
  code(body, "yt-theme", "yaml", `theme:
  primary: "#7c3aed"
  cardRadius: 0.25rem
  dark: { primary: "#c4b5fd" }`);
  demo(
    body,
    "yd-scope",
    `
ui:
  - div:
      style: "--primary:#7c3aed;--primary-hover:#6d28d9;--radius:0.25rem"
      children:
        - Button: Lila gomb
        - Badge: { text: Lila téma ezen a területen, type: info }
`,
  );
}

/* ---------------------------------------------------------------- 11. Teljes példa */
{
  const body = card("yaml-todo", "Teljes példa: teendőlista");
  text(body, "Állapot, kötés, ismétlés, feltétel és műveletek együtt, JavaScript nélkül:");
  demo(
    body,
    "yd-todo",
    `
state:
  draft: ""
  todos: []
ui:
  - Card#yd-todo-card:
      title: Teendők
      body:
        - div:
            style: { display: flex, gap: 0.5rem, alignItems: end }
            children:
              - TextInput#yd-todo-draft: { bind: draft, placeholder: Mit kell tenni? }
              - button.btn:
                  text: Hozzáad
                  disabled: "§{!draft}"
                  click:
                    - push: { todos: { title: "§{draft}", done: false } }
                    - set: { draft: "" }
        - if: "§{len(todos) == 0}"
          then:
            - Paragraph: Még nincs teendő.
        - each: { in: "§{todos}", as: todo }
          do:
            - div:
                style: { display: flex, gap: 0.5rem, alignItems: center, padding: 0.25rem 0 }
                children:
                  - input:
                      type: checkbox
                      checked: "§{todo.done}"
                      change: { toggle: "todos.§{index}.done" }
                  - span:
                      text: "§{todo.title}"
                      style: "§{todo.done ? 'text-decoration:line-through;opacity:.6' : ''}"
        - Paragraph: "§{len(todos)} teendő"
      footer:
        - Button: { text: Összes törlése, click: { set: { todos: [] } } }
`,
  );
}

/* ---------------------------------------------------------------- 12. JS API */
{
  const body = card("yaml-api", "JavaScript API");
  code(body, "ya-sig", "typescript", `buildUI(spec: string | object, options?: BuildOptions): UI
mountYaml(target: HTMLElement | string, source: string | object, options?): UI
parseYaml(text: string): unknown          // csak a YAML-részhalmaz értelmezése`);
  heading(body, "BuildOptions");
  table(body, "ya-opts", ["Név", "Leírás"], [
    ["parent", "hová épüljön (elem vagy azonosító / szelektor); ha nincs megadva, új <code>div</code> készül"],
    ["handlers", "a <code>\"@név\"</code> hivatkozások függvényei: <code>(ctx, ...args) =&gt; void</code>"],
    ["data", "kész adatok: <code>$név</code> / <code>${név}</code> (nem reaktívak; frissítéshez használd az állapotot)"],
    ["state", "kezdőállapot, a leírás <code>state</code> részét felülírja"],
  ]);
  heading(body, "UI (a visszatérési érték)");
  table(body, "ya-ui", ["Név", "Leírás"], [
    ["root", "a gyökérelem, amibe az oldal épült"],
    ["state", "az állapottár: <code>get</code>, <code>set</code>, <code>toggle</code>, <code>inc</code>, <code>push</code>, <code>batch</code>, <code>subscribe</code>"],
    ["get(id)", "egy elem a leírásbeli <code>#id</code> alapján (beviteli komponensnél a doboz, benne az <code>input</code>)"],
    ["destroy()", "leiratkozik minden kötésről, eltávolítja az elemeket és a témát"],
  ]);
  heading(body, "Kezelő kontextusa");
  table(body, "ya-ctx", ["Név", "Leírás"], [
    ["state", "az állapottár"],
    ["ui", "a felépített felület (<code>ui.get(id)</code>, <code>ui.root</code>)"],
    ["event", "az esemény, ha a visszahívás első argumentuma esemény"],
    ["el", "az eseményt kezelő elem (<code>event.currentTarget</code>)"],
    ["args", "a visszahívás összes argumentuma (pl. Gantt <code>onMilestoneClick</code>: a mérföldkő és a sor)"],
  ]);
}

/* ---------------------------------------------------------------- 13. Hibák */
{
  const body = card("yaml-errors", "Hibák és hibaüzenetek");
  text(body, "A leíró hibái <strong>útvonallal</strong> (hol van a hiba a leírásban) és, ahol lehet, <strong>javaslattal</strong> érkeznek; a YAML-hibák a sorszámot is tartalmazzák. Az alábbi minták szándékosan hibásak, az eredmény a kapott üzenet:");
  const bad: Array<[string, string]> = [
    ["Elgépelt komponens", "ui:\n  - Buton: Mentés"],
    ["Elgépelt paraméter", "ui:\n  - Card:\n      tite: Cím"],
    ["Ismeretlen kezelő", "ui:\n  - Button: { text: x, click: \"@sav\" }"],
    ["Hiányzó kötelező paraméter", "ui:\n  - Link: { text: Hivatkozás }"],
    ["Hibás kifejezés", "ui:\n  - Paragraph: \"§{1 +}\""],
    ["Rossz behúzás (egy csomópont, két kulcs)", "ui:\n  - Button: x\n    Paragraph: y"],
    ["Tabulátor behúzás", "ui:\n\t- Button: x"],
    ["Ismétlődő azonosító", "ui:\n  - Button#x: a\n  - Paragraph#x: b"],
  ];
  bad.forEach(([title, src], i) => {
    heading(body, title);
    const s = y(src);
    code(body, `ye-${i}`, "yaml", s);
    let message = "";
    try {
      buildUI(s, { handlers: { save: () => undefined } }).destroy();
    } catch (e) {
      message = (e as Error).message;
    }
    createDOMElem({ tag: "pre", parent: body, attrs: { id: `ye-${i}-msg`, class: "yaml-demo-message" }, text: message || "–", style: { color: "var(--error)", whiteSpace: "pre-wrap", margin: "0.25rem 0 0.5rem", fontSize: "0.85rem" } });
  });
}

/* ---------------------------------------------------------------- 14. Szerkesztő, korlátok */
{
  const body = card("yaml-tools", "Szerkesztő-támogatás, korlátok és biztonság");
  text(body, "<strong>Automatikus kiegészítés a szerkesztőben:</strong> a könyvtár JSON Schemát ad (<code>assets/createDOMBlocks.schema.json</code>), amelyet a komponensek típusaiból generál. YAML nyelvi szerverrel (pl. VS Code) a fájl elejére elég egy sor, és a komponensek, paraméterek, enum értékek és leírások kiegészítődnek:");
  code(body, "yt-schema", "yaml", `# yaml-language-server: $schema=node_modules/createdomblocks/assets/createDOMBlocks.schema.json
ui:
  - Card:
      title: ...`);
  heading(body, "Korlátok");
  text(body, "A saját YAML-értelmező egy részhalmazt ismer: nincs horgony / alias, címke, több dokumentum és többsoros sima (idézőjel nélküli) szöveg; a <code>|</code> és <code>&gt;</code> blokk-szöveg és a flow forma (<code>[a, b]</code>, <code>{a: 1}</code>) működik. Az <code>each</code> és <code>if</code> a Tabs, Accordion és Drawer tartalmában csak egyszer értékelődik ki (nem reaktív). A nyers elemek <code>t:</code> argumentumai egyszer értékelődnek ki.");
  heading(body, "Biztonság");
  text(body, "Nincs <code>eval</code>: a kifejezések saját értelmezővel futnak, csak az engedélyezett függvények hívhatók, a <code>__proto__</code>, <code>constructor</code> és <code>prototype</code> nevek tiltottak. Eseménykezelő csak a megadott <code>handlers</code> térképből jöhet. A <code>html:</code> kulcs és a <code>content</code> nyers HTML, csak megbízható szöveget adj át; a <code>text</code> mindig szövegként kerül be.");
  createBadge({ parent: body, id: "yaml-badge", text: tr("Nincs eval, nincs új függőség"), type: "success" });
}

done();
