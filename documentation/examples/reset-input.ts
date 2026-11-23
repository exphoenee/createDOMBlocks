import { initDocPage, renderSections, example } from "../page-components/index";
import { createResetInput } from "../../src/index";

const done = initDocPage();

const sections = [
  example(
    { title: "createResetInput", description: "Reset gomb, form visszaállításhoz.", component: createResetInput },
    (parent) => createResetInput({ parent, id: "b3", text: "Visszaállítás" }),
  ),
];

renderSections(sections);
done();
