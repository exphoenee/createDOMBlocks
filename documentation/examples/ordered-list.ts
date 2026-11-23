import { initDocPage, renderSections, example } from "../page-components/index";
import { tr } from "../page-components/i18n";
import { createOrderedList } from "../../src/index";

const done = initDocPage();

const sections = [
  example(
    { title: tr("Ordered list"), description: tr("Rendezett lista (ol) indulásos számmal."), component: createOrderedList },
    (parent) => createOrderedList(["Tizedik", "Tizenegyedik", "Tizenkettedik"], { parent, id: "l2", start: 10 }),
  ),
];

renderSections(sections);
done();
