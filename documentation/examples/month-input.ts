import { initDocPage, renderSections, example } from "../page-components/index";
import { tr } from "../page-components/i18n";
import { createMonthInput } from "../../src/index";

const done = initDocPage();

const sections = [
  example(
    { title: tr("Month input"), description: tr("Hónap kiválasztó."), component: createMonthInput },
    (parent) => createMonthInput({ parent, id: "t11", labelText: "Hónap:", value: "2024-01" }),
  ),
];

renderSections(sections);
done();
