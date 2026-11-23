import { initDocPage, renderSections, example } from "../page-components/index";
import { createCustomDatePicker } from "../../src/index";

const done = initDocPage();

const sections = [
  example(
    { title: "Custom date picker", description: "Egy\xe9ni d\xe1tum kiv\xe1laszt\xf3 napt\xe1r popup-pal.", component: createCustomDatePicker },
    (parent) => createCustomDatePicker({ parent, id: "dp1", labelText: "D\xe1tum:", placeholder: "V\xe1lassz d\xe1tumot...", onChange: (v: string) => console.log(v) }),
  ),
];

renderSections(sections);
done();
