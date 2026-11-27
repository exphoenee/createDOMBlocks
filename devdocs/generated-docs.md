# A dokumentáció generálása a kódból

A dokumentáció váza a forráskódból készül, minden `npm run build`, `build:page` és `dev:page` indításkor (a `scripts/gen-props.mjs` hívja a többit). A kimenet a `documentation/generated/` mappába kerül, ez nincs verziókezelve.

| Mit | Honnan | Szkript | Kimenet |
|-----|--------|---------|---------|
| Paraméter-táblázatok | a `*Params` típusok és a JSDoc (`@default`) | `gen-props.mjs` | `props.json` |
| Komponens-metaadatok a YAML leíróhoz, JSON Schema | `props.json` + `src/spec/overrides.json` | `spec-meta.mjs` | `src/spec/meta.generated.ts`, `assets/createDOMBlocks.schema.json` |
| Komponens-oldalak (HTML) és a menü | a `createX` függvények JSDoc-címkéi | `gen-docs.mjs` | `pages/*.html`, `components.json` |
| YAML minta a komponens-oldalakhoz | az oldal TS példájának első `createX({...})` hívása | `gen-yaml-examples.mjs` | `yamlExamples.json` |
| API-referencia (i18n, YAML, felugró ablakok, segédek) | a `@group` címkés exportok JSDoc-ja és típusai | `gen-api.mjs` | `api.json` |
| YAML leíró-referencia (kulcsszavak, műveletek, függvények, változók) | `src/spec/keywords.json` (a builder, a séma és a `yaml.html` közös forrása) | – (közvetlen import) | a `yaml.html` referencia-táblázatai, a séma `attrs` / `onMount` leírásai |
| Példakódok az oldalakon | a példa `render` függvényének tényleges forrása | `example-loader.mjs` (webpack) | (a bundle-be) |

## Új komponens felvétele

1. A `createX` függvény fölé JSDoc:

   ```ts
   /**
    * Kártya komponens címmel, testtel és lábléccel.
    *
    * @category content          // forms | buttons | content | navigation | feedback | interactive | overlays
    * @menu Card                 // a menü és az oldal címe
    * @order 1                   // a sorrend a kategórián belül (kategóriánként egyedi)
    * @summary Kártya komponens címmel, testtel és lábléccel.   // az oldal alcíme
    */
   export function createCard(params: CardParams): HTMLElement { ... }
   ```

   Az oldal neve alapból a kebab-case komponensnév (`CustomDatePicker` → `custom-date-picker`); más névhez `@page egyedi-nev`.
2. A paraméterekhez JSDoc a `*Params` típusban (leírás, `@default`).
3. A példa: `documentation/examples/<oldal>.ts` (`example(...)` + `renderSections`).
4. Fordítás: `npm run check:i18n -- --no-fail --write-missing hianyzo.json`, majd a `scripts/merge-i18n.mjs`.

A HTML-oldal, a menüelem, a paraméter-táblázat és a YAML minta ezután magától megjelenik. Kézi YAML mintát csak akkor kell írni (`documentation/page-components/yamlExamples.ts`), ha a generált nem elég beszédes (állapot, kötés, több elem).

## Nem-komponens API

Egy publikus függvény / osztály / konstans az API-referenciába a JSDoc-ja `@group` címkéjével kerül (`i18n`, `yaml`, `overlays`, `utils`):

```ts
/**
 * Nyelv váltása: ...
 *
 * @group i18n
 */
export function setLocale(...)
```

Az aláírást a típusrendszer adja, a leírás a JSDoc első bekezdése; a tesztek (`test/gen-docs.test.ts`) ellenőrzik, hogy minden ilyen elemnek van leírása és aláírása.

## Ellenőrzések

- `npx vitest run`: a jegyzék (egyedi oldalnevek, ismert kategóriák, van példafájl), a generált YAML minták (mind felépül), az API-referencia teljessége.
- `npm run check:i18n`: minden megjelenő szöveghez van angol fordítás.
