import { initDocPage, renderSections, example } from "../page-components/index";
import { createButtonInput, createSubmitInput, createResetInput, createButton } from "../../src/index";

const done = initDocPage();

const sections = [
  example(
    { title: "createButtonInput", description: "Input gomb a submit/reset mellett.", component: createButtonInput },
    (parent) => createButtonInput({ parent, id: "b1", text: "Button input", click: () => console.log("clicked") }),
  ),
  example(
    { title: "createSubmitInput", description: "Submit gomb, form-ok küldéséhez.", component: createSubmitInput },
    (parent) => createSubmitInput({ parent, id: "b2", text: "Küldés" }),
  ),
  example(
    { title: "createResetInput", description: "Reset gomb, form visszaállításhoz.", component: createResetInput },
    (parent) => createResetInput({ parent, id: "b3", text: "Visszaállítás" }),
  ),
  example(
    { title: "createButton", description: "Általános button elem szöveggel és eseménykezelővel.", component: createButton },
    (parent) => createButton({ parent, id: "b4", text: "Gomb", click: () => console.log("clicked") }),
  ),
];

renderSections(sections);
done();
