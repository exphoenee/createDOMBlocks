import { initDocPage, renderSections } from "../page-components/index";
import { createButtonInput, createSubmitInput, createResetInput, createButton } from "../../src/index";
import type { DocSection } from "../page-components/index";

const done = initDocPage();

const sections: DocSection[] = [
  {
    title: "createButtonInput",
    description: "Input gomb a submit/reset mellett.",
    code: `createButtonInput({\n  parent: "#app",\n  id: "btnInput",\n  text: "Button input",\n  click: () => console.log("clicked"),\n});`,
    codeLang: "typescript",
    render: (c) => createButtonInput({ parent: c, id: "b1", text: "Button input", click: () => console.log("clicked") }),
  },
  {
    title: "createSubmitInput",
    description: "Submit gomb, form-ok küldéséhez.",
    code: `createSubmitInput({\n  parent: "#app",\n  id: "submitInput",\n  text: "Küldés",\n});`,
    codeLang: "typescript",
    render: (c) => createSubmitInput({ parent: c, id: "b2", text: "Küldés" }),
  },
  {
    title: "createResetInput",
    description: "Reset gomb, form visszaállításhoz.",
    code: `createResetInput({\n  parent: "#app",\n  id: "resetInput",\n  text: "Visszaállítás",\n});`,
    codeLang: "typescript",
    render: (c) => createResetInput({ parent: c, id: "b3", text: "Visszaállítás" }),
  },
  {
    title: "createButton",
    description: "Általános button elem szöveggel és eseménykezelővel.",
    code: `createButton({\n  parent: "#app",\n  id: "btn1",\n  text: "Gomb",\n  click: () => console.log("clicked"),\n});`,
    codeLang: "typescript",
    render: (c) => createButton({ parent: c, id: "b4", text: "Gomb", click: () => console.log("clicked") }),
  },
];

renderSections(sections);
