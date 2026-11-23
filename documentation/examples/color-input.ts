import { initDocPage, renderSections, example } from "../page-components/index";
import { tr } from "../page-components/i18n";
import { createColorInput } from "../../src/index";

const done = initDocPage();

const sections = [
  example(
    { title: tr("Color input"), description: tr("Szín kiválasztó."), component: createColorInput },
    (parent) => createColorInput({ parent, id: "t14", labelText: "Szín:", value: "#3b82f6" }),
  ),
];

renderSections(sections);
done();
