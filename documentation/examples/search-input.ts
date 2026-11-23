import { initDocPage, renderSections, example } from "../page-components/index";
import { createSearchInput } from "../../src/index";

const done = initDocPage();

const sections = [
  example(
    { title: "Search input", description: "Keresési mezők.", component: createSearchInput },
    (parent) => createSearchInput({ parent, id: "t4", labelText: "Keresés:", placeholder: "Keress..." }),
  ),
];

renderSections(sections);
done();
