import { initDocPage, renderSections, example } from "../page-components/index";
import { createDateInput } from "../../src/index";

const done = initDocPage();

const sections = [
  example(
    { title: "createDateInput", description: "Dátum kiválasztó.", component: createDateInput },
    (parent) => createDateInput({ parent, id: "t8", labelText: "Dátum:", value: "2024-01-15" }),
  ),
];

renderSections(sections);
done();
