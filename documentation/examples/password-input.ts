import { initDocPage, renderSections, example } from "../page-components/index";
import { createPasswordInput } from "../../src/index";

const done = initDocPage();

const sections = [
  example(
    { title: "createPasswordInput", description: "Jelszó input.", component: createPasswordInput },
    (parent) => createPasswordInput({ parent, id: "t6", labelText: "Jelszó:", placeholder: "****" }),
  ),
];

renderSections(sections);
done();
