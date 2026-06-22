# Példa és renderelt minta — egy igazságforrásból (Single Source of Truth) Terv

## 1. A probléma

A dokumentációs oldalon minden komponens-szekció **két dolgot** mutat:

1. a **kód-példát** (syntax-highlightolt `<pre><code>` blokk),
2. a **renderelt eredményt** (élő DOM elem).

Jelenleg ezt a kettőt **kézzel, kétszer** írjuk meg minden szekcióban. Lásd [documentation/examples/buttons.ts](documentation/examples/buttons.ts):

```ts
{
  title: "createButtonInput",
  description: "Input gomb a submit/reset mellett.",
  // (1) megjelenített kód – string literál
  code: `createButtonInput({\n  parent: "#app",\n  id: "btnInput",\n  text: "Button input",\n  click: () => console.log("clicked"),\n});`,
  codeLang: "typescript",
  // (2) ténylegesen lefuttatott kód – függvény
  render: (c) => createButtonInput({ parent: c, id: "b1", text: "Button input", click: () => console.log("clicked") }),
},
```

**Következmények:**

- **Elcsúszás (drift):** a `code` string és a `render` body már most is eltér — `id: "btnInput"` vs `id: "b1"`, `parent: "#app"` vs `parent: c`. A megjelenített kód tehát **nem az, ami valójában fut** → a doksi félrevezető.
- **Dupla karbantartás:** minden API-változásnál két helyen kell javítani.
- **Nincs garancia a helyességre:** a `code` string sosem fordul/típusellenőrződik, így lejárt/hibás kódot is mutathat anélkül, hogy a build elbukna.

**Cél:** a példát **egyszer** írjuk le (a `render` függvényben), és ebből az egy forrásból származzon **mind** a megjelenített kód, **mind** a renderelt eredmény.

---

## 2. A jelenlegi adatfolyam

```
examples/*.ts  →  DocSection[] { code, render }  →  renderSections()  →  DOM
                        │   │
                        │   └─ render(container)            → élő eredmény
                        └───── highlightCode(code, lang)    → <pre><code>
```

Érintett fájlok:

- [documentation/page-components/initPage.ts](documentation/page-components/initPage.ts) — `DocSection` típus, `renderSections()`, `createCodeBlockHTML()`.
- [documentation/page-components/buildPage.ts](documentation/page-components/buildPage.ts) — párhuzamos `PageSection` típus + `buildPage()` (ugyanaz a minta, külön implementáció).
- `documentation/examples/*.ts` — ~17 belépési pont (lásd [webpack.config.mjs](webpack.config.mjs)), mindegyik kézzel írt `code` + `render` párokkal.
- [src/components/highlighter.ts](src/components/highlighter.ts) — a string → highlightolt HTML.

---

## 3. Megoldási lehetőségek

### 3.1 Opció A — Build-time forráskinyerés webpack loaderrel ⭐ (AJÁNLOTT)

A példát egyetlen render-függvényként írjuk le, és egy **saját webpack loader** a fordítás során (a `ts-loader` **előtt**) kiolvassa a függvény **eredeti TypeScript forrásszövegét**, és abból generálja a `code` mezőt.

Új DSL-helper:

```ts
// documentation/page-components/example.ts
export interface ExampleMeta {
  title: string;
  description: string;
  codeLang?: string;
}
export interface DocSection extends ExampleMeta {
  code: string;                          // a loader tölti ki build-time
  render: (container: HTMLElement) => void;
}

// Marker függvény: a loader ezt a hívást ismeri fel és írja át.
export function example(
  meta: ExampleMeta,
  render: (parent: HTMLElement) => void,
): DocSection {
  // futásidőben a `code` üres marad, ha a loader nem futott (lásd fallback)
  return { ...meta, code: (render as any).__code ?? "", render };
}
```

Példa-írás (egyetlen forrás):

```ts
example(
  { title: "createButtonInput", description: "Input gomb a submit/reset mellett." },
  (parent) => createButtonInput({ parent, id: "btnInput", text: "Button input", click: () => console.log("clicked") }),
);
```

A loader minden `example(meta, (parent) => <body>)` hívásnál:

1. AST-ben megkeresi a hívást (`@babel/parser` vagy a TS Compiler API; a nyers `.ts` szöveg még elérhető),
2. a második argumentum **arrow-body** forrásszeletét kivágja (`node.start..node.end`),
3. normalizálja (blokk-body → belső sorok kibontása; egy-kifejezéses body marad),
4. beinjektálja a hívásba egy `code` literált, pl. a `render` függvényre `__code` property-ként vagy közvetlenül az objektumba.

**Kulcsfeltétel:** a container paramétert **`parent`-nek** nevezzük, és **shorthand**-del adjuk át (`{ parent, ... }`). Így a megjelenített kód **szó szerint** az, ami fut — nincs szükség azonosító-helyettesítésre, és a `parent` mint változó természetesen olvasható.

| Előny | Hátrány |
|-------|---------|
| Egyetlen forrás, nulla drift | Saját loadert kell írni + tesztelni (~80–120 sor) |
| Megjelenített kód = **eredeti TS** (típusokkal együtt) | Csak a `documentation` webpack confighoz kötött |
| A `render` típusellenőrződik (`tsc --noEmit` elbukik, ha a példa hibás) | A loader-illesztést karban kell tartani, ha a DSL változik |
| Production minify-tól független (a nyers forrásból dolgozik) | |

---

### 3.2 Opció B — Pre-build codegen szkript (TS Compiler API)

Külön node szkript (`scripts/gen-example-code.mjs`) a build előtt: bejárja az `examples/*.ts` fájlokat, kinyeri minden `example(...)` render-body forrását, és **sidecar** fájlba írja (`*.code.json`, kulcs = szekció-id), amit a runtime betölt. Vagy ugyanezt a forrást visszageneráljuk markerek közé a fájlba.

| Előny | Hátrány |
|-------|---------|
| Framework-független (nem webpack-specifikus) | Külön generált artefakt → szinkronban kell tartani |
| Könnyű debugolni (a kinyert kód fájlban látszik) | Plusz build-lépés a `build:page` scriptben |
| Más doc-eszközből is újrahasznosítható | Stale-codegen veszély, ha valaki elfelejti futtatni |

---

### 3.3 Opció C — Runtime `Function.prototype.toString()`

A `render` függvényt futásidőben `render.toString()`-gal stringgé alakítjuk, levágjuk a `(parent) =>` prefixet, és azt highlightoljuk. Nulla build-infrastruktúra.

Mivel a `documentation` config `mode: "development"` és **nincs minify** ([webpack.config.mjs:55-111](webpack.config.mjs#L55-L111)), a `toString()` jelenleg **olvasható** kódot adna vissza.

| Előny | Hátrány |
|-------|---------|
| Nulla build-eszköz, ~20 sor | A `ts-loader` **transzpilál**: a megjelenített kód JS, **típusok nélkül** (nem a TS forrás) |
| Azonnal bevezethető | Production `mode`/minify bekapcsolásakor **eltörik** (minifikált kód jelenne meg) |
| | Az arrow-body normalizálása (zárójelek, `return`) trükkös és törékeny |

---

### 3.4 Opció D — A `code` string mint forrás + `new Function` / `eval` (ELVETVE)

A `code` string lenne az egyetlen forrás, és a `render` ezt `new Function(...)`-nel futtatná.

**Elvetve:** elveszik a típusellenőrzés és a tree-shaking, az összes `createX`-et scope-ba kell injektálni, biztonságilag kétes, és egy TS-könyvtár doksijához nem méltó. Csak teljesség kedvéért szerepel.

---

## 4. Döntés és ajánlás

**Ajánlott: Opció A (build-time loader).** Ez az egyetlen, amely:

- valódi **egy forrást** ad (nincs sem string, sem sidecar a render mellett),
- a **megjelenített kód = eredeti TypeScript** (típusokkal), nem transzpilált JS,
- a példát **típusellenőrzi** (a hibás doksi build-time elbukik),
- **minify-független** (a nyers forrásból dolgozik), így a doc-build production módba is átállhat.

**Ha a loader írása túl nagy falat:** kezdő lépésként **Opció C** gyorsan bevezethető (a dev-mód miatt ma működne), majd később átállás A-ra — a `DocSection`/`example()` API ugyanaz marad, csak a `code` kitöltési mechanizmusa cserélődik. **Opció B** akkor jó, ha a doksi-kód a webpacktől függetlenül (pl. README-generáláshoz) is kell.

---

## 5. Implementációs lépések (Opció A)

### 5.1 DSL bevezetése

- [ ] Új `documentation/page-components/example.ts`: `ExampleMeta`, `DocSection`, `example(meta, render)` helper.
- [ ] `DocSection` átköltöztetése ide az [initPage.ts](documentation/page-components/initPage.ts)-ből; az [index.ts](documentation/page-components/index.ts) re-exportja frissítve.
- [ ] Konvenció rögzítése: a container paraméter **mindig `parent`**, shorthand átadással (`{ parent, ... }`).

### 5.2 Loader megírása

- [ ] `scripts/example-loader.mjs`: webpack loader.
  - bemenet: a `.ts` forrás szövege,
  - parse `@babel/parser`-rel (`plugins: ["typescript"]`) vagy TS Compiler API-val,
  - minden `example(<meta>, <arrow>)` hívásnál az arrow-body forrásszeletének kivágása + normalizálás,
  - a forrásszöveg beinjektálása `code:`-ként (a meta objektumba, vagy `render.__code = "..."`),
  - **forward**: a módosított szöveget adja tovább a `ts-loader`-nek.
- [ ] Normalizálás: blokk-body (`{ ... }`) → belső sorok dedentálva; egy-kifejezéses body változatlanul; `console.log` és többsoros hívások kezelése.
- [ ] Edge case-ek: beágyazott `example` hívás, template literál a body-ban, vesszők/zárójelek a stringekben (AST-alapú slice, nem regex).

### 5.3 Webpack illesztés

- [ ] [webpack.config.mjs](webpack.config.mjs) `documentationConfig.module.rules`: az `examples/*.ts`-re a custom loader **a `ts-loader` elé** (a `use` tömbben a loaderek jobbról balra futnak → `use: ["ts-loader", "./scripts/example-loader.mjs"]`).
- [ ] Esetleg `include`-szal csak a `documentation/examples`-re szűkíteni, hogy a komponens-forrásokat ne érintse.

### 5.4 Migráció

- [ ] `documentation/examples/*.ts` (~17 fájl) átírása a `DocSection[]` tömbökről `example(meta, render)` hívásokra; a kézi `code` stringek **törlése**.
- [ ] `renderSections()` változatlan maradhat (ugyanazt a `DocSection`-t fogyasztja).
- [ ] [buildPage.ts](documentation/page-components/buildPage.ts) `PageSection`/`buildPage()` összevonása a `DocSection`/`renderSections` ággal (ne maradjon két párhuzamos implementáció), vagy a `PageSection` is `example()`-re álljon.

### 5.5 Ellenőrzés

- [ ] `npm run typecheck` — a példák immár típusellenőrződnek.
- [ ] `npm run build:page` — a `dist-page/examples/*.js`-ben a beágyazott `code` az eredeti TS-t tükrözi.
- [ ] Vizuális ellenőrzés: minden szekcióban a megjelenített kód **azonos** azzal, ami a „Eredmény:" alatt renderelődik.
- [ ] Szándékosan elrontott példa → a `tsc` elbukik (regressziós bizonyíték a SoT-ra).

---

## 6. Kockázatok és megjegyzések

- **`buildPage` vs `renderSections` duplikáció:** két külön renderelő ág van ([buildPage.ts](documentation/page-components/buildPage.ts) és [initPage.ts](documentation/page-components/initPage.ts)). A SoT bevezetésekor érdemes ezeket **egyesíteni**, különben a probléma egy szinttel feljebb ismétlődik.
- **Loader-karbantartás:** az `example()` szignatúra változása a loader parse-logikáját is érinti — érdemes 2-3 unit-tesztet írni a kinyerésre (egy-kifejezéses body, blokk-body, többsoros hívás).
- **Highlightolás:** a kinyert kód továbbra is a meglévő [highlighter.ts](src/components/highlighter.ts)-en megy át — nincs változás a megjelenítési láncban.
- **Fokozatos bevezetés:** a `code` mező opcionálissá tételével A és C **egyszerre** is élhet (ahol már van loader-kinyerés, ott azt használja; ahol nincs, ott `toString()` fallback) — így fájlonként migrálható.
