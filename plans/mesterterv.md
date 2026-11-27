# Mesterterv: a YAML-alapú átírások sorrendje

> Ez a terv csak a sorrendet és a függőségeket rögzíti. A részletek az altervekben vannak, itt csak hivatkozunk rájuk.

## Állapot

Jelölés: `[ ]` nincs elkezdve, `[~]` folyamatban, `[x]` kész. Egy mérföldkő akkor kész, ha a hivatkozott alterv-tételek mind késznek vannak jelölve, és a „Mérföldkövenként kötelező” ellenőrzések lefutottak.

- [~] 0. Kiindulás: `feature/yaml-descriptor` lezárva (PR #4 megnyitva, a merge a PR #3 után a felhasználó döntése)
- [x] 1. Leíró-alapok (K: A1–A4 · D: D4, D6) — ág: `feature/spec-foundations`
- [x] 2. Generátor-előkészítés (D: D1, D2, D3) — ág: `feature/spec-foundations`
- [x] 3. Leíró-ergonómia (K: A5–A8 · D: D5, D7 1–7.) — ág: `feature/spec-foundations`
- [ ] 4. Competitions takarítás (Y)
- [ ] 5. Kis komponensek (K: C3, C4, C5, B2, B1 · D: D8)
- [ ] 6. Portfólió 0–4. szakasz (P)
- [ ] 7. Foglalás és zene (K: C6, B3 · D: D8)
- [ ] 8. Portfólió befejezése (P: 5–6.)
- [ ] 9. cv 0–2. szakasz (C)
- [ ] 10. cv swagger (C: 4.)
- [ ] 11. Átrendezés (K: C1, B4 · D: D8)
- [ ] 12. cv gantt (C: 3.)
- [ ] 13. Kanban (K: C2 · D: D8)
- [ ] 14. cv scrumboard (C: 5.)
- [ ] 15. Kódnézet (K: C7 · D: D8)
- [ ] 16. cv json (C: 6.)
- [ ] 17. Lezárás (C: 7. · D: D9)

## Altervek

| Rövid jel | Fájl | Tárgy | Repó |
|---|---|---|---|
| **K** | `plans/hianyzo-komponensek-terv.md` | Leíró-bővítések (A1–A8), komponens-bővítések (B1–B4), új komponensek (C1–C7) | createDOMBlocks |
| **D** | `plans/dokumentacio-generalas-terv.md` | A dokumentáció-generálás bővítése (D1–D9) | createDOMBlocks |
| **Y** | `plans/yaml-improvement.md` | A competitions-oldal YAML-jának takarítása | 2026-27-competitions (domblocks worktree) |
| **P** | `plans/dev-portfolio-yaml-ujrairas-felmeres.md` | A portfólió átírása (0–6. szakasz) | dev-portfolio |
| **C** | `plans/cv-yaml-ujrairas-felmeres.md` | A cv átírása (0–7. szakasz) | cv |

A **Y** terv könyvtár-szintű pontjai (csendes elírás, `stable()` / `syncing`) a **K** A5–A8 tételeibe kerültek; a **Y**-ban csak az oldal saját takarítása marad.

## Elvek

1. **Előbb a könyvtár, aztán az oldalak.** Egy oldal-szakasz csak akkor indul, ha a **K** előfeltételei kész és kiadott verzióban vannak.
2. **A dokumentáció a kóddal együtt készül.** A **D** generátor-javításai (D1–D3) megelőzik az új komponenseket, így minden új komponens magától teljes docs-oldalt kap.
3. **Kiadás mérföldkövenként.** A könyvtár verziózása a CI dolga (merge a main-re → új verzió). Minden mérföldkő után az oldalprojektek a `sync-domblocks.mjs`-sel frissítik a vendorolt fájlokat.
4. **Kicsitől a nagy felé, kísérleti oldallal.** A competitions (már YAML-os) az első próbapad, a portfólió (egy oldal, kevés előfeltétel) a második, a cv (hat nézet, legtöbb előfeltétel) az utolsó.

## Sorrend

| # | Mérföldkő | Mit kell elvégezni | Előfeltétel | Eredmény |
|---|---|---|---|---|
| 0 | Kiindulás | A `feature/yaml-descriptor` ág lezárása (PR, merge), hogy az új munka a main-ről induljon | – | kiadott alapverzió |
| 1 | Leíró-alapok | **K** 1. szakasz (A1–A4) + **D** 1. lépés (D4 `keywords.ts`, D6 séma) | 0 | `attrs`, `t`+`html`, `locale`, `onMount` dokumentálva |
| 2 | Generátor-előkészítés | **D** 2. lépés (D1, D2, D3) | 1 | új komponens → teljes oldal automatikusan |
| 3 | Leíró-ergonómia | **K** 1b. szakasz (A5–A8) + **D** 3. lépés (D5) + **D** D7 1–6. fejezet | 1 | `each` újrahasznosítás, `derive`, `strict`, HTML-validálás |
| 4 | Competitions takarítás (próbapad) | **Y** javaslatai (1–3., 5.) + a `stable()` és a `syncing` kiváltása **K** A5/A6-tal + vendor-szinkron | 3 | a leíró-bővítések éles próbája egy kész oldalon |
| 5 | Kis komponensek | **K** 2. szakasz (C3, C4, C5, B2) + 3. szakasz (B1) + a hozzájuk tartozó **D** D8 minták | 2 | a portfólió és a cv közös keretének építőelemei |
| 6 | Portfólió, 0–4. szakasz | **P** 0–4. szakasz | 3, 5 | keret, hero, projektek, skillek, idővonal, kapcsolat YAML-ban |
| 7 | Foglalás és zene | **K** 4. szakasz (C6, B3) + **D** D8 minták | 5 | `SlotPicker`, bővített `MusicPlayer` |
| 8 | Portfólió befejezése | **P** 5–6. szakasz | 6, 7 | a portfólió teljesen YAML-alapú |
| 9 | cv, 0–2. szakasz | **C** 0–2. szakasz (közös keret, plain, index) | 7 (és a 8. tapasztalatai) | a cv közös kerete és első két nézete |
| 10 | cv swagger | **C** 4. szakasz | 9 | – |
| 11 | Átrendezés | **K** 5. szakasz (C1, B4) + **D** D8 | 5 | `Sortable`, rendezhető Gantt |
| 12 | cv gantt | **C** 3. szakasz | 9, 11 | – |
| 13 | Kanban | **K** 6. szakasz (C2) + **D** D8 | 11 | `Board` |
| 14 | cv scrumboard | **C** 5. szakasz | 9, 13 | – |
| 15 | Kódnézet | **K** 7. szakasz (C7) + **D** D8 | 2 | `CodeView` |
| 16 | cv json | **C** 6. szakasz | 9, 15 | – |
| 17 | Lezárás | **C** 7. szakasz (szabályok, skillek, README) + **D** D7 7. fejezet + **D** D9 (skill, katalógus) | 8, 16 | dokumentáció és AI-folyamatok naprakészek |

## A dokumentáció-generálás (D) helye a sorrendben

| D-tétel | Tárgy | Mérföldkő |
|---|---|---|
| D4 | A leíró kulcsszavai egy JSDoc-os forrásban (`src/spec/keywords.ts`), ebből a referencia | 1 |
| D6 | Közös kulcsok (`attrs`, `onMount`) a JSON Schemában | 1 |
| D1 | Adatvezérelt API-csoportok | 2 |
| D2 | YAML-minta függvény-paraméterrel (`"@kezelő"`) | 2 |
| D3 | „YAML-ban” doboz a komponensoldalakon (kötés, updaterek) | 2 |
| D5 | A `buildUI` / `mountYaml` beállításainak mezői az API-oldalon | 3 |
| D7 | A kézzel írt YAML-útmutató új fejezetei (1–6.: 3. mérföldkő; 7.: 17.) | 3, 17 |
| D8 | Állapotos kézi YAML-minták élő kezelőkkel | 5, 7, 11, 13, 15 (az adott komponenssel együtt) |
| D9 | A `yaml-page` skill és a `spec-catalog` frissítése | 17 (az A-tételek után egy köztes frissítés a 3.-ban) |

Az új komponensek docs-oldala (paramétertábla, menüpont, generált YAML-minta) a 2. mérföldkő után **magától** elkészül; a D-tételek ezt teszik teljessé.

## Párhuzamosítható ágak

A könyvtár és az oldalak munkája a függőségeken belül párhuzamosan haladhat:

```
könyvtár:   1 ─ 2 ─ 3 ─ 5 ─ 7 ─ 11 ─ 13 ─ 15 ─────────────── 17
                     │    │    │     │     │     │              │
oldalak:             4    6 ── 8 ── 9 ─ 10 ─ 12 ─ 14 ─ 16 ──────┘
```

- A 10. (cv swagger) nem vár új komponensre, a 9. után azonnal mehet, miközben a könyvtárban a 11. készül.
- A 15. (CodeView) független a 11–13-tól, előrehozható, ha a json-nézet fontosabb a scrumboardnál.
- Ha a cv json- és scrumboard-nézete kimarad (**C** nyitott kérdése), a 13–16. mérföldkő elhagyható.

## Durva időbecslés

| Szakasz | Mérföldkövek | Becslés |
|---|---|---|
| Könyvtár-alapok és dokumentáció | 0–3 | kb. 1,5–2 hét |
| Próbapad és kis komponensek | 4–5 | kb. 1,5 hét |
| Portfólió | 6–8 | kb. 2 hét |
| cv (keret, plain, index, swagger) | 9–10 | kb. 1,5 hét |
| Nagy komponensek és a maradék cv-nézetek | 11–16 | kb. 3–4 hét |
| Lezárás | 17 | kb. 2–3 nap |

Összesen kb. 10–12 hét egy fejlesztővel, sorosan. Párhuzamos könyvtár- és oldalmunkával kb. 8 hét.

## Mérföldkövenként kötelező

1. A könyvtárban: `npx tsc --noEmit`, `npx vitest run`, `npm run check:i18n`, `npm run build:page` hibátlan, a docs-oldal böngészőben ellenőrizve (világos, sötét, mobil).
2. Kiadás után: a competitions smoke-tesztje (`yamlsmoke.cjs`) a frissített vendor-fájlokkal zöld.
3. Az oldalprojektben: a saját tesztek (cv: Playwright; portfólió: `npm run verify` + DOM-teszt; competitions: smoke) és a `validate-spec` a beágyazott YAML-ra.
4. A tervekben a kész tételek jelölése (✅) és az eltérések rögzítése, hogy a mesterterv követhető maradjon.
