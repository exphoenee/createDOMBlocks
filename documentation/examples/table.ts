import { initDocPage, renderSections, example } from "../page-components/index";
import { tr } from "../page-components/i18n";
import { createTable } from "../../src/index";
import type { TableServerQuery } from "../../src/index";

const done = initDocPage();

const sections = [
  example(
    { title: tr("Table (tömb)"), description: tr("Táblázat tömböl építve, fejléccel, sor számokkal és összeg oszloppal."), component: createTable },
    (parent) => createTable([
      ["Név", "Kor", "Város"], ["Anna", 25, "Budapest"], ["Béla", 32, "Debrecen"], ["Csaba", 18, "Szeged"],
    ], { parent, id: "tbl-array", hasHeader: true, addRowNumbers: true, sumRowValues: true }),
  ),
  example(
    { title: tr("Table (objektum)"), description: tr("Táblázat objektum tömböl, automatikus fejléccel.") },
    (parent) => createTable([
      { Termék: "Laptop", Ár: 299000, Készlet: 15 },
      { Termék: "Monitor", Ár: 149000, Készlet: 23 },
      { Termék: "Billentyű", Ár: 24900, Készlet: 50 },
    ], { parent, id: "tbl-object", hasHeader: true, hasFooter: true, addRowNumbers: true }),
  ),
  example(
    { title: tr("Table – rendezhető"), description: tr("A `sortable: true` a fejlécre kattintva rendez: növekvő → csökkenő → eredeti sorrend. A számok számként, a szövegek magyar ábécé szerint hasonlítódnak össze."), component: createTable },
    (parent) => createTable([
      { Név: "Anna", Kor: 25, Város: "Budapest", Pont: 82.5 },
      { Név: "Béla", Kor: 32, Város: "Debrecen", Pont: 91 },
      { Név: "Csaba", Kor: 18, Város: "Szeged", Pont: 67.25 },
      { Név: "Éva", Kor: 41, Város: "Pécs", Pont: 74 },
      { Név: "Ödön", Kor: 29, Város: "Győr", Pont: 88.5 },
    ], { parent, id: "tbl-sortable", hasHeader: true, sortable: true }),
  ),
  example(
    { title: tr("Table – szűrhető"), description: tr("A `filterable: true` szűrőmezőt ad a táblázat fölé; a sorok bármely cellájában keres, kis- és nagybetűre érzéketlenül. Találat nélkül üzenet jelenik meg.") },
    (parent) => createTable([
      { Termék: "Laptop", Kategória: "Számítógép", Ár: 299000 },
      { Termék: "Monitor", Kategória: "Periféria", Ár: 149000 },
      { Termék: "Billentyűzet", Kategória: "Periféria", Ár: 24900 },
      { Termék: "Egér", Kategória: "Periféria", Ár: 9900 },
      { Termék: "Asztali gép", Kategória: "Számítógép", Ár: 399000 },
      { Termék: "Nyomtató", Kategória: "Iroda", Ár: 59900 },
    ], { parent, id: "tbl-filter", hasHeader: true, filterable: true, labels: { filter: "Keresés a termékek között…" } }),
  ),
  example(
    { title: tr("Table – lapozás, szűrés és rendezés együtt"), description: tr("A `pageSize` lapoz, a `pageSizeOptions` oldalméret-választót ad. A három funkció külön-külön is, együtt is használható; a lábléc összegei az összes sorra vonatkoznak."), component: createTable },
    (parent) => {
      const cities = ["Budapest", "Debrecen", "Szeged", "Pécs", "Győr", "Miskolc", "Nyíregyháza"];
      const rows = Array.from({ length: 53 }, (_, i) => ({
        Azonosító: i + 1,
        Név: `Felhasználó ${i + 1}`,
        Város: cities[i % cities.length],
        Pont: ((i * 37) % 100) + 1,
      }));
      return createTable(rows, {
        parent,
        id: "tbl-paged",
        hasHeader: true,
        hasFooter: true,
        sortable: true,
        filterable: true,
        pageSize: 10,
        pageSizeOptions: [5, 10, 25],
      });
    },
  ),
  example(
    { title: tr("Table – oldalméret-választó (select)"), description: tr("A `pageSizeOptions` tömb adja a select opcióit a megadott sorrendben, pl. `[5, 10, 15]` vagy `[10, 25, 50, 100, \"all\"]`. Az `\"all\"` a Mind opció (minden sor egy oldalon). Külön `pageSize` nélkül az első szám az alapértelmezett.") },
    (parent) => {
      const rows = Array.from({ length: 120 }, (_, i) => ({ Sor: i + 1, Érték: ((i * 53) % 97) + 3 }));
      return createTable(rows, {
        parent,
        id: "tbl-sizes",
        hasHeader: true,
        sortable: true,
        pageSizeOptions: [10, 25, 50, 100, "all"],
        labels: { rowsPerPage: "Sor / oldal:", all: "Mind" },
      });
    },
  ),
  example(
    { title: tr("Table – szerveroldali lapozás"), description: tr("A `serverSide` módban a táblázat nem dolgozik a sorokkal: az előző / következő gombok, az oldalszámok, az oldalméret-választó, a rendezés és a szűrés az `onChange`-et hívják (oldal, oldalméret, szűrő, rendezés). A választ a visszaadott elem `setData(rows, { total })`-jával kell megadni; addig a táblázat betöltés állapotú, a lapozó letiltott. Itt egy 600 ms késleltetésű mock szerver szolgálja ki az adatot."), component: createTable },
    (parent) => {
      // mock szerver: 237 sor, szűrés + rendezés + lapozás késleltetéssel
      const all = Array.from({ length: 237 }, (_, i) => ({ Azonosító: i + 1, Név: `Felhasználó ${i + 1}`, Pont: ((i * 37) % 100) + 1 }));
      const fetchPage = (q: TableServerQuery) =>
        new Promise<{ rows: typeof all; total: number }>((resolve) =>
          setTimeout(() => {
            let list = all.filter((r) => !q.filter || Object.values(r).join(" ").toLowerCase().includes(q.filter.toLowerCase()));
            if (q.sort) {
              const key = q.sort.column as keyof (typeof all)[number];
              const dir = q.sort.direction === "asc" ? 1 : -1;
              list = [...list].sort((a, b) => (a[key] > b[key] ? dir : a[key] < b[key] ? -dir : 0));
            }
            const size = q.pageSize === "all" ? list.length : q.pageSize;
            resolve({ rows: list.slice((q.page - 1) * size, q.page * size), total: list.length });
          }, 600)
        );

      const table = createTable(all.slice(0, 10), {
        parent,
        id: "tbl-server",
        hasHeader: true,
        sortable: true,
        filterable: true,
        pageSize: 10,
        pageSizeOptions: [10, 25, 50],
        serverSide: {
          total: all.length,
          onChange: (query) => {
            fetchPage(query)
              .then(({ rows, total }) => table.setData(rows, { total }))
              .catch(() => table.setLoading(false));
          },
        },
      });
      return table;
    },
  ),
];

renderSections(sections);
done();
