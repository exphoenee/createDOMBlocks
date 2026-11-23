import { initDocPage, renderSections, example } from "../page-components/index";
import { createBlockquote } from "../../src/index";

const done = initDocPage();

const sections = [
  example(
    { title: "createBlockquote", description: "Idézet szerzővel.", component: createBlockquote },
    (parent) => createBlockquote({ parent, id: "cont-bq1", text: "A kódolás a jövő nyelve.", author: "Bozzay Viktor" }),
  ),
];

renderSections(sections);
done();
