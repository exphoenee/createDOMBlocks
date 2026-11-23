import { initDocPage, renderSections, example } from "../page-components/index";
import { tr } from "../page-components/i18n";
import { createCheckbox } from "../../src/index";

const done = initDocPage();

const sections = [
  example(
    { title: tr("Checkbox"), description: tr("Jelölő négyzet."), component: createCheckbox },
    (parent) => createCheckbox({ parent, id: "t13", labelText: "Elfogadom", checked: true }),
  ),
];

renderSections(sections);
done();
