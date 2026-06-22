import { initDocPage, renderSections, example } from "../page-components/index";
import { createCustomDatePicker, createCustomWeekPicker, createCustomMonthPicker, createCustomDateTimePicker, createCustomDateRangePicker, createDragAndDropFileInput } from "../../src/index";

const done = initDocPage();

const sections = [
  example(
    { title: "createCustomDatePicker", description: "Egy\xe9ni d\xe1tum kiv\xe1laszt\xf3 napt\xe1r popup-pal.", component: createCustomDatePicker },
    (parent) => createCustomDatePicker({ parent, id: "dp1", labelText: "D\xe1tum:", placeholder: "V\xe1lassz d\xe1tumot...", onChange: (v: string) => console.log(v) }),
  ),
  example(
    { title: "createCustomWeekPicker", description: "Egy\xe9ni h\xe9t kiv\xe1laszt\xf3.", component: createCustomWeekPicker },
    (parent) => createCustomWeekPicker({ parent, id: "wp1", labelText: "H\xe9t:", placeholder: "V\xe1lassz hetet...", onChange: (v: string) => console.log(v) }),
  ),
  example(
    { title: "createCustomMonthPicker", description: "Egy\xe9ni h\xf3nap kiv\xe1laszt\xf3.", component: createCustomMonthPicker },
    (parent) => createCustomMonthPicker({ parent, id: "mp1", labelText: "H\xf3nap:", placeholder: "V\xe1lassz h\xf3napot...", onChange: (v: string) => console.log(v) }),
  ),
  example(
    { title: "createCustomDateTimePicker", description: "Egy\xe9ni d\xe1tum + id\u0151 kiv\xe1laszt\xf3.", component: createCustomDateTimePicker },
    (parent) => createCustomDateTimePicker({ parent, id: "dtp1", labelText: "D\xe1tum-Id\u0151:", placeholder: "V\xe1lassz d\xe1tumot \xe9s id\u0151t...", onChange: (v: string) => console.log(v) }),
  ),
  example(
    { title: "createCustomDateRangePicker", description: "Egy\xe9ni d\xe1tumtartom\xe1ny kiv\xe1laszt\xf3.", component: createCustomDateRangePicker },
    (parent) => createCustomDateRangePicker({ parent, id: "drp1", labelText: "Tartom\xe1ny:", onChange: (s: string, e: string) => console.log(s, e) }),
  ),
  example(
    { title: "createDragAndDropFileInput", description: "Drag-and-drop f\xe1jl felt\xf6lt\u0151.", component: createDragAndDropFileInput },
    (parent) => createDragAndDropFileInput({ parent, id: "dd1", labelText: "F\xe1jl felt\xf6lt\xe9se:", dropText: "H\xfazd ide a f\xe1jlokat", accept: [".jpg", ".png", ".pdf"], multiple: true, onFiles: (f: File[]) => console.log(f.map((x) => x.name)) }),
  ),
];

renderSections(sections);
done();
