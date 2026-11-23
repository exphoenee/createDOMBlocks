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
  registerMessages,
  setLocale,
  getLocale,
  onLocaleChange,
  huMessages,
  enMessages,
  t,
  tr,
  createLocalizedElem,
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

/* ---------------------------------------------------------------- 1. Alapok */
{
  const body = card("i18n-basics", "Alapok");
  text(body, "Minden komponens <strong>minden szöveges paramétere</strong> (címke, placeholder, gomb felirat, cím, üzenet, aria-label, táblázat cella…) háromféle értéket fogad. A <code>tr()</code> hivatkozás és a függvény <strong>nyelvváltáskor magától újraszámolódik</strong>: a komponens ugyanaz az elem marad, csak a szövege cserélődik, ezért az állapota (begépelt érték, aktív tab, lapozás, kijelölés, lejátszás) nem vész el.");
  createTable(
    [
      { Forma: "\"Fix szöveg\"", Példa: "text: \"Mentés\"", Nyelvváltáskor: "nem változik" },
      { Forma: "tr(\"kulcs\", paraméterek?)", Példa: "text: tr(\"form.save\")", Nyelvváltáskor: "automatikusan frissül (ajánlott)" },
      { Forma: "() => string", Példa: "text: () => t(\"hello\", { name })", Nyelvváltáskor: "újra lefut, az eredmény frissül" },
    ],
    { parent: body, id: "i18n-forms-table", hasHeader: true },
  );
  text(body, "A beépített feliratok (táblázat lapozó, modál gombok, jelszó szem gomb, zenelejátszó aria-label-ek, naptár hónapnevei stb.) szintén átváltanak, a könyvtár magyar (<code>hu</code>, alapértelmezett) és angol (<code>en</code>) katalógust tartalmaz. Más nyelvet te regisztrálsz.", { marginTop: "1rem" });
}

/* ---------------------------------------------------------------- 2. Gyors kezdés */
{
  const body = card("i18n-quickstart", "Gyors kezdés");
  code(body, "i18n-q1", "typescript", `import { registerMessages, setLocale, tr, createTextInput, createButtonInput } from "createdomblocks";

// 1) Üzenetek: kulcs → szöveg (nyelvenként)
registerMessages("hu", { "form.name": "Név", "form.save": "Mentés" });
registerMessages("en", { "form.name": "Name", "form.save": "Save" });

// 2) Komponensek: a szövegeket tr() hivatkozással add át
createTextInput({ parent: "app", id: "name", labelText: tr("form.name") });
createButtonInput({ parent: "app", id: "save", text: tr("form.save") });

// 3) Nyelvváltás: minden feliratot frissít, a begépelt érték megmarad
setLocale("en");`);
}

/* ---------------------------------------------------------------- 3. Élő demó */
{
  const body = card("i18n-demo-card", "Élő demó");
  text(body, "Válassz nyelvet, és figyeld a komponenseket. <strong>Gépelj a név mezőbe, válassz dátumot, lapozz a táblázatban</strong>, majd válts nyelvet: az érték és az állapot megmarad. A <em>Deutsch</em> egy itt regisztrált példanyelv; a hiányzó kulcsokat a magyar katalógus pótolja.");

  // A demó saját üzenetei (hu, en, de) + a beépített feliratok német fordításának egy része
  registerMessages("hu", {
    "demo.name": "Név",
    "demo.name.ph": "Írd ide a neved…",
    "demo.password": "Jelszó",
    "demo.role": "Szerepkör",
    "demo.role.dev": "Fejlesztő",
    "demo.role.design": "Tervező",
    "demo.save": "Mentés",
    "demo.modal.open": "Modál megnyitása",
    "demo.modal.title": "Megerősítés",
    "demo.modal.body": "Biztosan folytatod?",
    "demo.alert.title": "Tipp",
    "demo.alert.message": "Váltsd át a nyelvet: ez a szöveg is frissül.",
    "demo.greet": "Szia {name}!",
    "demo.items_one": "{count} elem",
    "demo.items_other": "{count} elem",
    "demo.tab.a": "Áttekintés",
    "demo.tab.b": "Részletek",
    "demo.tab.a.body": "Az aktív fül a nyelvváltás után is ugyanaz marad.",
    "demo.tab.b.body": "Ez a második fül tartalma.",
    "demo.date": "Dátum",
    "demo.table.name": "Név",
    "demo.table.status": "Állapot",
    "demo.status.active": "Aktív",
    "demo.status.pending": "Függőben",
    "demo.status.done": "Kész",
  });
  registerMessages("en", {
    "demo.name": "Name",
    "demo.name.ph": "Type your name…",
    "demo.password": "Password",
    "demo.role": "Role",
    "demo.role.dev": "Developer",
    "demo.role.design": "Designer",
    "demo.save": "Save",
    "demo.modal.open": "Open modal",
    "demo.modal.title": "Confirmation",
    "demo.modal.body": "Are you sure you want to continue?",
    "demo.alert.title": "Tip",
    "demo.alert.message": "Switch the language: this text updates too.",
    "demo.greet": "Hello {name}!",
    "demo.items_one": "{count} item",
    "demo.items_other": "{count} items",
    "demo.tab.a": "Overview",
    "demo.tab.b": "Details",
    "demo.tab.a.body": "The active tab stays the same after switching language.",
    "demo.tab.b.body": "This is the content of the second tab.",
    "demo.date": "Date",
    "demo.table.name": "Name",
    "demo.table.status": "Status",
    "demo.status.active": "Active",
    "demo.status.pending": "Pending",
    "demo.status.done": "Done",
  });
  registerMessages("de", {
    "demo.name": "Name",
    "demo.name.ph": "Gib deinen Namen ein…",
    "demo.password": "Passwort",
    "demo.role": "Rolle",
    "demo.role.dev": "Entwickler",
    "demo.role.design": "Designer",
    "demo.save": "Speichern",
    "demo.modal.open": "Dialog öffnen",
    "demo.modal.title": "Bestätigung",
    "demo.modal.body": "Möchtest du wirklich fortfahren?",
    "demo.alert.title": "Tipp",
    "demo.alert.message": "Wechsle die Sprache: auch dieser Text wird aktualisiert.",
    "demo.greet": "Hallo {name}!",
    "demo.items_one": "{count} Element",
    "demo.items_other": "{count} Elemente",
    "demo.tab.a": "Übersicht",
    "demo.tab.b": "Details",
    "demo.tab.a.body": "Der aktive Tab bleibt nach dem Sprachwechsel derselbe.",
    "demo.tab.b.body": "Dies ist der Inhalt des zweiten Tabs.",
    "demo.date": "Datum",
    "demo.table.name": "Name",
    "demo.table.status": "Status",
    "demo.status.active": "Aktiv",
    "demo.status.pending": "Ausstehend",
    "demo.status.done": "Fertig",
    // a beépített feliratok egy része is fordítható: a többit a magyar katalógus pótolja
    "cdb.table.filter": "Filtern…",
    "cdb.table.filterAria": "Tabelle filtern",
    "cdb.table.prev": "Zurück",
    "cdb.table.next": "Weiter",
    "cdb.table.page": "Seite",
    "cdb.table.rowsPerPage": "Zeilen / Seite",
    "cdb.table.all": "Alle",
    "cdb.table.noResults": "Keine Treffer",
    "cdb.modal.cancel": "Abbrechen",
    "cdb.modal.ok": "OK",
    "cdb.password.show": "Passwort anzeigen",
    "cdb.password.hide": "Passwort verbergen",
    "cdb.picker.date": "Datum wählen…",
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

  createTextInput({ parent: demo, id: "i18n-name", labelText: tr("demo.name"), placeholder: tr("demo.name.ph") });
  createPasswordInput({ parent: demo, id: "i18n-pass", labelText: tr("demo.password") });
  createSelect({
    parent: demo,
    id: "i18n-role",
    labelText: tr("demo.role"),
    options: [
      { text: tr("demo.role.dev"), value: "dev" },
      { text: tr("demo.role.design"), value: "design" },
    ],
  });
  createCustomDatePicker({ parent: demo, id: "i18n-date", labelText: tr("demo.date") });
  const row = createDOMElem({ tag: "div", parent: demo, style: { display: "flex", gap: "0.5rem", flexWrap: "wrap", margin: "0.5rem 0" } });
  createButtonInput({ parent: row, id: "i18n-save", text: tr("demo.save") });
  createButtonInput({ parent: row, id: "i18n-open", text: tr("demo.modal.open"), click: () => openModal("i18n-modal") });
  createModal({ modalTitle: tr("demo.modal.title"), body: { tag: "p", text: tr("demo.modal.body") } }, {}, { id: "i18n-modal" });

  createLocalizedElem({ tag: "p", parent: demo, text: () => t("demo.greet", { name: "Anna" }), style: { margin: "0.25rem 0" } });
  createLocalizedElem({ tag: "p", parent: demo, text: () => `${t("demo.items", { count: 1 })} · ${t("demo.items", { count: 5 })}`, style: { margin: "0.25rem 0", color: "var(--text-light)" } });
  createAlert({ parent: demo, id: "i18n-alert", type: "info", title: tr("demo.alert.title"), message: tr("demo.alert.message") });
  createTabs({
    parent: demo,
    id: "i18n-tabs",
    tabs: [
      { id: "a", label: tr("demo.tab.a"), content: { tag: "p", text: tr("demo.tab.a.body") } },
      { id: "b", label: tr("demo.tab.b"), content: { tag: "p", text: tr("demo.tab.b.body") } },
    ],
  });
  const names = ["Anna", "Béla", "Csaba", "Dóra", "Emil", "Fruzsina", "Gábor"];
  const statuses = ["demo.status.active", "demo.status.pending", "demo.status.done"];
  createTable(
    [
      [tr("demo.table.name"), tr("demo.table.status")],
      ...names.map((n, i) => [n, tr(statuses[i % 3])]),
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
    [
      { Függvény: "registerMessages(lang, messages)", Leírás: "Üzenetek hozzáadása egy nyelvhez (a meglévő kulcsok felülíródnak). Nem vált nyelvet." },
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
    ],
    { parent: body, id: "i18n-api-table", hasHeader: true },
  );
}

/* ---------------------------------------------------------------- 8. Beépített feliratok */
{
  const body = card("i18n-builtin", "Beépített feliratok (cdb.* kulcsok)");
  text(body, "Ezeket használják a komponensek alapértelmezett szövegként. Egy kulcsot felülírhatsz a saját katalógusodban (<code>registerMessages(\"hu\", { \"cdb.table.noResults\": \"Üres\" })</code>), új nyelvhez pedig ugyanezekkel a kulcsokkal készíts fordítást. Egy konkrét komponensen a <code>labels</code> / szöveges paraméterek mindig erősebbek.");
  const rows = Object.keys(huMessages).map((key) => ({ Kulcs: key, Magyar: huMessages[key], English: enMessages[key] ?? "" }));
  createTable(rows, {
    parent: body,
    id: "i18n-builtin-table",
    hasHeader: true,
    sortable: true,
    filterable: true,
    pageSize: 10,
    pageSizeOptions: [10, 25, "all"],
  });
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
  ].forEach((html) => createDOMElem({ tag: "li", parent: list, content: html }));
}

done();
