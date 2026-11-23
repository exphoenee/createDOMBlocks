import { initDocPage, renderSections, example } from "../page-components/index";
import { createWeekInput } from "../../src/index";

const done = initDocPage();

const sections = [
  example(
    { title: "Week input", description: "Hét kiválasztó.", component: createWeekInput },
    (parent) => createWeekInput({ parent, id: "t12", labelText: "Hét:", value: "2024-W03" }),
  ),
];

renderSections(sections);
done();
