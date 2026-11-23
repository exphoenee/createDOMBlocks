import { initDocPage, renderSections, example } from "../page-components/index";
import { createFileInput } from "../../src/index";

const done = initDocPage();

const sections = [
  example(
    { title: "File input", description: "Fájl kiválasztó.", component: createFileInput },
    (parent) => createFileInput({ parent, id: "t15", labelText: "Fájl:" }),
  ),
];

renderSections(sections);
done();
