import { initDocPage, renderSections, example } from "../page-components/index";
import { createUnorderedList } from "../../src/index";

const done = initDocPage();

const sections = [
  example(
    { title: "createUnorderedList", description: "Rendezetlen lista (ul) elemekből.", component: createUnorderedList },
    (parent) => createUnorderedList(["Első", "Második", "Harmadik", "Negyedik"], { parent, id: "l1" }),
  ),
];

renderSections(sections);
done();
