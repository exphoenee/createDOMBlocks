---
name: yaml-page
description: A felhasználó szöveges leírásából (prompt) elkészíti egy oldal createDOMBlocks YAML leíróját (buildUI / mountYaml), kiegészítve a hozzá szükséges JavaScript kezelőkkel és adatokkal, majd a valódi könyvtárral ellenőrzi, hogy felépül-e. Használd, ha a user oldalt, felületet, dashboardot, űrlapot vagy "page-et" kér leírással ("csinálj egy oldalt, ahol ...", "YAML leíró az oldalról", "írd le YAML-ban"), vagy egy meglévő oldal szerkezetét kell YAML-ba átírni.
---

# YAML oldalleíró készítése leírásból

Cél: a user szabad szövegéből egy **olvasható, ellenőrzött YAML leírás** (és a hozzá tartozó minimális JavaScript), amelyből a createDOMBlocks `buildUI` / `mountYaml` felépíti az egész oldalt. A leíró **opcionális** réteg: ugyanazokat a komponenseket hívja, mint a `createX` függvények.

A részletes szintaxis: `documentation/examples/yaml.ts` (a "YAML leíró" docs oldal), a terv: `plans/yaml-leiro-terv.md`. A paraméterek forrása mindig a generált típusinfó, **ne találj ki paramétert**: használd a katalógus szkriptet.

## Munkamenet

1. **Értsd meg a leírást.** Jegyezd fel: a szekciókat (fejléc, lista, űrlap, panel ...), a megjelenő adatokat, a felhasználói műveleteket (kattintás, beírás, szűrés, váltás), az állapotot (mi változhat), a nyelveket, a témát. Ha lényeges, de hiányzik (pl. milyen adat jelenjen meg, kell-e több nyelv), **kérdezz rá röviden**; minden mást döntsd el értelmes alapértékkel, és írd le az átadáskor.
2. **Válaszd ki a komponenseket.** `node scripts/spec-catalog.mjs` (nevek), `--find szó` (keresés), `node scripts/spec-catalog.mjs Card Gantt` (paraméterek típussal, kötelezőséggel, leírással, rövidítésekkel). Ami nincs komponensként, az nyers HTML elem (kisbetűs név).
3. **Tervezd meg az állapotot és az adatokat.**
   - `state`: ami a felhasználó műveleteitől változik (nyitva-e valami, szűrő, kiválasztott elem, beviteli mezők értéke, listák).
   - `data` (`$név`): kész, nem változó adat, amit a JavaScript ad át.
   - Származtatott érték (szűrt lista, darabszám, formázott szöveg): **a `derive` beállítás** számolja (`buildUI(spec, { derive: { visibleTodos: { deps: ["todos", "filter"], fn: (s) => ... } } })`); a YAML csak megjeleníti. Ne írd vissza kézzel, ne használj `syncing` zászlót vagy JSON-összehasonlítást: a könyvtár csak szerkezeti változásnál ír, és az `each` a változatlan elemeket megtartja, a megváltozottakat helyben frissíti. Összetett számítást ne írj kifejezésbe.
   - Többnyelvű **adat** (pl. `desc: { hu, en }`): `${project.desc[locale]}` — a `locale` az aktuális nyelv, foglalt név (állapot-kulcs nem lehet).
4. **Írd meg a YAML-t** az alábbi szabályok szerint, ments el egy fájlba (pl. `page.yaml`), vagy egy HTML `<script type="text/yaml" id="page">` blokkba.
5. **Ellenőrizd:** `node scripts/validate-spec.mjs page.yaml [--data adat.json] [--state allapot.json] [--strict] [--print]` — HTML-ben lévő leírásnál `node scripts/validate-spec.mjs index.html#page --strict` (a sorszám a HTML-beli sor); ha a leírás a JavaScriptből kapott adatra, kezelőkre vagy `derive`-ra épül, a teljes oldalt futtasd: `node scripts/validate-spec.mjs index.html --run --strict` (a saját szkriptjeivel, `?debug` módban; az oldal a `strict: /[?&]debug\b/.test(location.search)` beállítással jelezze az elírásokat). Előtte `npm run build`, ha nincs friss `dist/`; más buildhez (vendor) `--lib vendor/createDOMBlocks.js`. A kimenet kiírja a hibát útvonallal és javaslattal, `--strict` mellett az elírt neveket / mezőket is, a megírandó `@kezelőket`, az átadandó `$adatokat` és az állapot-kulcsokat. **Javítsd, amíg `OK`.**
6. **Add át:** a YAML-t, a minimális JavaScriptet (`buildUI` / `mountYaml` hívás, `handlers`, `data`, `derive`; fejlesztés közben `strict: true`), és 2-3 mondatban a döntéseket (mit tettél állapotba, mit adatba, mit származtatottba).

## Szintaxis (összefoglaló)

```yaml
# yaml-language-server: $schema=node_modules/createdomblocks/assets/createDOMBlocks.schema.json
state: { count: 0, query: "" }            # kezdőállapot
messages:                                  # nyelvi szövegek (opcionális)
  hu: { app: { title: Címem } }
  en: { app: { title: My title } }
define:                                    # saját, paraméterezhető részlet (opcionális)
  Stat:
    params: [label, value]
    body:
      - div: [ { span: "${label}" }, { strong: "${value}" } ]
ui:
  - Title(1)#page-title.big: { t: app.title }   # Típus(szint)#azonosító.osztály
  - Card#counter:
      title: Számláló                      # skalár rövidítés: a fő szöveg (Card: title)
      body:                                # lista = gyerekek
        - Paragraph: "Kattintások: ${count}"
        - Button: { text: Növel, click: { inc: count } }
```

- **Csomópont = egy kulcs.** Nagybetű = könyvtári komponens (`Card`, `Button`, `Gantt` ...), kisbetű = nyers HTML elem (`div`, `section`, `a`, `span` ...): ott a `text` a szöveg, a `children` (vagy a lista érték) a gyerek, a `style` szöveg vagy térkép, az ismeretlen kulcs attribútum (`href`, `title`, `data-x`), az eseménynevek (`click`, `change`, `input`) eseménykezelők, a `html:` nyers HTML (csak megbízható szöveg).
- **Rövidítések:** `Button: Mentés` (skalár = fő szöveg), `Card: [ ... ]` (lista = `body`; Tabs: `tabs`, listák: `items`, Table: `data`, egyébként `children`), `Title(2)` (szint), `#id`, `.osztály`.
- **Gyerek-paraméterek komponensenként:** Card `body` / `footer`, Container és Grid `children`, Modal `body`, Tabs `tabs[].content`, Accordion `items[].content`, Drawer `children`. A pontos lista: `spec-catalog`.
- **Kifejezések:** `"szöveg ${x}"` az állapotból / adatból olvas (idézőjelben legyen a YAML-ben); ha az egész érték egy kifejezés, a nyers érték jön (szám, lista). Megengedett: literálok, útvonalak (`a.b[0]`), `+ - * / %`, `== != < <= > >=`, `! && || ??`, `?:`, és `len upper lower trim join round min max str plural`. Más nem (nincs `eval`, nincs függvényhívás).
- **Állapot:** a `${}` kifejezések az állapot változásakor magukat frissítik. `bind: kulcs` kétirányú kötés beviteli mezőn (TextInput, Textarea, Select, Checkbox, Radio, RangeInput, NumberInput, DateInput ... és nyers `input`).
- **Szerkezet:** `each: { in: "${lista}", as: elem, key: elem.id }` + `do: [...]`; `if: "${feltétel}"` + `then:` + `else:`; `define` + a név használata.
- **Események:** `"@kezelő"` (JavaScript `handlers`), vagy beépített művelet: `set: { kulcs: érték }`, `toggle: kulcs`, `inc: kulcs` / `{ kulcs: n }`, `push: { lista: elem }`, `open: azonosító`, `close: azonosító` (Modal, Drawer); listában egymás után futnak; az útvonal sablon is lehet: `toggle: "active.${competition.id}"`.
- **Nyelv:** `messages` + `t: kulcs` (+ `args: { count: 3 }`), a szöveg a nyelvváltáskor frissül. HTML-t tartalmazó fordítás nyers elemen: `{ t: kulcs, html: true }` (csak saját nyelvi fájlból). Adatban tárolt többnyelvű szöveg: `${item.desc[locale]}`.
- **Attribútumok bármelyik csomóponton:** `attrs: { data-testid: send, aria-label: ..., aria-pressed: "${on}" }` (komponensen is; az állapotfüggő érték helyben frissül; `on*` tilos, eseményhez `"@kezelő"`).
- **Felépülés után futó kód:** `onMount: "@kezelő"` (a kezelő `el` mezője a kész elem; animáció, külső könyvtár bekötése, képbetöltő). Az `each` minden új elemére lefut.
- **Mit tud a komponens a leíróban** (kötés, újraépítés nélküli frissítés, gyerek-helyek, visszahívások): a docs komponens-oldalának „YAML-ban” doboza, vagy `spec-catalog Név`. A teljes kulcsszó-lista: `src/spec/keywords.json`.
- **Téma:** `theme: { primary: "#...", dark: { primary: "#..." } }` (CSS-változók); egy részre szűkítve a konténer `style: "--primary:#..."`.

## Olvashatósági szabályok (kötelező)

A leírást emberek olvassák és tartják karban, ezért:

- **Beszédes nevek mindenhol.** Az `each` változója teljes szó (`competition`, `event`, `person`, `link`, `file`), soha `c`, `e`, `d`, `i`, `l`. Az állapot- és adatkulcsok is teljes szavak (`selectedEvent`, `timelineRows`, `upcomingText`), a logikai mezők `has...` / `is...` / `can...` előtagúak, a CSS-osztályt hordozó mezők `cssClass` / `...Class`, a színváltozók `colorStyle`. A `define` paraméterei is beszédesek (`event`, `person`).
- **Azonosítók kebab-case-ben, leíróan:** `#competition-filters`, `#theme-toggle-button`, `#event-modal`.
- **Szakaszolás és megjegyzés.** `# ===== Fejléc =====` típusú fejlécek, a bonyolultabb részeknél egysoros magyarázat. A fájl tetején megjegyzésben az **állapot és az adatok leírása** (forrás- és származtatott kulcsok, mit ír és ki olvassa).
- **Blokk-forma a hosszú térképeknek.** Egysoros flow forma (`{ a: 1, b: 2 }`) csak rövid, 2-3 kulcsú értéknél; különben minden kulcs külön sorba. Egységes, 2 szóköz behúzás; tabulátor tilos.
- **Ne ismételd magad:** ami háromszor előfordul, azt `define`-nal vagy `each`-csel oldd meg.
- **A logika nem a YAML-ben él.** Számítás, szűrés, formázás, hálózat: JavaScript (kezelő vagy származtatott állapot); a YAML csak a nézet és az egyszerű állapotváltások.

## Tipikus hibák és megoldásuk

| Tünet | Ok / megoldás |
|-------|---------------|
| `ismeretlen komponens: Buton` | elgépelés; a javaslatot a hibaüzenet adja |
| `ismeretlen paraméter` | nézd meg a `spec-catalog` kimenetét; a gyerek-paraméter nevét (body, children, tabs) ellenőrizd |
| `egy csomópont egy kulcsot tartalmazhat` | rossz behúzás: a testvér kulcs a lista elemén belül maradt |
| `ismeretlen eseménykezelő` | a `@név` nincs a `handlers`-ben: add át, vagy használj beépített műveletet |
| `hiányzó kötelező paraméter` | pl. Link `href`, Select `options`, Alert `message` |
| `ismétlődő azonosító` | az `#id` egyedi legyen; each-ben `#név-${elem.id}` |
| a szám üresen jelenik meg | szöveg-paraméterben a szám szöveggé alakul; nyers elemnél `text: "${n}"` kell idézőjellel |
| a lista nem frissül | tömb elemét **cseréld** (`set("lista.1", új)`), ne módosítsd helyben |
| egy mező csendben üres | elírt név (`${event.hasLnk}`): futtasd `--strict`-tel, vagy `buildUI(..., { strict: true })`; a figyelmeztetés javasol |
| `származtatott állapot (derive), kézzel nem írható` | a `derive` kulcsot ne `set`-eld; a forrását (`deps`) módosítsd |
| `a "locale" név foglalt` | az aktuális nyelv neve; az állapot-kulcsot nevezd át (pl. `uiLanguage`) |
| `eseménykezelő nem adható meg attribútumként` | `attrs`-ban nincs `onclick`; használj `click: "@kezelő"`-t |
| `${...}` nem fut le | idézőjel hiányzik: `text: "${x}"`, nem `text: ${x}` (a YAML kapcsos zárójelet értelmez) |

## Korlátok

Nincs horgony / alias / címke / több dokumentum / többsoros sima szöveg a YAML-ban (a `|` és `>` blokk-szöveg működik). Az `each` / `if` a Tabs, Accordion és Drawer tartalmában csak egyszer értékelődik ki. Egy beviteli komponens `#id`-je a dobozra mutat (`ui.get(id)`), a benne lévő `input` id-je ugyanaz a DOM-ban.

## Átadás

A kész munkát így add át: (1) a `page.yaml` tartalma, (2) a JavaScript (`buildUI` + `handlers` + `data` + származtatott állapot, ha van), (3) hogyan töltsd be (`<script type="text/yaml" id="page">` + `mountYaml("#app", "#page")`, ez `file://` alól is működik), (4) a nem egyértelmű döntések listája.
