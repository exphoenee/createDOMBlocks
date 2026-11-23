import { initDocPage, renderSections, example } from "../page-components/index";
import { tr } from "../page-components/i18n";
import { createRadio } from "../../src/index";

const done = initDocPage();

const sections = [
  example(
    { title: tr("Radio"), description: tr("Radio gomb csoport opciókkal."), component: createRadio },
    (parent) => createRadio({ parent, id: "s2", labelText: "", value: 2,
      options: [{ text: "Első", value: 1 }, { text: "Második", value: 2 }, { text: "Harmadik", value: 3 }] }),
  ),
];

renderSections(sections);
done();
