import { initDocPage, renderSections, example } from "../page-components/index";
import { tr } from "../page-components/i18n";
import { createTimeInput } from "../../src/index";

const done = initDocPage();

const sections = [
  example(
    { title: tr("Time input"), description: tr("Idő kiválasztó."), component: createTimeInput },
    (parent) => createTimeInput({ parent, id: "t10", labelText: "Idő:", value: "14:30" }),
  ),
];

renderSections(sections);
done();
