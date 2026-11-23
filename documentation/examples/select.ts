import { initDocPage, renderSections, example } from "../page-components/index";
import { tr } from "../page-components/i18n";
import { createSelect } from "../../src/index";

const done = initDocPage();

const sections = [
  example(
    { title: tr("Select"), description: tr("Legördülő menü opciókkal."), component: createSelect },
    (parent) => createSelect({ parent, id: "s1", labelText: "", value: 2,
      options: [{ text: "Első", value: 1 }, { text: "Második", value: 2 }, { text: "Harmadik", value: 3 }] }),
  ),
];

renderSections(sections);
done();
