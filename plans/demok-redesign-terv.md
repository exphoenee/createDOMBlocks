# Demók újratervezése — modern, letisztult, kizárólag `createDOMElem`-mel

## 1. Cél és alapelvek

A 4 demó **teljes újratervezése**:

- **Új koncepciók** (a régi Landing / Tech / Dashboard / Social helyett).
- **Modern, letisztult** stílus: sok fehér tér, lágy árnyékok, lekerekített sarkok, finom gradientek, nagy tipográfia, tartalmas reszponzivitás.
- **Kizárólag `createDOMElem`** (a `domelemjs`-ből). **Semmilyen** `createX` library-komponens (`createCard`, `createCarousel`, `createAvatar`, …) nem használható a demókban — minden DOM-csomópont nyers `createDOMElem`-ből épül.

> **Megjegyzés a megkötéshez:** a `createDOMBlocks` lényege épp a `createX` blokkok, ezért a „csak `createDOMElem`" demó tudatosan azt mutatja meg, *mit lehet a puszta alapprimitívvel felépíteni*. A kód-duplikáció elkerülésére **helyi** kompozíciós segédfüggvényeket vezetünk be (lásd 4.), amelyek maguk is **kizárólag** `createDOMElem`-et hívnak — tehát nem sértik a megkötést.

---

## 2. Jelenlegi állapot (amit lecserélünk)

| Fájl | Jelenlegi koncepció | Sorok | Probléma |
|------|--------------------|------:|----------|
| [demo1-landing.ts](documentation/demos/demo1-landing.ts) | Landing | 150 | Vegyesen `createCard`/`createCarousel`/`createDOMElem`; lila gradient, elavult |
| [demo2-tech.ts](documentation/demos/demo2-tech.ts) | Tech | 152 | – |
| [demo3-dashboard.ts](documentation/demos/demo3-dashboard.ts) | Dashboard | 296 | `createBadge`/`createTable`/`createAvatar`/… importok |
| [demo4-social.ts](documentation/demos/demo4-social.ts) | Social | 257 | – |

A demók ma **importálnak `../../src`-ből** (createX) — ezeket az importokat **mind töröljük**, marad `import { createDOMElem } from "domelemjs"`.

Bekötés (amit frissíteni kell a koncepcióváltáskor):

- [webpack.config.mjs:77-80](webpack.config.mjs#L77-L80) — `demos/demoN-*` entry-k.
- `documentation/demoN.html` (4 db) — `<title>` + `<link>`/`<script>` hivatkozások.
- [index.html](documentation/index.html) demó-kártyák (4 db) — ikon/cím/leírás.
- A `demos/*.css`-t a [build-page.mjs:71-80](scripts/build-page.mjs#L71-L80) **már másolja** → új CSS automatikusan a kimenetbe kerül.

---

## 3. Új koncepciók (4 demó)

Négy, egymástól markánsan eltérő, modern layout — együtt sokféle `createDOMElem`-mintát mutatnak be (rács, bento, galéria, idővonal, űrlap-kinézet, adat-tábla).

### 3.1 Demó 1 — „Lumen" SaaS termék-landing

```
┌──────────────────────────────────────────────┐
│  ● Lumen        Funkciók  Árak  Dokumentáció  [Kezdés]   ← sticky nav
├──────────────────────────────────────────────┤
│            ◦ Új: v2.1 megjelent                │   ← badge
│        Építs gyorsabban, kevesebb kóddal       │   ← nagy H1
│     Rövid alcím két sorban a value prop-ról    │
│         [Ingyenes próba]   [Demó ▷]            │
│   ── megbízható logók sora (5 db, halvány) ──  │
├──────────────────────────────────────────────┤
│  Bento funkció-rács (2×3, eltérő cellaméret)   │
├──────────────────────────────────────────────┤
│   Stat sáv:  50+ komponens · 0 dep · 100% TS   │
├──────────────────────────────────────────────┤
│   Árazás: 3 kártya (Ingyenes / Pro* / Cég)     │
├──────────────────────────────────────────────┤
│   GYIK (összecsukható tételek)                 │
├──────────────────────────────────────────────┤
│   Záró CTA sáv + lábléc                         │
└──────────────────────────────────────────────┘
```
Bemutatott minták: sticky nav, badge, bento-grid, statisztika-sáv, pricing-kártyák, **összecsukható GYIK** (createDOMElem + `click` toggle class), CTA.

### 3.2 Demó 2 — „Studio" portfólió / ügynökség

```
┌──────────────────────────────────────────────┐
│  (avatar)  Kovács Anna — Termékdizájner        │   ← hero, kör-avatar div
│            rövid bemutatkozás + [Kapcsolat]    │
│            ▸ tech-chipek sora                   │
├──────────────────────────────────────────────┤
│  Kiemelt munkák — bento galéria (hover zoom)   │
├──────────────────────────────────────────────┤
│  Tapasztalat — függőleges idővonal             │
├──────────────────────────────────────────────┤
│  Kapcsolat kártya (űrlap-kinézet)              │
└──────────────────────────────────────────────┘
```
Bemutatott minták: kör-avatar (kép/initials div), **chip**-sor, **bento galéria** hover-effekttel, **idővonal** (timeline pszeudo-elemmel), űrlap-kinézetű kapcsolat-blokk.

### 3.3 Demó 3 — „Shop" e-commerce termékoldal

```
┌──────────────────────────────────────────────┐
│  Főoldal › Cipők › Futócipő        breadcrumb  │
├───────────────────────┬──────────────────────┤
│  Fő kép                │  Terméknév            │
│  ┌──┬──┬──┐ tumbnailek │  ★★★★☆ (128 értékelés)│
│  └──┴──┴──┘            │  24 990 Ft            │
│                        │  szín-swatch-ok ● ● ● │
│                        │  méret-gombok 40 41 42│
│                        │  [– 1 +]  [Kosárba]   │
├──────────────────────────────────────────────┤
│  Fülek: Leírás | Paraméterek | Értékelések     │
├──────────────────────────────────────────────┤
│  Kapcsolódó termékek — 4-es rács               │
└──────────────────────────────────────────────┘
```
Bemutatott minták: breadcrumb, **galéria fő+tumbnail** váltással (`click`), **csillagos értékelés**, **swatch/méret-választó** (aktív állapot toggle), **mennyiség-stepper**, **fülek** (tab-váltás class-szal), termékrács.

### 3.4 Demó 4 — „Pulse" analitika dashboard (világos téma)

```
┌────────┬─────────────────────────────────────┐
│ ◧ Pulse│  Áttekintés          🔍  (avatar)    │  ← topbar
│ ▸ Áttek│ ┌─────┐┌─────┐┌─────┐┌─────┐         │
│ ▸ Forg.│ │ KPI ││ KPI ││ KPI ││ KPI │ +trend  │  ← stat-kártyák
│ ▸ Users│ └─────┘└─────┘└─────┘└─────┘         │
│ ▸ Beáll│ ┌───────────────┐┌───────────┐       │
│        │ │ CSS oszlopdiag ││ aktivitás │       │  ← CSS-only chart
│        │ └───────────────┘└───────────┘       │
│        │  Adattábla (rendezett sorok)         │
└────────┴─────────────────────────────────────┘
```
Bemutatott minták: sidebar-nav aktív állapottal, topbar, **KPI-kártyák trend-jelzéssel**, **CSS-only oszlopdiagram** (div magasságok), **aktivitás-feed**, **adattábla** státusz-badge-ekkel.

---

## 4. `createDOMElem`-only architektúra

A megkötés betartásával is DRY kód: minden demó egy **helyi, megosztott primitív-készletre** épül, amely kizárólag `createDOMElem`-et hív.

### 4.1 Megosztott helper modul — `documentation/demos/_shared.ts`

```ts
import { createDOMElem } from "domelemjs";
import type { CreateDOMElemOptions } from "domelemjs";

// Rövidítő — semmi extra, csak kevesebb gépelés.
export const el = (opts: CreateDOMElemOptions) => createDOMElem(opts);

// Gyakori primitívek — MIND createDOMElem-ből.
export const section = (cls: string, children: CreateDOMElemOptions[]) =>
  ({ tag: "section", attrs: { class: cls }, children });

export const button = (text: string, cls = "demo-btn", on?: () => void) =>
  ({ tag: "button", text, attrs: { class: cls },
     ...(on ? { handleEvent: { event: "click", cb: on } } : {}) });

export const chip = (text: string) => ({ tag: "span", text, attrs: { class: "demo-chip" } });

export const icon = (glyph: string, cls = "demo-icon") => ({ tag: "span", text: glyph, attrs: { class: cls } });

// Kártya, avatar, csillagos rating, stb. — ugyanígy, createDOMElem-objektumokat adnak vissza.
```

- A helperek **plain `CreateDOMElemOptions` objektumot** adnak vissza → beágyazhatók a `children`-be, vagy `createDOMElem(...)`-mel példányosíthatók.
- **Tilos** bármit a `../../src`-ből importálni. A lint/PR-ellenőrzés ezt vizsgálja (lásd 7.).

### 4.2 Demó-fájl szerkezet (egységes)

```ts
import { createDOMElem } from "domelemjs";
import { el, section, button, chip /* … */ } from "./_shared";

const app = document.getElementById("app")!;
const page = el({ tag: "div", attrs: { class: "demo1-page" }, parent: app });

page.appendChild(createDOMElem(buildNav()));
page.appendChild(createDOMElem(buildHero()));
// … szekciónként külön build-függvény a fájl alján, tiszta tagolásért.
```

### 4.3 Interaktivitás `createDOMElem`-mel

Fülek/swatch/GYIK/galéria: `handleEvent: { event: "click", cb }` + `classList.toggle/add/remove`. Nincs külső komponens, minden esemény nyersen kötve.

---

## 5. Dizájn-rendszer (modern, letisztult)

### 5.1 Design tokenek — `documentation/demos/_demo-base.css`

Megosztott alap-stíluslap (minden demó HTML linkeli **a saját** CSS-e előtt):

```css
:root {
  /* Neutrális skála */
  --d-bg: #fafafa;  --d-surface: #ffffff;  --d-border: #ececf0;
  --d-text: #1a1a2e; --d-muted: #6b6b80;
  /* Akcent (finom, egységes) */
  --d-accent: #5b5bd6; --d-accent-soft: #eef0ff;
  /* Forma */
  --d-radius: 14px; --d-radius-sm: 10px;
  --d-shadow: 0 1px 2px rgba(20,20,40,.04), 0 8px 24px rgba(20,20,40,.06);
  --d-shadow-lg: 0 12px 40px rgba(20,20,40,.10);
  /* Tér + tipográfia */
  --d-gap: 1.5rem; --d-pad: clamp(1.5rem, 4vw, 4rem);
  --d-font: "Inter", system-ui, -apple-system, sans-serif;
}
/* Primitívek: .demo-btn, .demo-card, .demo-section, .demo-chip, .demo-grid … */
```

Elvek: **sok fehér tér** (`--d-pad`), **lágy árnyék** (`--d-shadow`), **lekerekített** (`--d-radius`), **finom akcent** (egyetlen lila-kék), **nagy, légies tipográfia**, `clamp()`-alapú reszponzív méretek, `prefers-reduced-motion` tisztelete az animációknál.

### 5.2 Per-demó CSS

`demoN-<concept>.css` csak a demó-specifikus osztályokat tartalmazza (`.demo1-hero`, `.demo3-gallery`…), a tokeneket a base-ből örökli. Megtartjuk a meglévő `demoN-*` névteres osztály-konvenciót.

### 5.3 Képek

A galériákhoz/termékekhez: a meglévő `assets/demos/*.jpg`-k újrahasznosítása ahol illik; ahol nincs megfelelő kép, **CSS-gradiens / monokróm placeholder blokk** (modern, letisztult hatás, külső függőség nélkül).

---

## 6. Bekötés frissítése (koncepcióváltás)

A fájlokat a koncepcióhoz igazítjuk; a numerikus útvonal (`demo1.html`…`demo4.html`) **marad**, csak a suffix és a tartalom változik.

| Hely | Teendő |
|------|--------|
| Fájlnevek | `demo1-landing.* → demo1-saas.*`, `demo2-tech → demo2-portfolio`, `demo3-dashboard → demo3-shop`, `demo4-social → demo4-pulse` (vagy a régi suffix megtartása a churn minimalizálásáért — eldöntendő) |
| [webpack.config.mjs](webpack.config.mjs) | 4 entry kulcs/útvonal frissítése |
| `demoN.html` ×4 | `<title>`, `<link rel="stylesheet" href="demos/_demo-base.css">` **+** per-demó CSS, `<script src=…>` |
| [index.html](documentation/index.html) | 4 demó-kártya ikon/cím/leírás az új koncepciókra (🚀 SaaS landing · 🎨 Portfólió · 🛍️ Webshop · 📊 Dashboard) |

---

## 7. Implementációs lépések

1. [ ] `documentation/demos/_demo-base.css`: design tokenek + primitívek (5.1).
2. [ ] `documentation/demos/_shared.ts`: `el`, `section`, `button`, `chip`, `icon`, `card`, `avatar`, `stars`, `stepper` — mind `createDOMElem`-ből (4.1).
3. [ ] **Demó 1 (Lumen)** újraírása + `demo1-saas.css`.
4. [ ] **Demó 2 (Studio)** újraírása + `demo2-portfolio.css`.
5. [ ] **Demó 3 (Shop)** újraírása + `demo3-shop.css`.
6. [ ] **Demó 4 (Pulse)** újraírása + `demo4-pulse.css`.
7. [ ] Minden demóból a `../../src` importok eltávolítása; csak `domelemjs` + `_shared`.
8. [ ] `webpack.config.mjs` entry-k + `demoN.html` link/script/title + `index.html` kártyák frissítése.
9. [ ] `npm run build:page` és vizuális ellenőrzés mind a 4 demón (asztali + mobil szélesség).
10. [ ] **Megkötés-ellenőrzés:** grep, hogy egyetlen `demos/*.ts` se importáljon `../../src`-ből.

---

## 8. Kockázatok és kapcsolódások

- **DRY vs. megkötés:** `createX` nélkül nő az ismétlés veszélye → a `_shared.ts` primitívek kulcsfontosságúak; ezeket a megkötés szellemében **csak `createDOMElem`-ből** építjük.
- **Interaktivitás:** carousel/tab/accordion korábban kész komponens volt — most kézzel (event + class-toggle). Tartsuk egyszerűen, hozzáférhetően (`aria-*`, fókusz).
- **Képfüggőség:** ha a meglévő `assets/demos` képek nem illenek az új koncepciókhoz, CSS-placeholderre váltunk, hogy ne kelljen új bináris asset.
- **i18n kapcsolat:** ha a [nyelvesites-i18n-terv.md](plans/nyelvesites-i18n-terv.md) bevezetésre kerül, a demók sok szabad szövege is `t()`-n menjen át (a 9. szakasz ott a demókat 2. fázisba sorolta — ezt érdemes együtt ütemezni ezzel a redesignnal, hogy a szövegek egyből kulcsosak legyenek).
- **Fájl-átnevezés churn-je:** a suffix-átnevezés 3 helyen igényel frissítést entry-nként; ha ezt el akarjuk kerülni, a régi fájlneveket megtartva is csak a tartalom cserélődik (eldöntendő a 6. pontban).
```
