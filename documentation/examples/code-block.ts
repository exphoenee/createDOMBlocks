import { initDocPage, renderSections, example } from "../page-components/index";
import { createCodeBlock } from "../../src/index";

const done = initDocPage();

const sections = [
  example(
    { title: "Code block", description: "Kódblokk nyelv megadásával és syntax highlighting-gel.", component: createCodeBlock },
    (parent) => createCodeBlock({ parent, id: "cont-cb1", language: "typescript", code: 'const x: number = 42;\nconsole.log(x);' }),
  ),
];

renderSections(sections);
done();
