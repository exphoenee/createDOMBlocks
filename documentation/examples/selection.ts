import { initDocPage, renderSections, example } from "../page-components/index";
import { createSelect, createRadio, createCustomSelect, createTextarea } from "../../src/index";

const done = initDocPage();

const sections = [
  example(
    { title: "createSelect", description: "Legördülő menü opciókkal." },
    (parent) => createSelect({ parent, id: "s1", labelText: "", value: 2,
      options: [{ text: "Első", value: 1 }, { text: "Második", value: 2 }, { text: "Harmadik", value: 3 }] }),
  ),
  example(
    { title: "createRadio", description: "Radio gomb csoport opciókkal." },
    (parent) => createRadio({ parent, id: "s2", labelText: "", value: 2,
      options: [{ text: "Első", value: 1 }, { text: "Második", value: 2 }, { text: "Harmadik", value: 3 }] }),
  ),
  example(
    { title: "createCustomSelect", description: "Custom legördülő egyéni stílussal." },
    (parent) => createCustomSelect({ parent, id: "s3", labelText: "", placeholder: "Valássz...",
      options: [{ text: "Budapest", value: "bp" }, { text: "Debrecen", value: "dc" }],
      onChange: (val: string | number) => console.log("Select:", val) }),
  ),
  example(
    { title: "createTextarea", description: "Szövegdoboz sorokkal és oszlopokkal." },
    (parent) => createTextarea({ parent, id: "s4", labelText: "Szöveg:", value: "Szöveg...", rows: 5, cols: 40 }),
  ),
];

renderSections(sections);
done();
