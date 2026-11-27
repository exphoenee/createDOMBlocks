# Terv: a dokumentáció-generálás bővítése a komponens- és leíró-bővítésekhez

> Kapcsolódó terv: `plans/hianyzo-komponensek-terv.md` (A1–A8, B1–B4, C1–C7). A generálás mai működése: `devdocs/generated-docs.md`.

## Állapot

Jelölés: `[ ]` nincs elkezdve, `[~]` folyamatban, `[x]` kész.

- [ ] D1 adatvezérelt API-csoportok (`apiGroups.ts` + teszt)
- [ ] D2 YAML-minta függvény-paraméterrel (`"@kezelő"`, fejléc-megjegyzés)
- [ ] D3 „YAML-ban” doboz a komponensoldalakon
- [ ] D4 `src/spec/keywords.ts` + `gen-spec-ref.mjs` + referencia-táblázatok
- [ ] D5 a beállítás-típusok mezői az API-oldalon
- [ ] D6 közös kulcsok (`attrs`, `onMount`) a JSON Schemában
- [ ] D7 YAML-útmutató új fejezetei
  - [ ] 1. attribútumok (`attrs`)
  - [ ] 2. HTML-fordítás (`t` + `html`)
  - [ ] 3. nyelvfüggő adat (`locale`)
  - [ ] 4. életciklus (`onMount`)
  - [ ] 5. származtatott állapot (`derive`)
  - [ ] 6. `strict` mód és HTML-validálás
  - [ ] 7. listák és teljesítmény
- [ ] D8 állapotos kézi YAML-minták (`handlers` mezővel)
  - [ ] SegmentedControl
  - [ ] Timeline
  - [ ] Carousel
  - [ ] SlotPicker
  - [ ] MusicPlayer
  - [ ] Board
  - [ ] CodeView
- [ ] D9 a `yaml-page` skill és a `spec-catalog` frissítése
- [ ] `devdocs/generated-docs.md` frissítve az új generátor-lépésekkel

## 1. Miért kell módosítani?

A mai generálás (`gen-props` → `spec-meta` → `gen-docs` → `gen-yaml-examples` → `gen-api`) az **új komponenseket magától kezeli**: a JSDoc-címkékből (`@category`, `@menu`, `@order`, `@summary`) elkészül az oldal és a menüpont, a `*Params` típusból a paramétertábla. Ezért a C-tételek nagy része külön munka nélkül megjelenik.

Hat ponton viszont a mai generátor nem elég:

| # | Hiány | Melyik tétel váltja ki | Következmény, ha nem javítjuk |
|---|---|---|---|
| D1 | Az API-oldal csoportjai kézzel rögzítettek (`documentation/examples/api.ts`, `GROUPS`: i18n, yaml, overlays, utils) | `makeSortable` (C1), `themeBootstrapScript` (C5) új csoportot kér | az új exportok nem jelennek meg az API-oldalon |
| D2 | A YAML-minta generátor kihagyja azt a példát, amelyben függvény-paraméter van (`incomplete`) | `Board` (`onMove`), `SlotPicker` (`loadSlots`), `SegmentedControl` (`onChange`) | ezeknek az oldalaknak nem lesz YAML-mintája |
| D3 | A komponensoldal nem mutatja, mi frissül újraépítés nélkül és mi köthető (`overrides.json`: `bind`, `updaters`, `array`, `items`) | B1–B4, C2–C4 (updaterek) | a YAML-használó nem tudja, mely paramétere reaktív olcsón |
| D4 | A leíró kulcsszavai (`attrs`, `t`, `html`, `bind`, `onMount`, `each`, `if`, `define`, műveletek, kifejezés-függvények) csak a kézi `yaml.html`-ben vannak | A1–A4, A7 | minden új kulcsszót kézzel kell dokumentálni, el fog csúszni |
| D5 | A `buildUI` / `mountYaml` beállításai (`handlers`, `data`, `derive`, `strict`) az API-oldalon csak aláírásként látszanak, a mezők leírása nem | A6, A7 | a `derive` és a `strict` dokumentálatlan |
| D6 | A JSON Schema nem ismeri a minden komponensre érvényes kulcsokat (`attrs`, `onMount`) | A1, A4 | a szerkesztő hibát jelez a helyes leíróra |

A kézzel írt részek (a `yaml.html` útmutató, az állapotos példák) frissítése szintén kell (D7, D8), és a `yaml-page` skill is ismerje az új lehetőségeket (D9).

## 2. Tételek

### D1. Adatvezérelt API-csoportok

A `gen-api.mjs` a csoportok listáját is kiírja, a csoportcímek egy helyen, fordíthatóan vannak. Ismeretlen csoportnál a teszt hibát ad (ne tűnjön el csendben export).

```ts
// documentation/page-components/apiGroups.ts
export const API_GROUPS: Record<string, () => TextValue> = {
  i18n: () => tr("Nyelvesítés (i18n)"),
  yaml: () => tr("YAML leíró"),
  overlays: () => tr("Felugró ablakok"),
  theme: () => tr("Téma"),
  behaviors: () => tr("Viselkedések"),
  utils: () => tr("Segédek"),
};
```

```ts
// test/gen-docs.test.ts
it("minden @group-nak van címe az API-oldalon", () => {
  const groups = new Set(api.map((e) => e.group));
  for (const g of groups) expect(API_GROUPS[g], `ismeretlen @group: ${g}`).toBeDefined();
});
```

### D2. YAML-minta függvény-paraméterrel

A `gen-yaml-examples.mjs` a függvény-literált (`ArrowFunctionExpression`, `FunctionExpression`, azonosító-hivatkozás függvényre) **kezelő-hivatkozássá** alakítja: `onMove: (e) => …` → `onMove: "@onMove"`. A mintához egy megjegyzés kerül, hogy a kezelőt a `handlers`-ben kell megadni.

```js
// gen-yaml-examples.mjs, lit()
if (node.type === "ArrowFunctionExpression" || node.type === "FunctionExpression") {
  usedHandlers.add(propName);
  return `@${propName}`;
}
// ...
const header = usedHandlers.size ? `# Kezelők (buildUI handlers): ${[...usedHandlers].join(", ")}\n` : "";
out[c.name] = header + stringifyYaml({ ui: [{ [key]: params }] });
```

A kihagyott komponensek listája a build kimenetében marad; cél, hogy a végén csak a `Modal` legyen rajta (ott a hármas szignatúra miatt kézi minta van).

### D3. „YAML-ban” doboz a komponensoldalakon

A `gen-docs.mjs` az `overrides.json`-ból (és a `meta.generated.ts`-ből) minden komponensoldalra egy rövid összefoglalót tesz a YAML-minta fölé:

- **Rövidítés:** skalár → `title`, lista → `slides`
- **Kétirányú kötés:** `bind` → `value`
- **Újraépítés nélkül frissülő paraméterek:** `slides`, `startIndex`
- **Gyerek-tartalmat fogadó mezők:** `slides[].content`

```js
// gen-docs.mjs
function yamlFacts(name, o) {
  const facts = [];
  if (o.text) facts.push({ key: "yaml.fact.scalar", value: o.text });
  if (o.array) facts.push({ key: "yaml.fact.list", value: o.array });
  if (o.bind) facts.push({ key: "yaml.fact.bind", value: o.bind });
  if (o.updaters) facts.push({ key: "yaml.fact.updaters", value: Object.keys(o.updaters).join(", ") });
  for (const [k, f] of Object.entries(o.items ?? {})) facts.push({ key: "yaml.fact.content", value: `${k}[].${f}` });
  return facts;
}
```

A feliratok (`yaml.fact.*`) a docs i18n-katalógusába kerülnek, így két nyelven jelennek meg.

### D4. Generált leíró-referencia

Új forrás: `src/spec/keywords.ts`. Ez a leíró foglalt kulcsszavait, műveleteit és kifejezés-függvényeit **JSDoc-kal** tartalmazza, és a `build.ts` és az `expr.ts` is innen veszi a listát (egy igazság). A `gen-spec-ref.mjs` ebből `specReference.json`-t ír, a `yaml.html` táblázatai ebből készülnek.

```ts
// src/spec/keywords.ts
export const NODE_KEYS = {
  /** Attribútumok a csomópont gyökerén (`data-*`, `aria-*`); `on*` tiltott. @since A1 */
  attrs: { appliesTo: "all", example: "attrs: { data-testid: hire }" },
  /** Nyelvesített szöveg kulcsa; `html: true` mellett HTML-ként. */
  t: { appliesTo: "text", example: "t: nav.home" },
  /** Kezelő a beszúrás után (`{ el, state, ui }`). @since A4 */
  onMount: { appliesTo: "all", example: 'onMount: "@revealCards"' },
  // ... each, if, define, bind, args, html, style, class
} as const;

export const ACTIONS = { set: "…", toggle: "…", inc: "…", push: "…", open: "…", close: "…" } as const;
export const EXPR_FUNCTIONS = { len: "…", upper: "…", lower: "…", join: "…", round: "…", str: "…" } as const;
```

```ts
// build.ts – a mai kézi Set helyett
const RAW_RESERVED = new Set(Object.keys(NODE_KEYS));
```

Teszt: minden `NODE_KEYS`, `ACTIONS` és `EXPR_FUNCTIONS` elemnek van leírása és példája, és a példa a `buildUI`-val felépül.

### D5. A beállítás-típusok mezői az API-oldalon

A `gen-api.mjs` a `@group` címkés függvények paraméter-típusait (pl. `BuildOptions`, `MountOptions`) is kibontja, mezőnként a JSDoc-kal, ahogy az osztályok tagjait már ma is.

```js
// gen-api.mjs, függvényeknél
const sig = type.getCallSignatures()[0];
for (const p of sig.getParameters()) {
  const pt = checker.getTypeOfSymbolAtLocation(p, decl);
  if (!pt.getProperties().length || !pt.aliasSymbol) continue;      // csak elnevezett objektumtípus
  entry.members.push(...pt.getProperties().map((m) => ({
    name: `${p.name}.${m.name}`,
    signature: `${m.name}: ${checker.typeToString(checker.getTypeOfSymbolAtLocation(m, decl), decl, FLAGS)}`,
    summary: summaryOf(m, checker),
  })));
}
```

Így a `derive`, `strict`, `handlers`, `data` a forrásból dokumentált.

### D6. Közös kulcsok a JSON Schemában

A `spec-meta.mjs` minden komponens-sémába felveszi a `NODE_KEYS`-ből az `appliesTo: "all"` kulcsokat (`attrs`, `onMount`), a nyers elemek sémájába pedig mindet. A forrás a D4 `keywords.ts`, tehát nincs második lista.

### D7. A kézzel írt YAML-útmutató frissítése

A `documentation/examples/yaml.ts` (`yaml.html`) új fejezetei, mindegyik élő példával és két nyelven:

1. Attribútumok és tesztazonosítók (`attrs`).
2. HTML-t tartalmazó fordítás (`t` + `html: true`), biztonsági figyelmeztetéssel.
3. Nyelvfüggő adat (`${p.desc[locale]}`).
4. Életciklus (`onMount`).
5. Származtatott állapot (`derive`) a `syncing`-minta helyett, előtte–utána összevetéssel.
6. Fejlesztői mód (`strict`) és a HTML-be ágyazott YAML ellenőrzése (`validate-spec index.html#page`).
7. Listák és teljesítmény: kulcs, szerkezeti egyenlőség, updaterek.

A referencia-táblázatok (D4) ugyanezen az oldalon, generálva.

### D8. Állapotos kézi YAML-minták

A generált minta egyetlen hívásból készül, az állapotot nem mutatja. Ahol a lényeg a kötés vagy a frissítés, kézi minta kell (`documentation/page-components/yamlExamples.ts`), élő kezelőkkel. A kézi minták formátuma bővül egy `handlers` mezővel, hogy élőben is működjenek.

```ts
// documentation/page-components/yamlExamples.ts
export const YAML_EXAMPLES: Record<string, { yaml: string; handlers?: Record<string, (...a: unknown[]) => unknown> }> = {
  SegmentedControl: {
    yaml: `state: { view: grid }
ui:
  - SegmentedControl: { bind: view, options: [ { value: grid, label: Rács }, { value: carousel, label: Carousel } ] }
  - Paragraph: "Kiválasztva: \${view}"`,
  },
  SlotPicker: {
    yaml: `ui:
  - SlotPicker: { loadSlots: "@demoSlots", onSelect: [ { set: { chosen: "\${$event}" } } ] }`,
    handlers: { demoSlots: async () => [{ date: "2026-12-01", times: ["09:00", "09:30"] }] },
  },
};
```

Kézi minta készül: `SegmentedControl`, `Timeline` (tömör váltás), `Carousel` (szűrés `setSlides`-szal), `Board` (mozgatás), `SlotPicker` (próbaadattal), `MusicPlayer` (`storageKey`), `CodeView` (összecsukás).

### D9. A `yaml-page` skill és a katalógus

- `.claude/skills/yaml-page/SKILL.md`: az új kulcsszavak (`attrs`, `onMount`, `t` + `html`, `locale`), a `derive` beállítás, a `strict` mód és a `validate-spec index.html#page` használata a munkafolyamatban; a „gyakori hibák” táblázat új sorai.
- `scripts/spec-catalog.mjs`: a D3 tényeit (kötés, updaterek) is kiírja, mert a skill ebből választ komponenst.

## 3. Sorrend

| Lépés | Tételek | Mikor (a komponens-terv szakaszaihoz képest) |
|---|---|---|
| 1 | D4 `keywords.ts` + D6 séma | az A1–A4 megvalósításával **együtt** (a kulcsszavak innen kerülnek a builderbe) |
| 2 | D1 API-csoportok, D2 függvény → kezelő, D3 „YAML-ban” doboz | a C-tételek **előtt**, hogy minden új komponens magától teljes oldalt kapjon |
| 3 | D5 beállítás-mezők | az A6–A7 (`derive`, `strict`) után |
| 4 | D7 útmutató, D8 kézi minták | folyamatosan, minden komponens-szakasz végén az ahhoz tartozó rész |
| 5 | D9 skill és katalógus | az A-tételek után egyszer, majd a C-tételek végén frissítve |

## 4. Ellenőrzés

- `npx vitest run`: `test/gen-docs.test.ts` új esetei (minden `@group`-nak van címe; a kihagyott YAML-minták listája csak a `Modal`; minden `keywords.ts` bejegyzésnek van leírása és felépülő példája; a séma tartalmazza az `attrs`/`onMount` kulcsot).
- `npm run build:page` és `npm run check:i18n`: minden új felirat két nyelven.
- `npm run dev:page`: a generátorok továbbra is csak változáskor írnak (`writeIfChanged`), nincs újraépítési hurok.
- Böngészőben: egy új komponens oldala (pl. `SegmentedControl`) mutatja a paramétertáblát, a „YAML-ban” dobozt, a generált és a kézi YAML-mintát, és a minta élőben működik.
