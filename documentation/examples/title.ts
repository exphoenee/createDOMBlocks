import { initDocPage, renderSections, example } from "../page-components/index";
import { tr } from "../page-components/i18n";
import { createTitle } from "../../src/index";

const done = initDocPage();

const sections = [
  example(
    { title: tr("Title"), description: tr("Címsor h1-h6 szintekkel."), component: createTitle },
    (parent) => { for (let i = 1; i <= 3; i++) createTitle({ parent, id: `cont-title${i}`, text: `Címsor ${i}` }, i); },
  ),
];

renderSections(sections);
done();
