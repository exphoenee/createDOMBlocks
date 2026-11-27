import { initDocPage, renderSections, example } from "../page-components/index";
import { tr } from "../page-components/i18n";
import { createDatetimeInput } from "../../src/index";

const done = initDocPage();

const sections = [
  example(
    { title: tr("Datetime input"), description: tr("Dátum és idő kiválasztó."), component: createDatetimeInput },
    (parent) => createDatetimeInput({ parent, id: "t9", labelText: "Dátum-Idő:", value: "2024-01-15T14:30" }),
  ),
];

renderSections(sections);
done();
