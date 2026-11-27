import { initDocPage, renderSections, example } from "../page-components/index";
import { tr } from "../page-components/i18n";
import { createBlockquote } from "../../src/index";

const done = initDocPage();

const sections = [
  example(
    { title: tr("Blockquote"), description: tr("Idézet szerzővel."), component: createBlockquote },
    (parent) => createBlockquote({ parent, id: "cont-bq1", text: "A kódolás a jövő nyelve.", author: "Bozzay Viktor" }),
  ),
];

renderSections(sections);
done();
