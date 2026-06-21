import { initDocPage, renderSections } from "../page-components/index";
import { createUnorderedList, createOrderedList } from "../../src/index";
import type { DocSection } from "../page-components/index";

initDocPage();

const sections: DocSection[] = [
  {
    title: "createUnorderedList",
    description: "Rendezetlen lista (ul) elemekből.",
    code: `createUnorderedList(\n  ["Első", "Második", "Harmadik", "Negyedik"],\n  { parent: "#app", id: "ul1" }\n);`,
    codeLang: "typescript",
    render: (c) => createUnorderedList(["Első", "Második", "Harmadik", "Negyedik"], { parent: c, id: "l1" }),
  },
  {
    title: "createOrderedList",
    description: "Rendezett lista (ol) indulásos számmal.",
    code: `createOrderedList(\n  ["Tizedik", "Tizenegyedik", "Tizenkettedik"],\n  { parent: "#app", id: "ol1", start: 10 }\n);`,
    codeLang: "typescript",
    render: (c) => createOrderedList(["Tizedik", "Tizenegyedik", "Tizenkettedik"], { parent: c, id: "l2", start: 10 }),
  },
];

renderSections(sections);
