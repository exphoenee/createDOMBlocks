import { initDocPage, renderSections, example } from "../page-components/index";
import { createTable } from "../../src/index";

const done = initDocPage();

const sections = [
  example(
    { title: "createTable (tömb)", description: "Táblázat tömböl építve, fejléccel, sor számokkal és összeg oszloppal." },
    (parent) => createTable([
      ["Név", "Kor", "Város"], ["Anna", 25, "Budapest"], ["Béla", 32, "Debrecen"], ["Csaba", 18, "Szeged"],
    ], { parent, id: "tbl-array", hasHeader: true, addRowNumbers: true, sumRowValues: true }),
  ),
  example(
    { title: "createTable (objektum)", description: "Táblázat objektum tömböl, automatikus fejléccel." },
    (parent) => createTable([
      { Termék: "Laptop", Ár: 299000, Készlet: 15 },
      { Termék: "Monitor", Ár: 149000, Készlet: 23 },
      { Termék: "Billentyű", Ár: 24900, Készlet: 50 },
    ], { parent, id: "tbl-object", hasHeader: true, hasFooter: true, addRowNumbers: true }),
  ),
];

renderSections(sections);
done();
