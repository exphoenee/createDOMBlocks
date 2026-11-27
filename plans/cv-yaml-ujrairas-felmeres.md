# Terv: a `cv` oldalainak átírása a YAML leíróra (implementáció)

> A szükséges könyvtári komponensek és leíró-bővítések elkészítése **nem része** ennek a tervnek, azok a `plans/hianyzo-komponensek-terv.md`-ben vannak (azonosítóik: A1–A4, B1–B4, C1–C7). Ez a terv a `C:\Projects\cv` oldalainak átírását írja le a kész komponensekkel.

## Állapot

Jelölés: `[ ]` nincs elkezdve, `[~]` folyamatban, `[x]` kész. Zárójelben a szükséges komponens-tételek (`plans/hianyzo-komponensek-terv.md`).

- [ ] 0. Előkészítés: vendor + szinkronszkript, `CLAUDE.md` kivétel, `i18n-bridge.js`, Playwright alapvonal (A1, A2)
- [ ] 1. Közös keret: fejléc, téma, nyelvváltó, toast, hire- és booking-modál, zenelejátszó (C4, C5, C6, B3)
- [ ] 2. plain és index nézet (B1, A3)
- [ ] 3. gantt nézet, sor-átrendezés (B4)
- [ ] 4. swagger nézet (A1)
- [ ] 5. scrumboard nézet (C2)
- [ ] 6. json nézet (C7)
- [ ] 7. szabályok, skillek, README, `CLAUDE.md`
- [ ] Ellenőrzés: Playwright zöld mind a 7 oldalon, `/locale-check`, vizuális összevetés, `/cv-backup` + `/cv-restore` próbakör
- [ ] Nyitott kérdések megválaszolva (7. fejezet)

## 1. Kiindulópont

| Terület | Jelenleg |
|---|---|
| Technológia | Statikus oldal, build és keretrendszer nélkül (tiltott: webpack, vite, React stb.), ES modulok, HTTP szerver kell. |
| Adat | `cv/cv-data.js` (`CV_DATA`) az egyetlen igazság; nyelvenkénti tartalom-felülírás `cv/locales/<lang>.js` (`content`), UI-címkék `cv/locales/<lang>-page.js` (`labels`). 12 nyelv. |
| Nézetek | index (carousel), plain, gantt, scrumboard, swagger, json, game. |
| Renderelés | Sablon-stringek és `innerHTML`, a `localechange` eseményre teljes újrarajzolás. |
| Közös elemek | `shared.js` (1259 sor): hire- és booking-modál, toast, téma, zenelejátszó HTML-je, állapotmentés. |
| Tesztek | Playwright, `tests/cv-modals.spec.js`: mind a 7 oldalon a hire- és booking-modál, fix ID-kkal. |
| AI-folyamatok | `.claude` skillek és agentek, `cv-ledger.py` a `cv-data.js` és a tartalmi locale-fájlok fejlécmarkerével. |

**Cél:** a hat nem-játék nézet szerkezete YAML-ban, a logika (adat-előkészítés, beküldés, mentés) JS-ben. A játék (`cv-game`) nem változik, csak a közös keretet (modálok, zene, téma) kapja meg.

## 2. Rögzített döntések

1. **Vendorolt könyvtár.** `vendor/createDOMBlocks.{js,css,schema.json}`, a competitions-ben használt `scripts/sync-domblocks.mjs` mintájára. Ez statikus erőforrás, nem build, ezért a `CLAUDE.md` „no bundler” szabályával összefér. A kivételt a `CLAUDE.md` rögzíti.
2. **Az adatfájlok formátuma nem változik.** A `cv/cv-data.js` és a tartalmi `cv/locales/<lang>.js` fájlokat az AI-folyamatok (`cv-ledger.py`, `/job-apply`, `/cv-improver`, `/cv-restore`, validátorok) szerkesztik. Ezek érintetlenek maradnak.
3. **A UI-címkék a könyvtár i18n-jébe kerülnek, a fájlok helye marad.** A `*-page.js` fájlok továbbra is JS-modulok (a `/locale-check` és a validátor ismeri őket). Induláskor egy híd `registerMessages(lang, labels)`-szel tölti be őket, a YAML `t:` kulcsokkal hivatkozik rájuk.
4. **A YAML az oldal HTML-jében él:** `<script type="text/yaml" id="page">`, `mountYaml('#page', { handlers, data })`.
5. **A meglévő ID-k megmaradnak** (`#hire-plain-btn`, `#plain-booking-btn` …) az `attrs` / `#id` segítségével (A1), így a Playwright-tesztek változatlanul futnak és regressziós hálót adnak.
6. **Származtatott adat a könyvtár `derive` beállításával** (A6), szerkezeti egyenlőségre építő `each`-csel (A5), így nincs `stable()` és `syncing` zászló. Fejlesztés közben `strict: true` (A7), a CI-ban `validate-spec cv-*.html#page` (A8).
7. **CRLF.** Minden új és módosított fájl CRLF (`.editorconfig`), a vendor-szinkron szkript is CRLF-et ír.

## 3. Célszerkezet

```
cv/
├── vendor/createDOMBlocks.{js,css,schema.json}   ← sync-domblocks.mjs tölti
├── scripts/
│   ├── app/
│   │   ├── boot.js          ← közös indítás: i18n-híd, téma, idempotens start
│   │   ├── i18n-bridge.js   ← *-page.js → registerMessages, nyelvváltás → localStorage + <html lang>
│   │   ├── derive.js        ← CV_DATA + locale.getData() → nézetenként kész listák
│   │   ├── handlers.js      ← közös handlerek (hire/booking beküldés, toast, nyomtatás)
│   │   └── layout.yaml.js   ← a közös keret (fejléc, modálok, zene) YAML-szövegként, define-okkal
│   ├── cv-plain.js …        ← nézetenként: data + handlers + mountYaml
│   ├── shared.js            ← fokozatosan fogy; a beküldési logika marad (Turnstile, MX, tiltott szavak)
│   └── game/**              ← változatlan
└── cv-*.html                ← <head> + <script type="text/yaml" id="page">
```

A közös keret (hire- és booking-modál, zene, téma, nyelvváltó) egyszer, `define`-okkal készül, és minden nézet hivatkozik rá. Nézetenként csak a prefix és a gombok ID-ja változik.

```yaml
define:
  HireModal:
    params: [prefix, subject]
    body:
      - Modal#${prefix}-modal:
          title: { t: hireTitle }
          body:
            - Form#${prefix}-form:
                fields: "${hireFields(prefix)}"
                onSubmit: "@submitHire"
```

```js
// scripts/app/boot.js
let started = false;
export function boot(start) {
  const run = () => { if (started) return; started = true; start(); };   // idempotens (bővítmények kétszer is lefuttathatják)
  document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', run) : run();
}
```

## 4. Szakaszok

### 0. szakasz: előkészítés (0,5–1 nap)

- `vendor/` és a szinkronszkript, a `CLAUDE.md` kivétel-bejegyzése.
- `i18n-bridge.js`: a 12 `*-page.js` betöltése `registerMessages`-szel; a `locale.setLang` és a könyvtár `setLocale` összekötése (a `localStorage` `cv_lang` kulcsa marad).
- A Playwright-tesztek lefuttatása a mostani állapoton (alapvonal).

**Előfeltétel:** A1, A2.

### 1. szakasz: közös keret (2–3 nap)

- Fejléc, téma, nyelvváltó, toast, betöltésjelző YAML-ban. A nyelvváltó a 12 nyelvvel `LocaleSwitcher` (C4) legördülő módban, a téma `ThemeToggle` (C5) az extra témákkal (`superdark`, `nightvision`, `predator` csak a plain nézetben), a `themeBootstrapScript()` a `<head>`-be.
- Hire- és booking-modál `define`-ként. A beküldés, a Turnstile, az MX-ellenőrzés és a tiltott szavak a meglévő `shared.js` függvényeit hívják a handlerekből, nem íródnak újra. A booking időpontválasztója a `SlotPicker` (C6).
- Zenelejátszó: `MusicPlayer` (B3) `storageKey`-jel (a mostani `cv-music-*` kulcsok helyett egy kulcs, a régi értékek egyszeri átvételével), `playlistMode: select` a 19 számhoz, Spotify- és dalszöveg-gomb `actions`-ként. A „csak egy helyen lehet a lejátszó” szabály nézetenként a `define` paraméterével dől el.

**Előfeltétel:** A1, A2, C4, C5, C6, B3.

### 2. szakasz: plain és index (2 nap)

- **plain**: szekciók `each`-csel (`workExperience`, `projects`, `skills`, `education`, `community`), a mobil beállítás-panel `Drawer`. A nyomtatás (`@media print`) a meglévő CSS-ből megy.
- **index**: a hat nézet kártyája `Carousel` (B1), a gombok és a lábléc YAML-ban.

```yaml
- section.cv-section:
    - Title(2): { t: workExperience }
    - each: { in: "${jobs}", as: job, key: job.id }
      do:
        - article.work-item:
            - Title(3): "${job.title}"
            - p.work-company: "${job.company} · ${job.periodLabel}"
            - UnorderedList: { items: "${job.bullets}" }
```

**Előfeltétel:** B1 (index), A3 a nyelvfüggő mezőkhöz.

### 3. szakasz: gantt (2 nap)

- A meglévő `createGantt` (`rows` updaterrel) a `derive.js`-ből kapott sorokkal; a részletpanel `Drawer` vagy oldalsáv; a kapcsolat-popup `Modal`.
- Sor-átrendezés: `reorderable: true` (B4), az új sorrend `onReorder` handlerben `localStorage`-ba.
- A skill-chipek átrendezése alacsony prioritású: ha kell, a `Sortable` (C1) közvetlenül a chip-listán.

**Előfeltétel:** B4 (és ezzel C1).

### 4. szakasz: swagger (2–3 nap)

- A 4405 soros `cv-swagger.html` kézi markupja `each`-ekből generálódik: tag-szekció = `Accordion`, végpont-blokk = `define: Endpoint` (fejléc, paramétertábla `Table`-lel, válaszok, „Hire” gomb).
- A swagger-kinézet a meglévő `cv-swagger.css`-ből jön (az osztálynevek megtartásával), így a CSS nem íródik újra.

```yaml
- each: { in: "${apiTags}", as: tag, key: tag.id }
  do:
    - Accordion.opblock-tag-section:
        items:
          - title: "${tag.name}"
            content:
              - each: { in: "${tag.endpoints}", as: ep, key: ep.id }
                do: [ { Endpoint: { endpoint: "${ep}" } } ]
```

**Előfeltétel:** A1 (a megtartott osztályok és ID-k).

### 5. szakasz: scrumboard (2 nap)

- `Board` (C2): oszlopok és kártyák a `derive.js`-ből (a mostani `CARD_COLORS` és `COMMUNITY_ROW` oda kerül), a skeleton kártya az üres oszlop `emptyHint`-je, a mozgatás `onMove` handlerben mentve.

**Előfeltétel:** C2.

### 6. szakasz: json-nézet (1,5–2 nap)

- `CodeView` (C7) a `CV_DATA` formázott JSON-jával, `storageKey`-jel az összecsukott blokkokhoz. A menü- és modálkeret az 1. szakaszból jön.

**Előfeltétel:** C7.

### 7. szakasz: szabályok, skillek, dokumentáció (1–2 nap)

- `.claude/rules/new-view.md`, `shared-api.md`, `script-placement.md`, `aria-labels.md`: az új minta (YAML + `derive.js` + handlerek), a régi `innerHTML`-es sablonok kivezetése.
- `code-review` és `arch-review` skill: a YAML-oldalakra vonatkozó ellenőrzések (`node scripts/validate-spec.mjs`, `t:` kulcsok mind a 12 nyelvben).
- `README.md`, `README-hu.md`, `CLAUDE.md`: vendor-szinkron, YAML-szerkezet.
- A `yaml-page` skill használata új nézetekhez.

## 5. Ellenőrzés

- **Playwright** (`npm test`): a `cv-modals.spec.js` mind a 7 oldalon zöld, szakaszonként futtatva.
- **YAML-validálás:** minden nézet leírója átmegy a `validate-spec`-en (a vendorolt sémával).
- **Nyelv:** `/locale-check` hibátlan, a 12 nyelv váltása minden nézeten frissít, és nem rajzol újra mindent (a fókusz és a görgetés megmarad).
- **Vizuálisan:** képernyőkép-összevetés régi/új minden nézeten, világos, sötét és az extra témákban, mobil és asztali szélességen, valamint a nyomtatási előnézet (plain).
- **Adat-folyamatok:** egy `/cv-backup` + `/cv-restore` próbakör után a nézetek ugyanazt mutatják (a `cv-data.js` formátuma nem változott).

## 6. Kockázatok

1. **A modálok beküldési logikája** érzékeny kód. Csak a külseje kerül YAML-ba, a meglévő függvényeket a handlerek hívják.
2. **AI-folyamatok:** a tartalmi locale-fájlokhoz és a `cv-data.js` szerkezetéhez nem nyúlunk.
3. **Teljesítmény:** 12 nyelv × nagy adat. A kulcsolt `each` és az updaterek miatt nincs teljes újrarajzolás, de első betöltést és nyelvváltást mérni kell.
4. **Letöltési méret:** a vendorolt könyvtár minden nézetben betöltődik (+100–200 KB).
5. **Párhuzamosság a dev-portfolio-val:** a közös keret (hire/booking, téma, nyelvváltó) mindkét projektben ugyanazokra a komponensekre épül. Érdemes a cv-ben elkészülő `define`-okat a portfólió is átvegye.

## 7. Nyitott kérdések

1. Mind a hat nézet átkerül, vagy a json és a scrumboard egyelőre marad (és velük a C2 és C7 is halasztható)?
2. A hire- és booking-modál prefixes ID-i maradjanak (a Playwright-tesztek miatt), vagy a tesztek egyszerűsíthetők egységes ID-kra?
3. A zenelejátszó mentett állapotát (régi `cv-music-*` kulcsok) át kell-e venni, vagy elég az új kulcsra indulni?
