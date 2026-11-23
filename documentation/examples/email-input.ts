import { initDocPage, renderSections, example } from "../page-components/index";
import { tr } from "../page-components/i18n";
import { createEmailInput } from "../../src/index";

const done = initDocPage();

const sections = [
  example(
    { title: tr("Email input"), description: tr("E-mail input."), component: createEmailInput },
    (parent) => createEmailInput({ parent, id: "t5", labelText: "Email:", value: "test@example.com" }),
  ),
];

renderSections(sections);
done();
