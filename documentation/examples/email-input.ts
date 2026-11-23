import { initDocPage, renderSections, example } from "../page-components/index";
import { createEmailInput } from "../../src/index";

const done = initDocPage();

const sections = [
  example(
    { title: "createEmailInput", description: "E-mail input.", component: createEmailInput },
    (parent) => createEmailInput({ parent, id: "t5", labelText: "Email:", value: "test@example.com" }),
  ),
];

renderSections(sections);
done();
