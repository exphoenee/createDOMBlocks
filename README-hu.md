# createDOMBlocks

TypeScript könyvtár komplex HTML blokkok és űrlapelemek létrehozásához JavaScript segítségével. A [DOMelemJS](https://github.com/exphoenee/DOMelemJS) könyvtárra épül.

## Jellemzők

- Űrlap inputok létrehozása címkékkel és eseménykezelőkkel
- Táblázatok építése tömbökből vagy objektumokból automatikus lábléc számítással
- Modál dialógus generálása testreszabott műveletekkel
- Rendezett/rendezetlen listák létrehozása
- Típusbiztonság teljes TypeScript támogatással

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

### npm használatával

```typescript
import { createTextInput, createButton, createTable } from "createdomblocks";
import "createdomblocks/style.css";

const parent = document.getElementById("app");

// Szöveg input létrehozása
createTextInput({
  parent,
  id: "myInput",
  labelText: "Név:",
  placeholder: "Adja meg a nevet",
});

// Gomb létrehozása
createButton({
  parent,
  id: "submitBtn",
  text: "Küldés",
  click: () => console.log("Kattintás!"),
});
```

### CDN használatával

```html
<!DOCTYPE html>
<html lang="hu">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Alkalmazásom</title>
    <link rel="stylesheet" href="https://unpkg.com/createdomblocks/dist/style.css" />
  </head>
  <body>
    <div id="app"></div>
    <script src="https://unpkg.com/createdomblocks/dist/index.js"></script>
    <script>
      const { createTextInput, createButton } = CreateDOMBlocks;
      const parent = document.getElementById("app");

      createTextInput({
        parent,
        id: "myInput",
        labelText: "Név:",
        placeholder: "Adja meg a nevet",
      });

      createButton({
        parent,
        id: "submitBtn",
        text: "Küldés",
        click: () => console.log("Kattintás!"),
      });
    </script>
  </body>
</html>
```

## API

### Űrlap Inputok

#### `createTextInput(params)`
Szöveg input létrehozása opcionális címkével.

#### `createTelInput(params)`
Telefon input létrehozása.

#### `createUrlInput(params)`
URL input létrehozása.

#### `createSearchInput(params)`
Keresési input létrehozása.

#### `createEmailInput(params)`
E-mail input létrehozása.

#### `createPasswordInput(params)`
Jelszó input létrehozása.

#### `createNumberInput(params)`
Szám input létrehozása.

#### `createDateInput(params)`
Dátum input létrehozása.

#### `createDatetimeInput(params)`
Dátum-idő input létrehozása.

#### `createTimeInput(params)`
Idő input létrehozása.

#### `createMonthInput(params)`
Hónap input létrehozása.

#### `createWeekInput(params)`
Hét input létrehozása.

#### `createCheckbox(params)`
Jelölőnégyzet létrehozása.

#### `createColorInput(params)`
Szín kiválasztó létrehozása.

#### `createFileInput(params)`
Fájl kiválasztó létrehozása.

#### `createRangeInput(params)`
Csúszka létrehozása min/max/step paraméterrel.

#### `createHiddenInput(params)`
Rejtett input létrehozása.

### Gombok

#### `createButtonInput(params)`
Input gomb létrehozása.

#### `createSubmitInput(params)`
Küldés gomb létrehozása.

#### `createResetInput(params)`
Visszaállítás gomb létrehozása.

#### `createButton(params)`
Gomb elem létrehozása.

### Kiválasztás

#### `createSelect(params)`
Legördülő menü létrehozása opciókkal.

#### `createRadio(params)`
Radio gomb csoport létrehozása.

#### `createCustomSelect(params)`
Egyedi legördülő menü létrehozása saját stílussal.

#### `createTextarea(params)`
Szövegdoboz létrehozása.

### Egyéb Elemek

#### `createParagraph(params)`
Bekezdés létrehozása.

#### `createTitle(params, level)`
Címsor létrehozása (h1-h6).

#### `createUnorderedList(data, params)`
Rendezetlen lista létrehozása (ul).

#### `createOrderedList(data, params)`
Rendezett lista létrehozása (ol).

#### `createTable(data, params)`
Táblázat létrehozása fejléccel, sorokkal és opcionális lábléc számítással.

#### `createModal(content, actions, params)`
Modál dialógus létrehozása.

#### `newLine(parent)`
Sortörés létrehozása.

#### `createForm(config)`
Űrlap létrehozása tömbbe szedett input konfigurációkkal.

#### `createCard(params)`
Kártya komponens címmel, testtel és lábléccel.

#### `createGrid(params)`
Rács elrendezés oszlopokkal.

#### `createContainer(params)`
Általános container wrapper.

#### `createNav(params)`
Navigációs sáv menüpontokkal.

#### `createBreadcrumb(params)`
Morzsa menü.

#### `createTabs(params)`
Lapozahtató tabok.

#### `createAlert(params)`
Figyelmeztető üzenet (success/error/warning/info).

#### `createToast(params)`
Ideiglenes értesítés.

#### `createBadge(params)`
Állapot jelző.

#### `createSpinner(params)`
Töltés indikátor.

#### `createProgressBar(params)`
Folyamatjelző.

#### `createImage(params)`
Kép captionnel.

#### `createLink(params)`
Stilizált hivatkozás.

#### `createCodeBlock(params)`
Kódblokk nyelv megadásával.

#### `createBlockquote(params)`
Idézet szerzővel.

#### `createDivider(params)`
Vízszintes vonal.

#### `createAccordion(params)`
Összecsukható szekciók.

#### `createTooltip(params)`
Buborék súgó.

#### `createAvatar(params)`
Felhasználó avatar.

### Általános Paraméterek

Az összes input függvény a következő paramétereket fogadja:

| Paraméter | Típus | Leírás |
|-----------|-------|--------|
| `parent` | `HTMLElement \| string` | Szülő elem vagy CSS selector |
| `id` | `string` | Elem ID |
| `class` | `string` | CSS osztálynév |
| `labelText` | `string` | Címke szövege (inputoknál) |
| `labelfirst` | `boolean` | Címke az input előtt (alapértelmezett: true) |
| `value` | `string \| number` | Kezdeti érték |
| `name` | `string` | Input name attribútum |
| `placeholder` | `string` | Helyettesítő szöveg |
| `onChange` | `(e: Event) => void` | Változás eseménykezelő |
| `click` | `(e: Event) => void` | Kattintás eseménykezelő |
| `handleEvent` | `EventHandler[]` | További eseménykezelők |

### Táblázat Opciók

| Paraméter | Típus | Leírás |
|-----------|-------|--------|
| `hasHeader` | `boolean` | Első sor fejléc |
| `hasFooter` | `boolean` | Lábléc sor megjelenítése |
| `addRowNumbers` | `boolean` | Sor számok hozzáadása |
| `sumRowValues` | `boolean` | Összeg oszlop hozzáadása |
| `cellNames` | `object` | Egyéni fejléc nevek |

## Példa

```typescript
import {
  createTextInput,
  createSelect,
  createButton,
  createTable,
  createModal
} from "createdomblocks";

const parent = document.getElementById("app");

// Form több inputtal
createTextInput({
  parent,
  id: "username",
  labelText: "Felhasználónév:",
  placeholder: "Adja meg a felhasználónevet",
});

createSelect({
  parent,
  id: "role",
  labelText: "Szerep:",
  options: [
    { text: "Admin", value: "admin" },
    { text: "Felhasználó", value: "user" },
  ],
});

// Adat táblázat
const data = [
  ["Név", "Kor", "Város"],
  ["Anna", "30", "Budapest"],
  ["Béla", "25", "Debrecen"],
];

createTable(data, {
  parent,
  id: "userTable",
  hasHeader: true,
});

// Modál dialógus
createModal(
  { modalTitle: "Megerősítés", body: { tag: "p", text: "Biztos benne?" } },
  {
    okAction: () => console.log("Megerősítve"),
    cancelAction: () => console.log("Megsegitve"),
    closeAction: () => console.log("Bezárva"),
  },
  { parent, id: "confirmModal" }
);
```

## Licenc

MIT © Viktor Bozzay
