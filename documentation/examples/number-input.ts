import { initDocPage, renderSections, example } from "../page-components/index";
import { tr } from "../page-components/i18n";
import { createNumberInput } from "../../src/index";

const done = initDocPage();

const sections = [
  example(
    { title: tr("Number input"), description: tr("Szám input min/max/step paraméterrel."), component: createNumberInput },
    (parent) => createNumberInput({ parent, id: "t7", labelText: "Szám:", value: "42", min: 0, max: 100, step: 5 }),
  ),
];

renderSections(sections);
done();
