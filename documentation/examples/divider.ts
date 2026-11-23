import { initDocPage, renderSections, example } from "../page-components/index";
import { tr } from "../page-components/i18n";
import { createDivider } from "../../src/index";

const done = initDocPage();

const sections = [
  example(
    { title: tr("Divider"), description: tr("Vízszintes vonal elválasztáshoz."), component: createDivider },
    (parent) => createDivider({ parent, id: "cont-div1" }),
  ),
];

renderSections(sections);
done();
