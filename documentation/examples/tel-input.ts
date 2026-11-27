import { initDocPage, renderSections, example } from "../page-components/index";
import { tr } from "../page-components/i18n";
import { createTelInput } from "../../src/index";

const done = initDocPage();

const sections = [
  example(
    { title: tr("Tel input"), description: tr("Telefonszám input."), component: createTelInput },
    (parent) => createTelInput({ parent, id: "t2", labelText: "Telefon:", value: "+36301234567" }),
  ),
];

renderSections(sections);
done();
