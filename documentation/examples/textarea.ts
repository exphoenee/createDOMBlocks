import { initDocPage, renderSections, example } from "../page-components/index";
import { tr } from "../page-components/i18n";
import { createTextarea } from "../../src/index";

const done = initDocPage();

const sections = [
  example(
    { title: tr("Textarea"), description: tr("Szövegdoboz sorokkal és oszlopokkal."), component: createTextarea },
    (parent) => createTextarea({ parent, id: "s4", labelText: "Szöveg:", value: "Szöveg...", rows: 5, cols: 40 }),
  ),
];

renderSections(sections);
done();
