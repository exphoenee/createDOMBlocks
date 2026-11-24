import { initDocPage, renderSections, example } from "../page-components/index";
import { tr } from "../page-components/i18n";
import { createCodeBlock } from "../../src/index";

const done = initDocPage();

const sections = [
  example(
    { title: tr("Code block"), description: tr("Kódblokk nyelv megadásával és syntax highlighting-gel."), component: createCodeBlock },
    (parent) => createCodeBlock({ parent, id: "cont-cb1", language: "typescript", code: 'const x: number = 42;\nconsole.log(x);' }),
  ),
];

renderSections(sections);
done();
