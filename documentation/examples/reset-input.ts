import { initDocPage, renderSections, example } from "../page-components/index";
import { tr } from "../page-components/i18n";
import { createResetInput } from "../../src/index";

const done = initDocPage();

const sections = [
  example(
    { title: tr("Reset input"), description: tr("Reset gomb, form visszaállításhoz."), component: createResetInput },
    (parent) => createResetInput({ parent, id: "b3", text: "Visszaállítás" }),
  ),
];

renderSections(sections);
done();
