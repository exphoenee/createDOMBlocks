import { initDocPage, renderSections, example } from "../page-components/index";
import { createParagraph } from "../../src/index";

const done = initDocPage();

const sections = [
  example(
    { title: "Paragraph", description: "Sima bekezdés szöveg.", component: createParagraph },
    (parent) => createParagraph({ parent, id: "cont-p1", text: "Ez egy bekezdés szöveg." }),
  ),
];

renderSections(sections);
done();
