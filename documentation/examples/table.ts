import { initDocPage, renderSections, example } from "../page-components/index";
import { createTable } from "../../src/index";

const done = initDocPage();

const sections = [
  example(
    { title: "Table (tömb)", description: "Táblázat tömböl építve, fejléccel, sor számokkal és összeg oszloppal.", component: createTable },
    (parent) => createTable([
      ["Név", "Kor", "Város"], ["Anna", 25, "Budapest"], ["Béla", 32, "Debrecen"], ["Csaba", 18, "Szeged"],
    ], { parent, id: "tbl-array", hasHeader: true, addRowNumbers: true, sumRowValues: true }),
  ),
  example(
    { title: "Table (objektum)", description: "Táblázat objektum tömböl, automatikus fejléccel." },
    (parent) => createTable([
      { Termék: "Laptop", Ár: 299000, Készlet: 15 },
      { Termék: "Monitor", Ár: 149000, Készlet: 23 },
      { Termék: "Billentyű", Ár: 24900, Készlet: 50 },
    ], { parent, id: "tbl-object", hasHeader: true, hasFooter: true, addRowNumbers: true }),
  ),
  example(
    { title: "Table – rendezhető", description: "A `sortable: true` a fejlécre kattintva rendez: növekvő → csökkenő → eredeti sorrend. A számok számként, a szövegek magyar ábécé szerint hasonlítódnak össze.", component: createTable },
    (parent) => createTable([
      { Név: "Anna", Kor: 25, Város: "Budapest", Pont: 82.5 },
      { Név: "Béla", Kor: 32, Város: "Debrecen", Pont: 91 },
      { Név: "Csaba", Kor: 18, Város: "Szeged", Pont: 67.25 },
      { Név: "Éva", Kor: 41, Város: "Pécs", Pont: 74 },
      { Név: "Ödön", Kor: 29, Város: "Győr", Pont: 88.5 },
    ], { parent, id: "tbl-sortable", hasHeader: true, sortable: true }),
  ),
  example(
    { title: "Table – szűrhető", description: "A `filterable: true` szűrőmezőt ad a táblázat fölé; a sorok bármely cellájában keres, kis- és nagybetűre érzéketlenül. Találat nélkül üzenet jelenik meg." },
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
    { title: "Table – lapozás, szűrés és rendezés együtt", description: "A `pageSize` lapoz, a `pageSizeOptions` oldalméret-választót ad. A három funkció külön-külön is, együtt is használható; a lábléc összegei az összes sorra vonatkoznak.", component: createTable },
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
];

renderSections(sections);
done();
