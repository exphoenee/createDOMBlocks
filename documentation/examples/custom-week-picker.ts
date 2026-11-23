import { initDocPage, renderSections, example } from "../page-components/index";
import { tr } from "../page-components/i18n";
import { createCustomWeekPicker } from "../../src/index";

const done = initDocPage();

const sections = [
  example(
    { title: tr("Custom week picker"), description: tr("Egy\xe9ni h\xe9t kiv\xe1laszt\xf3."), component: createCustomWeekPicker },
    (parent) => createCustomWeekPicker({ parent, id: "wp1", labelText: "H\xe9t:", placeholder: "V\xe1lassz hetet...", onChange: (v: string) => console.log(v) }),
  ),
];

renderSections(sections);
done();
