import { initDocPage, renderSections, example } from "../page-components/index";
import { tr } from "../page-components/i18n";
import { createCustomSelect } from "../../src/index";

const done = initDocPage();

const sections = [
  example(
    { title: tr("Custom select"), description: tr("Custom legördülő egyéni stílussal."), component: createCustomSelect },
    (parent) => createCustomSelect({ parent, id: "s3", labelText: "", placeholder: "Valássz...",
      options: [{ text: "Budapest", value: "bp" }, { text: "Debrecen", value: "dc" }],
      onChange: (val: string | number) => console.log("Select:", val) }),
  ),
];

renderSections(sections);
done();
