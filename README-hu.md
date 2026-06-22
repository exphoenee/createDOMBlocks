# createDOMBlocks

[English README](README.md)

TypeScript könyvtár komplex HTML blokkok és űrlapelemek létrehozásához JavaScript segítségével. A [DOMelemJS](https://github.com/exphoenee/DOMelemJS) könyvtárra épül.

**50+ komponens** – form inputok, gombok, navigáció, tartalom blokkok, egyedi pickerek, drawer, modal, carousel, és még sok más.

## Jellemzők

- 50+ UI komponens – inputok, gombok, táblázatok, modálok, navigáció, alert-ek, stb.
- Framework-független – működik React, Vue, Angular vagy vanilla JS projektben
- Típusbiztonság – teljes TypeScript támogatás IntelliSense-szel
- Tree-shakable – csak azt importáld, amire szükséged van
- Portal támogatás – drawer és modal komponensek automatikusan a `document.body`-hoz fűződnek

## Telepítés

### npm

```bash
npm install createdomblocks
```

### CDN (unpkg)

```html
<link rel="stylesheet" href="https://unpkg.com/createdomblocks/dist/style.css" />
<script src="https://unpkg.com/createdomblocks/dist/index.js"></script>
```

Ez egy globális `CreateDOMBlocks` objektumot hoz létre az összes exportált függvénnyel.

## Gyors elkezdés

```typescript
import { createTextInput, createButton, createCard } from "createdomblocks";
import "createdomblocks/style.css";

const parent = document.getElementById("app");

createTextInput({
  parent,
  id: "name",
  labelText: "Név:",
  placeholder: "Adja meg a nevet",
});

createButton({
  parent,
  id: "submitBtn",
  text: "Küldés",
  click: () => console.log("Kattintás!"),
});

createCard({
  parent,
  id: "infoCard",
  title: "Üdvözlünk",
  body: { tag: "p", text: "Helló a createDOMBlocks-tól!" },
});
```

## API

### Form Inputok

| Függvény | Leírás |
|----------|--------|
| `createTextInput(params)` | Szöveg input címkével |
| `createTelInput(params)` | Telefon input |
| `createUrlInput(params)` | URL input |
| `createSearchInput(params)` | Kereső input |
| `createEmailInput(params)` | E-mail input |
| `createPasswordInput(params)` | Jelszó input |
| `createNumberInput(params)` | Szám input |
| `createDateInput(params)` | Dátum input |
| `createDatetimeInput(params)` | Dátum-idő input |
| `createTimeInput(params)` | Idő input |
| `createMonthInput(params)` | Hónap input |
| `createWeekInput(params)` | Hét input |
| `createCheckbox(params)` | Jelölőnégyzet |
| `createColorInput(params)` | Színválasztó |
| `createFileInput(params)` | Fájl választó |
| `createRangeInput(params)` | Csúszka (min/max/step) |
| `createHiddenInput(params)` | Rejtett input |

### Gombok

| Függvény | Leírás |
|----------|--------|
| `createButton(params)` | `<button>` elem click handlerrel |
| `createButtonInput(params)` | `<input type="button">` |
| `createSubmitInput(params)` | `<input type="submit">` |
| `createResetInput(params)` | `<input type="reset">` |

### Kiválasztás

| Függvény | Leírás |
|----------|--------|
| `createSelect(params)` | Natív `<select>` legördülő |
| `createRadio(params)` | Radio gomb csoport |
| `createCustomSelect(params)` | Stílusos egyedi legördülő |

### Egyedi Pickerek

| Függvény | Leírás |
|----------|--------|
| `createCustomDatePicker(params)` | Interaktív dátum választó |
| `createCustomDateTimePicker(params)` | Dátum + idő választó |
| `createCustomDateRangePicker(params)` | Dátum tartomány választó |
| `createCustomMonthPicker(params)` | Hónap választó |
| `createCustomWeekPicker(params)` | Hét választó |

### Layout & Konténerek

| Függvény | Leírás |
|----------|--------|
| `createCard(params)` | Kártya fejléccel / testtel / lábléccel |
| `createContainer(params)` | Max-width wrapper konténer |
| `createGrid(params)` | CSS rács oszlopokkal |
| `createDivider(params)` | Vízszintes elválasztó `<hr>` |

### Navigáció

| Függvény | Leírás |
|----------|--------|
| `createNav(params)` | Navigációs sáv almenükkel |
| `createBreadcrumb(params)` | Morzsa menü |
| `createTabs(params)` | Lapozahtató tabok |
| `createMenu(params)` | Menü lista (drawer-ben használható) |
| `createDrawer(params)` | Oldalsó panel (portal – body-hoz fűződik) |
| `openDrawer(id)` | Drawer megnyitása ID alapján |
| `closeDrawer(id)` | Drawer bezárása ID alapján |

### Visszajelzés

| Függvény | Leírás |
|----------|--------|
| `createAlert(params)` | Figyelmeztetés (success/error/warning/info) |
| `createToast(params)` | Automatikusan eltűnő értesítés |
| `createBadge(params)` | Állapot jelző / pilula |
| `createSpinner(params)` | Töltés indikátor (sm/md/lg) |
| `createProgressBar(params)` | Folyamatjelző százalékkal |

### Tartalom

| Függvény | Leírás |
|----------|--------|
| `createParagraph(params)` | `<p>` bekezdés |
| `createTitle(params, level)` | Címsor (h1–h6) |
| `createImage(params)` | Ábra képpel + opcionális felirattal |
| `createLink(params)` | Stilizált `<a>` link |
| `createCodeBlock(params)` | Kódblokk szintaxis kiemeléssel |
| `createBlockquote(params)` | Idézet szerzővel |
| `createAccordion(params)` | Összecsukható akkordeon szekciók |
| `createTooltip(params)` | Buborék súgó (hover vagy click) |
| `createAvatar(params)` | Felhasználói avatar (kép vagy monogram) |
| `createUnorderedList(data, params)` | Rendezetlen lista |
| `createOrderedList(data, params)` | Rendezett lista |
| `newLine(parent)` | Sortörés `<br>` |
| `asyncImage(params)` | Lusta betöltésű kép |

### Adat Megjelenítés

| Függvény | Leírás |
|----------|--------|
| `createTable(data, params)` | Táblázat fejléccel/lábléccel/összegzéssel |

### Átfedő Elemek (Portal)

| Függvény | Leírás |
|----------|--------|
| `createModal(content, actions, params)` | Modál dialógus (portal – body-hoz fűződik) |
| `openModal(id)` | Modál megnyitása ID alapján |
| `closeModal(id)` | Modál bezárása ID alapján |

### Űrlapok

| Függvény | Leírás |
|----------|--------|
| `createForm(params)` | Űrlap elem input konfigurációkkal |

### Interaktív

| Függvény | Leírás |
|----------|--------|
| `createCarousel(params)` | 3D carousel navigációval és érintés támogatással |
| `createDragAndDropFileInput(params)` | Drag & drop fájl feltöltő |

### Általános Paraméterek

Minden komponens egy `params` objektumot vár. Közös mezők:

| Paraméter | Típus | Leírás |
|-----------|-------|--------|
| `parent` | `HTMLElement \| string` | Szülő elem vagy CSS selector (kötelező) |
| `id` | `string` | Elem ID (kötelező) |
| `class` | `string` | CSS osztály |
| `handleEvent` | `EventHandler \| EventHandler[]` | Eseménykezelők |

Input komponensek emellett támogatják:

| Paraméter | Típus | Alapértelmezett | Leírás |
|-----------|-------|-----------------|--------|
| `labelText` | `string` | – | Címke szövege |
| `labelfirst` | `boolean` | `true` | Címke az input előtt |
| `value` | `string \| number` | – | Kezdeti érték |
| `name` | `string` | – | Input name attribútum |
| `placeholder` | `string` | – | Helyettesítő szöveg |
| `onChange` | `(e: Event) => void` | – | Változás eseménykezelő |
| `click` | `(e: Event) => void` | – | Kattintás eseménykezelő |

---

### Táblázat Opciók

| Paraméter | Típus | Alapértelmezett | Leírás |
|-----------|-------|-----------------|--------|
| `hasHeader` | `boolean` | `true` | Első sor fejléc |
| `showFooter` | `boolean` | `true` | Lábléc sor megjelenítése |
| `addRowNumbers` | `boolean` | `false` | Sorszám oszlop hozzáadása |
| `sumRowValues` | `boolean` | `false` | Összeg oszlop hozzáadása |
| `cellNames` | `object` | – | Egyéni fejléc nevek |

---

### Drawer / Modal (Portal)

A `createDrawer` és `createModal` **portal komponensek** – automatikusan a `document.body`-hoz fűzik magukat. **Nem fogadnak el `parent` paramétert.**

```typescript
// Drawer menüvel
createDrawer({
  id: "sidebar",
  title: "Menü",
  children: [createMenu({ id: "nav", items: menuItems })],
  mode: "push",
  defaultState: "closed",
});
openDrawer("sidebar");

// Modal
createModal(
  { modalTitle: "Megerősítés", body: { tag: "p", text: "Biztos benne?" } },
  { okAction: () => console.log("OK"), cancelAction: () => console.log("Mégse") },
  { id: "confirmModal" }
);
openModal("confirmModal");
```

---

## Példa

```typescript
import {
  createTextInput, createSelect, createButton,
  createTable, createCard, createToast
} from "createdomblocks";

const parent = document.getElementById("app");

createCard({
  parent,
  id: "formCard",
  title: "Felhasználói űrlap",
  body: [
    createTextInput({ parent, id: "name", labelText: "Név:", placeholder: "Add meg a nevet" }),
    createSelect({ parent, id: "role", labelText: "Szerep:", options: [
      { text: "Admin", value: "admin" },
      { text: "Felhasználó", value: "user" },
    ]}),
    createButton({ parent, id: "saveBtn", text: "Mentés", click: () => {
      createToast({ parent: document.body, message: "Elmentve!", type: "success" });
    }}),
  ],
});
```

## Licenc

MIT © Viktor Bozzay
