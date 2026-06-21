import { initDocPage, renderSections } from "../page-components/index";
import { createCustomDatePicker, createCustomWeekPicker, createCustomMonthPicker, createCustomDateTimePicker, createCustomDateRangePicker, createDragAndDropFileInput } from "../../src/index";
import type { DocSection } from "../page-components/index";

const done = initDocPage();

const sections: DocSection[] = [
  {
    title: "createCustomDatePicker",
    description: "Egyéni dátum kiválasztó naptár popup-pal.",
    code: `createCustomDatePicker({\n  parent: "#app",\n  id: "datePicker",\n  labelText: "Dátum:",\n  placeholder: "Valássz dátumot...",\n  onChange: (val) => console.log(val),\n});`,
    codeLang: "typescript",
    render: (c) => createCustomDatePicker({ parent: c, id: "dp1", labelText: "", placeholder: "Valássz dátumot...", onChange: (v: string) => console.log(v) }),
  },
  {
    title: "createCustomWeekPicker",
    description: "Egyéni hét kiválasztó.",
    code: `createCustomWeekPicker({\n  parent: "#app",\n  id: "weekPicker",\n  labelText: "Hét:",\n  placeholder: "Valássz hetet...",\n  onChange: (val) => console.log(val),\n});`,
    codeLang: "typescript",
    render: (c) => createCustomWeekPicker({ parent: c, id: "wp1", labelText: "", placeholder: "Valássz hetet...", onChange: (v: string) => console.log(v) }),
  },
  {
    title: "createCustomMonthPicker",
    description: "Egyéni hónap kiválasztó.",
    code: `createCustomMonthPicker({\n  parent: "#app",\n  id: "monthPicker",\n  labelText: "Hónap:",\n  placeholder: "Valássz hónapot...",\n  onChange: (val) => console.log(val),\n});`,
    codeLang: "typescript",
    render: (c) => createCustomMonthPicker({ parent: c, id: "mp1", labelText: "", placeholder: "Valássz hónapot...", onChange: (v: string) => console.log(v) }),
  },
  {
    title: "createCustomDateTimePicker",
    description: "Egyéni dátum + idő kiválasztó.",
    code: `createCustomDateTimePicker({\n  parent: "#app",\n  id: "dateTimePicker",\n  labelText: "Dátum-Idő:",\n  placeholder: "Valássz dátumot és időt...",\n  onChange: (val) => console.log(val),\n});`,
    codeLang: "typescript",
    render: (c) => createCustomDateTimePicker({ parent: c, id: "dtp1", labelText: "", placeholder: "Valássz dátumot és időt...", onChange: (v: string) => console.log(v) }),
  },
  {
    title: "createCustomDateRangePicker",
    description: "Egyéni dátumtartomány kiválasztó.",
    code: `createCustomDateRangePicker({\n  parent: "#app",\n  id: "dateRangePicker",\n  labelText: "Tartomány:",\n  onChange: (start, end) => console.log(start, end),\n});`,
    codeLang: "typescript",
    render: (c) => createCustomDateRangePicker({ parent: c, id: "drp1", labelText: "", onChange: (s: string, e: string) => console.log(s, e) }),
  },
  {
    title: "createDragAndDropFileInput",
    description: "Drag-and-drop fájl feltöltő;.",
    code: `createDragAndDropFileInput({\n  parent: "#app",\n  id: "fileDrop",\n  labelText: "Fájl feltöltése:",\n  dropText: "Húzd ide a fájlokat",\n  accept: [".jpg", ".png", ".pdf"],\n  multiple: true,\n  onFiles: (files) => console.log(files),\n});`,
    codeLang: "typescript",
    render: (c) => createDragAndDropFileInput({ parent: c, id: "dd1", labelText: "", dropText: "Húzd ide a fájlokat", accept: [".jpg", ".png", ".pdf"], multiple: true, onFiles: (f: File[]) => console.log(f.map((x) => x.name)) }),
  },
];

renderSections(sections);
done();
