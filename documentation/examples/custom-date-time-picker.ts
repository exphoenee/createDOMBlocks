import { initDocPage, renderSections, example } from "../page-components/index";
import { tr } from "../page-components/i18n";
import { createCustomDateTimePicker } from "../../src/index";

const done = initDocPage();

const sections = [
  example(
    { title: tr("Custom date time picker"), description: tr("Egy\xe9ni d\xe1tum + id\u0151 kiv\xe1laszt\xf3."), component: createCustomDateTimePicker },
    (parent) => createCustomDateTimePicker({ parent, id: "dtp1", labelText: "D\xe1tum-Id\u0151:", placeholder: "V\xe1lassz d\xe1tumot \xe9s id\u0151t...", onChange: (v: string) => console.log(v) }),
  ),
];

renderSections(sections);
done();
