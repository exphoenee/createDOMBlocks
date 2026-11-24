import { initDocPage, renderSections, example } from "../page-components/index";
import { tr } from "../page-components/i18n";
import { createUnorderedList } from "../../src/index";

const done = initDocPage();

const sections = [
  example(
    { title: tr("Unordered list"), description: tr("Rendezetlen lista (ul) elemekből."), component: createUnorderedList },
    (parent) => createUnorderedList(["Első", "Második", "Harmadik", "Negyedik"], { parent, id: "l1" }),
  ),
];

renderSections(sections);
done();
