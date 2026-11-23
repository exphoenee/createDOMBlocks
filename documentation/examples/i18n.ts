import { initDocPage } from "../page-components/index";
import {
  createCard,
  createCodeBlock,
  createTable,
  createSelect,
  createTextInput,
  createPasswordInput,
  createButtonInput,
  createAlert,
  createTabs,
  createCustomDatePicker,
  createModal,
  openModal,
  defineMessages,
  registerTranslations,
  setLocale,
  getLocale,
  onLocaleChange,
  huMessages,
  enMessages,
  t,
  createLocalizedElem,
} from "../../src/index";
import { createLocalizedElem as createDOMElem } from "../../src/index";
import { tr as dtr, trRows } from "../page-components/i18n";

const done = initDocPage();
const app = document.getElementById("app") as HTMLElement;

const bodyOf = (id: string) => document.querySelector(`#${id} .card-body`) as HTMLElement;
const card = (id: string, title: string) => {
  createCard({ parent: app, id, title: dtr(title), body: { tag: "div", attrs: { class: "card-content" } } });
  return bodyOf(id);
};
const text = (parent: HTMLElement, html: string, style: Record<string, string> = {}) =>
  createDOMElem({ tag: "p", parent, content: dtr(html), style: { margin: "0.5rem 0", ...style } });
const code = (parent: HTMLElement, id: string, language: string, src: string) =>
  createCodeBlock({ parent, id, language, code: src });

/* ---------------------------------------------------------------- 1. Alapok */
{
  const body = card("i18n-basics", "Alapok");
  text(body, "Minden komponens <strong>minden szöveges paramétere</strong> (címke, placeholder, gomb felirat, cím, üzenet, aria-label, táblázat cella…) háromféle értéket fogad. A <code>tr()</code> hivatkozás és a függvény <strong>nyelvváltáskor magától újraszámolódik</strong>: a komponens ugyanaz az elem marad, csak a szövege cserélődik, ezért az állapota (begépelt érték, aktív tab, lapozás, kijelölés, lejátszás) nem vész el.");
  createTable(
    trRows([
      { Forma: "\"Fix szöveg\"", Példa: "text: \"Mentés\"", Nyelvváltáskor: "nem változik" },
      { Forma: "tr(\"kulcs\", paraméterek?)", Példa: "text: tr(\"form.save\")", Nyelvváltáskor: "automatikusan frissül (ajánlott)" },
      { Forma: "() => string", Példa: "text: () => t(\"hello\", { name })", Nyelvváltáskor: "újra lefut, az eredmény frissül" },
    ], ["Forma", "Példa"]),
    { parent: body, id: "i18n-forms-table", hasHeader: true },
  );
  text(body, "A beépített feliratok (táblázat lapozó, modál gombok, jelszó szem gomb, zenelejátszó aria-label-ek, naptár hónapnevei stb.) szintén átváltanak, a könyvtár magyar (<code>hu</code>, alapértelmezett) és angol (<code>en</code>) katalógust tartalmaz. Más nyelvet te regisztrálsz.", { marginTop: "1rem" });
}

/* ---------------------------------------------------------------- 2. Gyors kezdés */
{
  const body = card("i18n-quickstart", "Gyors kezdés");
  code(body, "i18n-q1", "typescript", `import { defineMessages, setLocale, createTextInput, createButtonInput } from "createdomblocks";

// 1) Üzenetek egyetlen objektumban (nyelvenként ágyazható); a defineMessages regisztrálja őket,
//    és típusos tr() hivatkozásokat ad vissza, nem kell kulcs-stringeket gépelni
const m = defineMessages({
  hu: { form: { name: "Név", save: "Mentés" } },
  en: { form: { name: "Name", save: "Save" } },
});

// 2) Komponensek: a szövegeket a hivatkozásokkal add át
createTextInput({ parent: "app", id: "name", labelText: m.form.name });
createButtonInput({ parent: "app", id: "save", text: m.form.save });

// 3) Nyelvváltás: minden feliratot frissít, a begépelt érték megmarad
setLocale("en");`);
}

/* ---------------------------------------------------------------- 2b. Üzenetek objektumból */
{
  const body = card("i18n-object", "Üzenetek JavaScript objektumból");
  text(body, "Nem kell minden kulcsot kézzel, egyesével regisztrálni: az üzeneteket megadhatod <strong>egymásba ágyazott JavaScript objektumként</strong>. A beágyazás pontokkal lapul egyetlen kulccsá (<code>form.save</code>), a többes számú szövegeknek pedig elég egy <code>one</code> / <code>other</code> objektum.");
  code(body, "i18n-o1a", "typescript", `import { defineMessages, registerTranslations, registerMessages, flattenMessages } from "createdomblocks";

// A) defineMessages: több nyelv egy objektumból + típusos hivatkozások (ajánlott)
const m = defineMessages({
  hu: {
    form: { name: "Név", save: "Mentés" },
    cart: { items: { one: "{count} termék", other: "{count} termék" } },
  },
  en: {
    form: { name: "Name", save: "Save" },
    cart: { items: { one: "{count} item", other: "{count} items" } },
  },
});

m.form.save;        // tr("form.save"): komponens-paraméterbe adható, nyelvváltáskor frissül
m.cart.items;       // tr("cart.items"): a count paraméter választja az _one / _other szöveget
t(m.cart.items.key, { count: 3 }); // "3 items" (angolul)

// B) registerTranslations: ugyanez hivatkozások nélkül, opcionális előtaggal
registerTranslations({ hu: { save: "Mentés" }, en: { save: "Save" } }, { prefix: "toolbar" }); // toolbar.save

// C) registerMessages: egy nyelv, lapos vagy ágyazott objektum is jó
registerMessages("de", { form: { save: "Speichern" } });

// D) flattenMessages: csak a lapítás (pl. ellenőrzéshez, vagy más rendszerbe exportáláshoz)
flattenMessages({ form: { save: "Mentés" }, items: { one: "{count} elem", other: "{count} elem" } });
// { "form.save": "Mentés", "items_one": "{count} elem", "items_other": "{count} elem" }`);
  text(body, "A <code>defineMessages</code> a kulcsokat <strong>típus-szinten</strong> is ismeri: az IDE kiegészít (<code>m.form.</code> → <code>name</code>, <code>save</code>), egy elgépelt kulcs pedig fordítási hiba lesz. A nyelvi fájlok (<code>loadMessages</code>) is lehetnek ágyazott JSON-ok, ugyanígy lapulnak.", { marginTop: "1rem" });
}

/* ---------------------------------------------------------------- 3. Élő demó */
{
  const body = card("i18n-demo-card", "Élő demó");
  text(body, "Válassz nyelvet, és figyeld a komponenseket. <strong>Gépelj a név mezőbe, válassz dátumot, lapozz a táblázatban</strong>, majd válts nyelvet: az érték és az állapot megmarad. A <em>Deutsch</em> egy itt regisztrált példanyelv; a hiányzó kulcsokat a magyar katalógus pótolja.");

  // A demó üzenetei egyetlen objektumban (nyelvenként ágyazott fa): a defineMessages regisztrálja őket,
  // és típusos tr() hivatkozásokat ad vissza, így nem kell kulcs-stringeket gépelni.
  const m = defineMessages({
    hu: {
      demo: {
        name: "Név", namePh: "Írd ide a neved…", password: "Jelszó", role: "Szerepkör", roleDev: "Fejlesztő", roleDesign: "Tervező",
        save: "Mentés", modalOpen: "Modál megnyitása", modalTitle: "Megerősítés", modalBody: "Biztosan folytatod?",
        alertTitle: "Tipp", alertMessage: "Váltsd át a nyelvet: ez a szöveg is frissül.", greet: "Szia {name}!",
        items: { one: "{count} elem", other: "{count} elem" },
        tabA: "Áttekintés", tabB: "Részletek", tabABody: "Az aktív fül a nyelvváltás után is ugyanaz marad.", tabBBody: "Ez a második fül tartalma.",
        date: "Dátum", tableName: "Név", tableStatus: "Állapot",
        status: { active: "Aktív", pending: "Függőben", done: "Kész" },
      },
    },
    en: {
      demo: {
        name: "Name", namePh: "Type your name…", password: "Password", role: "Role", roleDev: "Developer", roleDesign: "Designer",
        save: "Save", modalOpen: "Open modal", modalTitle: "Confirmation", modalBody: "Are you sure you want to continue?",
        alertTitle: "Tip", alertMessage: "Switch the language: this text updates too.", greet: "Hello {name}!",
        items: { one: "{count} item", other: "{count} items" },
        tabA: "Overview", tabB: "Details", tabABody: "The active tab stays the same after switching language.", tabBBody: "This is the content of the second tab.",
        date: "Date", tableName: "Name", tableStatus: "Status",
        status: { active: "Active", pending: "Pending", done: "Done" },
      },
    },
    de: {
      demo: {
        name: "Name", namePh: "Gib deinen Namen ein…", password: "Passwort", role: "Rolle", roleDev: "Entwickler", roleDesign: "Designer",
        save: "Speichern", modalOpen: "Dialog öffnen", modalTitle: "Bestätigung", modalBody: "Möchtest du wirklich fortfahren?",
        alertTitle: "Tipp", alertMessage: "Wechsle die Sprache: auch dieser Text wird aktualisiert.", greet: "Hallo {name}!",
        items: { one: "{count} Element", other: "{count} Elemente" },
        tabA: "Übersicht", tabB: "Details", tabABody: "Der aktive Tab bleibt nach dem Sprachwechsel derselbe.", tabBBody: "Dies ist der Inhalt des zweiten Tabs.",
        date: "Datum", tableName: "Name", tableStatus: "Status",
        status: { active: "Aktiv", pending: "Ausstehend", done: "Fertig" },
      },
      // a beépített feliratok egy része is fordítható (ágyazva is megadható): a többit a visszaeső nyelv pótolja
      cdb: {
        table: {
          filter: "Filtern…", filterAria: "Tabelle filtern", prev: "Zurück", next: "Weiter", page: "Seite",
          rowsPerPage: "Zeilen / Seite", all: "Alle", noResults: "Keine Treffer",
        },
        modal: { cancel: "Abbrechen", ok: "OK" },
        password: { show: "Passwort anzeigen", hide: "Passwort verbergen" },
        picker: { date: "Datum wählen…" },
      },
    },
  });

  const picker = createSelect({
    parent: body,
    id: "i18n-lang",
    labelText: "Nyelv / Language / Sprache:",
    value: getLocale(),
    options: [
      { text: "Magyar", value: "hu" },
      { text: "English", value: "en" },
      { text: "Deutsch", value: "de" },
    ],
    onChange: (e) => setLocale((e?.target as HTMLSelectElement).value),
  });
  void picker;

  const demo = createDOMElem({
    tag: "div",
    parent: body,
    style: { display: "grid", gap: "0.25rem", margin: "0.75rem 0", padding: "1.25rem", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", background: "var(--bg)" },
  });

  createTextInput({ parent: demo, id: "i18n-name", labelText: m.demo.name, placeholder: m.demo.namePh });
  createPasswordInput({ parent: demo, id: "i18n-pass", labelText: m.demo.password });
  createSelect({
    parent: demo,
    id: "i18n-role",
    labelText: m.demo.role,
    options: [
      { text: m.demo.roleDev, value: "dev" },
      { text: m.demo.roleDesign, value: "design" },
    ],
  });
  createCustomDatePicker({ parent: demo, id: "i18n-date", labelText: m.demo.date });
  const row = createDOMElem({ tag: "div", parent: demo, style: { display: "flex", gap: "0.5rem", flexWrap: "wrap", margin: "0.5rem 0" } });
  createButtonInput({ parent: row, id: "i18n-save", text: m.demo.save });
  createButtonInput({ parent: row, id: "i18n-open", text: m.demo.modalOpen, click: () => openModal("i18n-modal") });
  createModal({ modalTitle: m.demo.modalTitle, body: { tag: "p", text: m.demo.modalBody } }, {}, { id: "i18n-modal" });

  createLocalizedElem({ tag: "p", parent: demo, text: () => t(m.demo.greet.key, { name: "Anna" }), style: { margin: "0.25rem 0" } });
  createLocalizedElem({ tag: "p", parent: demo, text: () => `${t(m.demo.items.key, { count: 1 })} · ${t(m.demo.items.key, { count: 5 })}`, style: { margin: "0.25rem 0", color: "var(--text-light)" } });
  createAlert({ parent: demo, id: "i18n-alert", type: "info", title: m.demo.alertTitle, message: m.demo.alertMessage });
  createTabs({
    parent: demo,
    id: "i18n-tabs",
    tabs: [
      { id: "a", label: m.demo.tabA, content: { tag: "p", text: m.demo.tabABody } },
      { id: "b", label: m.demo.tabB, content: { tag: "p", text: m.demo.tabBBody } },
    ],
  });
  const names = ["Anna", "Béla", "Csaba", "Dóra", "Emil", "Fruzsina", "Gábor"];
  const statuses = [m.demo.status.active, m.demo.status.pending, m.demo.status.done];
  createTable(
    [
      [m.demo.tableName, m.demo.tableStatus],
      ...names.map((n, i) => [n, statuses[i % 3]]),
    ],
    { parent: demo, id: "i18n-table", sortable: true, filterable: true, pageSize: 3, pageSizeOptions: [3, 5, "all"] },
  );

  const status = createDOMElem({ tag: "p", parent: body, style: { margin: "0.25rem 0", fontSize: "0.875rem", color: "var(--text-light)" } });
  const showStatus = () => {
    status.textContent = `getLocale() = "${getLocale()}" · <html lang="${document.documentElement.lang}">`;
  };
  onLocaleChange(showStatus);
  showStatus();
}

/* ---------------------------------------------------------------- 4. Üzenetek */
{
  const body = card("i18n-messages", "Üzenetek: kulcsok, paraméterek, többes szám");
  text(body, "Az üzenetek egyszerű <code>kulcs → szöveg</code> térképek. A szövegben <code>{név}</code> helyére a paraméter kerül, a <code>count</code> paraméter pedig a nyelv többes szám szabálya szerint (<code>Intl.PluralRules</code>) választ a <code>_one</code> / <code>_other</code> (és szükség esetén <code>_few</code>, <code>_many</code>…) végű kulcsok közül.");
  code(body, "i18n-m1", "typescript", `registerMessages("en", {
  "greet": "Hello {name}!",
  "items_one": "{count} item",
  "items_other": "{count} items",
});

t("greet", { name: "Anna" });     // "Hello Anna!"
t("items", { count: 1 });          // "1 item"
t("items", { count: 5 });          // "5 items"
t("nincs.ilyen");                  // "nincs.ilyen" (hiányzó kulcs: maga a kulcs)
t("nincs.ilyen", undefined, "Alapszöveg"); // "Alapszöveg"`);
  text(body, "<strong>Visszaesés (fallback).</strong> Ha egy kulcs nincs az aktuális nyelven (előbb a nyelv családja is: <code>de-AT</code> → <code>de</code>), a visszaeső nyelv katalógusából pótlódik (alapból <code>hu</code>; átállítható: <code>setFallbackLocale(\"en\")</code>), végül a megadott alapszöveg vagy maga a kulcs jelenik meg.", { marginTop: "1rem" });
}

/* ---------------------------------------------------------------- 5. Betöltés */
{
  const body = card("i18n-load", "Nyelvi fájlok betöltése");
  text(body, "Nagyobb alkalmazásnál a nyelvi fájlokat külön JSON-ként töltsd be, és csak a szükséges nyelvet:");
  code(body, "i18n-l1", "typescript", `import { loadMessages, setLocale } from "createdomblocks";

// assets/locales/de.json: { "form.save": "Speichern", "cdb.table.noResults": "Keine Treffer", ... }
await loadMessages("de", "assets/locales/de.json");
setLocale("de");

// vagy tetszőleges aszinkron forrásból (dinamikus import, API...)
await loadMessages("fr", () => import("./locales/fr").then((m) => m.default));
setLocale("fr");`);
  text(body, "<strong>A felhasználó nyelvének felismerése és megjegyzése:</strong>", { marginTop: "1rem" });
  code(body, "i18n-l2", "typescript", `const supported = ["hu", "en", "de"];
const stored = localStorage.getItem("lang");
const preferred = navigator.languages.map((l) => l.split("-")[0]).find((l) => supported.includes(l));

await loadMessages("de", "assets/locales/de.json");
setLocale(stored ?? preferred ?? "hu");

onLocaleChange((lang) => localStorage.setItem("lang", lang));`);
}

/* ---------------------------------------------------------------- 6. Saját kód */
{
  const body = card("i18n-own", "Saját szövegek és logika");
  text(body, "Ha a szövegnek függvény kell (több értékből áll, számítás van benne), adj át függvényt, ez nyelvváltáskor újra lefut. A saját, nem komponens-szövegeket (pl. a dokumentum címét) az <code>onLocaleChange</code> eseménnyel tartsd frissen:");
  code(body, "i18n-o1", "typescript", `// összetett szöveg: függvény
createParagraph({ parent: "app", id: "info", text: () => \`\${t("user.greet", { name })} — \${t("items", { count: cart.length })}\` });

// saját állapot frissítése nyelvváltáskor
onLocaleChange(() => {
  document.title = t("app.title");
  chart.setLabels([t("chart.jan"), t("chart.feb")]);
});

// dátum és szám: használd az Intl-t az aktuális nyelvvel
new Intl.NumberFormat(getLocale(), { style: "currency", currency: "EUR" }).format(1234.5);
new Intl.DateTimeFormat(getLocale(), { dateStyle: "long" }).format(new Date());`);
}

/* ---------------------------------------------------------------- 7. API */
{
  const body = card("i18n-api", "API");
  createTable(
    trRows([
      { Függvény: "registerMessages(lang, messages)", Leírás: "Üzenetek hozzáadása egy nyelvhez (lapos vagy ágyazott objektum; a meglévő kulcsok felülíródnak). Nem vált nyelvet." },
      { Függvény: "defineMessages(translations, { prefix? })", Leírás: "Több nyelv egyetlen (ágyazott) objektumból: regisztrálja őket, és típusos tr() hivatkozások fáját adja vissza." },
      { Függvény: "registerTranslations(translations, { prefix? })", Leírás: "Több nyelv regisztrálása egy objektumból, hivatkozások nélkül." },
      { Függvény: "flattenMessages(tree)", Leírás: "Egymásba ágyazott objektumból lapos kulcs → szöveg térkép (a többes számú csomópontok _one / _other kulcsokká alakulnak)." },
      { Függvény: "loadMessages(lang, url | () => Promise)", Leírás: "Üzenetek betöltése JSON-ból vagy aszinkron függvényből, majd regisztrálás." },
      { Függvény: "setLocale(lang)", Leírás: "Nyelvváltás: minden tr()/függvény szöveg és beépített felirat frissül, beállítja a <html lang>-ot." },
      { Függvény: "getLocale() / getLocales()", Leírás: "Az aktuális nyelv / a regisztrált nyelvek." },
      { Függvény: "setFallbackLocale(lang)", Leírás: "A visszaeső nyelv (alapból \"hu\"), innen pótlódnak a hiányzó kulcsok." },
      { Függvény: "t(key, params?, fallback?)", Leírás: "Azonnali fordítás (sima string). Nyelvváltáskor nem frissül, ezért komponens-paraméterbe tr()-t vagy () => t() függvényt adj." },
      { Függvény: "tr(key, params?, fallback?)", Leírás: "\"Élő\" fordítási hivatkozás: bármely szöveges komponens-paraméter elfogadja, nyelvváltáskor frissül." },
      { Függvény: "onLocaleChange(cb)", Leírás: "Nyelvváltás-esemény saját logikához; a leiratkozó függvényt adja vissza." },
      { Függvény: "watchLocale(element, fn)", Leírás: "Saját elem frissítése nyelvváltáskor (gyenge hivatkozás, nem szivárog)." },
      { Függvény: "createLocalizedElem(options)", Leírás: "A createDOMElem nyelvesített változata saját blokkokhoz: a text és az attribútumok tr() / függvény értéket is elfogadnak, és nyelvváltáskor frissülnek." },
      { Függvény: "resolveText(value)", Leírás: "Egy szöveg-érték (string / tr() / függvény) aktuális szövege." },
      { Függvény: "huMessages / enMessages", Leírás: "A beépített katalógusok (a lenti táblázat ebből épül); kiindulásnak új nyelvhez." },
    ], ["Függvény"]),
    { parent: body, id: "i18n-api-table", hasHeader: true },
  );
}

/* ---------------------------------------------------------------- 8. Beépített feliratok */
{
  const body = card("i18n-builtin", "Beépített feliratok (cdb.* kulcsok)");
  text(body, "Ezeket használják a komponensek alapértelmezett szövegként. Egy kulcsot felülírhatsz a saját katalógusodban (<code>registerMessages(\"hu\", { \"cdb.table.noResults\": \"Üres\" })</code>), új nyelvhez pedig ugyanezekkel a kulcsokkal készíts fordítást. Egy konkrét komponensen a <code>labels</code> / szöveges paraméterek mindig erősebbek.");
  const rows = Object.keys(huMessages).map((key) => ({ Kulcs: key, Magyar: huMessages[key], English: enMessages[key] ?? "" }));
  createTable(trRows(rows, ["Kulcs", "Magyar", "English"]), {
    parent: body,
    id: "i18n-builtin-table",
    hasHeader: true,
    sortable: true,
    filterable: true,
    pageSize: 10,
    pageSizeOptions: [10, 25, "all"],
  });
}

/* ---------------------------------------------------------------- 8b. Ez a dokumentáció */
{
  const body = card("i18n-docs", "Így van nyelvesítve ez a dokumentáció");
  text(body, "Az oldal magyar és angol nyelven is elérhető (a jobb felső sarokban a <strong>HU / EN</strong> gomb vált, a választás megmarad, és a böngésző nyelve vagy a <code>?lang=en</code> is beállítja). A váltás újratöltés nélkül frissít mindent a könyvtár saját mechanizmusával.");
  text(body, "<strong>Természetes nyelvű kulcsok:</strong> a kulcs maga a magyar szöveg, ezért a magyar nyelvnek nincs külön katalógusa, az angol fordítások pedig az <code>assets/locales/en.json</code>-ban vannak (<code>\"magyar szöveg\": \"English text\"</code>). Hiányzó fordításnál a magyar eredeti látszik, így semmi sem törik el.", { marginTop: "1rem" });
  code(body, "i18n-docs-code", "typescript", `// a dokumentáció kódjában a szövegeket tr()-be csomagoljuk (a kulcs a magyar szöveg)
createCard({ parent, id: "c", title: tr("Telepítés"), body: { tag: "p", text: tr("Vagy CDN-nel:") } });

// assets/locales/en.json
{ "Telepítés": "Installation", "Vagy CDN-nel:": "Or with a CDN:" }`);
  text(body, "<strong>Ellenőrzés:</strong> az <code>npm run check:i18n</code> betölti az összes oldalt, kigyűjti a megjelenő fordítható szövegeket, és hibával leáll, ha az <code>en.json</code>-ból valamelyik hiányzik. A CI ezt minden deploy előtt futtatja. A kód-példák mintaadatai (pl. <code>\"Név:\"</code> egy példa-inputban) szándékosan nem fordulnak, mert a megjelenített kód is ugyanazt mutatja.", { marginTop: "1rem" });
}

/* ---------------------------------------------------------------- 9. Tippek */
{
  const body = card("i18n-tips", "Tippek és ismert korlátok");
  const list = createDOMElem({ tag: "ul", parent: body, style: { listStyle: "disc", paddingLeft: "1.25rem", display: "grid", gap: "0.5rem" } });
  [
    "<strong>Mindig <code>tr()</code> vagy függvény.</strong> A <code>t()</code> eredménye sima szöveg, amit a komponens nem tud újraszámolni. Komponens-paraméterbe ne <code>t(\"kulcs\")</code>-t, hanem <code>tr(\"kulcs\")</code>-t írj.",
    "<strong>Az elemnek a DOM-ban kell lennie.</strong> A nyelvváltás a DOM-ból kimaradt elemeket is frissíti, de két egymást követő váltás után elfelejti őket. A <code>setLocale</code> előtt hozz létre mindent, amit meg akarsz tartani.",
    "<strong>Naptár popup.</strong> A hónap- és napnevek (Intl alapján) a naptár megnyitásakor és lapozásakor számolódnak újra; egy éppen nyitott naptár a következő lapozásig a régi nyelven marad.",
    "<strong>Sorrend.</strong> A táblázat rendezése nyelvváltáskor az új nyelv szabályai szerint újraszámolódik (az oldal, szűrő és rendezési irány megmarad).",
    "<strong>Alapértelmezett nyelv: magyar.</strong> A beépített feliratok eddig vegyesen magyarok és angolok voltak; most egységesen a <code>hu</code> katalógusból jönnek. Ha angol alapot szeretnél: <code>setLocale(\"en\")</code> az első komponens előtt.",
    "<strong>Hiányzó fordítás.</strong> A hiányzó kulcs helyén a visszaeső nyelv szövege (vagy maga a kulcs) látszik, így egy félkész fordítás sem törik el. A kulcsokat fejlesztés közben könnyen kiszűrheted a megjelenő <code>demo.valami</code> szövegekről.",
  ].forEach((html) => createDOMElem({ tag: "li", parent: list, content: dtr(html) }));
}

done();
