import { initDocPage } from "../page-components/index";
import {
  createCard,
  createCodeBlock,
  createTextarea,
  createBadge,
  buildUI,
  mountYaml,
  createLocalizedElem as createDOMElem,
} from "../../src/index";
import type { UI, DOMOptions } from "../../src/index";
import { tr } from "../page-components/i18n";

const done = initDocPage();
const app = document.getElementById("app") as HTMLElement;

const bodyOf = (id: string) => document.querySelector(`#${id} .card-body`) as HTMLElement;
const card = (id: string, title: string) => {
  createCard({ parent: app, id, title: tr(title), body: { tag: "div", attrs: { class: "card-content" } } });
  return bodyOf(id);
};
const text = (parent: HTMLElement, html: string, style: Record<string, string> = {}) =>
  createDOMElem({ tag: "p", parent, content: tr(html), style: { margin: "0.5rem 0", ...style } });
const code = (parent: HTMLElement, id: string, language: string, src: string) =>
  createCodeBlock({ parent, id, language, code: src });

/* ---------------------------------------------------------------- 1. Gyors kezdés */
{
  const body = card("yaml-quickstart", "Gyors kezdés");
  text(body, "Az oldalt nem kell soronként, <code>createX</code> hívásokkal felépíteni: egy <strong>YAML leíró</strong> egyben megadja a szerkezetet, a szövegeket és az állapotot. A leírásból a <code>mountYaml</code> / <code>buildUI</code> építi fel az oldalt a meglévő komponensekkel, új komponens nem készül.");
  code(body, "yaml-q1", "html", `<div id="app"></div>
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
  text(body, "A <code>&lt;script type=\"text/yaml\"&gt;</code> elem <code>file://</code> alól is működik (a <code>fetch</code> ott nem). A leírás lehet YAML szöveg vagy kész JavaScript objektum is, ugyanazokkal a szabályokkal.", { marginTop: "1rem" });
}

/* ---------------------------------------------------------------- 2. Élő szerkesztő */
{
  const body = card("yaml-live", "Élő szerkesztő");
  text(body, "Írd át a leírást: a jobb oldali eredmény gépelés közben újraépül, a hibák sorszámmal és javaslattal jelennek meg.");

  const SAMPLE = `state:
  count: 0
  name: ""
messages:
  hu: { hello: "Szia, {name}!" }
  en: { hello: "Hello, {name}!" }
ui:
  - Card#demo:
      title: Számláló és üdvözlés
      body:
        - Paragraph: "Kattintások: \${count}"
        - Button: { text: Növelés, click: { inc: count } }
        - TextInput: { bind: name, placeholder: A neved }
        - if: "\${name}"
          then:
            - Paragraph: "Szia, \${name}! (\${upper(name)})"
`;
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

/* ---------------------------------------------------------------- 3. Csomópont */
{
  const body = card("yaml-nodes", "A csomópont szintaxisa");
  text(body, "Egy csomópont egyetlen kulcsból áll: a kulcs a komponens neve (a <code>create</code> nélkül, <strong>nagybetűvel</strong>), az érték a paraméterei. Ami előre kitalálható, rövidíthető.");
  code(body, "yaml-n1", "yaml", `- Card#info.wide:            # Típus # id . osztály
    title: Versenykiírás     # paraméterek
    body:                    # a gyerekek listája
      - Paragraph: Rövid leírás
      - Button: Mentés       # skalár = a fő szöveg
- Title(2): Alcím            # zárójelben a szint
- div.row:                   # kisbetűs név = nyers HTML elem
    - span: bal
    - a: { href: "x.html", text: link }`);
  const rows: Array<[string, string]> = [
    ["Button: Mentés", "skalár érték: a komponens fő szövege (<code>text</code>, Cardnál <code>title</code>)"],
    ["Card#id.a.b", "<code>#id</code> az azonosító, <code>.a.b</code> az osztályok; id nélkül automatikus"],
    ["Title(2)", "a zárójeles szám a <code>level</code> paraméter"],
    ["Card: [ ... ]", "lista érték: a gyerekek (Cardnál a <code>body</code>, Tabsnál a <code>tabs</code>, listáknál az <code>items</code>)"],
    ["div, section, a", "kisbetűs név: nyers HTML elem; ismeretlen kulcs attribútum, az <code>click</code>, <code>input</code> stb. esemény"],
  ];
  createDOMElem({
    tag: "table",
    parent: body,
    attrs: { id: "yaml-n-table", class: "table" },
    style: { width: "100%", marginTop: "1rem", borderCollapse: "collapse" },
    children: [
      { tag: "thead", children: [{ tag: "tr", children: [{ tag: "th", text: tr("Forma"), style: { textAlign: "left", padding: "0.4rem" } }, { tag: "th", text: tr("Jelentés"), style: { textAlign: "left", padding: "0.4rem" } }] }] },
      {
        tag: "tbody",
        children: rows.map(([form, meaning]): DOMOptions => ({
          tag: "tr",
          style: { borderTop: "1px solid var(--border)" },
          children: [
            { tag: "td", text: form, style: { padding: "0.4rem", fontFamily: "ui-monospace,Consolas,monospace", fontSize: "0.85rem", whiteSpace: "nowrap" } },
            { tag: "td", content: tr(meaning), style: { padding: "0.4rem" } },
          ],
        })),
      },
    ],
  });
}

/* ---------------------------------------------------------------- 4. Szövegek, események */
{
  const body = card("yaml-i18n-events", "Szövegek és események");
  text(body, "A <code>messages</code> kulcs a nyelvi szövegeket a meglévő <code>defineMessages</code> / <code>tr()</code> rétegbe regisztrálja, a <code>t:</code> kulccsal hivatkozhatsz rájuk; nyelvváltáskor a szövegek maguktól frissülnek.");
  code(body, "yaml-e1", "yaml", `messages:
  hu: { form: { save: Mentés } }
  en: { form: { save: Save } }
ui:
  - Button: { t: form.save, click: "@save" }   # @save → a handlers.save függvény
  - Button: { text: Nyit, click: { open: help } }   # beépített művelet`);
  text(body, "Az eseménykezelők JavaScriptben maradnak: <code>@név</code> a <code>buildUI(spec, { handlers })</code> térkép egy függvényére mutat (ismeretlen név hibát ad). A beépített műveletek: <code>set</code>, <code>toggle</code>, <code>inc</code>, <code>push</code>, <code>open</code>, <code>close</code>; listában egymás után futnak.", { marginTop: "1rem" });
  code(body, "yaml-e2", "javascript", `CreateDOMBlocks.buildUI(spec, {
  parent: "#app",
  handlers: {
    // az első paraméter a kontextus: { state, ui, event, el, args }
    save: ({ state, ui }) => console.log(state.get("name"), ui.get("demo")),
  },
  data: { rows },        // kész adatok: $rows vagy \${rows}
});`);
}

/* ---------------------------------------------------------------- 5. Adat, ismétlés, feltétel, részletek */
{
  const body = card("yaml-data", "Adatok, ismétlés, feltétel és saját részletek");
  code(body, "yaml-d1", "yaml", `define:                              # saját, paraméterezhető részlet
  DocRow:
    params: [title, href]
    body:
      - div.doc:
          - span: "\${title}"
          - a: { href: "\${href}", text: Megnézés }
ui:
  - each: { in: $docs, as: d, key: d.id }   # ismétlés (a JS-ből átadott adatból)
    do:
      - DocRow: { title: "\${d.title}", href: "\${d.href}" }
  - if: "\${open}"                          # feltétel
    then: [ { Paragraph: Nyitva } ]
    else: [ { Paragraph: Zárva } ]`);
  text(body, "A <code>\${...}</code> kifejezésekben megengedett: számok, szövegek, útvonalak (<code>a.b[0]</code>), <code>! - + * / % &lt; &lt;= &gt; &gt;= == != &amp;&amp; || ??</code>, a ternáris <code>?:</code> és a <code>len</code>, <code>upper</code>, <code>lower</code>, <code>trim</code>, <code>join</code>, <code>round</code>, <code>min</code>, <code>max</code>, <code>str</code>, <code>plural</code> függvények. Nincs <code>eval</code>, hozzárendelés vagy tetszőleges függvényhívás.", { marginTop: "1rem" });
}

/* ---------------------------------------------------------------- 6. Állapot */
{
  const body = card("yaml-state", "Állapot és reaktivitás");
  text(body, "A <code>state</code> kezdőértéke a leírásban adható meg. A <code>\${...}</code> kifejezések automatikusan követik, mely állapotot olvasták, és csak azok változásakor frissülnek.");
  code(body, "yaml-s1", "yaml", `state: { q: "", showHelp: false, rows: [] }
ui:
  - TextInput: { bind: q, placeholder: Keresés }      # kétirányú kötés
  - Paragraph: "\${len(rows)} találat, keresés: \${q}"
  - Button: { text: Súgó, click: { toggle: showHelp } }
  - if: "\${showHelp}"
    then: [ { Paragraph: Itt a súgó } ]
  - Gantt: { rows: "\${rows}" }                          # frissítő metódus: setRows`);
  text(body, "Hogyan frissül? A nyers HTML elemek szövege, attribútuma, osztálya és stílusa <strong>helyben</strong>; az <code>if</code> és az <code>each</code> felépíti / lebontja a részfát (az <code>each</code> a <code>key</code> alapján kulcsolt, az elemek megmaradnak); a komponensek <strong>újraépülnek</strong> ugyanazzal az azonosítóval, kivéve ahol frissítő metódus van (a Gantt <code>rows</code> paramétere a <code>setRows</code>-t hívja). A <code>bind</code> nem épít újra, így a fókusz megmarad.", { marginTop: "1rem" });
  text(body, "Az állapotot JavaScriptből is írhatod: <code>ui.state.set(\"q\", \"alma\")</code>, <code>ui.state.push(\"rows\", sor)</code>. Tömbök és objektumok elemét <strong>cseréld</strong> (<code>set(\"rows.1\", ujSor)</code>), ne módosítsd helyben, így a változás felismerhető.");
}

/* ---------------------------------------------------------------- 7. Téma, szerkesztő, korlátok */
{
  const body = card("yaml-tools", "Téma, szerkesztő-támogatás és korlátok");
  text(body, "A <code>theme</code> kulcs CSS-változókat állít be a <code>:root</code>-ra (a <code>dark</code> alkulcs a sötét témára), a camelCase kulcsok kötőjelessé alakulnak:");
  code(body, "yaml-t1", "yaml", `theme:
  primary: "#7c3aed"
  cardRadius: 0.25rem
  dark: { primary: "#c4b5fd" }`);
  text(body, "<strong>Automatikus kiegészítés a szerkesztőben:</strong> a könyvtár JSON Schemát ad (<code>assets/createDOMBlocks.schema.json</code>), amelyet a komponensek típusaiból generál. YAML nyelvi szerverrel (pl. VS Code) a fájl elejére elég egy sor:", { marginTop: "1rem" });
  code(body, "yaml-t2", "yaml", `# yaml-language-server: $schema=node_modules/createdomblocks/assets/createDOMBlocks.schema.json`);
  text(body, "<strong>Hibák:</strong> a leíró hibái útvonallal és javaslattal érkeznek, pl. <code>ui[0].Card.tite: ismeretlen paraméter: \"tite\", erre gondoltál: \"title\"?</code>", { marginTop: "1rem" });
  text(body, "<strong>Korlátok:</strong> a saját YAML-értelmező egy részhalmazt ismer (nincs horgony/alias, címke, több dokumentum, többsoros sima szöveg); az <code>each</code> és <code>if</code> a Tabs, Accordion és Drawer tartalmában csak egyszer értékelődik ki (nem reaktív); a <code>html:</code> kulcs és a <code>content</code> nyers HTML, csak megbízható szöveget adj át.");
  createBadge({ parent: body, id: "yaml-badge", text: tr("Nincs eval, nincs új függőség"), type: "success" });
}

done();
