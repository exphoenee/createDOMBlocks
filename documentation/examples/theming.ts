import { initDocPage } from "../page-components/index";
import {
  createCard,
  createCodeBlock,
  createTable,
  createSelect,
  createTextInput,
  createCheckbox,
  createButtonInput,
  createSubmitInput,
  createBadge,
  createAlert,
  createProgressBar,
  createTabs,
} from "../../src/index";
import { createDOMElem } from "domelemjs";

const done = initDocPage();
const app = document.getElementById("app") as HTMLElement;

const bodyOf = (id: string) => document.querySelector(`#${id} .card-body`) as HTMLElement;
const card = (id: string, title: string) => {
  createCard({ parent: app, id, title, body: { tag: "div", attrs: { class: "card-content" } } });
  return bodyOf(id);
};
const text = (parent: HTMLElement, html: string, style: Record<string, string> = {}) =>
  createDOMElem({ tag: "p", parent, content: html, style: { margin: "0.5rem 0", ...style } });
const code = (parent: HTMLElement, id: string, language: string, src: string) =>
  createCodeBlock({ parent, id, language, code: src });

/* ---------------------------------------------------------------- 1. Gyors kezdés */
{
  const body = card("theme-quickstart", "Gyors kezdés");
  text(body, "A createDOMBlocks megjelenését egyetlen <code>style.css</code> adja, amely <strong>CSS változókra (custom properties)</strong> épül. A színeket, lekerekítést, árnyékot és az animáció sebességét ezért nem a komponensek kódjában, hanem a változók felülírásával állíthatod. Nincs szükség build lépésre vagy a könyvtár módosítására.");

  text(body, "<strong>1. Töltsd be a saját CSS-ed a könyvtáré után</strong> — így azonos specificitásnál a tiéd győz:", { marginTop: "1rem" });
  code(body, "theme-q1", "html", `<link rel="stylesheet" href="node_modules/createdomblocks/dist/style.css" />
<link rel="stylesheet" href="my-theme.css" />`);
  text(body, "Bundlerrel (webpack, Vite stb.) ugyanez: előbb <code>import \"createdomblocks/style.css\"</code>, utána a saját fájlod importja.");

  text(body, "<strong>2. Írd felül a változókat a <code>:root</code>-on</strong> — az egész oldal komponenseire érvényes:", { marginTop: "1rem" });
  code(body, "theme-q2", "css", `/* my-theme.css */
:root {
  --primary: #7c3aed;        /* márkaszín: gombok, aktív elemek, fókusz */
  --primary-hover: #6d28d9;
  --radius: 0.25rem;         /* kisebb lekerekítés mindenhol */
}`);

  text(body, "<strong>3. Vagy csak egy részre</strong> — a változók öröklődnek, ezért egy konténerre szűkítve több téma is élhet egy oldalon:", { marginTop: "1rem" });
  code(body, "theme-q3", "css", `.admin-panel {
  --primary: #16a34a;
  --bg: #f0fdf4;
}`);
}

/* ---------------------------------------------------------------- 2. Változók */
{
  const body = card("theme-vars", "CSS változók");
  text(body, "Ezeket a változókat definiálja a könyvtár a <code>:root</code>-on. Bármelyik felülírható.");
  createTable(
    [
      { Változó: "--primary", Alap: "#3b82f6", Szerep: "Márkaszín: elsődleges gombok, aktív menüpont, fókusz, kijelölés" },
      { Változó: "--primary-hover", Alap: "#2563eb", Szerep: "A --primary hover / aktív állapota" },
      { Változó: "--on-primary", Alap: "#ffffff", Szerep: "Szöveg a --primary színű felületeken (olvashatóság sötétebb / világosabb márkaszínnél)" },
      { Változó: "--secondary", Alap: "#6b7280", Szerep: "Másodlagos szín" },
      { Változó: "--text", Alap: "#1f2937", Szerep: "Fő szövegszín" },
      { Változó: "--text-light", Alap: "#6b7280", Szerep: "Halványabb szöveg: címkék, leírások, segédszövegek" },
      { Változó: "--bg", Alap: "#ffffff", Szerep: "Fő háttér (inputok, kártyák, modál, menü)" },
      { Változó: "--bg-alt", Alap: "#f9fafb", Szerep: "Másodlagos háttér: fejlécek, hover sorok, üres állapotok" },
      { Változó: "--border", Alap: "#e5e7eb", Szerep: "Keretek, elválasztó vonalak" },
      { Változó: "--success / --success-bg", Alap: "#22c55e / #dcfce7", Szerep: "Siker állapot: alert, badge, toast" },
      { Változó: "--error / --error-bg", Alap: "#ef4444 / #fee2e2", Szerep: "Hiba állapot" },
      { Változó: "--warning / --warning-bg", Alap: "#f59e0b / #fef3c7", Szerep: "Figyelmeztetés" },
      { Változó: "--info / --info-bg", Alap: "#3b82f6 / #dbeafe", Szerep: "Információ" },
      { Változó: "--neutral / --neutral-bg", Alap: "#6b7280 / #f3f4f6", Szerep: "Semleges állapot" },
      { Változó: "--success-text / --error-text / --warning-text / --info-text", Alap: "#166534 / #991b1b / #92400e / #1e40af", Szerep: "Szöveg a -bg hátterű állapotelemeken (alert, badge, toast); sötét témában világosabbak" },
      { Változó: "--radius", Alap: "0.5rem", Szerep: "Alap lekerekítés: inputok, gombok, kártyák" },
      { Változó: "--radius-lg", Alap: "1rem", Szerep: "Nagyobb elemek lekerekítése: modál, hero" },
      { Változó: "--shadow / --shadow-md / --shadow-lg", Alap: "…", Szerep: "Három árnyékfokozat (kártya, lebegő elem, modál)" },
      { Változó: "--transition", Alap: "0.2s ease", Szerep: "Az animációk időzítése; `0s` kikapcsolja a legtöbb átmenetet" },
    ],
    { parent: body, id: "theme-vars-table", hasHeader: true },
  );
}

/* ---------------------------------------------------------------- 3. Élő demó */
{
  const body = card("theme-demo-card", "Élő demó: témaváltás");
  text(body, "Válassz egy témát: a lenti komponensek <em>ugyanazzal a kóddal</em> jelennek meg, csak a változók értéke más. A téma egy <code>data-theme</code> attribútumos konténerre van szűkítve; éles használatban ugyanezt a blokkot a <code>:root</code>-ra írod.");

  type Theme = { id: string; label: string; vars: Record<string, string> };
  const themes: Theme[] = [
    { id: "alap", label: "Alap (nincs felülírás)", vars: {} },
    {
      id: "sotet",
      label: "Sötét",
      vars: {
        "--bg": "#0f172a", "--bg-alt": "#1e293b", "--text": "#e2e8f0", "--text-light": "#94a3b8", "--border": "#334155",
        "--primary": "#38bdf8", "--primary-hover": "#0ea5e9", "--on-primary": "#0f172a",
        "--info-bg": "#0c4a6e", "--success-bg": "#14532d", "--error-bg": "#7f1d1d", "--warning-bg": "#78350f", "--neutral-bg": "#334155",
        "--shadow-md": "0 4px 6px rgba(0,0,0,0.5)",
      },
    },
    { id: "lila", label: "Lila márka, kisebb lekerekítés", vars: { "--primary": "#7c3aed", "--primary-hover": "#6d28d9", "--radius": "0.25rem", "--radius-lg": "0.5rem" } },
    { id: "zold", label: "Zöld, puha", vars: { "--primary": "#16a34a", "--primary-hover": "#15803d", "--bg-alt": "#f0fdf4", "--border": "#bbf7d0", "--radius": "0.875rem", "--radius-lg": "1.5rem" } },
    {
      id: "eles",
      label: "Éles, lapos (nincs lekerekítés és árnyék)",
      vars: {
        "--primary": "#111827", "--primary-hover": "#374151", "--border": "#111827", "--radius": "0", "--radius-lg": "0",
        "--shadow": "none", "--shadow-md": "none", "--shadow-lg": "none", "--transition": "0s",
      },
    },
  ];

  const css = (t: Theme, selector: string) =>
    Object.keys(t.vars).length
      ? `${selector} {\n${Object.entries(t.vars).map(([k, v]) => `  ${k}: ${v};`).join("\n")}\n}`
      : `/* nincs felülírás: a könyvtár alap témája */`;

  // a demó konténer saját témái (egy <style> elemben), a kódblokk a :root-os változatot mutatja
  const style = document.createElement("style");
  style.textContent = themes.map((t) => css(t, `.theme-demo[data-theme="${t.id}"]`)).join("\n");
  document.head.appendChild(style);

  const picker = createSelect({
    parent: body,
    id: "theme-picker",
    labelText: "Téma:",
    options: themes.map((t) => ({ text: t.label, value: t.id })),
  });
  const select = picker.querySelector("select") as HTMLSelectElement;

  const demo = createDOMElem({
    tag: "div",
    parent: body,
    attrs: { class: "theme-demo", "data-theme": "alap" },
    style: { background: "var(--bg)", color: "var(--text)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "1.25rem", margin: "0.5rem 0 1rem" },
  });

  createTextInput({ parent: demo, id: "td-name", labelText: "Név:", placeholder: "Ide írj…" });
  createCheckbox({ parent: demo, id: "td-check", labelText: "Elfogadom a feltételeket" });
  const row = createDOMElem({ tag: "div", parent: demo, style: { display: "flex", gap: "0.5rem", flexWrap: "wrap", margin: "0.75rem 0" } });
  createButtonInput({ parent: row, id: "td-btn", text: "Gomb" });
  createSubmitInput({ parent: row, id: "td-submit", text: "Küldés" });
  const badges = createDOMElem({ tag: "div", parent: demo, style: { display: "flex", gap: "0.5rem", flexWrap: "wrap", margin: "0.75rem 0" } });
  (["info", "success", "warning", "error", "neutral"] as const).forEach((type) =>
    createBadge({ parent: badges, id: `td-badge-${type}`, text: type, type })
  );
  createAlert({ parent: demo, id: "td-alert", type: "info", title: "Információ", message: "Az alert a --info és --info-bg változókból épül." });
  createProgressBar({ parent: demo, id: "td-progress", value: 65, label: "Folyamat", showPercentage: true });
  createTabs({
    parent: demo,
    id: "td-tabs",
    ariaLabel: "Demó tabok",
    tabs: [
      { id: "a", label: "Első", content: { tag: "p", text: "Az aktív tab a --primary színt használja." } },
      { id: "b", label: "Második", content: { tag: "p", text: "Második tab tartalma." } },
    ],
  });
  createTable(
    [{ Név: "Anna", Pont: 82 }, { Név: "Béla", Pont: 91 }, { Név: "Csaba", Pont: 67 }],
    { parent: demo, id: "td-table", hasHeader: true, sortable: true },
  );

  const codeHost = createDOMElem({ tag: "div", parent: body });
  const show = () => {
    const t = themes.find((x) => x.id === select.value) as Theme;
    demo.setAttribute("data-theme", t.id);
    codeHost.textContent = "";
    createDOMElem({ tag: "p", parent: codeHost, content: "Éles használatban ezt írod a saját CSS-edbe:", style: { margin: "0.25rem 0 0.5rem" } });
    createCodeBlock({ parent: codeHost, id: "theme-demo-code", language: "css", code: css(t, ":root") });
  };
  select.addEventListener("change", show);
  show();
}

/* ---------------------------------------------------------------- 4. Sötét mód */
{
  const body = card("theme-dark", "Sötét mód");
  text(body, "<strong>Kész sötét téma a dobozból.</strong> A <code>style.css</code> tartalmaz egy opt-in sötét témát: állítsd a <code>&lt;html&gt;</code> elemre a <code>data-theme=\"dark\"</code> attribútumot, és minden komponens átvált. Ezt használja ez a dokumentáció is (jobb felső sarok: nap / hold gomb). Automatikusan nem kapcsol be, hogy a meglévő oldalak kinézete ne változzon.");
  code(body, "theme-dark-builtin", "typescript", `// kézi kapcsoló + a rendszerbeállítás követése
const preferred = matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
document.documentElement.dataset.theme = localStorage.getItem("theme") ?? preferred;`);
  text(body, "Ha a saját palettádat szeretnéd, az alábbi változókat írd felül (a beépített téma ugyanezt teszi):", { marginTop: "1rem" });
  text(body, "A sötét mód ugyanígy működik: a háttér-, szöveg- és keretváltozókat kell felülírni. Kétféleképp is kérheted — az operációs rendszer beállítása szerint, vagy kézi kapcsolóval (a kettő kombinálható):");
  code(body, "theme-dark-css", "css", `/* 1) Automatikus: a rendszer beállítása szerint */
@media (prefers-color-scheme: dark) {
  :root {
    --bg: #0f172a;
    --bg-alt: #1e293b;
    --text: #e2e8f0;
    --text-light: #94a3b8;
    --border: #334155;
    --primary: #38bdf8;
    --primary-hover: #0ea5e9;
    --on-primary: #0f172a;
    --info-bg: #0c4a6e;
    --success-bg: #14532d;
    --error-bg: #7f1d1d;
    --warning-bg: #78350f;
    --neutral-bg: #334155;
  }
}

/* 2) Kézi kapcsoló: <html data-theme="dark"> */
:root[data-theme="dark"] {
  --bg: #0f172a;
  --bg-alt: #1e293b;
  /* … ugyanazok az értékek, mint fent */
}`);
  code(body, "theme-dark-js", "typescript", `const root = document.documentElement;

// betöltéskor visszaállítjuk a korábbi választást
const saved = localStorage.getItem("theme");
if (saved) root.dataset.theme = saved;

function toggleTheme() {
  const next = root.dataset.theme === "dark" ? "light" : "dark";
  root.dataset.theme = next;
  localStorage.setItem("theme", next);
}`);
  text(body, "Tipp: a változók felülírása az inline stílusokban lévő értékekre is hat, mert a komponensek <code>var(--bg)</code> stb. hivatkozásokat használnak (pl. a modál is).", { color: "var(--text-light)" });
}

/* ---------------------------------------------------------------- 5. Finomhangolás */
{
  const body = card("theme-fine", "Finomhangolás osztályokkal");
  text(body, "Ha a változók nem elegendők, az egyes komponensek osztályait is felülírhatod. Minden komponens kiszámítható, stabil osztályneveket használ, és a legtöbb elfogad egy <code>class</code> paramétert is, amivel saját osztályt adhatsz rá:");
  code(body, "theme-fine-ts", "typescript", `createButtonInput({
  parent,
  id: "save",
  text: "Mentés",
  class: "btn-danger",   // saját osztály a könyvtár osztálya mellé
});`);
  code(body, "theme-fine-css", "css", `/* a saját osztály: a könyvtár szabályánál nagyobb specificitású választóval */
input.button-input.btn-danger {
  background-color: #dc2626;
}
input.button-input.btn-danger:hover {
  background-color: #b91c1c;
}

/* egy komponens összes példányának módosítása */
.card {
  border-radius: 0;
  box-shadow: none;
}
.card-header {
  background: var(--bg-alt);
}`);
  text(body, "Gyakran használt osztályok:", { marginTop: "1rem" });
  createTable(
    [
      { Komponens: "Gomb input", Osztály: "input.button-input, input.submit-input, input.reset-input", Megjegyzés: "a háttér a --primary / --success / --error szerint" },
      { Komponens: "Szöveges mezők", Osztály: ".text-input, .email-input, … (a konténer), .text-input input", Megjegyzés: "a konténer típusnév-input osztályt kap" },
      { Komponens: "Kártya", Osztály: ".card, .card-header, .card-body, .card-footer", Megjegyzés: "" },
      { Komponens: "Táblázat", Osztály: ".table, .table-container, .table-filter, .table-page-btn", Megjegyzés: "szűrés / lapozás / rendezés elemei is" },
      { Komponens: "Tabok", Osztály: ".tab-button, .tab-button.active, .tab-panel", Megjegyzés: "" },
      { Komponens: "Modál", Osztály: ".modal, .modal-title, .modal-footer", Megjegyzés: "a hátteret / árnyékot a változók adják" },
      { Komponens: "Menü / Drawer", Osztály: ".drawer-sidebar, .drawer-link, .drawer-link.active", Megjegyzés: "" },
      { Komponens: "Jelzések", Osztály: ".alert, .badge, .toast, .progress-fill", Megjegyzés: "típusonként -success / -error … módosítóval" },
    ],
    { parent: body, id: "theme-fine-table", hasHeader: true },
  );
}

/* ---------------------------------------------------------------- 6. Komponens-változók */
{
  const body = card("theme-comp", "Komponens-szintű változók");
  text(body, "Néhány komponens saját változókat is használ, amelyeket paraméterből is beállíthatsz, vagy CSS-ből felülírhatsz:");
  createTable(
    [
      { Változó: "--carousel-slide-w", Komponens: "Carousel", Szerep: "Egy slide szélessége (a `slideWidth` paraméter állítja)" },
      { Változó: "--carousel-height", Komponens: "Carousel", Szerep: "A színpad magassága (a `height` paraméter állítja)" },
    ],
    { parent: body, id: "theme-comp-table", hasHeader: true },
  );
  code(body, "theme-comp-css", "css", `.hero-carousel {
  --carousel-slide-w: 420px;
  --carousel-height: 360px;
}`);
}

/* ---------------------------------------------------------------- 7. Tippek */
{
  const body = card("theme-tips", "Tippek és ismert korlátok");
  const list = createDOMElem({ tag: "ul", parent: body, style: { listStyle: "disc", paddingLeft: "1.25rem", display: "grid", gap: "0.5rem" } });
  [
    "<strong>Előbb a változók, utána az osztályok.</strong> A változó-felülírás a legkisebb, legstabilabb módosítás, és frissítéskor sem törik el.",
    "<strong>Kerüld az <code>!important</code>-ot.</strong> Elég a saját stíluslapot a <code>style.css</code> után betölteni, vagy kétosztályos választót használni (<code>.card.my-card</code>).",
    "<strong>Mozgáscsökkentés.</strong> A <code>--transition: 0s</code> kikapcsolja a legtöbb átmenetet; érdemes a <code>@media (prefers-reduced-motion: reduce)</code> blokkban beállítani.",
    "<strong>Betűtípus.</strong> A könyvtár a <code>body</code>-ra állítja a rendszerfontot; ezt a saját <code>body { font-family: … }</code> szabályoddal cseréled le, a komponensek öröklik.",
    "<strong>Állapotszínek.</strong> A <code>--success</code>, <code>--error</code> stb. párok (<code>-bg</code> változattal) az alert, badge és toast alapja. Sötét témában a <code>-bg</code> párokat is sötétre kell állítani.",
    "<strong>Ismert korlát:</strong> néhány apró díszelem (pl. a paraméter-táblázat típusjelvényei, egyes alert-szövegszínek) fix színt használ. Ezeket osztályfelülírással igazíthatod a témádhoz, pl. <code>.type-badge { … }</code>.",
  ].forEach((html) => createDOMElem({ tag: "li", parent: list, content: html }));
}

done();
