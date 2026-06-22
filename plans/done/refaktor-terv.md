# createDOMBlocks – Refaktorálási Terv

## 1. Áttekintés

**Verzió:** 2.1.0  
**Függőség:** domelemjs ^2.0.1  
**Komponensek száma:** ~50+ (form inputok, gombok, navigáció, tartalom, egyedi inputok, stb.)

A library célja: összetett HTML blokkok létrehozása JavaScript/TypeScript segítségével, a `domelemjs` könyvtárra építve. Minden komponens egy `createDOMElem(options)` híváson keresztül építi fel a DOM-ot.

---

## 2. Használhatóság Értékelése

### Erősségek

- **Következetes mintázat:** A legtöbb komponens egységes `createXxx(params)` szignatúrát követ.
- **Nincs JSX/React függőség:** Tiszta DOM API, framework-független.
- **Alacsony belépési küszöb:** A `parent` paraméterrel bármely HTML elemhez hozzá lehet adni a komponenseket.
- **TypeScript támogatás:** Teljes típusdefiníciók.
- **Dokumentáció:** Minden komponenshez van élő példa a dokumentációs oldalon.

### Gyengeségek

- **Inkonzisztens API:** A paraméterek elnevezése, kötelezősége és a visszatérési típusok komponensenként eltérnek.
- **Duplikált kód:** A date picker család (CustomDatePicker, CustomDateTimePicker, stb.) rengeteg ismétlődő kódot tartalmaz.
- **Kevert felelősségi körök:** A `createForm` duplikálja az egyes input komponensek logikáját.
- **Hiányos típusdefiníciók:** Néhány komponens (pl. `createCustomSelect`) saját interface-t definiál a komponens fájlban a `types.ts` helyett.
- **Felesleges absztrakciók:** A `DOMBlock` osztály és az `asyncImage` függvény gyakorlatilag használhatatlan/használaton kívüli.

---

## 3. Talált Inkonzisztenciák

### 3.1 Paraméter név: `params` vs `config`

A legtöbb komponens `params` néven várja a konfigurációs objektumot, de a `components/` mappában lévők `config` néven:

| Komponens | Jelenlegi név | Javítás |
|-----------|--------------|---------|
| `createButton(params)` | `params` | marad `params` |
| `createTextInput(params)` | `params` | marad `params` |
| `createCard(config)` | `config` | át kell írni `params`-ra |
| `createAlert(config)` | `config` | át kell írni `params`-ra |
| `createCarousel(config)` | `config` | át kell írni `params`-ra |
| `createDrawer(params)` | `params` | marad `params` |

**Döntés:** ✅ **KÉSZ** – Mindenhol `params` az egységes paraméter név. `config` → `params` átnevezés elvégezve 27 fájlban: `createAccordion.ts`, `createAlert.ts`, `createAvatar.ts`, `createBadge.ts`, `createBlockquote.ts`, `createBreadcrumb.ts`, `createCard.ts`, `createCarousel.ts`, `createCodeBlock.ts`, `createContainer.ts`, `createCustomDatePicker.ts`, `createCustomDateTimePicker.ts`, `createCustomDateRangePicker.ts`, `createCustomMonthPicker.ts`, `createCustomSelect.ts`, `createCustomWeekPicker.ts`, `createDivider.ts`, `createDragAndDropFileInput.ts`, `createGrid.ts`, `createImage.ts`, `createLink.ts`, `createNav.ts`, `createProgressBar.ts`, `createSpinner.ts`, `createTabs.ts`, `createToast.ts`, `createTooltip.ts`. Typecheck OK.

---

### 3.2 Visszatérési típus inkonzisztencia

A legtöbb komponens `HTMLElement`-et ad vissza, de a `createButtonInput`, `createSubmitInput`, `createResetInput` visszatérési típusa `CreateDOMElemOptions` (nyers konfigurációs objektum, nem valódi DOM elem).

```typescript
// createButton (returns HTMLElement)
export function createButton(params: ButtonParams): HTMLElement

// createButtonInput (returns CreateDOMElemOptions!)
export function createButtonInput(params: ButtonInputParams): CreateDOMElemOptions
```

**Döntés:** ✅ **KÉSZ** – `createButtonInput`, `createSubmitInput`, `createResetInput` most már `HTMLElement`-et adnak vissza. `createDOMElem()`-be burkolva, `parent` átadással. Typecheck OK.

---

### 3.3 `parent` mező kötelezősége

| Komponens | `parent` típusa |
|-----------|----------------|
| `createButton` | `parent?: HTMLElement \| string` (opcionális) |
| `createToast` | `parent?: HTMLElement \| string` (opcionális, default: "body") |
| `createCodeBlock` | `parent?: HTMLElement \| string` (opcionális) |
| `createCard` | `parent: HTMLElement \| string` (kötelező) |
| `createTextInput` | `parent: HTMLElement \| string` (kötelező) |
| `createDrawer` | nincs `parent` mező – **SZÁNDÉKOS**: portal mintát követ (React portal analógia), a komponens a `document.body`-hoz fűzi magát |
| `createModal` | nincs `parent` mező – **SZÁNDÉKOS**: portal mintát követ, a `document.body`-hoz fűződik |

**Döntés:** ✅ **KÉSZ** – `parent` kötelezővé téve `ButtonParams`, `ToastParams`, `CodeBlockParams` interface-ekben. `createToast`-ban a `|| "body"` fallback megtartva biztonsági okból. `createModal.ts`-ben `createButton` hívások kiegészítve `parent: document.body`-val. Typecheck OK.

**Megjegyzés:** A `createDrawer` és `createModal` portal jellege **SZÁNDÉKOS** – ezt dokumentálni kell, de nem kell megváltoztatni.

---

### 3.4 Eseménykezelés kettőssége

Egyes komponensek külön `onChange`, `click`, és `handleEvent` mezőket is támogatnak, máshol csak `handleEvent` elérhető:

```typescript
// createButton:
if (params.onChange) handleEvent.push(...)
if (params.click) handleEvent.push(...)
if (params.handleEvent) handleEvent.push(...)

// createTooltip:
handleEvent: config.trigger === "click"
  ? { event: "click", cb: ... }
  : undefined

// createTabs, createAccordion:
// Csak handleEvent, nincs onChange/click
```

Különösen furcsa, hogy a `createButton` támogat `onChange`-t, ami egy `<button>` elemnél értelmetlen.

**Döntés:** ✅ **KÉSZ** – `ButtonParams`-ból eltávolítva az `onChange` (értelmetlen egy `<button>` elemen). `handleEvent` és `click` megtartva. Typecheck OK.

---

### 3.5 `createDrawer` – egyedi architektúra

A `createDrawer` több szempontból is eltér a többi komponenstől:

1. **Portal minta** – szándékosan nincs `parent` paraméter, a `document.body`-hoz fűz. ✓
2. **Modul szintű állapot** – `currentMode` és `initialOpenDone` modul szintű változók. Ez több drawer példány esetén versenyhelyzethez vezethet.
3. **Speciális nyitás/zárás** – `openDrawer(id)` és `closeDrawer(id)` globális függvények.
4. **Külön interface** – `DrawerMenuItem` és `DrawerParams` a komponens fájlban van definiálva, nem a `types.ts`-ben.

**Döntés:** ✅ **KÉSZ** – `DrawerMenuItem` és `DrawerParams` áthelyezve `types.ts`-be. Modul szintű állapot (`currentMode`, `initialOpenDone`) eltávolítva, helyette `data-drawer-mode` és `data-drawer-opened-before` attribútumok. Importok frissítve 5 fájlban. Typecheck OK.

**Megjegyzés:** A portal minta szándékos, maradhat.

---

### 3.6 `createModal` – privát metódusok `any` casttal

```typescript
(modal as any).__openModal = openModal;
(modal as any).__closeModal = closeModal;
```

Az `any` típus használata típusbiztonsági probléma. A portal minta (body-hoz fűzés) szándékos.

**Döntés:** ✅ **KÉSZ** – `openModal(id)` / `closeModal(id)` függvények hozzáadva. `(modal as any).__openModal` / `__closeModal` eltávolítva. Exportálva `src/index.ts`-ből. `documentation/examples/modal.ts` frissítve. Typecheck OK.

---

### 3.7 CSS osztály ütközés: `textarea-input`

A `createTextarea` ugyanazt a `textarea-input` CSS osztályt használja mind a wrapper `<div>`-re, mind a belső `<textarea>` elemre. Ez CSS specifitási problémákhoz vezethet.

```typescript
// wrapper div
attrs: { class: `textarea-input${...}` }

// belső textarea
attrs: { class: `textarea-input${...}` }  // Ütközik!
```

**Döntés:** ✅ **KÉSZ** – Wrapper osztály: `textarea-wrapper`, textarea elem osztálya: `textarea-input` (megtartva). `style.css` frissítve (`.textarea-input` → `.textarea-wrapper` a wrapper stílusoknál, `textarea.textarea-input` a textarea elem stílusainál). Typecheck OK.

---

### 3.8 `createForm` kódduplikáció

A `createForm` újraimplementálja az összes input típus renderelését a `createFormInput` függvényben, ami szinte teljesen megegyezik az egyes input komponensek (pl. `createTextInput`, `createSelect`, stb.) logikájával.

**Döntés:** ✅ **KÉSZ** – `createForm` refaktorálva: a `<form>` elem létrehozása után a meglévő komponenseket (`createTextInput`, `createSelect`, `createRadio`, `createTextarea`, `createButtonInput`, stb.) hívja meg `parent: form` paraméterrel. A régi `createFormInput`/`getEvents`/`wrapWithLabel` függvények eltávolítva. Typecheck OK.

---

### 3.9 Date picker család – DRY sérelem

A következő fájlok szinte teljesen azonos kódot tartalmaznak:
- `createCustomDatePicker.ts`
- `createCustomDateTimePicker.ts`
- `createCustomDateRangePicker.ts`
- `createCustomMonthPicker.ts`
- `createCustomWeekPicker.ts`

Minden fájl tartalmazza:
- A hónapnevek tömbjét (`months`)
- Calendar navigáció (◀ / ▶ gombok)
- `renderCalendar` / `render` függvényeket
- `document.addEventListener("click", ...)` close handlert

**Döntés:** ✅ **KÉSZ** – `src/components/calendar-helper.ts` létrehozva. Tartalmazza: `MONTHS`, `createCalendarHeader`, `createDayNamesHeader`, `createDayGrid`, `buildMonthCalendar`, `setupCalendarCloseHandler`, `toggleCalendar`, `getISOWeek`, `getWeeksInMonth`. Mind az 5 picker refaktorálva (DatePicker, DateTimePicker, DateRangePicker, MonthPicker, WeekPicker) – a közös kód ~60%-a kiszervezve. Typecheck OK.

---

### 3.10 `asyncImage` – használhatatlan

```typescript
export function asyncImage(): HTMLElement {
  return createDOMElem({ tag: "img", attrs: { class: "async-image" } });
}
```

Nincs `src`, `parent`, vagy más paraméter. Ezzel jelenleg nem lehet mit kezdeni.

**Döntés:** ✅ **KÉSZ** – `asyncImage` kiegészítve `AsyncImageParams` interface-szel, `parent`, `src`, `alt`, `class`, `lazy` paraméterekkel. Typecheck OK.

---

### 3.11 `DOMBlock` osztály – holt kód

```typescript
export class DOMBlock {
  readonly elem: HTMLElement;
  constructor(recipe: CreateDOMElemOptions) {
    this.elem = createDOMElem(recipe);
  }
}
```

Egyszerű wrapper a `createDOMElem` körül, sehol nincs használva a projektben.

**Döntés:** ✅ **KÉSZ** – `src/domBlock.ts` törölve, export eltávolítva `src/index.ts`-ből. Typecheck OK.

---

### 3.12 `createRadio` – hiányzó `labelfirst` támogatás

Az összes input komponens támogatja a `labelfirst` paramétert, de a `createRadio` nem. A `createSelect` és a `createForm` külön kezelik a `labelfirst`-et, eltérő módon.

**Döntés:** ✅ **KÉSZ** – `labelfirst` támogatás hozzáadva a `createRadio`-hoz. `params.labelfirst === true` esetén label kerül az input elé. Typecheck OK.

---

### 3.13 Inkonzisztens `id` kötelezőség

| Komponens | `id` típusa |
|-----------|------------|
| `BaseInputParams` | `id: string` (kötelező) |
| `ButtonParams` | `id?: string` (opcionális) |
| `CardParams`, `AlertParams`, stb. | `id?: string` (opcionális) |
| `CustomSelectParams` (a fájlban) | `id: string` (kötelező) |

**Döntés:** ✅ **KÉSZ** – `id` kötelezővé téve 33 interface-ben + DrawerParams. Hiányzó `id`-k pótolva `createModal.ts`-ben. Typecheck OK.

---

### 3.14 Fájlok szervezése

Az input komponensek az `inputs/`, a gombok a `buttons/`, a selection elemek a `selection/` almappákban vannak, de:

- `createTextarea.ts` – lapos `src/` mappában
- `createForm.ts` – lapos `src/` mappában
- `createModal.ts` – lapos `src/` mappában
- `createTable.ts` – lapos `src/` mappában
- `createLists.ts` – lapos `src/` mappában
- `createParagraph.ts` – lapos `src/` mappában
- `createTitle.ts` – lapos `src/` mappában
- `newLine.ts` – lapos `src/` mappában
- `asyncImage.ts` – lapos `src/` mappában

A `components/` mappában lévők szépen egyben vannak.

**Döntés:** ✅ **KÉSZ** – 9 fájl áthelyezve `src/components/`-be (`createTextarea.ts`, `createForm.ts`, `createModal.ts`, `createTable.ts`, `createLists.ts`, `createParagraph.ts`, `createTitle.ts`, `newLine.ts`, `asyncImage.ts`). Barrel exportok frissítve. Eredeti fájlok törölve. `createForm.ts`-ben `config` → `params` átnevezve. Typecheck OK.

---

### 3.15 Típusok elhelyezkedése

A típusok többsége a `types.ts`-ben van, de:
- `DrawerMenuItem`, `DrawerParams` – a `createDrawer.ts` fájlban
- `CustomSelectParams` – a `createCustomSelect.ts` fájlban

**Döntés:** ✅ **KÉSZ** – `DrawerMenuItem`, `DrawerParams`, `CustomSelectParams` mind áthelyezve `types.ts`-be. Importok frissítve minden érintett fájlban. Typecheck OK.

---

### 3.16 `createInputElem` helper – `hiddenInput` vs `buttonInput`

```typescript
// createHiddenInput
return createDOMElem(createInputElem("input", { ...params, type: "hidden" }));
// Returns HTMLElement ✓

// createButtonInput
return createInputElem("input", { ...params, type: "button" });
// Returns CreateDOMElemOptions (nem HTMLElement)
```

A `createHiddenInput` burkolja `createDOMElem()`-be, a többiek nem. Inkonzisztens.

**Döntés:** ✅ **KÉSZ** – `createHiddenInput` kiegészítve `parent` átadással, konzisztensen a `createButtonInput`/`createSubmitInput`/`createResetInput` mintájára. Typecheck OK.

---

### 3.17 `createDrawer` kettéválasztása: drawer + menu

A jelenlegi `createDrawer` két dolgot csinál egyszerre:
1. **Drawer konténer** – oldalsó panel, overlay, nyitás/zárás logika (`openDrawer`/`closeDrawer`)
2. **Menü renderelés** – beépített `buildMenuItem()`, `DrawerMenuItem` interface, `items: DrawerMenuItem[]` paraméter

A drawer-nek **bármilyen tartalmat** kell tudnia fogadni (nem csak menüt). A menü logikát ki kell szervezni egy külön `createMenu` komponensbe.

**Jelenlegi `DrawerParams`:**
```typescript
interface DrawerParams {
  id: string;
  title?: string;
  items: DrawerMenuItem[];  // ← menüspecific!
  defaultState?: "open" | "closed";
  hasOverlay?: boolean;
  mode?: "overlay" | "push";
}
```

**Javasolt új struktúra:**

```typescript
// createDrawer – általános konténer (csak a panelt és logikát tartalmazza)
interface DrawerParams {
  id: string;
  title?: string;
  children?: CreateDOMElemOptions[];  // bármilyen tartalom
  defaultState?: "open" | "closed";
  hasOverlay?: boolean;
  mode?: "overlay" | "push";
}

// createMenu – menü komponens (a navigációs logikával)
interface MenuItem {
  label: string;
  href?: string;
  children?: MenuItem[];
}

interface MenuParams {
  id: string;
  items: MenuItem[];
}
```

Használat:
```typescript
createDrawer({
  id: "main-drawer",
  title: "Navigáció",
  children: [createMenu({ id: "main-menu", items: menuItems })],
  mode: "push",
});
```

**Érintett fájlok:**
- `src/components/createDrawer.ts` – drawer konténerré egyszerűsítése (items → children)
- `src/components/createMenu.ts` – új fájl a menü logikával
- `src/components/index.ts` – új export: `createMenu`
- `src/index.ts` – új export: `createMenu`, `MenuItem`
- `src/types.ts` – új típus: `MenuItem`, `MenuParams`
- `documentation/page-components/menuItems.ts` – `DrawerMenuItem` → `MenuItem`
- `documentation/page-components/initPage.ts` – `createDrawer({ items, ... })` → `createDrawer({ children: [createMenu({ items })], ... })`
- `documentation/page-components/buildPage.ts` – hasonló átalakítás
- `documentation/page-components/index.ts` – új exportok

**Döntés:** ✅ **KÉSZ** – `createDrawer` általános konténerré alakítva (`children?: CreateDOMElemOptions[]`), új `createMenu` komponens létrehozva. `DrawerParams.items` megtartva backward compat-ként. Dokumentáció (`initPage.ts`, `buildPage.ts`) frissítve. Typecheck OK. Holt kód: `documentation/page-components/createDrawer.ts` eltávolítva.

---

## 4. Refaktorálási Terv

### Fázis 1: Gyors javítások (alacsony kockázat)

| # | Feladat | Érintett fájlok | Státusz |
|---|---------|-----------------|---------|
| 1 | Távolítsd el a `DOMBlock` osztályt | `src/domBlock.ts`, `src/index.ts` | ✅ **KÉSZ** |
| 2 | `asyncImage` kiegészítése paraméterekkel (parent, src, alt) | `src/asyncImage.ts` | ✅ **KÉSZ** |
| 3 | CSS osztályütközés javítása a textarea-nál | `src/createTextarea.ts`, `style.css` | ✅ **KÉSZ** |
| 4 | Típusok áthelyezése `types.ts`-be (Drawer, CustomSelect) | `src/components/createDrawer.ts`, `src/components/createCustomSelect.ts`, `src/types.ts` | ✅ **KÉSZ** |

### Fázis 2: API egységesítés (közepes kockázat)

| # | Feladat | Érintett fájlok | Státusz |
|---|---------|-----------------|---------|
| 5 | `config` → `params` átnevezés a `components/` mappában | `src/components/createCard.ts`, `createAlert.ts`, `createCarousel.ts`, stb. | ✅ **KÉSZ** |
| 6 | Visszatérési típus egységesítése `HTMLElement`-re | `src/buttons/createButtonInput.ts`, `createSubmitInput.ts`, `createResetInput.ts` | ✅ **KÉSZ** |
| 7 | `labelfirst` hozzáadása a `createRadio`-hoz | `src/selection/createRadio.ts` | ✅ **KÉSZ** |
| 8 | `id` kötelezővé tétele minden interface-ben | `src/types.ts` | ✅ **KÉSZ** |

### Fázis 3: Architekturális változtatások (magas kockázat)

| # | Feladat | Érintett fájlok | Státusz |
|---|---------|-----------------|---------|
| 9 | Közös calendar helper kiemelése | `src/components/calendar-helper.ts`, 5 picker fájl | ✅ **KÉSZ** |
| 10 | `createForm` refaktorálása egyes komponensek használatára | `src/components/createForm.ts` | ✅ **KÉSZ** |
| 11 | `createDrawer` modul szintű állapotának eltávolítása + típusok áthelyezése `types.ts`-be | `src/components/createDrawer.ts`, `src/types.ts`, importok 4 fájlban | ✅ **KÉSZ** |
| 12 | `createModal` `any` cast eltávolítása – `openModal(modalId)` / `closeModal(modalId)` függvényekkel | `src/components/createModal.ts` | ✅ **KÉSZ** |
| 13 | Lapos fájlok áthelyezése `components/`-be | 9 fájl, barrel exportok | ✅ **KÉSZ** |
| 14 | `createDrawer` kettéválasztása: drawer konténer + createMenu komponens | `src/components/createDrawer.ts`, `src/components/createMenu.ts` (új), dokumentáció fájlok | ✅ **KÉSZ** |

### Fázis 4: Tesztelés és dokumentáció

| # | Feladat | Státusz |
|---|---------|---------|
| 15 | TypeScript típusellenőrzés futtatása | ✅ Folyamatosan fut a változtatások után |
| 16 | Build teszt (`npm run build:page`) | ✅ **KÉSZ** – lásd 4.2 |
| 17 | Demók ellenőrzése böngészőben | ⏳ Még nem futott |
| 18 | README és dokumentáció frissítése | ✅ **KÉSZ** – lásd 4.1 |

### 4.1 Dokumentációs példák javítása

A refaktorálás (kötelező `id`, `parent`, `openModal`/`closeModal`, `createForm` refaktor) után a dokumentációs kódpéldák elavulttá váltak. Az alábbi javítások készültek el:

**Új fájlok:**
- `documentation/drawer.html` – Drawer dokumentációs oldal (követi a többi oldal mintáját)
- `documentation/examples/drawer.ts` – Drawer példák 4 szekcióval: overlay mód, push mód, menüvel, API referencia

**Támogató módosítások:**
- `webpack.config.mjs` – `examples/drawer` entry point hozzáadva
- `documentation/page-components/menuItems.ts` – "Drawer" menüpont beszúrva Carousel és Modal közé

**Kijavított példafájlok:**

| Fájl | Javítások |
|------|-----------|
| `forms.ts` | `createForm` példa: `action: "/api/submit"` és `method: "POST"` hozzáadva (kód + render) |
| `content.ts` | `id` pótolva 7 komponensben: createParagraph, createTitle, createBlockquote, createCodeBlock, createImage, createLink, createDivider (kód + render) |
| `feedback.ts` | `id` pótolva 5 komponensben: createAlert, createBadge, createSpinner, createProgressBar, createToast (kód + render) |
| `interactive.ts` | `createTooltip` `id` pótolva; duplikált `import { createDOMElem }` sor eltávolítva |
| `modal.ts` | `createButton` `id` pótolva (kód + render) |
| `avatars.ts` | `createAvatar` `id` pótolva mind a 3 szekcióban (kód + render) |
| `drawer.ts` | `createButton` `id` pótolva overlay és push szekciókban (kód + render) |

**Összesen ~50+ hiányzó `id` mező és 1 duplikált import lett kijavítva.** `npm run typecheck` átmegy.

---

### 4.2 Build hibák javítása (29 error → 0)

A refaktorálás után a `npm run build:page` parancs 29 hibát dobott a dokumentációs bundle-ben. A hibák oka: a refaktor során több paraméter kötelezővé vált (`id`, `parent`), és a `createButton`/`createCodeBlock` függvények már `HTMLElement`-et adnak vissza (`parent` kötelezővel), így nem használhatók közvetlenül `createDOMElem` children tömbjében.

**Javított fájlok (9 fájl, 29 hiba):**

| Fájl | Hibák | Javítás |
|------|-------|---------|
| `documentation/demos/demo1-landing.ts` | 10 | 4× `createButton` → `createDOMElem` children-ben; 3× `createTitle` + `id`; 3× `createDivider` + `id` |
| `documentation/demos/demo2-tech.ts` | 2 | 2× `createButton` → `createDOMElem`; `createButton` import eltávolítva |
| `documentation/demos/demo3-dashboard.ts` | 1 | 1× `createButton` → `createDOMElem`; `createButton` import eltávolítva |
| `documentation/examples/index.ts` | 7 | 4× `createCard` + `id`; 3× `createCodeBlock` → inline `CreateDOMElemOptions`; `createCodeBlock` import eltávolítva |
| `documentation/examples/carousel.ts` | 2 | 2× `createCard` + `id` |
| `documentation/examples/tables.ts` | 2 | 2× `createTable` + `id` |
| `documentation/examples/feedback.ts` | 1 | `createToast` + `parent: document.body` |
| `documentation/examples/drawer.ts` | 3 | Automatikusan javult – `DrawerParams.children` típusbővítés |
| `documentation/page-components/initPage.ts` | 1 | Automatikusan javult – `DrawerParams.children` típusbővítés |

**Típusjavítás:**
- `src/types.ts` – `DrawerParams.children` típusa `CreateDOMElemOptions[]` → `(CreateDOMElemOptions | HTMLElement)[]` (mert `createMenu()` és `createDOMElem()` `HTMLElement`-et ad vissza)

**Eredmény:** `npm run build:page` – **0 hiba, sikeres build.**

---

## 5. Javasolt prioritási sorrend

1. ✅ **Fázis 1, 1. lépés** – `DOMBlock` eltávolítva.
2. ✅ **Fázis 2, 7-8. lépés** – `labelfirst` és `id` javítások elkészültek.
3. ✅ **Fázis 2, 5. lépés** – `config` → `params` átnevezés: **KÉSZ**.
4. ✅ **Fázis 1, 3-4. lépés** – Textarea CSS, típusok áthelyezése: **KÉSZ**.
5. ✅ **Fázis 3, 12. lépés** – `createModal` javítása: **KÉSZ**.
6. ✅ **Fázis 3, 13. lépés** – Lapos fájlok áthelyezése: **KÉSZ**.
7. ✅ **Fázis 3, 9. lépés** – Calendar helper: **KÉSZ**.
8. ✅ **Fázis 3, 10. lépés** – `createForm` refaktor: **KÉSZ**.
9. ✅ **Fázis 4, 16. lépés** – Build javítva (29 hiba → 0): **KÉSZ**.
10. ✅ **Fázis 4, 18. lépés** – Dokumentáció frissítve: **KÉSZ**.

---

## 6. Megjegyzések

| Jelölés | Jelentés |
|---------|----------|
| ✅ **KÉSZ** | Implementálva és typecheck átment |
| ✅ Döntés | Döntés megszületett, implementáció hátravan |
| ❓ Javaslat | Még nincs döntés, megvitatásra vár |

- **Döntés: `params`** – Az egységes paraméter név `params` lesz minden komponensben (még nem implementálva).
- A `createDrawer` és `createModal` **nem tartalmaz `parent` paramétert** – ez szándékos tervezési döntés: portal mintát követnek (React portal analógia), a komponensek a `document.body`-hoz fűzik magukat. Ezt a viselkedést a refaktorálás során is meg kell őrizni.
- A terv nem érinti a publikus API felületét a 2. fázisban említett változtatásokon kívül.
- A breaking change-eket (visszatérési típus változás) dokumentálni kell a changelog-ban.
- A `domelemjs` library marad a közvetlen függőség.
- A refaktorálás után érdemes lehet unit teszteket írni, mivel jelenleg nincs teszt a projektben.
