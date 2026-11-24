import { initDocPage, renderSections, example } from "../page-components/index";
import { tr } from "../page-components/i18n";
import { createTextInput } from "../../src/index";

const done = initDocPage();

const sections = [
  example(
    { title: tr("Text input"), description: tr("Szöveg input létrehozása címkével."), component: createTextInput },
    (parent) => createTextInput({ parent, id: "t1", labelText: "Név:", value: "valami", placeholder: "Ide írj..." }),
  ),
];

renderSections(sections);
done();
