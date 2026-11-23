import { initDocPage, renderSections, example } from "../page-components/index";
import { createDivider } from "../../src/index";

const done = initDocPage();

const sections = [
  example(
    { title: "createDivider", description: "Vízszintes vonal elválasztáshoz.", component: createDivider },
    (parent) => createDivider({ parent, id: "cont-div1" }),
  ),
];

renderSections(sections);
done();
