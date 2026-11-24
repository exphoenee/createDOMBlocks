import { initDocPage, renderSections, example } from "../page-components/index";
import { tr } from "../page-components/i18n";
import { createFileInput } from "../../src/index";

const done = initDocPage();

const sections = [
  example(
    { title: tr("File input"), description: tr("Fájl kiválasztó."), component: createFileInput },
    (parent) => createFileInput({ parent, id: "t15", labelText: "Fájl:" }),
  ),
];

renderSections(sections);
done();
