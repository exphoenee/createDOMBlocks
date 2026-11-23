import { initDocPage, renderSections, example } from "../page-components/index";
import { tr } from "../page-components/i18n";
import { createCustomMonthPicker } from "../../src/index";

const done = initDocPage();

const sections = [
  example(
    { title: tr("Custom month picker"), description: tr("Egy\xe9ni h\xf3nap kiv\xe1laszt\xf3."), component: createCustomMonthPicker },
    (parent) => createCustomMonthPicker({ parent, id: "mp1", labelText: "H\xf3nap:", placeholder: "V\xe1lassz h\xf3napot...", onChange: (v: string) => console.log(v) }),
  ),
];

renderSections(sections);
done();
