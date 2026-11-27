import { initDocPage, renderSections, example } from "../page-components/index";
import { tr } from "../page-components/i18n";
import { createRangeInput } from "../../src/index";

const done = initDocPage();

const sections = [
  example(
    { title: tr("Range input"), description: tr("Csúska min/max/step paraméterrel."), component: createRangeInput },
    (parent) => createRangeInput({ parent, id: "t16", labelText: "Csúska:", min: 0, max: 100, value: "50" }),
  ),
];

renderSections(sections);
done();
