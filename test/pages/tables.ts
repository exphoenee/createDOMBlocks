import { createTable } from "../../src/index";

createTable([
  ["Nev", "Kor", "Varos"],
  ["Anna", 25, "Budapest"],
  ["Bela", 32, "Debrecen"],
  ["Csaba", 18, "Szeged"],
], { parent: "#app-table1", id: "table1", hasHeader: true, addRowNumbers: true, sumRowValues: true,
  cellNames: { sum: "Osszes", total: "Osszeg", rowNr: "#" } });

createTable([
  { Termek: "Laptop", Ar: 299000, Keszlet: 15 },
  { Termek: "Monitor", Ar: 149000, Keszlet: 23 },
  { Termek: "Billentyu", Ar: 24900, Keszlet: 50 },
], { parent: "#app-table2", id: "table2", hasHeader: true, hasFooter: true, addRowNumbers: true });
