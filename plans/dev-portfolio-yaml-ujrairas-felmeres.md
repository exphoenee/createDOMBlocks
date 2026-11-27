# Terv: a `dev-portfolio` átírása a YAML leíróra (implementáció)

> A szükséges könyvtári komponensek és leíró-bővítések elkészítése **nem része** ennek a tervnek, azok a `plans/hianyzo-komponensek-terv.md`-ben vannak (azonosítóik: A1–A4, B1–B4, C1–C7). Ez a terv a `C:\Projects\dev-portfolio` oldalának átírását írja le a kész komponensekkel.

## Állapot

Jelölés: `[ ]` nincs elkezdve, `[~]` folyamatban, `[x]` kész. Zárójelben a szükséges komponens-tételek (`plans/hianyzo-komponensek-terv.md`).

> Megvalósítás: dev-portfolio `feature/yaml-rewrite` ág (commit `a7b8b78`, nincs feltöltve). Rögzített döntések az implementáció közben:
> - A teljes `<body>` a YAML-ból épül (a hero is), a `<head>` kézi HTML maradt.
> - **A könyvtár CSS-ét nem töltjük be**: a portfólió kinézetét kizárólag a `styles/` adja. Ok: osztálynév-ütközések (`.btn`, `.modal`, `.card-body`, `.theme-toggle`, `.timeline-*`, `.carousel-*`) és a könyvtár alap-resetje. Ezért a leíró a portfólió saját jelölését és osztályait használja nyers elemekkel; könyvtári komponens csak a `Carousel` (a portfólió globális carousel-CSS-e illeszkedik a jelölésére, `--drag-x` → `--carousel-drag` alias, `arrowIcons`). A `ThemeToggle`, `LocaleSwitcher`, `SegmentedControl`, `Timeline` saját kinézetű megfelelője marad nyers elemekkel (pixelpontos egyezés). Ez a cv-nél is érvényes tanulság (lásd a komponens-terv „CSS-névtér” tételét).
> - DOM-alapvonal: a jsdom ES-modult nem futtat, ezért az alapvonal és az összevetés böngészőben készült (elemszámok, szűrők, nézetek, nyelvváltás, modálok) — minden egyezett.

- [x] 0. Előkészítés: vendor + szinkronszkript, alapvonal (böngészőben), `i18n-bridge.js` (A1, A2, A3)
- [x] 1. Keret: navbar, nyelvváltó, téma, footer (nyers elemek a portfólió osztályaival; vissza-felülre statikus maradt)
- [x] 2. Hero (terminál, showcase, gépelő effekt; `onMount`)
- [x] 3. Projektek: szűrők, nézetváltó, kártyák, carousel (`Carousel` + `each` a slotban, fülek helyben frissülnek)
- [x] 4. Skillek, idővonal, kapcsolat
- [ ] 5. Modálok: képnagyító, hire, booking (C6)
- [ ] 6. Takarítás, CI (`validate-spec`, A8), README
- [ ] Ellenőrzés: `npm run verify` + DOM-teszt zöld, Lighthouse előtte/utána, böngészős ellenőrzés (6 nyelv, téma, mobil), megosztási előnézet
- [ ] Nyitott kérdések megválaszolva (7. fejezet)

## 1. Kiindulópont

| Terület | Jelenleg |
|---|---|
| Technológia | Statikus oldal, build és függőség nélkül, ES modulok, GitHub Pages (Actions: `npm run check` + `npm test`, majd deploy), HTTP szerver kell. |
| Oldal | Egyetlen `index.html`: navbar, hero (terminál + showcase), projektek, skillek, idővonal, kapcsolat, footer, 3 modál (hire, booking, képnagyító). |
| Adat | `data/portfolio-data.js`: `PROJECTS` (kb. 25, leírások 6 nyelven, `functional` + `technical`), `TIMELINE`, `SKILLS`, `CONTACT`. |
| Nyelvek | 6 nyelv; UI-címkék `data/locales/*-page.js`; nyelv a `?lang=`-ből, `localStorage`-ból vagy a böngészőből, váltáskor URL-frissítés. |
| JS | 25 modul (`render/`, `ui/`, `modals/`), kb. 3200 sor. |
| Tesztek | `node --test`: nyelvi kulcsok, adatintegritás, képek, tiltott szavak. Nincs DOM-teszt. |

**Cél:** a `<body>` szerkezete YAML-ban, a logika (adat-előkészítés, animációk, beküldés) JS-ben. A `<head>` (meta, JSON-LD, `hreflang`, téma-bootstrap) kézzel írt HTML marad.

## 2. Rögzített döntések

1. **A `<head>` statikus marad.** A keresők és a megosztás-előnézetek a metaadatokat így JS nélkül is megkapják. A nyelvfüggő meták (`<title>`, `og:description`, `og:locale`) frissítése nyelvváltáskor handlerben történik.
2. **Vendorolt könyvtár** (`vendor/createDOMBlocks.{js,css,schema.json}` + szinkronszkript). A CI továbbra sem igényel `npm install`-t.
3. **Az adatfájl nem változik.** A `data/portfolio-data.js` és a `*-page.js` marad, ezért a meglévő `tests/data.test.mjs` változatlanul érvényes.
4. **A többnyelvű adat feloldása JS-ben** (`scripts/app/derive.js`), a YAML a kész listát kapja. Egyszerű mezőknél (kártyaleírás) a `${p.desc[locale][tab]}` kifejezés (A3) is elég.
5. **Származtatott adat a könyvtár `derive` beállításával** (A6), szerkezeti egyenlőségre építő `each`-csel (A5); fejlesztés közben `strict: true` (A7); a CI `npm run check` lépése a `validate-spec index.html#page`-et is futtatja (A8).
6. **Nyelvváltás újrarajzolás nélkül:** a `t:` kötések és a kulcsolt `each` (`p.id`) helyben frissítenek, a betöltött képek, a fókusz és a görgetés megmarad (ahogy ma is).

## 3. Célszerkezet

```
dev-portfolio/
├── vendor/createDOMBlocks.{js,css,schema.json}
├── index.html                 ← <head> változatlan + <script type="text/yaml" id="page">
├── scripts/
│   ├── main.js                ← boot (idempotens) + mountYaml('#page', { data, handlers })
│   ├── app/
│   │   ├── i18n-bridge.js     ← *-page.js → registerMessages; nyelvváltás → URL ?lang=, localStorage, <html lang>, metak
│   │   ├── derive.js          ← PROJECTS/SKILLS/TIMELINE → nyelvre feloldott, szűrt listák
│   │   └── handlers.js        ← szűrés, nézetváltás, képnagyító, hire/booking beküldés, reveal
│   ├── modals/{hire,booking,turnstile,form-guards}.js   ← beküldési logika, marad
│   ├── ui/{typed,reveal,stats,scrollspy,showcase,image-loader}.js   ← viselkedések, maradnak
│   └── render/                ← kivezetésre kerül (a YAML veszi át)
└── tests/
    ├── data.test.mjs          ← változatlan
    └── dom.test.mjs           ← új jsdom füstteszt
```

## 4. Szakaszok

### 0. szakasz: előkészítés és alapvonal (1 nap)

- `vendor/` + szinkronszkript; `README` frissítés.
- **Alapvonal-teszt a mostani oldalra** (`tests/dom.test.mjs`, jsdom, `node --test`): navbar-linkek, 6 nyelvgomb, projektkártyák száma szűrőnként, tabváltás, nézetváltás, modálok nyitása, nyelvváltás utáni szövegek. Ugyanezt a tesztet kell zöldre hozni az átírás után.
- `i18n-bridge.js`: a `LocaleManager` viselkedése (URL > `localStorage` > böngésző) a könyvtár `setLocale`-jére kötve.

**Előfeltétel:** A1, A2, A3.

### 1. szakasz: keret (1–2 nap)

- Navbar (linkek, hamburger), nyelvváltó `LocaleSwitcher` (C4, `mode: auto`, 768 px), `ThemeToggle` (C5; a `<head>` meglévő bootstrap-szkriptje marad, vagy `themeBootstrapScript()`-re cserélődik), footer, vissza-felülre gomb.
- A `scrollspy` és a hamburger viselkedése `onMount` (A4) horogból indul.

```yaml
- header.navbar:
    - div.nav-inner:
        - a.logo: { t: logo, html: true, href: "#home" }
        - nav#nav-links.nav-links:
            attrs: { aria-label: Main navigation }
            children:
              - each: { in: "${navItems}", as: item }
                do: [ { a: { t: "${item.key}", href: "${item.href}" } } ]
        - div.nav-controls:
            - LocaleSwitcher#lang: { mode: auto, locales: "${languages}", onChange: "@syncLang" }
            - ThemeToggle#theme-toggle: { storageKey: portfolio-theme, themes: [dark, light] }
```

**Előfeltétel:** A1, A2, A4, C4, C5.

### 2. szakasz: hero (1 nap)

- Jelvény, cím, leírás, gombok YAML-ban (`data-open-hire` / `data-open-booking` `attrs`-szal vagy közvetlen `click` műveletekkel).
- A gépelő effekt (`typed.js`) és a showcase (`showcase.js`) `onMount`-ból indul; a terminál sorai `${...}` kifejezések a `derive.js`-ből (projektszám, ls-sorok).

### 3. szakasz: projektek (2 nap)

- Szűrők és nézetváltó: `SegmentedControl` (C3). A szűrők `mode: toggle` (aria-pressed), a nézet `mode: radio`, `bind`-del a `state`-re.
- Kártya: `define: ProjectCard` (kép gomb a nagyítóhoz, kategória-jelvények, `Tabs` funkcionális/technikai füllel, tech-címkék, linkek).
- Carousel nézetben `Carousel` (B1) a `setSlides` updaterrel (szűréskor nem épül újra), rács nézetben kulcsolt `each`.
- A reveal-animáció és a képbetöltők `onMount`-ból (A4).

```yaml
state:
  projectFilter: all
  projectsView: carousel     # handler tölti a localStorage-ból

ui:
  - SegmentedControl#projectFilters:
      mode: toggle
      bind: projectFilter
      options: "${filterOptions}"
  - if: "${projectsView == 'carousel'}"
    then:
      - Carousel#projectsCarousel:
          slides: "${projectSlides(projectFilter)}"
          slideWidth: 340px
    else:
      - div#projects-grid.projects-grid:
          onMount: "@revealCards"
          children:
            - each: { in: "${filteredProjects(projectFilter)}", as: p, key: p.id }
              do: [ { ProjectCard: { project: "${p}" } } ]
```

**Előfeltétel:** A3, A4, B1, C3.

### 4. szakasz: skillek, idővonal, kapcsolat (1–1,5 nap)

- Skillek: csoportonként `Card` + chipek; carousel/rács váltó ugyanazzal a `SegmentedControl` + `Carousel` párossal.
- Idővonal: `Timeline` (B2), `compact` updaterrel a részletes/tömör váltóhoz; az elemek nyelvváltáskor `setItems`-szel frissülnek.
- Kapcsolat-kártyák: `each` a `CONTACT`-ra, az ikon `html:`-lel; a hire/booking kártyák `click` műveletei a modálokat nyitják.

**Előfeltétel:** B2, C3.

### 5. szakasz: modálok (2 nap)

- Képnagyító: `Modal` + `Image`, a nyitás handlerből (`openModal('image-modal')`).
- Hire: `Modal` + `Form` YAML-ban; a beküldés, a Turnstile, az MX-ellenőrzés, a tiltott szavak és a napi korlát a meglévő `modals/hire.js` függvényeit hívja.
- Booking: a lépések `state` + `if` (`pick` → `form` → `confirm` / `error` / `cooldown`), a nap- és időpontválasztó `SlotPicker` (C6) a meglévő Google Apps Script-betöltővel (`loadSlots`).

**Előfeltétel:** C6.

### 6. szakasz: takarítás, CI, dokumentáció (1 nap)

- A `scripts/render/` modulok és a `index.html` kézi markupja kivezetve.
- `tools/check-syntax.mjs` mellé a YAML-validálás (`vendor/validate-spec.mjs index.html#page`, A8) a `npm run check`-be, így a CI is ellenőrzi.
- `README`: új szerkezet, vendor-szinkron, a YAML szerkesztése.

## 5. Ellenőrzés

- `npm run verify` (szintaxis + adat-tesztek) és az új `tests/dom.test.mjs` zöld.
- **Lighthouse** előtte és utána (teljesítmény, hozzáférhetőség, SEO); a cél: legfeljebb kismértékű romlás a teljesítményben, a SEO és a hozzáférhetőség nem romlik.
- **Böngészőben:** a 6 nyelv váltása (az URL `?lang=` frissül, a fókusz és a betöltött képek megmaradnak), világos és sötét téma villogás nélkül, mobil (legördülő nyelvváltó, hamburger) és asztali nézet, billentyűzettel a tabok, a carousel és a modálok.
- **Megosztási előnézet:** az `og:*` és a JSON-LD változatlan (a `<head>` nem változott).

## 6. Kockázatok

1. **SEO:** a hero és a szekciócímek JS-ből épülnek. A `<head>` metái megmaradnak, de a törzsszöveg indexelése a Google JS-renderelésére hagyatkozik. Ha ez nem elfogadható, a hero statikus HTML-ben marad, és csak a többi szekció kerül YAML-ba.
2. **Méret és teljesítmény:** a vendorolt könyvtár (+100–200 KB) egy eddig függőségmentes oldalon. Lighthouse-mérés dönt.
3. **Villogás:** a témát a `<head>` szkriptje dönti el festés előtt. A YAML-törzs felépüléséig egy egyszerű betöltésjelző kell.
4. **Közös keret a cv-vel:** a hire- és booking-modál, a nyelvváltó és a téma mindkét projektben ugyanazokra a komponensekre épül. A cv-ben készülő `define`-ok átvétele csökkenti a munkát.

## 7. Nyitott kérdések

1. A hero statikus HTML-ben maradjon (SEO, azonnali festés), vagy elfogadható a JS-ből épített törzs?
2. Elfogadható a vendorolt könyvtár mérete az eddig függőségmentes oldalon?
3. A portfólió átírása a cv előtt induljon (kevesebb előfeltétel, gyorsabb visszajelzés a komponensekről), vagy utána, a cv-ben elkészült közös `define`-okkal?
