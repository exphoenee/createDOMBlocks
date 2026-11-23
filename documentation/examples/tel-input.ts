import { initDocPage, renderSections, example } from "../page-components/index";
import { createTelInput } from "../../src/index";

const done = initDocPage();

const sections = [
  example(
    { title: "createTelInput", description: "Telefonszám input.", component: createTelInput },
    (parent) => createTelInput({ parent, id: "t2", labelText: "Telefon:", value: "+36301234567" }),
  ),
];

renderSections(sections);
done();
