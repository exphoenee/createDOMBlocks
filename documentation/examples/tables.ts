import { initDocPage, renderSections } from "../page-components/index";
import { createTable } from "../../src/index";
import type { DocSection } from "../page-components/index";

initDocPage();

const sections: DocSection[] = [
  {
    title: "createTable (tömb)",
    description: "Táblázat tömböl építve, fejléccel, sor számokkal és összeg oszloppal.",
    code: `createTable([\n  ["Név", "Kor", "Város"],\n  ["Anna", 25, "Budapest"],\n  ["Béla", 32, "Debrecen"],\n  ["Csaba", 18, "Szeged"],\n], {\n  parent: "#app",\n  hasHeader: true,\n  addRowNumbers: true,\n  sumRowValues: true,\n});`,
    codeLang: "typescript",
    render: (c) => createTable([
      ["Név", "Kor", "Város"], ["Anna", 25, "Budapest"], ["Béla", 32, "Debrecen"], ["Csaba", 18, "Szeged"],
    ], { parent: c, hasHeader: true, addRowNumbers: true, sumRowValues: true }),
  },
  {
    title: "createTable (objektum)",
    description: "Táblázat objektum tömböl, automatikus fejléccel.",
    code: `createTable([\n  { Termék: "Laptop", Ár: 299000 },\n  { Termék: "Monitor", Ár: 149000 },\n  { Termék: "Billentyű", Ár: 24900 },\n], {\n  parent: "#app",\n  hasHeader: true,\n  hasFooter: true,\n});`,
    codeLang: "typescript",
    render: (c) => createTable([
      { Termék: "Laptop", Ár: 299000, Készlet: 15 },
      { Termék: "Monitor", Ár: 149000, Készlet: 23 },
      { Termék: "Billentyű", Ár: 24900, Készlet: 50 },
    ], { parent: c, hasHeader: true, hasFooter: true, addRowNumbers: true }),
  },
];

renderSections(sections);
