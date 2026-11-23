import { initDocPage, renderSections, example } from "../page-components/index";
import { createButtonInput } from "../../src/index";

const done = initDocPage();

const sections = [
  example(
    { title: "createButtonInput", description: "Input gomb a submit/reset mellett.", component: createButtonInput },
    (parent) => createButtonInput({ parent, id: "b1", text: "Button input", click: () => console.log("clicked") }),
  ),
];

renderSections(sections);
done();
