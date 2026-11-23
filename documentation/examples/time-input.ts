import { initDocPage, renderSections, example } from "../page-components/index";
import { createTimeInput } from "../../src/index";

const done = initDocPage();

const sections = [
  example(
    { title: "createTimeInput", description: "Idő kiválasztó.", component: createTimeInput },
    (parent) => createTimeInput({ parent, id: "t10", labelText: "Idő:", value: "14:30" }),
  ),
];

renderSections(sections);
done();
