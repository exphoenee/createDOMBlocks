import { initDocPage, renderSections } from "../page-components/index";
import { createCustomDatePicker, createCustomWeekPicker, createCustomMonthPicker, createCustomDateTimePicker, createCustomDateRangePicker, createDragAndDropFileInput } from "../../src/index";
import type { DocSection } from "../page-components/index";

const done = initDocPage();

const sections: DocSection[] = [
  {
    title: "createCustomDatePicker",
    description: "Egy\xe9ni d\xe1tum kiv\xe1laszt\xf3 napt\xe1r popup-pal.",
    code: `createCustomDatePicker({\n  parent: "#app",\n  id: "datePicker",\n  labelText: "D\xe1tum:",\n  placeholder: "V\xe1lassz d\xe1tumot...",\n  onChange: (val) => console.log(val),\n});`,
    codeLang: "typescript",
    render: (c) => createCustomDatePicker({ parent: c, id: "dp1", labelText: "D\xe1tum:", placeholder: "V\xe1lassz d\xe1tumot...", onChange: (v: string) => console.log(v) }),
  },
  {
    title: "createCustomWeekPicker",
    description: "Egy\xe9ni h\xe9t kiv\xe1laszt\xf3.",
    code: `createCustomWeekPicker({\n  parent: "#app",\n  id: "weekPicker",\n  labelText: "H\xe9t:",\n  placeholder: "V\xe1lassz hetet...",\n  onChange: (val) => console.log(val),\n});`,
    codeLang: "typescript",
    render: (c) => createCustomWeekPicker({ parent: c, id: "wp1", labelText: "H\xe9t:", placeholder: "V\xe1lassz hetet...", onChange: (v: string) => console.log(v) }),
  },
  {
    title: "createCustomMonthPicker",
    description: "Egy\xe9ni h\xf3nap kiv\xe1laszt\xf3.",
    code: `createCustomMonthPicker({\n  parent: "#app",\n  id: "monthPicker",\n  labelText: "H\xf3nap:",\n  placeholder: "V\xe1lassz h\xf3napot...",\n  onChange: (val) => console.log(val),\n});`,
    codeLang: "typescript",
    render: (c) => createCustomMonthPicker({ parent: c, id: "mp1", labelText: "H\xf3nap:", placeholder: "V\xe1lassz h\xf3napot...", onChange: (v: string) => console.log(v) }),
  },
  {
    title: "createCustomDateTimePicker",
    description: "Egy\xe9ni d\xe1tum + id\u0151 kiv\xe1laszt\xf3.",
    code: `createCustomDateTimePicker({\n  parent: "#app",\n  id: "dateTimePicker",\n  labelText: "D\xe1tum-Id\u0151:",\n  placeholder: "V\xe1lassz d\xe1tumot \xe9s id\u0151t...",\n  onChange: (val) => console.log(val),\n});`,
    codeLang: "typescript",
    render: (c) => createCustomDateTimePicker({ parent: c, id: "dtp1", labelText: "D\xe1tum-Id\u0151:", placeholder: "V\xe1lassz d\xe1tumot \xe9s id\u0151t...", onChange: (v: string) => console.log(v) }),
  },
  {
    title: "createCustomDateRangePicker",
    description: "Egy\xe9ni d\xe1tumtartom\xe1ny kiv\xe1laszt\xf3.",
    code: `createCustomDateRangePicker({\n  parent: "#app",\n  id: "dateRangePicker",\n  labelText: "Tartom\xe1ny:",\n  onChange: (start, end) => console.log(start, end),\n});`,
    codeLang: "typescript",
    render: (c) => createCustomDateRangePicker({ parent: c, id: "drp1", labelText: "Tartom\xe1ny:", onChange: (s: string, e: string) => console.log(s, e) }),
  },
  {
    title: "createDragAndDropFileInput",
    description: "Drag-and-drop f\xe1jl felt\xf6lt\u0151.",
    code: `createDragAndDropFileInput({\n  parent: "#app",\n  id: "fileDrop",\n  labelText: "F\xe1jl felt\xf6lt\xe9se:",\n  dropText: "H\xfazd ide a f\xe1jlokat",\n  accept: [".jpg", ".png", ".pdf"],\n  multiple: true,\n  onFiles: (files) => console.log(files),\n});`,
    codeLang: "typescript",
    render: (c) => createDragAndDropFileInput({ parent: c, id: "dd1", labelText: "F\xe1jl felt\xf6lt\xe9se:", dropText: "H\xfazd ide a f\xe1jlokat", accept: [".jpg", ".png", ".pdf"], multiple: true, onFiles: (f: File[]) => console.log(f.map((x) => x.name)) }),
  },
];

renderSections(sections);
done();
