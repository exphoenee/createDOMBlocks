import { initDocPage, renderSections, example } from "../page-components/index";
import { createCustomDateRangePicker } from "../../src/index";

const done = initDocPage();

const sections = [
  example(
    { title: "Custom date range picker", description: "Egy\xe9ni d\xe1tumtartom\xe1ny kiv\xe1laszt\xf3.", component: createCustomDateRangePicker },
    (parent) => createCustomDateRangePicker({ parent, id: "drp1", labelText: "Tartom\xe1ny:", onChange: (s: string, e: string) => console.log(s, e) }),
  ),
];

renderSections(sections);
done();
