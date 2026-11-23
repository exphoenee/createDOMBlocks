import { initDocPage, renderSections, example } from "../page-components/index";
import { createSubmitInput } from "../../src/index";

const done = initDocPage();

const sections = [
  example(
    { title: "createSubmitInput", description: "Submit gomb, form-ok küldéséhez.", component: createSubmitInput },
    (parent) => createSubmitInput({ parent, id: "b2", text: "Küldés" }),
  ),
];

renderSections(sections);
done();
