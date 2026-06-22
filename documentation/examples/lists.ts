import { initDocPage, renderSections, example } from "../page-components/index";
import { createUnorderedList, createOrderedList } from "../../src/index";

const done = initDocPage();

const sections = [
  example(
    { title: "createUnorderedList", description: "Rendezetlen lista (ul) elemekből." },
    (parent) => createUnorderedList(["Első", "Második", "Harmadik", "Negyedik"], { parent, id: "l1" }),
  ),
  example(
    { title: "createOrderedList", description: "Rendezett lista (ol) indulásos számmal." },
    (parent) => createOrderedList(["Tizedik", "Tizenegyedik", "Tizenkettedik"], { parent, id: "l2", start: 10 }),
  ),
];

renderSections(sections);
done();
