import { initDocPage, renderSections } from "../page-components/index";
import { createSelect, createRadio, createCustomSelect, createTextarea } from "../../src/index";
import type { DocSection } from "../page-components/index";

initDocPage();

const sections: DocSection[] = [
  {
    title: "createSelect",
    description: "Legördülő menü opciókkal.",
    code: `createSelect({\n  parent: "#app",\n  id: "selectInput",\n  labelText: "Valássz:",\n  value: 2,\n  options: [\n    { text: "Első", value: 1 },\n    { text: "Második", value: 2 },\n    { text: "Harmadik", value: 3 },\n  ],\n});`,
    codeLang: "typescript",
    render: (c) => createSelect({ parent: c, id: "s1", labelText: "", value: 2,
      options: [{ text: "Első", value: 1 }, { text: "Második", value: 2 }, { text: "Harmadik", value: 3 }] }),
  },
  {
    title: "createRadio",
    description: "Radio gomb csoport opciókkal.",
    code: `createRadio({\n  parent: "#app",\n  id: "radioInput",\n  labelText: "Radio:",\n  value: 2,\n  options: [\n    { text: "Első", value: 1 },\n    { text: "Második", value: 2 },\n    { text: "Harmadik", value: 3 },\n  ],\n});`,
    codeLang: "typescript",
    render: (c) => createRadio({ parent: c, id: "s2", labelText: "", value: 2,
      options: [{ text: "Első", value: 1 }, { text: "Második", value: 2 }, { text: "Harmadik", value: 3 }] }),
  },
  {
    title: "createCustomSelect",
    description: "Custom legördülő egyéni stílussal.",
    code: `createCustomSelect({\n  parent: "#app",\n  id: "customSelect",\n  labelText: "Custom:",\n  placeholder: "Valássz...",\n  options: [\n    { text: "Budapest", value: "bp" },\n    { text: "Debrecen", value: "dc" },\n  ],\n  onChange: (val) => console.log(val),\n});`,
    codeLang: "typescript",
    render: (c) => createCustomSelect({ parent: c, id: "s3", labelText: "", placeholder: "Valássz...",
      options: [{ text: "Budapest", value: "bp" }, { text: "Debrecen", value: "dc" }],
      onChange: (val: string | number) => console.log("Select:", val) }),
  },
  {
    title: "createTextarea",
    description: "Szövegdoboz sorokkal és oszlopokkal.",
    code: `createTextarea({\n  parent: "#app",\n  id: "textarea",\n  labelText: "Szöveg:",\n  value: "Szöveg...",\n  rows: 5, cols: 40,\n});`,
    codeLang: "typescript",
    render: (c) => createTextarea({ parent: c, id: "s4", labelText: "", value: "Szöveg...", rows: 5, cols: 40 }),
  },
];

renderSections(sections);
