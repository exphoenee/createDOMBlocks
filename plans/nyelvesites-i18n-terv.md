# Dokumentáció nyelvesítése (i18n) — Terv

## 1. Cél

A [documentation/](documentation/) oldal többnyelvűvé tétele a következő elvekkel:

- A nyelvi fájlok az **`assets/locales/`** mappában legyenek (`hu.json`, `en.json`).
- A futtató kód **onnan** szerzi meg a fordításokat.
- **Alapnyelv: magyar** (`hu`), emellett **angol** (`en`) fordítás.
- A nyelvi fájl **kulcsai a jelenlegi magyar szövegek** legyenek (natural-language-key / gettext-stílus). Így a `hu` gyakorlatilag identitás-leképezés, és a hiányzó fordítás automatikusan a magyar eredetire esik vissza.

---

## 2. A magyar szövegek jelenlegi leltára

A szövegek **két csoportra** oszlanak — ez a megkülönböztetés végigvonul a terven.

### 2.1 TS-ből generált szövegek (JS futtatja a DOM-ba)

| Forrás | Példa szövegek |
|--------|----------------|
| [menuItems.ts](documentation/page-components/menuItems.ts) | „Kezdőlap", „Form Inputok", „Egyedi Inputok", „Gombok", „Tartalom", „Listák", „Táblázatok", „Navigáció", „Visszajelzés", „Interaktív", „Átfedő elemek", … |
| [initPage.ts](documentation/page-components/initPage.ts) | „Eredmény:" (`doc-result-label`) |
| [createFooter.ts](documentation/page-components/createFooter.ts) | copyright sablon |
| `examples/*.ts` (~17 fájl) | minden szekció `title` + `description` |
| [examples/index.ts](documentation/examples/index.ts) | „Telepítés", „Gyors használat", „Alapadatok", „Komponensek", „Vagy CDN-nel:", badge-feliratok, kártya-szövegek |
| `demos/*.ts` (4 fájl) | demó-tartalmak (sok szöveg) |

### 2.2 Statikus HTML-ben lévő szövegek

Minden oldal-HTML (~22 fájl) fejléce/teteje tartalmaz statikus szöveget:

| Hely | Példa |
|------|-------|
| `<title>` | „Gombok \| createDOMBlocks" |
| `h1.page-title` | „Gombok" |
| `p.page-subtitle` | „Gomb komponensek: input gomb, submit, reset és általános gomb." |
| [index.html](documentation/index.html) hero + demó szekció | „TypeScript könyvtár…", „Demók", „Nézd meg a createDOMBlocks lehetőségeit élőben!", demó-kártyák címei/leírásai |

> A `demo1–4.html` fájlok csak konténert + scriptet tartalmaznak — a tartalom a `demos/*.ts`-ből jön (2.1-es csoport).

---

## 3. Architektúra

### 3.1 Nyelvi fájlok — `assets/locales/`

```
assets/locales/
  hu.json   ← identitás (kulcs === érték); opcionális, de ajánlott a validációhoz
  en.json   ← magyar kulcs → angol fordítás
```

```jsonc
// en.json
{
  "Gombok": "Buttons",
  "Gomb komponensek: input gomb, submit, reset és általános gomb.":
    "Button components: input button, submit, reset and generic button.",
  "Eredmény:": "Result:",
  "Telepítés": "Installation",
  "Demók": "Demos"
  // ...
}
```

A `build-page.mjs` **már most átmásolja** az egész `assets/` mappát a `dist-page/assets/`-be ([scripts/build-page.mjs:84-88](scripts/build-page.mjs#L84-L88)), így a `locales/` automatikusan a kimenetbe kerül — **nincs build-módosítás szükséges** a másoláshoz.

### 3.2 i18n modul — `documentation/page-components/i18n.ts`

```ts
let dict: Record<string, string> = {};

export type Lang = "hu" | "en";

export function getLang(): Lang {
  const fromUrl = new URLSearchParams(location.search).get("lang");
  const stored = localStorage.getItem("doc-lang");
  const nav = navigator.language.startsWith("en") ? "en" : "hu";
  return (fromUrl || stored || nav) === "en" ? "en" : "hu";
}

export async function loadLocale(lang: Lang = getLang()): Promise<void> {
  if (lang === "hu") { dict = {}; return; }            // hu = fallback a kulcsra
  const res = await fetch(`assets/locales/${lang}.json`);
  dict = res.ok ? await res.json() : {};
}

// A KULCS a magyar szöveg; ha nincs fordítás → visszaadja a kulcsot (= magyar).
export function t(huText: string): string {
  return dict[huText] ?? huText;
}

export function setLang(lang: Lang): void {
  localStorage.setItem("doc-lang", lang);
  const url = new URL(location.href);
  url.searchParams.set("lang", lang);
  location.href = url.toString();                       // újratöltés a választott nyelven
}
```

**Fallback-elv:** mivel a kulcs maga a magyar szöveg, hiányzó `en` kulcs esetén is értelmes (magyar) szöveg jelenik meg — nincs `MISSING_KEY` artefakt.

### 3.3 Statikus HTML kezelése — `data-i18n`

A statikus HTML-szövegekhez `data-i18n` attribútumot adunk; a kulcs **a jelenlegi magyar textContent**. Egy futásidejű pásztázás lecseréli őket:

```html
<h1 class="page-title" data-i18n>Gombok</h1>
<p class="page-subtitle" data-i18n>Gomb komponensek: input gomb, submit, reset és általános gomb.</p>
<title data-i18n-title>Gombok | createDOMBlocks</title>
```

```ts
export function translateStaticDOM(root: ParentNode = document): void {
  root.querySelectorAll<HTMLElement>("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n") || el.textContent!.trim();
    el.textContent = t(key);
  });
  const titleEl = document.querySelector("title[data-i18n-title]");
  if (titleEl) document.title = t(titleEl.textContent!.trim());
  document.documentElement.lang = getLang();
}
```

Üres `data-i18n` esetén a **meglévő szöveg maga a kulcs** → nem kell duplikálni a magyart az attribútumba.

---

## 4. Két szöveg-típus átállítása

### 4.1 TS-generált → `t()` becsomagolás

Minden felhasználói szöveget `t("…")`-be teszünk:

```ts
// előtte
{ label: "Kezdőlap", href: "index.html" }
// utána
{ label: t("Kezdőlap"), href: "index.html" }
```

```ts
// initPage.ts
createDOMElem({ tag: "div", text: t("Eredmény:"), attrs: { class: "doc-result-label" } })
```

```ts
// examples/buttons.ts
{ title: t("createButtonInput"), description: t("Input gomb a submit/reset mellett."), … }
```

> A komponens-nevek (`createButtonInput`) jellemzően **nem** fordítandók — ezeket vagy kihagyjuk a `t()`-ből, vagy az `en.json`-ban identitásként hagyjuk.

### 4.2 Statikus HTML → `data-i18n`

A ~22 oldal-HTML `page-title` / `page-subtitle` / hero / demó-kártya elemeire `data-i18n` kerül (lásd 3.3).

---

## 5. Betöltési sorrend (async gating)

A fordítások `fetch`-csel töltődnek → **a render előtt** kell elérhetőnek lenniük. A példa-fájlok ma szinkron renderelnek `initDocPage()` után, ezért bevezetünk egy async bootstrap-csomagolót:

```ts
// page-components/index.ts
export async function bootstrapDocPage(render: () => void): Promise<void> {
  await loadLocale();              // 1. nyelv betöltése
  const done = initDocPage();      // 2. drawer/header/footer (már t()-vel)
  translateStaticDOM();            // 3. statikus HTML lefordítása
  render();                        // 4. szekciók renderelése (már t()-vel)
  done();                          // 5. loading overlay levétele
}
```

A példa-fájlok átállása:

```ts
// examples/buttons.ts – előtte: const done = initDocPage(); … renderSections(sections); done();
bootstrapDocPage(() => {
  renderSections([ /* szekciók t()-vel */ ]);
});
```

A meglévő [createPageLoading](documentation/page-components/createPageLoading.ts) overlay természetes „spinner" a fetch idejére.

---

## 6. Nyelvválasztó UI

A [createHeader.ts](documentation/page-components/createHeader.ts) `header-right` blokkjába egy **HU / EN kapcsoló**:

```ts
{
  tag: "button",
  text: getLang() === "hu" ? "EN" : "HU",
  attrs: { class: "header-lang-btn", "aria-label": "Language" },
  handleEvent: { event: "click", cb: () => setLang(getLang() === "hu" ? "en" : "hu") },
}
```

`setLang` perzisztál (`localStorage`) + `?lang=` query → **újratöltés** a választott nyelven. (Élő, reload nélküli váltás opcionális 2. fázis — minden `t()`-hívást újra kéne futtatni.)

---

## 7. Kulcs-kinyerő / fordítási workflow

- [ ] `scripts/extract-i18n-keys.mjs`: végigpásztázza a `documentation/`-t,
  - `t("…")` hívások stringjeit, és
  - `[data-i18n]` elemek szövegét
  összegyűjti → előállítja/validálja a `hu.json` kulcskészletet, és **listázza az `en.json`-ból hiányzó** kulcsokat.
- [ ] CI/lokál ellenőrzés: ha az `en.json` kulcskészlete eltér a `hu`-tól → figyelmeztetés (de nem hiba, a fallback miatt).

---

## 8. Implementációs lépések

1. [ ] `assets/locales/hu.json` + `assets/locales/en.json` létrehozása (üres váz).
2. [ ] `documentation/page-components/i18n.ts`: `getLang`, `loadLocale`, `t`, `setLang`, `translateStaticDOM`.
3. [ ] `bootstrapDocPage()` a [index.ts](documentation/page-components/index.ts) re-exportba.
4. [ ] page-components átállítása `t()`-re: [menuItems.ts](documentation/page-components/menuItems.ts), [initPage.ts](documentation/page-components/initPage.ts) („Eredmény:"), [createFooter.ts](documentation/page-components/createFooter.ts).
5. [ ] Nyelvválasztó gomb a [createHeader.ts](documentation/page-components/createHeader.ts)-be + `.header-lang-btn` stílus a [style.css](style.css)-be.
6. [ ] `examples/*.ts` (~17) átállítása: szövegek `t()`-be, body `bootstrapDocPage(...)`-be.
7. [ ] `demos/*.ts` (4) szövegei `t()`-be (ha demók is fordítandók — eldöntendő, lásd 9.).
8. [ ] HTML-ek (~22): `page-title`/`page-subtitle`/`<title>` + [index.html](documentation/index.html) hero & demó-kártyák `data-i18n`-nel.
9. [ ] Kulcsgyűjtés: `scripts/extract-i18n-keys.mjs` → `hu.json`/`en.json` feltöltése.
10. [ ] `en.json` fordítások megírása.
11. [ ] `npm run build:page` + manuális ellenőrzés mindkét nyelven (`?lang=en`).

---

## 9. Kockázatok és eldöntendők

- **Async render:** a legnagyobb változás, hogy a render most a locale-fetch **után** fut. A `bootstrapDocPage` ezt egységesíti, de mind a ~17 példa-fájlt át kell állítani. Alternatíva: a locale JSON-t a HTML `<head>`-jébe inline-olni build-time, így szinkron — de ez ütközik a „`assets/locales`-ből fetch-eli" kívánsággal.
- **SEO / `<title>` / `<meta>`:** a [build-page.mjs](scripts/build-page.mjs) a magyar `<title>`/`page-subtitle` alapján generál OG/meta tageket. A statikus HTML maradjon magyar (alapnyelv) → a meta tagek magyarok; a futásidejű `translateStaticDOM` csak a megjelenített `document.title`-t váltja. Külön nyelvű, indexelhető oldalak (`/en/…`) későbbi fázis.
- **Demók fordítása:** a `demos/*.ts` sok szabad szöveget tartalmaz; eldöntendő, hogy a demók is nyelvesüljenek-e, vagy csak a dokumentáció törzse (ajánlás: 1. fázisban a doksi-váz + menü + oldalcímek; demók 2. fázis).
- **Komponens-nevek:** API-nevek (`createButton`) ne forduljanak — szelektíven `t()`-zünk.
- **Kulcs-stabilitás:** mivel a kulcs maga a magyar szöveg, a magyar forrás **bármilyen módosítása** (akár írásjel) elrontja az `en` találatot → a 7-es kinyerő szkript folyamatos futtatása fontos a drift ellen. (Hasonló elven működik a [pelda-egy-igazsagforras-terv.md](plans/pelda-egy-igazsagforras-terv.md) drift-problémája.)
```
