import { initDocPage, renderSections, example } from "../page-components/index";
import { createColorInput } from "../../src/index";

const done = initDocPage();

const sections = [
  example(
    { title: "createColorInput", description: "Szín kiválasztó.", component: createColorInput },
    (parent) => createColorInput({ parent, id: "t14", labelText: "Szín:", value: "#3b82f6" }),
  ),
];

renderSections(sections);
done();
