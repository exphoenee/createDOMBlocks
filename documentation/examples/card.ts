import { initDocPage, renderSections, example } from "../page-components/index";
import { tr } from "../page-components/i18n";
import { createCard } from "../../src/index";

const done = initDocPage();

const sections = [
  example(
    { title: tr("Card"), description: tr("Kártya komponens címmel, testtel és lábléccel."), component: createCard },
    (parent) => createCard({ parent, id: "c1", title: "Kártya cím", body: { tag: "p", text: "Tartalom" }, footer: { tag: "div", text: "Lábléc" } }),
  ),
];

renderSections(sections);
done();
