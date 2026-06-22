import { initDocPage, renderSections, example } from "../page-components/index";
import { createUnorderedList, createOrderedList } from "../../src/index";

const done = initDocPage();

const sections = [
  example(
    { title: "createUnorderedList", description: "Rendezetlen lista (ul) elemekből.", component: createUnorderedList },
    (parent) => createUnorderedList(["Első", "Második", "Harmadik", "Negyedik"], { parent, id: "l1" }),
  ),
  example(
    { title: "createOrderedList", description: "Rendezett lista (ol) indulásos számmal.", component: createOrderedList },
    (parent) => createOrderedList(["Tizedik", "Tizenegyedik", "Tizenkettedik"], { parent, id: "l2", start: 10 }),
  ),
];

renderSections(sections);
done();
