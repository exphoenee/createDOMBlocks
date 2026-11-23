import { initDocPage, renderSections, example } from "../page-components/index";
import { createNumberInput } from "../../src/index";

const done = initDocPage();

const sections = [
  example(
    { title: "createNumberInput", description: "Szám input min/max/step paraméterrel.", component: createNumberInput },
    (parent) => createNumberInput({ parent, id: "t7", labelText: "Szám:", value: "42", min: 0, max: 100, step: 5 }),
  ),
];

renderSections(sections);
done();
