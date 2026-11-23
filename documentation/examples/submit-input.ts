import { initDocPage, renderSections, example } from "../page-components/index";
import { tr } from "../page-components/i18n";
import { createSubmitInput } from "../../src/index";

const done = initDocPage();

const sections = [
  example(
    { title: tr("Submit input"), description: tr("Submit gomb, form-ok küldéséhez."), component: createSubmitInput },
    (parent) => createSubmitInput({ parent, id: "b2", text: "Küldés" }),
  ),
];

renderSections(sections);
done();
