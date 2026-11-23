import { initDocPage, renderSections, example } from "../page-components/index";
import { createTitle } from "../../src/index";

const done = initDocPage();

const sections = [
  example(
    { title: "Title", description: "Címsor h1-h6 szintekkel.", component: createTitle },
    (parent) => { for (let i = 1; i <= 3; i++) createTitle({ parent, id: `cont-title${i}`, text: `Címsor ${i}` }, i); },
  ),
];

renderSections(sections);
done();
