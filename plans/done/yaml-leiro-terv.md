# YAML leíró a createDOMBlocks-hoz: oldal felépítése deklaratív leírásból


## 1. Kiindulópont és cél

A versenyoldal újraírása megmutatta a mai használat súrlódását. Egy egyszerű blokk is így néz ki:

```js
const card = B.createCard({ parent: container, id: uid('info'), class: 'cmp-info', title: comp.name, body: [], footer: [] });
card.setAttribute('style', compVars(comp));
const body = card.querySelector('.card-body');
B.createParagraph({ parent: body, id: uid('p'), text: comp.targetGroup });
```

Zaj: kötelező `id` és `parent` minden híváshoz, kézi `uid()`, a beágyazás imperatív (`querySelector('.card-body')`), a szerkezet nem látszik a kódból, és a „váz” (header, main, section) még nyers `createLocalizedElem` híváshoz kötött.

**Cél:** egy tömör, olvasható, szerkeszthető leírás (YAML, de a JSON/JS objektum is ugyanúgy megy), amiből egy parser felépíti az egész oldalt. A szerkezet egy helyen látszik, a logika (adatok, eseménykezelők) JS-ben marad.

Nem cél: új komponensek, saját sablonnyelv, `eval`, build lépés kötelezővé tétele.

## 2. Tervezési elvek

1. **Egy csomópont = egy kulcs.** A kulcs a komponens neve (a `create` nélkül, nagybetűvel), az érték a paraméterei.
2. **Rövidítések mindenre, ami előre kitalálható:** skalár érték = a komponens fő szövege, lista érték = gyerekek, `id` és `parent` nem kötelező (automatikus).
3. **A meglévő komponenseket használja újra**, nem ír újat: a `createX` függvények maradnak az egyetlen igazság, a leíró csak hívja őket.
4. **Biztonságos:** nincs `eval`; eseménykezelők csak a megadott `handlers` térképből jöhetnek; nyers HTML csak az explicit `html:` kulccsal.
5. **Jó hibaüzenet:** ismeretlen komponens vagy paraméter esetén útvonallal és javaslattal (`ui[2].Card: ismeretlen paraméter "tite", erre gondoltál: "title"?`).
6. **Nulla új futásidejű függőség** (a lib ma is csak a `domelemjs`-re épül), `file://` alól és build nélkül is használható.

## 3. A szintaxis

### 3.1 Csomópont

```yaml
- Card#info.wide:            # Típus # id . osztály(ok)
    title: Versenykiírás     # paraméterek
    body:                    # a Card "gyerek" paramétere: lista = beágyazott csomópontok
      - Paragraph: Rövid leírás
      - Button: Mentés
```

| Forma | Jelentés |
|-------|----------|
| `Button: Mentés` | skalár → a komponens fő szövege (`text`; Title: `text`, Paragraph: `text`, Link: `text`, Badge: `text`) |
| `Card#id.a.b: {...}` | `#id` → `id`, `.a.b` → `class: "a b"`; id nélkül automatikus (`card-1`) |
| `Title(2): Cím` | zárójeles szám → `level` (a `createTitle` második paramétere) |
| `div.row: [...]`, `section#x: [...]` | **kisbetűs** név = nyers HTML elem (`createLocalizedElem`), a nagybetűs a könyvtár komponense, így nincs névütközés (`table` ≠ `Table`) |
| `body: [...]` | gyerek-paraméterek komponensenként: `body`, `footer`, `children`, `items`, `content`, a regisztrációban rögzítve |

### 3.2 Szövegek és nyelvesítés

```yaml
messages:                    # defineMessages / registerTranslations
  hu: { form: { save: Mentés } }
  en: { form: { save: Save } }
ui:
  - Button: { t: form.save }          # tr("form.save"), nyelvváltáskor újrarajzolódik
  - Paragraph: { t: items.count, count: 3 }   # paraméteres / többes szám
```

A `t:` forma a meglévő `tr()` / `defineMessages` réteget használja (`src/i18n.ts`), új i18n logika nem készül.

### 3.3 Események

```yaml
- Button:
    text: Mentés
    click: "@save"           # a handlers.save függvény
    throttle: 500
```

`@név` → a `buildUI(spec, { handlers })` térkép egy függvénye. Ismeretlen név hiba (nem néma). A komponens visszahívás-paraméterei (`onChange`, `onSelect`, `onMilestoneClick`, ...) ugyanígy kötődnek.

### 3.4 Adatok, ismétlés, feltétel (2. szakasz)

```yaml
data: $competitions          # JS-ből átadott adat: buildUI(spec, { data: { competitions } })
ui:
  - each: { in: $competitions, as: c }       # ismétlés
    do:
      - Card#filter-${c.id}:
          title: ${c.name}
          style: --c-color:${c.color}
  - if: $hasDownloads
    then: [ ... ]
```

Interpoláció csak `${a.b}` útvonal-kiolvasás (függvényhívás, kifejezés nincs). Az összetett számítás a JS-ben marad, és kész adatként érkezik.

### 3.5 Téma és újrahasznosítás (2. szakasz)

```yaml
theme:                       # CSS-változók a :root-ra (lásd a Témázás útmutatót)
  primary: "#0f172a"
  dark: { primary: "#f1f5f9" }
define:                      # névvel ellátott, paraméterezhető részlet
  DocRow:
    params: [title, href]
    body:
      - div.cmp-doc: [ { span: ${title} }, { Link: { text: Megnézés, href: ${href} } } ]
ui:
  - DocRow: { title: Versenyfelhívás, href: downloads/a.pdf }
```

### 3.6 Állapot és reaktivitás (a döntés szerint az első kiadás része)

```yaml
state:                                   # kezdőértékek
  timeFilter: all
  detailsOpen: true
  query: ""
  results: []                            # a JS (handler) tölti fel; összetett számítás JS-ben marad
ui:
  - Button: { text: "${detailsOpen ? 'Részletek elrejtése' : 'Részletek megjelenítése'}", click: { toggle: detailsOpen } }
  - if: ${detailsOpen}                   # reaktív feltétel: felépül / lebomlik
    then: [ { Paragraph: "Itt a részletek" } ]
  - TextInput: { bind: query, placeholder: Keresés }      # kétirányú kötés
  - Paragraph: "${len(results)} találat"
  - each: { in: ${results}, as: r, key: r.id }             # reaktív, kulcsolt lista
    do: [ { Card: { title: "${r.name}" } } ]
```

Működés:

- **Store** (`src/spec/store.ts`): útvonal-alapú, kicsi (`get`, `set`, `toggle`, `subscribe`, `batch`). A `buildUI` eredményén is elérhető: `ui.state.set('timeFilter', 'upcoming')`.
- **Kifejezések** (`src/spec/expr.ts`): saját, `eval`-mentes értelmező, csak biztonságos részhalmazzal: literálok, útvonalak (`a.b[0]`), `! && || == != < > <= >= + - * /`, ternáris `?:`, zárójel, és egy engedélyezett függvénylista (`len`, `upper`, `lower`, `fmt`, `plural`). Nincs hozzárendelés, nincs tetszőleges függvényhívás, nincs `window`/globális hozzáférés.
- **Kötések** (`src/spec/bindings.ts`): minden `${...}` kifejezés kiértékeléskor feljegyzi, mely útvonalakat olvasta, és csak ezek változásakor frissül (finomszemcsés, nincs teljes újrarajzolás). Frissítési szabályok:
  - szöveg és attribútum (`text`, `class`, `title`, `disabled`, ...): helyben írja át, a `setElementText` / `createLocalizedElem` meglévő reaktív szövegeire építve (`TextValue` függvény-forma);
  - `if`: felépíti / lebontja a részfát (a belső kötések és figyelők takarításával);
  - `each` + `key`: kulcsolt diff (új elem létrehoz, meglévőt átrendez, eltűnőt töröl);
  - egyéb komponens-paraméter (pl. `Gantt.rows`): ha a komponensnek van frissítő metódusa (`setRows`, `setData`), azt hívja; egyébként a csomópontot újraépíti az állapota (kijelölés, görgetés) megőrzése nélkül. Az ilyen komponensek listája a regisztrációban látszik, a docs oldalon dokumentált.
- **Beépített műveletek** az eseményeknél, `@handler` mellett: `{ set: {kulcs: érték} }`, `{ toggle: kulcs }`, `{ inc: kulcs }`, `{ push: {kulcs: érték} }`, több művelet listában. Handler kontextusa: `{ state, event, el, ui }`.
- **`bind:`** a beviteli komponenseken (`TextInput`, `Checkbox`, `Select`, `Textarea`, `NumberInput`, `RangeInput`, `Radio`): az állapotból tölti az értéket, és beíráskor visszaírja.
- **Takarítás:** a `buildUI` visszaadott `ui.destroy()` leiratkozik minden kötésről és figyelőről (nem szivárog).
- **Nyelvváltás** marad a meglévő `tr()` / `watchLocale` mechanizmus: a `t:` szövegek az állapotkötésektől függetlenül frissülnek.

### 3.7 Példa: a versenyoldal váza YAML-ban (szemléltető)

```yaml
ui:
  - header.cmp-header:
      - div.cmp-header-inner:
          - Title(1)#pageTitle.cmp-title: Mátyás király utcai Általános Iskola versenycsapatok versenyei
          - Button#themeToggleBtn.cmp-theme-btn: { click: "@toggleTheme" }
  - main.cmp-main:
      - section#filterCardsContainer.cmp-filters:
          each: { in: $competitions, as: c }
          do:
            - Card.cmp-filter: { title: ${c.name}, body: [ { Paragraph: ${c.targetGroup} }, { Checkbox: { checked: ${c.active}, onChange: "@toggleComp" } } ] }
      - section.cmp-panel:
          - Gantt#timeline: { rows: $ganttRows, barStyle: thin, dragScroll: true, onMilestoneClick: "@openEvent" }
```

A dinamikus részek (Gantt-sorok, eseménypanel, naptár menü) JS-ben maradnak, a váz és a statikus szerkezet kerül a leíróba.

## 4. Architektúra

Új könyvtár: `src/spec/` (mind exportálva a `src/index.ts`-ből).

| Fájl | Feladat |
|------|---------|
| `src/spec/parseYaml.ts` | Saját, függőségmentes **YAML-részhalmaz** parser: térkép, lista, skalárok (string/szám/bool/null), idézőjeles stringek, `[a, b]` és `{a: b}` flow-forma, `#` megjegyzés, `\|` és `>` többsoros blokk. Nem támogatott (dokumentálva): horgonyok/aliasok, címkék, több dokumentum. Hibánál sor:oszlop. |
| `src/spec/registry.ts` | Név → gyártó + metaadat: fő szöveg paramétere, gyerek-paraméterek, jelzők. **Adapterek** a szabálytalan szignatúrákhoz: `createTitle(params, level)`, `createUnorderedList/OrderedList(data, params)`, `createModal(content, actions, params)`, `createTable` túlterhelések, `createForm(config)`. A paraméter-listát a `documentation/generated/props.json`-ből (a `scripts/gen-props.mjs` kimenete) generáljuk, nem kézzel. |
| `src/spec/build.ts` | `buildUI(spec, { parent, handlers, data, messages })` → `{ root, byId, update }`. Végigjárja a fát, feloldja a rövidítéseket, `@handlers`, `$data`, `${...}`, `each`/`if`, `define`, hívja a `createX`-et a regisztrációból. |
| `src/spec/store.ts` | Útvonal-alapú állapottár: `get`, `set`, `toggle`, `batch`, `subscribe(path, cb)`; nincs külső függőség. |
| `src/spec/expr.ts` | `eval`-mentes kifejezés-értelmező (tokenizer + precedencia-parser) a `${...}` kifejezésekhez, engedélyezett függvényekkel; kiértékeléskor gyűjti az olvasott útvonalakat. |
| `src/spec/bindings.ts` | Kötések: szöveg/attribútum helyben, `if` fel-/lebontás, `each` kulcsolt diff, komponens-frissítő metódusok (`setRows`, `setData`) vagy újraépítés; takarítás (`destroy`). |
| `src/spec/errors.ts` | `SpecError` útvonallal és „erre gondoltál” javaslattal (Levenshtein a paraméterlistán). |
| `src/spec/mount.ts` | `mountYaml(target, source, options)`: forrás lehet YAML szöveg, objektum, `<script type="text/yaml" id=...>` elem vagy URL (utóbbi `file://`-ről nem megy, ezért a script-elemes forma az elsődleges). |
| `scripts/gen-schema.mjs` | A `props.json`-ból **JSON Schema** (`dist/createDOMBlocks.schema.json`), így a szerkesztő automatikus kiegészítést ad (`# yaml-language-server: $schema=...` sor). |

Újrahasznosítandó meglévő kód: `src/dom.ts` (`createDOMElem` / `createLocalizedElem`), `src/i18n.ts` (`tr`, `defineMessages`, `registerTranslations`), `scripts/gen-props.mjs` és `documentation/generated/props.json`, `src/components/index.ts` (az exportált komponensek listája), `scripts/example-loader.mjs` (a docs példák kódja).

## 5. Ütemezés

1. **MVP (statikus váz):** `parseYaml` + `buildUI` a rövidítésekkel (3.1), `@handlers`, `t:` nyelvesítés, jó hibák, regisztráció az összes komponensre adapterekkel. Tesztek.
2. **Adat és szerkezet:** `data`/`$ref`, `${}` útvonal-interpoláció, `each`, `if`, `define`, `theme` (még állapot nélkül, egyszeri kiértékelés).
3. **Állapot és reaktivitás:** `store.ts`, `expr.ts`, `bindings.ts`; `state:`, `bind:`, beépített műveletek (`set`/`toggle`/`inc`/`push`), reaktív `if` és kulcsolt `each`, `destroy()`. A 2. szakasz egyszeri kiértékelése ide épül át kötésekre.
4. **Eszközök és dokumentáció:** JSON Schema generálás, új docs oldal („YAML leíró”) élő szerkesztővel (YAML bal oldalon, eredmény jobb oldalon, az állapot is kipróbálható), útmutató a Témázás/Nyelvesítés mellett, README, `check:i18n` kiterjesztése a leíró szövegeire.
5. **Kipróbálás éles oldalon:** a versenyoldal vázának és az állapotkezelésének (téma, időszűrő, összecsukás, versenykapcsolók) átírása `page.yaml`-ra a `2026-27-competitions-domblocks` worktree-ben; a tapasztalatok visszavezetése a szintaxisba.

## 6. Kockázatok és döntési pontok

- **YAML-részhalmaz vs. teljes parser:** a saját parser kicsi (≈300 sor) és függőségmentes, de nem teljes YAML; a `yaml` npm csomag teljes, de ~100 KB és új függőség. Javaslat: saját részhalmaz, jól tesztelve, a korlátok dokumentálva.
- **Az állapot/reaktivitás a legnagyobb kockázat** (a döntés szerint az első kiadás része): saját kifejezés-értelmező, kötés-életciklus, kulcsolt diff. Mérséklés: a 3. szakasz külön, a 2. szakaszra épülő lépés, minden kötéstípus külön teszttel; a kifejezés-nyelv szándékosan kicsi és `eval`-mentes; a hibák (ismeretlen útvonal, ciklikus függés) névvel jelzettek; teljes vagy függőségkövető újrarajzolás helyett csak a kötéssel jelzett pontok frissülnek.
- **Szabálytalan szignatúrák** (Modal, Table, Form, listák) adapterekkel oldódnak meg; ezek a legtöbb tesztet igénylő rész.
- **Biztonság:** a leíró megbízható forrásból jön; a `html:` kulcs és a `content` ugyanúgy „csak megbízható szöveg”, mint ma. Nincs `eval`, a `@handler` csak előre megadott függvényt hívhat.
- **`file://`:** `fetch` nem működik, ezért a `<script type="text/yaml">` és a JS-ben átadott szöveg az elsődleges forma.
- **Verziózás:** új publikus API (`buildUI`, `parseYaml`, `mountYaml`) → minor verzió; a meglévő `createX` hívások nem változnak.

## 7. Ellenőrzés

- `npx tsc --noEmit` és `npx vitest run`: új tesztek a `test/spec-*.test.ts` fájlokban: parser (idézés, többsoros blokk, flow-forma, hibák sorszámmal), builder (rövidítések, `#id.class`, beágyazás, `@handlers`, `t:`, `each`/`if`, `define`, hibaüzenetek javaslattal), adapterek (Title level, listák, Modal, Table), kifejezések (precedencia, tiltott szerkezetek elutasítása), store és kötések (szöveg/attribútum frissítés, `if` fel-/lebontás, kulcsolt `each` átrendezés, `bind` kétirányúság, `destroy` után nincs frissítés), JSON Schema egyezése a `props.json`-nal.
- `npm run build:page` + `npm run check:i18n`: az új docs oldal és a fordítások rendben vannak.
- Böngészőben a docs oldal élő szerkesztője: YAML átírása után azonnal frissül az eredmény, hibás YAML esetén a hibaüzenet a sorszámmal látszik.
- Végpróba: a versenyoldal vázát tartalmazó `page.yaml` ugyanazt az oldalt rajzolja, mint a mostani imperatív kód (képernyőkép-összevetés világos és sötét módban, a jsdom füstteszt újrafuttatása).

## 8. Megvalósítási állapot

Az 5. fejezet mind az öt lépése elkészült (az ágon: `feature/yaml-descriptor`):

1. **MVP:** `src/spec/parseYaml.ts` (saját YAML-részhalmaz), `registry.ts` (szerkezeti szabályok adatként: `overrides.json`, paraméterek a `meta.generated.ts`-ből), `build.ts` (`buildUI`), `mount.ts` (`mountYaml`), `errors.ts`.
2. **Adat és szerkezet:** `$név` és `${}`, `each` (kulcsolt), `if`/`else`, `define`, `theme`, `messages`.
3. **Állapot:** `store.ts`, `expr.ts` (eval-mentes), kötések a `build.ts`-ben; `state`, `bind`, `set`/`toggle`/`inc`/`push`/`open`/`close` (az útvonal sablon is lehet: `toggle: "active.${c.id}"`), `destroy()`. A frissítő metódussal rendelkező paraméterek (Gantt `rows`, `selectedMilestoneId`) nem építik újra a komponenst.
4. **Eszközök:** `assets/createDOMBlocks.schema.json` generálása a típusokból (`scripts/spec-meta.mjs`, a `gen-props.mjs` hívja), docs oldal élő szerkesztővel (`documentation/examples/yaml.ts`), README.
5. **Éles próba:** a versenyoldal teljes szerkezete és állapotkezelése YAML-ban (`2026-27-competitions-domblocks`, `feature/domblocks-rewrite`).

Tanulságok, amelyek a szintaxisba is visszakerültek: az `each` elemeinek azonossága adja a frissítés finomságát (a JS oldali `derive` ezért tartja meg a változatlan elemeket); a beviteli komponensek gyökere nem azonos az `id`-t viselő `input` elemmel, ezért a nyilvántartás a leíróbeli azonosítót külön követi; a szám / logikai érték a szöveg-paraméterekben szöveggé alakul.
