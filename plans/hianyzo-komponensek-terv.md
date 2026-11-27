# Terv: a cv és a dev-portfolio YAML-átírásához hiányzó komponensek és leíró-képességek

> Forrás: `plans/cv-yaml-ujrairas-felmeres.md` és `plans/dev-portfolio-yaml-ujrairas-felmeres.md`.
> Ez a terv **csak a createDOMBlocks könyvtár** munkáját írja le. A két oldal átírása (az implementáció) külön tervben van, és erre a tervre épül.

## Állapot

Jelölés: `[ ]` nincs elkezdve, `[~]` folyamatban, `[x]` kész (a 7. fejezet kész-definíciója szerint: típusok, JSDoc, feliratok, `overrides.json`, teszt, docs példa, böngészős ellenőrzés).

**A. Leíró**
- [x] A1 `attrs` komponens-csomóponton (és `on*` tiltás nyers elemen is; `aria-*` logikai érték "true"/"false" szöveg)
- [x] A2 nyelvesített HTML-szöveg (`t` + `html: true`, nyers elemen)
- [x] A3 `locale` a kifejezésekben (belső útvonal: `$locale`; a `locale` állapot-kulcs tiltott)
- [x] A4 `onMount` életciklus-horog
- [ ] A5 `each`: tartalom szerinti újrahasznosítás (1. lépés: szerkezeti egyenlőség; 2. lépés: helyben frissítés)
- [ ] A6 származtatott állapot (`derive`)
- [ ] A7 elírt útvonalak jelzése (`strict`)
- [ ] A8 beágyazott YAML ellenőrzése (`validate-spec <html>#page`, vendorolható)
- [ ] A9 a leíró-tesztek kiegészítve

**B. Meglévő komponensek**
- [ ] B1 Carousel: dia-tartalom YAML-ból, `setSlides`, `goTo`
- [ ] B2 Timeline: `setCompact`, `setItems`
- [ ] B3 MusicPlayer: `storageKey`, `playlistMode`, `actions`
- [ ] B4 Gantt: `reorderable`, `onReorder`

**C. Új komponensek**
- [ ] C1 Sortable viselkedés
- [ ] C2 Board (Kanban)
- [ ] C3 SegmentedControl
- [ ] C4 LocaleSwitcher
- [ ] C5 ThemeToggle + `themeBootstrapScript()`
- [ ] C6 SlotPicker
- [ ] C7 CodeView

**Kiadás**
- [ ] a 8. fejezet kockázatainak felülvizsgálata (csomagméret mérve, extras belépési pont kell-e)
- [ ] a competitions vendor-szinkronja és smoke-tesztje minden kiadás után

## 1. Kiindulópont

A két felmérés a hiányokat oldalszempontból gyűjtötte össze. A forrás ellenőrzése után a kép a következő:

- **Megvan, használható:** `Carousel` (3D coverflow, húzás, billentyűk, fókuszkezelés), `Timeline` (tömör mód), `Tabs`, `Accordion`, `Card`, `Badge`, `Image`, `Modal`, `Form`, `TextInput`, `Textarea`, `RangeInput`, `CustomSelect`, `CustomDatePicker`, `CodeBlock`, `Nav`, `Menu`, `Toast`, `Spinner`, `MusicPlayer`, `Gantt`.
- **Megvan, de hiányos:** a `Carousel` a YAML-ból nem kap egyedi dia-tartalmat és nem frissíthető újraépítés nélkül. A `Timeline` `compact` váltása újraépítést jelent. A `MusicPlayer` nem ment állapotot, nincs benne műfajválasztó és extra gomb. A `Gantt` sorai nem rendezhetők át.
- **A leíró (YAML) hiányai:** komponens-csomóponton nincs `attrs` (`data-*`, `aria-*`, tesztazonosítók). A `t:` nem tud HTML-t tartalmazó címkét. A kifejezésekben nem érhető el az aktuális nyelv. Nincs „felépült” életciklus-horog (a reveal-animáció és a képbetöltők újrakötéséhez).
- **Teljesen hiányzik:** átrendezés (`Sortable`), Kanban (`Board`), nézetváltó gombcsoport (`SegmentedControl`), nyelvváltó (`LocaleSwitcher`), témaváltó (`ThemeToggle`), időpont-foglaló (`SlotPicker`), kódnézet sorszámmal és összecsukással (`CodeView`).

**Kapcsolat a `plans/yaml-improvement.md`-vel** (a competitions-oldal YAML-elemzése): annak könyvtár-szintű pontjai ebbe a tervbe kerültek. Az elírt útvonal csendes üressége (5. pont) az A7 és az A8, a `stable()` / `syncing` állapot-szinkron (6. pont) az A5 és az A6. A többi pont (ismétlődő részek `define`-ba, egységes gyerek-szintaxis, a nézetlogika a `derive.js`-be, a holt `localStorage`-kulcs) az oldal saját takarítása, az a mestertervben külön lépés.

**Nem cél** (az alkalmazásban marad JS-ként): Cloudflare Turnstile, Formspree- és Google Apps Script-hívások, MX-ellenőrzés, tiltott szavak szűrője, a gépelő effekt, a háttér-orbok és a canvas-játék. Ezek alkalmazás-specifikusak, nem könyvtárfeladatok.

## 2. Közös konvenciók (minden tételre érvényes)

Minden új vagy bővített komponens a meglévő mintát követi, így a dokumentáció, a YAML-séma és a fordítás-ellenőrzés automatikusan működik.

| Mit | Hol | Megjegyzés |
|---|---|---|
| Gyártó | `src/components/createX.ts` | `createX(params: XParams): HTMLElement`, `parent` + `id` kötelező, `class` opcionális |
| Típusok | `src/types.ts` | Minden mező JSDoc-kal, `@default`-tal (a `gen-props.mjs` ebből készít paramétertáblát) |
| Dokumentáció-jegyzék | JSDoc a gyártó fölött | `@category`, `@menu`, `@order`, `@summary` (a `gen-docs.mjs` ebből készít oldalt és menüt) |
| Feliratok | `src/locales.ts` | `builtin("x.key", "Alapérték")`, `cdb.x.*` kulcsok hu/en párban; nyelvváltáskor `watchLocale` frissít |
| Stílus | `style.css` | CSS-változókra épül (`--primary`, `--surface`…), sötét téma `:root[data-theme="dark"]` |
| YAML-regisztráció | `src/spec/overrides.json` | `text`, `array`, `items`, `slots`, `bind`, `updaters` |
| Frissítő metódus | a gyökérelemen | a `Gantt` mintájára: `Object.assign(root, { setX })`, az `updaters` erre hivatkozik |
| Export | `src/index.ts` | a komponens és a típusai |
| Teszt | `test/<nev>.test.ts` | vitest + jsdom |
| Docs példa | `documentation/examples/<slug>.ts` | a YAML minta ebből generálódik (`gen-yaml-examples.mjs`) |

A frissítő metódus mintája (a `Gantt`-nál már így működik):

```ts
// a gyártó végén
return Object.assign(root, {
  setSlides(next: CarouselSlide[]) { /* helyben frissít, az aktív indexet megtartja */ },
  goTo(index: number) { /* ... */ },
});
```

```json
// src/spec/overrides.json
"Carousel": { "updaters": { "slides": "setSlides", "startIndex": "goTo" } }
```

Ha egy paraméter állapotfüggő (`${...}`), és van rá frissítő, a leíró a metódust hívja újraépítés helyett. Így megmarad a fókusz, a görgetés és a betöltött képek.

## 3. A. A leíró (YAML) bővítései

### A1. `attrs` komponens-csomóponton

**Kinek kell:** mindkét projekt. A cv Playwright-tesztjei fix ID-kra épülnek (`#hire-plain-btn`), a portfólió `data-open-hire` és `aria-*` attribútumokkal dolgozik.

```yaml
- Button#hire-plain-btn:
    text: { t: hireMe }
    attrs:
      data-open-hire: true
      aria-label: ${t('ariaHire')}
      data-testid: hire
```

Megvalósítás a `src/spec/build.ts` `renderComponent` függvényében: az `attrs` „különleges” kulcs. A komponens létrejötte után a gyökérelemre kerül, és állapotfüggő értéknél helyben frissül.

```ts
// renderComponent
const special = new Set(["t", "args", "bind", "attrs", "onMount"]);
// ...
const applyAttrs = (el: HTMLElement, deps: Set<string> | null): void => {
  if (raw.attrs === undefined) return;
  if (typeof raw.attrs !== "object" || raw.attrs === null) throw new SpecError("az attrs térkép kell legyen", `${path}.attrs`);
  for (const [k, v] of Object.entries(raw.attrs as Record<string, unknown>)) {
    if (/^on/i.test(k)) throw new SpecError(`eseménykezelő nem adható attribútumként: ${k}`, `${path}.attrs.${k}`);
    setAttr(el, k, evalValue(v, scope, ctx, deps, `${path}.attrs.${k}`));
  }
};
```

Biztonság: az `on*` attribútumok tiltottak (az eseménykezelő csak `"@handler"` lehet). A JSON Schema-ba (`spec-meta.mjs`) minden komponens kap egy `attrs: { type: object }` mezőt.

### A2. Nyelvesített HTML-szöveg

**Kinek kell:** a portfólió címkéi HTML-t tartalmaznak (`&lt;VB/&gt;`, kiemelések). A mostani `applyStaticLabels` ezeket `innerHTML`-lel írja be.

```yaml
- a.logo: { t: logo, html: true, href: "#home" }
```

Ha a `t:` mellett `html: true` áll, a szöveg `innerHTML`-ként kerül be, és nyelvváltáskor ugyanígy frissül. Csak megbízható forrásból (a projekt saját nyelvi fájljaiból) jöhet, ezt a dokumentáció kiemeli.

```ts
// renderRaw, a "szöveg: t / text / html" ág
if (params.t !== undefined && params.html === true) {
  const key = asText(params.t);
  const apply = (): void => void (el.innerHTML = t(key, args));
  apply();
  watchLocale(el, apply);
} else if (params.t !== undefined) { /* mostani szöveges ág */ }
```

### A3. Az aktuális nyelv a kifejezésekben

**Kinek kell:** a portfólió projektleírásai az adatban többnyelvűek (`p.desc.hu.functional`).

```yaml
- p.card-desc: ${p.desc[locale][tab]}
```

A `locale` foglalt azonosító a kifejezés-értelmezőben (`src/spec/expr.ts`). A tár egy belső útvonalon (`$locale`) tartja, és a `buildUI` a `watchLocale`-on keresztül frissíti, így a kötések függőségkövetése magától működik.

```ts
// build.ts, buildUI
store.set("$locale", getLocale());
const stop = onLocaleChange(() => store.set("$locale", getLocale()));
ui.addDisposer(stop);

// expr.ts, azonosító feloldása
if (name === "locale") return readPath("$locale", deps);
```

A `$` előtagú útvonal a felhasználói `state`-ben tiltott, így nem ütközik.

### A4. `onMount` életciklus-horog

**Kinek kell:** a portfólió `revealIn()`, `wireImageLoaders()` és `initStats()` függvényei a kész DOM-on futnak. Kulcsolt `each` újrarajzolásakor az új elemekre is futniuk kell.

```yaml
- div#projects-grid:
    onMount: "@revealCards"
    children:
      - each: { in: "${visibleProjects}", as: p, key: p.id }
        do: [ { ProjectCard: { project: "${p}" } } ]
```

A horog a beszúrás után, `queueMicrotask`-ban fut, és megkapja a `{ el, state, ui }` kontextust. Nyers elemen és komponensen is működik. Az `each` minden új elemnél külön hívja.

### A5. `each`: tartalom szerinti újrahasznosítás

**Kinek kell:** minden oldal, amely a `derive.js` mintát használja (competitions, cv, portfólió). Ma az `each` egy elemet csak akkor hasznosít újra, ha az érték **ugyanaz az objektum** (`Object.is`). A származtatott listák minden számoláskor új objektumokat adnak, ezért minden elem újraépül. A competitions ezt a `derive.js` `stable()` függvényével kerüli meg (JSON-összehasonlítás). Ezt a könyvtárnak kell megoldania.

Javasolt viselkedés: azonos kulcsnál, ha az érték szerkezetileg egyenlő, az elem marad; ha különbözik, az elem **helyben frissül** (az elem-scope új értéket kap, a belső `${...}` kötések frissítenek), és csak az újraépítést nem igénylő részek változnak.

```ts
// build.ts, renderEach / draw
if (old && (Object.is(old.value, value) || shallowEqualDeep(old.value, value))) {
  item = old;                       // változatlan: semmi teendő
} else if (old) {
  item = old;
  item.scope.set(as, value);        // helyben frissítés: a kötések az új értékből számolnak
}
```

Ehhez az elem-scope-nak reaktívnak kell lennie (ma statikus `child(scope, {...})`). A legkisebb lépés: először csak a szerkezeti egyenlőség (ez önmagában kiváltja a `stable()`-t), a helyben frissítés második lépés.

### A6. Származtatott állapot (`derive`)

**Kinek kell:** a competitions `app.js` 44–153. sora (forrás- és származtatott állapot, `syncing` zászló, `SOURCE_KEYS`, kézi `batch`). A cv és a portfólió ugyanezt a mintát használná.

```js
const ui = mountYaml('#page', {
  handlers,
  derive: {
    // kulcs: a számolt állapot neve; deps: forrásútvonalak; fn: tiszta függvény
    events:   { deps: ['active', 'timeFilter', 'selectedId'], fn: (s) => visibleEvents(s) },
    ganttRows:{ deps: ['active'], fn: (s) => ganttRows(s) },
  },
});
```

A könyvtár a forrásútvonalak változásakor újraszámol, egy `batch`-ben írja vissza, és a ciklust maga akadályozza meg (számolt kulcsot a felhasználó nem írhat, erre hibát ad). Ezzel a `syncing` zászló és a kézi feliratkozás eltűnik.

### A7. Elírt útvonalak jelzése (fejlesztői mód)

**Kinek kell:** mindenkinek. Ma egy elírt `${event.hasLnk}` csendben üres szöveg lesz.

`buildUI(spec, { strict: true })` (vagy `?cdbDebug` URL-paraméter): ha egy útvonal első szegmense sem az állapotban, sem a scope-ban (`each` változó, `define` paraméter, `data`) nem létezik, `console.warn` útvonallal és „erre gondoltál?” javaslattal. Objektumon belüli hiányzó mező (`event.hasLnk`, ha az `event` létezik) szintén figyelmeztetés, ha az objektumnak van hasonló nevű mezője. Éles módban nincs költsége.

### A8. Beágyazott YAML ellenőrzése

**Kinek kell:** minden oldal, ahol a YAML a HTML-ben él (`<script type="text/yaml" id="page">`). Ott a szerkesztő nem ad sémát és kiegészítést.

- `scripts/validate-spec.mjs` fogadjon HTML-fájlt: `node validate-spec.mjs index.html#page --data … --strict`. A szkript kiveszi a blokkot, a sorszámokat az eredeti HTML-hez igazítja, és az A7 figyelmeztetéseit is kiírja.
- A vendor-szinkron szkript ezt a validátort is másolja (`vendor/validate-spec.mjs`), így az oldalprojektek CI-ja futtathatja.

### A9. Ellenőrzés

- `test/spec-build.test.ts`: `attrs` statikus és reaktív érték, `on*` tiltás, `t` + `html`, `locale` kifejezés nyelvváltásra frissül, `onMount` egyszer fut és az `each` új elemeire is; `each` szerkezetileg egyenlő értéknél nem épít újra (a DOM-csomópont ugyanaz); `derive` újraszámol, ciklust nem enged; `strict` mód figyelmeztet elírt útvonalra.
- `test/spec-schema.test.ts`: az `attrs` és az `onMount` minden komponensnél szerepel a sémában.
- `validate-spec` HTML-bemenettel: hibás sor a HTML-beli sorszámmal jelenik meg.

## 4. B. Meglévő komponensek bővítése

### B1. Carousel: egyedi dia-tartalom YAML-ból, frissítés újraépítés nélkül

**Kinek kell:** a portfólió projektjei és skilljei (coverflow + szűrés), a cv kezdőoldala.

Bővítések:

1. `overrides.json`: a diák `content` mezője YAML-csomópontokat fogad (ugyanúgy, mint a `Tabs` és az `Accordion`).
2. `setSlides(slides)`: kulcs (`slide.id`) szerinti frissítés, a megmaradó diák DOM-ja (és betöltött képei) megmaradnak. Az aktív dia megmarad, ha még létezik, különben a 0. dia lesz aktív.
3. `goTo(index)` publikus metódus, `startIndex` updaterként.
4. Dián `attrs` (a `data-category` szűréshez és a tesztekhez).

```json
"Carousel": {
  "array": "slides",
  "items": { "slides": "content" },
  "updaters": { "slides": "setSlides", "startIndex": "goTo" }
}
```

```ts
function setSlides(next: CarouselSlide[]): void {
  const byId = new Map(slides.map((el) => [el.dataset.slideId, el]));
  const activeId = slides[current]?.dataset.slideId;
  const fresh = next.map((s, i) => byId.get(s.id ?? String(i)) ?? createDOMElem(buildSlide(s)));
  stage.replaceChildren(...fresh);       // egyetlen DOM-csere, a meglévő elemek mozognak
  slides = fresh;
  rebuildDots();
  goTo(Math.max(0, fresh.findIndex((el) => el.dataset.slideId === activeId)));
}
```

```yaml
- Carousel#projectsCarousel:
    slides: "${visibleProjects}"     # [{ id, content: [...] }] a derive JS-ből
    slideWidth: 340px
    onChange: "@rememberSlide"
```

Teszt: a `setSlides` után a megmaradó dia ugyanaz a DOM-csomópont, az aktív index megmarad, a pöttyök száma követi a diák számát.

### B2. Timeline: tömör mód és elemek frissítése

**Kinek kell:** a portfólió idővonala (részletes/tömör váltó).

- `setCompact(boolean)`: csak osztályt vált a gyökéren (`timeline--compact`), nincs újraépítés.
- `setItems(items)`: elemlista cseréje (nyelvváltáskor kell, mert a `period`, `title`, `desc` nyelvenként az adatban van).

```json
"Timeline": { "array": "items", "updaters": { "compact": "setCompact", "items": "setItems" } }
```

```yaml
- Timeline#career:
    items: "${timelineItems}"
    compact: "${timelineView == 'compact'}"
```

### B3. MusicPlayer: állapotmentés, műfajválasztó, extra gombok

**Kinek kell:** a cv-ben minden nézeten szerepel (19 szám, Spotify- és dalszöveg-gomb, az állapot oldalak között megmarad).

Új paraméterek:

```ts
export interface MusicPlayerParams {
  // ... meglévők
  /** Ha meg van adva, a szám indexe, pozíciója, hangereje és az ismétlés localStorage-ba kerül ezzel az előtaggal */
  storageKey?: string;
  /**
   * A lejátszási lista megjelenése: `list` (lista) vagy `select` (legördülő választó, sok számnál)
   * @default "list"
   */
  playlistMode?: "list" | "select";
  /** Extra gombok a vezérlősorban (pl. Spotify, dalszöveg) */
  actions?: Array<{ icon: string; label: TextValue; href?: string; click?: (e: Event) => void }>;
}
```

```ts
// mentés: egyetlen JSON-kulcs, hibatűrően (privát mód)
const save = (): void => {
  if (!params.storageKey) return;
  try {
    localStorage.setItem(params.storageKey, JSON.stringify({ index, time: audio.currentTime, volume: audio.volume, loop }));
  } catch { /* privát mód: nem mentünk */ }
};
audio.addEventListener("timeupdate", throttle(save, 1000));
```

A `select` mód a meglévő `createCustomSelect`-et használja, nem új választót. A `storageKey` nélküli viselkedés nem változik (visszafelé kompatibilis).

### B4. Gantt: sorok átrendezése

**Kinek kell:** a cv Gantt-nézete (a sorok húzással rendezhetők).

```ts
/** A sorok húzással / billentyűvel átrendezhetők @default false */
reorderable?: boolean;
/** Átrendezés után hívódik, a sorok új azonosító-sorrendjével */
onReorder?: (ids: string[]) => void;
```

A megvalósítás a C1 `Sortable` viselkedésre épül (csoporton belül rendez, a felirat-oszlop a fogantyú). Az új sorrend a `setRows` útján is visszaírható, így az alkalmazás mentheti (`localStorage`).

## 5. C. Új komponensek és viselkedések

### C1. Sortable (viselkedés, nem önálló komponens)

**Kinek kell:** a `Board` (C2) és a `Gantt` (B4). Egy helyen készül el, mert a hozzáférhető húzás nehéz: Pointer Events, billentyűzetes mód, felolvasott állapot.

```ts
// src/behaviors/sortable.ts
export interface SortableOptions {
  /** A rendezhető elemek szelektora a tárolón belül */
  items: string;
  /** Fogantyú szelektora (alapból maga az elem) */
  handle?: string;
  /** Csoportnév: azonos csoportú tárolók között is lehet mozgatni (Kanban oszlopok) */
  group?: string;
  /** Elem → azonosító */
  idOf?: (el: HTMLElement) => string;
  onMove?: (e: { id: string; from: HTMLElement; to: HTMLElement; index: number }) => void;
  labels?: { grabbed?: (id: string) => string; moved?: (pos: number, total: number) => string; dropped?: (pos: number) => string; cancelled?: string };
}

/** Rendezhetővé teszi a tároló elemeit; a visszaadott függvény leveszi a figyelőket. */
export function makeSortable(container: HTMLElement, opts: SortableOptions): () => void {
  const live = ensureLiveRegion();                 // egy közös aria-live="assertive" régió
  let grabbed: HTMLElement | null = null;

  // Billentyűzet: Szóköz = megfog / letesz, nyilak = mozgat, Esc = visszavon
  container.addEventListener("keydown", (e) => {
    const item = (e.target as HTMLElement).closest<HTMLElement>(opts.items);
    if (!item) return;
    if (e.key === " ") {
      e.preventDefault();
      if (!grabbed) { grabbed = item; item.setAttribute("aria-grabbed", "true"); live.say(label("grabbed", id(item))); }
      else drop(item);
    } else if (grabbed && (e.key === "ArrowUp" || e.key === "ArrowDown")) {
      e.preventDefault();
      moveBy(grabbed, e.key === "ArrowUp" ? -1 : 1);
    } else if (grabbed && e.key === "Escape") cancel();
  });

  // Egér / érintés: Pointer Events, 6 px küszöb, helyőrző elem, auto-görgetés a szélen
  container.addEventListener("pointerdown", onPointerDown);
  return () => { /* figyelők levétele */ };
}
```

Eldöntendő a megvalósításkor: a natív HTML5 drag-and-drop nem működik érintőképernyőn, ezért Pointer Events kell (a `Carousel` húzási logikája mintának jó).

Teszt (jsdom): billentyűzetes megfog-mozgat-letesz sorrend és `onMove`, Esc visszaállít, az aria-live szövegek, pointer szimuláció `PointerEvent`-tel.

### C2. Board (Kanban)

**Kinek kell:** a cv scrumboard-nézete.

```ts
export interface BoardCard {
  id: string;
  title: TextValue;
  subtitle?: TextValue;
  meta?: TextValue;
  /** Kis címkék (pl. technológiák) */
  chips?: TextValue[];
  /** Bal oldali színcsík (CSS szín) */
  color?: string;
  /** Kép vagy monogram */
  avatar?: { src?: string; initials?: string };
  /** Kiemelt jelvény (pl. „Élő”) */
  badge?: TextValue;
  data?: unknown;
}

export interface BoardColumn {
  id: string;
  title: TextValue;
  color?: string;
  cards: BoardCard[];
  /** Üres oszlopban mutatott szöveg / helyőrző kártya */
  emptyHint?: TextValue;
}

export interface BoardParams {
  parent: HTMLElement | string;
  id: string;
  class?: string;
  columns: BoardColumn[];
  /** Kártyák mozgathatók (oszlopon belül és oszlopok között) @default true */
  draggable?: boolean;
  /** Egyedi kártya-tartalom; alapból a beépített kártya */
  renderCard?: (card: BoardCard) => HTMLElement;
  onMove?: (e: { cardId: string; from: string; to: string; index: number }) => void;
  onCardClick?: (card: BoardCard) => void;
  labels?: { column?: (title: string, n: number) => string };
}
```

```ts
export function createBoard(params: BoardParams): HTMLElement {
  const root = createDOMElem({ tag: "div", parent: params.parent, attrs: { id: params.id, class: cls("board", params.class) } });
  const stops: Array<() => void> = [];

  const render = (columns: BoardColumn[]): void => {
    stops.splice(0).forEach((s) => s());
    root.replaceChildren(...columns.map(renderColumn));
    if (params.draggable !== false) {
      root.querySelectorAll<HTMLElement>(".board-col-body").forEach((body) =>
        stops.push(makeSortable(body, { items: ".board-card", group: params.id, idOf: (el) => el.dataset.cardId!, onMove: (e) => {
          updateCounts();
          params.onMove?.({ cardId: e.id, from: e.from.dataset.col!, to: e.to.dataset.col!, index: e.index });
        } })));
    }
  };

  render(params.columns);
  return Object.assign(root, { setColumns: render });
}
```

Billentyűzet: a `Sortable` csoport-módja a ←/→ nyíllal a szomszéd oszlopba visz. Hozzáférhetőség: oszlop = `role="region"` + címke a darabszámmal, törzs = `role="list"`, kártya = `role="listitem"`.

```json
"Board": { "array": "columns", "updaters": { "columns": "setColumns" } }
```

```yaml
- Board#careerBoard:
    columns: "${boardColumns}"
    onMove: "@saveBoardOrder"
```

### C3. SegmentedControl (nézetváltó gombcsoport)

**Kinek kell:** a portfólió három nézetváltója (carousel/rács ×2, részletes/tömör) és a projektszűrő gombsor; a cv mobil beállításai.

```ts
export interface SegmentedOption {
  value: string;
  label: TextValue;
  /** Ikon (SVG szöveg vagy emoji) */
  icon?: string;
  /** Csak ikon látszik, a felirat aria-label lesz @default false */
  iconOnly?: boolean;
}

export interface SegmentedControlParams {
  parent: HTMLElement | string;
  id: string;
  class?: string;
  options: SegmentedOption[];
  value: string;
  /** A csoport elérhetőségi neve */
  ariaLabel?: TextValue;
  /** `toggle`: aria-pressed gombok (szűrőkhöz); `radio`: radiogroup nyílbillentyűkkel @default "radio" */
  mode?: "toggle" | "radio";
  onChange?: (value: string) => void;
}
```

```ts
export function createSegmentedControl(params: SegmentedControlParams): HTMLElement {
  let value = params.value;
  const radio = (params.mode ?? "radio") === "radio";
  const root = createDOMElem({ tag: "div", parent: params.parent, attrs: { id: params.id, class: cls("segmented", params.class), role: radio ? "radiogroup" : "group", "aria-label": params.ariaLabel ?? "" } });
  const buttons = params.options.map((o) => {
    const b = createDOMElem({ tag: "button", parent: root, attrs: { type: "button", class: "segmented-btn", "data-value": o.value } });
    if (o.icon) b.insertAdjacentHTML("beforeend", o.icon);
    const label = createDOMElem({ tag: "span", parent: b, text: o.label });
    if (o.iconOnly) { label.classList.add("sr-only"); }
    b.addEventListener("click", () => select(o.value, true));
    return b;
  });
  const sync = (): void => buttons.forEach((b) => {
    const on = b.dataset.value === value;
    b.classList.toggle("active", on);
    if (radio) { b.setAttribute("role", "radio"); b.setAttribute("aria-checked", String(on)); b.tabIndex = on ? 0 : -1; }
    else b.setAttribute("aria-pressed", String(on));
  });
  function select(v: string, user: boolean): void { if (v === value) return; value = v; sync(); if (user) params.onChange?.(v); }
  if (radio) root.addEventListener("keydown", (e) => { /* ←/→/Home/End: roving tabindex, mint a Tabs-nál */ });
  sync();
  return Object.assign(root, { setValue: (v: string) => select(v, false) });
}
```

```json
"SegmentedControl": { "array": "options", "bind": "value", "updaters": { "value": "setValue" } }
```

```yaml
- SegmentedControl#projectsView:
    bind: projectsView
    ariaLabel: { t: view.ariaLabel }
    options:
      - { value: carousel, label: { t: view.carousel }, icon: "${icons.carousel}" }
      - { value: grid, label: { t: view.grid }, icon: "${icons.grid}" }
```

### C4. LocaleSwitcher (nyelvváltó)

**Kinek kell:** a cv (12 nyelv, legördülő) és a portfólió (6 nyelv, asztalon gombsor, mobilon legördülő).

```ts
export interface LocaleOption { code: string; label: string; short?: string; icon?: string }

export interface LocaleSwitcherParams {
  parent: HTMLElement | string;
  id: string;
  class?: string;
  locales: LocaleOption[];
  /**
   * `buttons` gombsor, `dropdown` legördülő, `auto` a `breakpoint` alatt legördülő
   * @default "auto"
   */
  mode?: "buttons" | "dropdown" | "auto";
  /** @default 768 */
  breakpoint?: number;
  /** Váltás előtt / után (pl. URL `?lang=` szinkron, saját tároló); alapból csak setLocale hívódik */
  onChange?: (code: string) => void;
  ariaLabel?: TextValue;
}
```

A váltás a könyvtár `setLocale`-jét hívja, ezért minden `tr()` / `t:` szöveg magától frissül. Az alkalmazás saját teendőit (URL, `localStorage`, `<html lang>`, `og:locale`) az `onChange` végzi. A legördülő mód a `Menu` / `CustomSelect` billentyűkezelését használja újra: Esc zár, kívülre kattintás zár, nyilak léptetnek. A gombsor nem kerül duplikálásra, ugyanaz a markup CSS-sel vált alakot (ahogy a portfólióban ma is).

```yaml
- LocaleSwitcher#lang:
    mode: auto
    locales: "${languages}"
    onChange: "@syncLangToUrl"
```

### C5. ThemeToggle és a festés előtti téma-bootstrap

**Kinek kell:** mindkét projekt (a cv-ben extra témák is vannak: `superdark`, `nightvision`, `predator`).

```ts
export interface ThemeToggleParams {
  parent: HTMLElement | string;
  id: string;
  class?: string;
  /** A körbejárt témák sorrendje @default ["light", "dark"] */
  themes?: string[];
  /** @default "cdb-theme" */
  storageKey?: string;
  /** Témánként ikon (SVG / emoji) */
  icons?: Record<string, string>;
  onChange?: (theme: string) => void;
}

/** A <head>-be ágyazható, festés előtt futó szkript szövege (villogás ellen). */
export function themeBootstrapScript(opts: { storageKey?: string; themes?: string[] } = {}): string {
  const key = JSON.stringify(opts.storageKey ?? "cdb-theme");
  const themes = JSON.stringify(opts.themes ?? ["light", "dark"]);
  return `(function(){try{var t=localStorage.getItem(${key});if(${themes}.indexOf(t)<0)t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';document.documentElement.dataset.theme=t}catch(e){}})();`;
}
```

A komponens a `document.documentElement.dataset.theme`-ből indul (ezt a bootstrap már beállította), nem dönt újra. A `theme-color` meta frissítése opcionális (`syncMetaThemeColor: true`).

### C6. SlotPicker (időpont-foglaló)

**Kinek kell:** mindkét projekt booking-modálja (nap → időpont → adatok). A harmadik lépés (űrlap) és a lépések közti váltás a YAML-ban marad (`state` + `if`). A komponens a „nap → időpont” részt adja, a betöltési, hiba- és üres állapottal.

```ts
export interface SlotDay { date: string /* 2026-12-01 */; times: string[] /* ["09:00", "09:30"] */ }

export interface SlotPickerParams {
  parent: HTMLElement | string;
  id: string;
  class?: string;
  /** Az elérhető időpontok betöltése (pl. Google Apps Script fetch) */
  loadSlots: () => Promise<SlotDay[]>;
  /** Intl-dátumformázás nyelve; ismeretlen (fiktív) nyelvnél angol @default az aktuális nyelv */
  dateLocale?: string;
  onSelect?: (slot: { date: string; time: string }) => void;
  labels?: { loading?: TextValue; error?: TextValue; retry?: TextValue; empty?: TextValue; back?: TextValue; chooseDay?: TextValue; chooseTime?: TextValue };
}
```

```ts
const fmtLocale = (lang: string): string => (Intl.DateTimeFormat.supportedLocalesOf([lang]).length ? lang : "en");

async function load(): Promise<void> {
  setView("loading");
  try {
    days = (await params.loadSlots()).filter((d) => d.times.length);
    setView(days.length ? "days" : "empty");
  } catch {
    setView("error");   // a hibaállapotban „Újra” gomb → load()
  }
}
```

Állapotai: `loading`, `error`, `empty`, `days`, `times`. Mindegyik `aria-live` régióban, a gombok listaként (`role="list"`). Nyelvváltáskor a dátumfeliratok a `watchLocale`-lal frissülnek. A `reset()` metódus a „Új foglalás” gombhoz kell.

```yaml
- if: "${bookingStep == 'pick'}"
  then:
    - SlotPicker#bookingSlots:
        loadSlots: "@loadBookingSlots"
        onSelect: [ { set: { chosenSlot: "${$event}", bookingStep: form } } ]
- if: "${bookingStep == 'form'}"
  then: [ { BookingForm: { slot: "${chosenSlot}" } } ]   # define-olt űrlap, a beküldés JS handler
```

### C7. CodeView (kódnézet sorszámmal és összecsukással)

**Kinek kell:** a cv JSON-nézete (VS Code-szerű megjelenés). A meglévő `CodeBlock` (kiemelés + másolás) marad, a `CodeView` ennél többet tud: sorszám, behúzásvezetők, összecsukás, összecsukott állapot mentése.

```ts
export interface CodeViewParams {
  parent: HTMLElement | string;
  id: string;
  class?: string;
  /** A megjelenített kód */
  code: string;
  /** Kiemelés nyelve (a meglévő highlighter) */
  language?: string;
  /** @default true */
  lineNumbers?: boolean;
  /** Zárójelpár alapú összecsukás (JSON, JS) @default true */
  foldable?: boolean;
  /** @default true */
  indentGuides?: boolean;
  /** Az összecsukott blokkok kezdősorai localStorage-ba ezzel a kulccsal */
  storageKey?: string;
  onFoldChange?: (folded: number[]) => void;
}
```

A legfontosabb logika (a cv `computeFolds` általánosítása): egy veremmel a nyitó-záró zárójelek sorpárjait keressük, a stringeken belüli zárójeleket kihagyva.

```ts
/** Nyitó sor → záró sor. A sztringen belüli zárójeleket figyelmen kívül hagyja. */
export function computeFolds(lines: string[]): Map<number, number> {
  const folds = new Map<number, number>();
  const stack: number[] = [];
  lines.forEach((line, i) => {
    let inString = false;
    for (let c = 0; c < line.length; c++) {
      const ch = line[c];
      if (ch === '"' && line[c - 1] !== "\\") inString = !inString;
      if (inString) continue;
      if (ch === "{" || ch === "[") stack.push(i);
      else if (ch === "}" || ch === "]") {
        const open = stack.pop();
        if (open !== undefined && open !== i) folds.set(open, i);
      }
    }
  });
  return folds;
}
```

A sorok egy `<ol>` elemei. Az összecsukás a köztes sorokat `hidden`-re állítja, és egy „…” jelölőt mutat. A fogantyú `button` (`aria-expanded`), így billentyűzettel is működik. Metódusok: `foldAll()`, `unfoldAll()`, `setCode(code)`.

## 6. Prioritás és ütemezés

A sorrend azt követi, hogy melyik oldal-átírást mi blokkolja. A portfólió szinte csak az 1. szakasztól függ, így az 1. szakasz után az indulhat.

| Szakasz | Tételek | Kit blokkol | Becslés |
|---|---|---|---|
| 1. Leíró-alapok | A1 `attrs`, A2 `t` + `html`, A3 `locale`, A4 `onMount` | mindkét projekt minden oldalát | 2–3 nap |
| 1b. Leíró-ergonómia | A5 `each` újrahasznosítás, A6 `derive`, A7 `strict`, A8 HTML-validálás | a `derive.js`-mintát (mindhárom oldalt), a competitions takarítását | 3–4 nap |
| 2. Kis komponensek | C3 SegmentedControl, C4 LocaleSwitcher, C5 ThemeToggle, B2 Timeline | portfólió, cv közös keret | 3–4 nap |
| 3. Carousel | B1 | portfólió projektek/skillek, cv kezdőoldal | 2 nap |
| 4. Foglalás és zene | C6 SlotPicker, B3 MusicPlayer | mindkét booking-modál, cv zene | 3–4 nap |
| 5. Átrendezés | C1 Sortable, B4 Gantt reorderable | cv gantt | 3–4 nap |
| 6. Kanban | C2 Board | cv scrumboard | 3–4 nap |
| 7. Kódnézet | C7 CodeView | cv json-nézet | 3–4 nap |

Összesen kb. 5–6 hét. Az 1., 1b., 2. és 3. szakasz (kb. 2–2,5 hét) után a portfólió átírása teljes egészében indítható, a cv átírása a plain, index és swagger nézetekkel.

## 7. Minden tételnél kötelező (kész-definíció)

1. Típusok JSDoc-kal és `@default`-tal a `src/types.ts`-ben, export a `src/index.ts`-ből.
2. Gyártó JSDoc-címkékkel (`@category`, `@menu`, `@order`, `@summary`), így a docs oldal és a menüpont magától elkészül.
3. Beépített feliratok `cdb.*` kulccsal hu/en párban (`src/locales.ts`), `npm run check:i18n` hibátlan.
4. `overrides.json` bejegyzés (`array`, `items`, `bind`, `updaters`), a generált séma (`assets/createDOMBlocks.schema.json`) frissül.
5. vitest teszt: alap-renderelés, interakció (egér és billentyű), frissítő metódus (a DOM-csomópontok megmaradnak), nyelvváltás, YAML-ból építés (`buildUI`).
6. Docs példa (`documentation/examples/<slug>.ts`), a YAML minta ebből generálódik.
7. Sötét téma és mobil nézet ellenőrzése a docs oldalon (Chrome).
8. Hozzáférhetőség: szerepek, `aria-*`, fókusz-sorrend, `prefers-reduced-motion` az animációknál.

## 8. Kockázatok

1. **A Sortable a legnehezebb darab** (hozzáférhető húzás, érintés, auto-görgetés). Mérséklés: egyetlen, jól tesztelt viselkedés, amit a Board és a Gantt is használ. Kezdetben csak függőleges listák és oszlopok közti mozgatás, rács-elrendezés nem.
2. **Leíró-változások** (A1–A4) a meglévő YAML-oldalakat is érintik (competitions worktree). Mérséklés: mind bővítés, a meglévő szintaxis nem változik. A `locale` azonosító foglalttá válik, ezért ellenőrizni kell, hogy egyik meglévő leíró sem használja állapotkulcsként.
3. **A `t` + `html` biztonsági kérdés.** Csak a saját nyelvi fájlokból jövő szövegre szabad használni. A dokumentáció és a `yaml-page` skill ezt kiemeli.
4. **Méret.** A 7 új elem kb. 25–40 KB-tal növeli a csomagot (minifikálatlanul). Ha ez sok, a `Board`, a `CodeView` és a `SlotPicker` külön belépési pontba (`createDOMBlocks.extras.js`) kerülhet.
5. **A competitions-oldal vendorolt könyvtára** a bővítések után frissítendő (`scripts/sync-domblocks.mjs`), a smoke-teszttel újraellenőrizve.

## 9. Ellenőrzés

- `npx tsc --noEmit`, `npx vitest run` (minden új teszttel), `npm run check:i18n`, `npm run build:page`.
- A docs oldalon minden új komponens élő példája és generált YAML-mintája megjelenik. Ellenőrizni kell világos és sötét módban, mobil szélességen, billentyűzettel.
- A competitions worktree smoke-tesztje (`yamlsmoke.cjs`) a frissített vendor-fájlokkal is zöld.
