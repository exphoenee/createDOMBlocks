import { initDocPage, renderSections, example } from "../page-components/index";
import { createGrid } from "../../src/index";

const done = initDocPage();

const sections = [
  example(
    { title: "Grid", description: "Rács elrendezés oszlopokkal.", component: createGrid },
    (parent) => { createGrid({ parent, id: "c2", columns: 3, gap: "1rem" }); },
  ),
];

renderSections(sections);
done();
