import { initDocPage, renderSections, example } from "../page-components/index";
import { createCheckbox } from "../../src/index";

const done = initDocPage();

const sections = [
  example(
    { title: "createCheckbox", description: "Jelölő négyzet.", component: createCheckbox },
    (parent) => createCheckbox({ parent, id: "t13", labelText: "Elfogadom", checked: true }),
  ),
];

renderSections(sections);
done();
