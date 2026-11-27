# A YAML renderelés elemzése (index.html `#page`, createDOMBlocks buildUI)

## Állapot

Jelölés: `[ ]` nincs elkezdve, `[~]` folyamatban, `[x]` kész. A könyvtár-szintű pontok a `plans/hianyzo-komponensek-terv.md`-ben vannak (A5–A8); itt az oldal (2026-27-competitions, domblocks worktree) saját teendői.

> A worktree időközben a `main`-be olvadt; a takarítás a competitions repó `feature/yaml-cleanup` ágán készült (commit `a3bdf5f`, nincs feltöltve).

- [x] 1. `define` az ismétlődő részekre (`DiscrepancyBadge`, `CalendarButton`, `ExternalLink`; a letöltések is a közös `DocumentList`-et használják)
- [x] 2. egységes gyerek-szintaxis, a mély részek kiemelése (`CompetitionSwitchCard`, `EventListItem`, `CompetitionInfoCard`, `TeamRow`, `WorkshopProjectCard`)
- [x] 3. a stílusosztály- és szövegszámítás csak a `derive.js`-ben (`menuButton`, `selectedStatus`, `timeFilterButtons`, `detailsToggle`; a YAML-ben csak `len(...)` maradt)
- [x] 4. beágyazott YAML ellenőrzése: `validate-spec index.html --run --strict` (a teljes oldal a szkriptjeivel; a `#page` mód a derive nélküli szerkezetre)
- [x] 5. a holt `isDetailsSectionOpen` kulcs törlése
- [x] 6. `stable()` és `syncing` / `SOURCE_KEYS` kiváltása a könyvtár A5 és A6 tételével (`DERIVED` szabályok, `mountYaml(..., { derive })`)
- [x] vendor-szinkron a bővített könyvtárral
- [x] Verifikáció: a `--run --strict` hiba és figyelmeztetés nélkül fut (1102 elem); böngészőben (http) a kapcsolók, a szűrő, a kiválasztás (a listaelemek helyben frissülnek), a részletek, a menü és a téma működik, konzolhiba nincs. (A `file://` alatti betöltést a Chrome-bővítmény nem tudja ellenőrizni; a szkriptek sorrendje és a `#page` betöltés nem változott.)

## Context
A user azt kérte, hogy elemezzem: mennyire egyszerű és átlátható az oldal YAML-leíróra épülő renderelése. Elemzés történt (index.html, js/app.js, js/derive.js elolvasva), kódmódosítás nincs. Az alábbi javaslatok opcionálisak.

## Ítélet
Statikus szerkezet olvashatósága: jó (kb. 8/10). Logika követhetősége: közepes (kb. 6/10).

## Ami egyszerű és átlátható
- Az oldal teljes szerkezete egy helyen van (~470 sor), `# =====` szekciófejlécekkel és olvasási útmutatóval (index.html:50-71). Nincs záró tag, nincs kézi DOM-építés.
- `${...}` kötések: az állapotváltozás magától frissít, nincs `render()`/`innerHTML` kód.
- `define: EventDetails` (index.html:81): a panel és a modal ugyanazt a blokkot használja.
- A nevek beszédesek (`event.hasDiscrepancy`, `competition.cssClass`), a derive.js ugyanezeket adja, ezért a két oldal könnyen párosítható.
- A rövid szelektor-kulcs (`Title(4).cmp-label`, `Button#id.cls`) tömör.

## Ami bonyolítja
1. **Két szintaxis ugyanarra**: `- div: [gyerekek]` (rövid) és `children:` (ha attribútum is kell). Az olvasónak tudnia kell, mikor melyik (pl. index.html:91 vs 302-308).
2. **Mély beágyazás**: az eseménylista eleme (302-353) és a versenyinfó-kártya (383-456) 12-14 szint; a sorok vége kb. 56 oszlopnál kezdődik.
3. **Ismétlődő blokkok, de csak 1 `define`**: a „⚠ Eltérés" badge (115, 328), a „📅 Naptárba" gomb (138, 350), a külső link + ikon és a `target:_blank rel:noopener` (4x) másolva van.
4. **Nézetlogika két helyen**: a YAML-ben inline ternary (`class: "cmp-seg-btn ${timeFilter == 'all' ? ...}"`, 279), a derive.js-ben előre kiszámolt `cssClass`/`statusClass`/`hasTime`. Egy mező jelentéséhez három fájl között kell ugrani (index.html, derive.js, app.js).
5. **Szerkesztői támogatás hiányzik**: a `# yaml-language-server: $schema=...` (73) csak önálló `.yaml` fájlban működik, `<script>` blokkban valószínűleg nem, tehát nincs kiegészítés és hibajelzés. Elírt `${event.hasLnk}` valószínűleg csendben üres (ellenőrizendő).
6. **Állapot-szinkron bonyolult** (app.js:44-153): forrás és származtatott állapot, `syncing` zászló, `SOURCE_KEYS`, kézi `state.batch`, valamint a `stable()` (derive.js:13) JSON-összehasonlítása az `each` újraépítésének elkerülésére. Ez a deklaratív megközelítés ára.
7. **Apróság**: app.js:27 `isDetailsSectionOpen` felesleges, a `detailsOpen` mellett duplán mentett kulcs (maradék).

## Javaslatok (kicsitől nagyobbig, mind opcionális)
1. `define` az ismétlődő részekre: `DiscrepancyBadge`, `CalendarButton`, `ExternalLink` (index.html, a meglévő `define:` szekcióba). Kb. -30 sor, nincs viselkedésváltozás.
2. Egységes gyerek-szintaxis: ahol lehet, a rövid lista forma, `children:` csak attribútum mellett; a mély részeket (eseménylista elem, infokártya) `define`-nal kiemelni, hogy max. ~8 szint maradjon.
3. Szabály: a stílusosztály/szöveg számítása csak derive.js-ben, a YAML csak megjelenít (a 279/285 sori ternaryk is oda mennének, pl. `timeFilterAllClass`).
4. Szerkesztői támogatás: a YAML külön `page.yaml`-ba és build-lépés nélkül `js/page.js`-be (sablon-string) generálva, vagy a séma-ellenőrzés egy `node scripts/check-page.mjs` szkriptből. (`file://` alól fetch nem megy, ezért van inline.)
5. app.js:27 dead kulcs törlése.

## Verifikáció (ha megvalósítjuk)
- Az oldal `file://` alól megnyitva ugyanúgy renderel (idővonal, lista, modal, versenykapcsolók, sötét mód, újdonságok ablak).
- Böngésző-konzolban nincs hiba, a naptár menü és a „Naptárba" gombok mindkét helyen (panel, lista) működnek.
- Mentett állapot (localStorage) visszatöltése változatlan.
