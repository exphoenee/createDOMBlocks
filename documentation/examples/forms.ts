import { initDocPage, renderSections } from "../page-components/index";
import { createTextInput, createTelInput, createUrlInput, createSearchInput, createEmailInput, createPasswordInput, createNumberInput, createDateInput, createDatetimeInput, createTimeInput, createMonthInput, createWeekInput, createCheckbox, createColorInput, createFileInput, createRangeInput, createForm } from "../../src/index";
import type { DocSection } from "../page-components/index";

const done = initDocPage();

const sections: DocSection[] = [
  {
    title: "createTextInput",
    description: "Szöveg input létrehozása címkével.",
    code: `createTextInput({\n  parent: "#app",\n  id: "myInput",\n  labelText: "Név:",\n  value: "valami",\n  placeholder: "Ide írj...",\n});`,
    codeLang: "typescript",
    render: (c) => createTextInput({ parent: c, id: "t1", labelText: "", value: "valami", placeholder: "Ide írj..." }),
  },
  {
    title: "createTelInput",
    description: "Telefonszám input.",
    code: `createTelInput({\n  parent: "#app",\n  id: "telInput",\n  labelText: "Telefon:",\n  value: "+36301234567",\n});`,
    codeLang: "typescript",
    render: (c) => createTelInput({ parent: c, id: "t2", labelText: "", value: "+36301234567" }),
  },
  {
    title: "createUrlInput",
    description: "URL input.",
    code: `createUrlInput({\n  parent: "#app",\n  id: "urlInput",\n  labelText: "URL:",\n  value: "https://example.com",\n});`,
    codeLang: "typescript",
    render: (c) => createUrlInput({ parent: c, id: "t3", labelText: "", value: "https://example.com" }),
  },
  {
    title: "createSearchInput",
    description: "Keresési mezők.",
    code: `createSearchInput({\n  parent: "#app",\n  id: "searchInput",\n  labelText: "Keresés:",\n  placeholder: "Keress...",\n});`,
    codeLang: "typescript",
    render: (c) => createSearchInput({ parent: c, id: "t4", labelText: "", placeholder: "Keress..." }),
  },
  {
    title: "createEmailInput",
    description: "E-mail input.",
    code: `createEmailInput({\n  parent: "#app",\n  id: "emailInput",\n  labelText: "Email:",\n  value: "test@example.com",\n});`,
    codeLang: "typescript",
    render: (c) => createEmailInput({ parent: c, id: "t5", labelText: "", value: "test@example.com" }),
  },
  {
    title: "createPasswordInput",
    description: "Jelszó input.",
    code: `createPasswordInput({\n  parent: "#app",\n  id: "passInput",\n  labelText: "Jelszó:",\n  placeholder: "****",\n});`,
    codeLang: "typescript",
    render: (c) => createPasswordInput({ parent: c, id: "t6", labelText: "", placeholder: "****" }),
  },
  {
    title: "createNumberInput",
    description: "Szám input min/max/step paraméterrel.",
    code: `createNumberInput({\n  parent: "#app",\n  id: "numInput",\n  labelText: "Szám:",\n  value: "42",\n  min: 0, max: 100, step: 5,\n});`,
    codeLang: "typescript",
    render: (c) => createNumberInput({ parent: c, id: "t7", labelText: "", value: "42", min: 0, max: 100, step: 5 }),
  },
  {
    title: "createDateInput",
    description: "Dátum kiválasztó.",
    code: `createDateInput({\n  parent: "#app",\n  id: "dateInput",\n  labelText: "Dátum:",\n  value: "2024-01-15",\n});`,
    codeLang: "typescript",
    render: (c) => createDateInput({ parent: c, id: "t8", labelText: "", value: "2024-01-15" }),
  },
  {
    title: "createDatetimeInput",
    description: "Dátum és idő kiválasztó.",
    code: `createDatetimeInput({\n  parent: "#app",\n  id: "datetimeInput",\n  labelText: "Dátum-Idő:",\n  value: "2024-01-15T14:30",\n});`,
    codeLang: "typescript",
    render: (c) => createDatetimeInput({ parent: c, id: "t9", labelText: "", value: "2024-01-15T14:30" }),
  },
  {
    title: "createTimeInput",
    description: "Idő kiválasztó.",
    code: `createTimeInput({\n  parent: "#app",\n  id: "timeInput",\n  labelText: "Idő:",\n  value: "14:30",\n});`,
    codeLang: "typescript",
    render: (c) => createTimeInput({ parent: c, id: "t10", labelText: "", value: "14:30" }),
  },
  {
    title: "createMonthInput",
    description: "Hónap kiválasztó.",
    code: `createMonthInput({\n  parent: "#app",\n  id: "monthInput",\n  labelText: "Hónap:",\n  value: "2024-01",\n});`,
    codeLang: "typescript",
    render: (c) => createMonthInput({ parent: c, id: "t11", labelText: "", value: "2024-01" }),
  },
  {
    title: "createWeekInput",
    description: "Hét kiválasztó.",
    code: `createWeekInput({\n  parent: "#app",\n  id: "weekInput",\n  labelText: "Hét:",\n  value: "2024-W03",\n});`,
    codeLang: "typescript",
    render: (c) => createWeekInput({ parent: c, id: "t12", labelText: "", value: "2024-W03" }),
  },
  {
    title: "createCheckbox",
    description: "Jelölő négyzet.",
    code: `createCheckbox({\n  parent: "#app",\n  id: "checkbox",\n  labelText: "Elfogadom",\n  checked: true,\n});`,
    codeLang: "typescript",
    render: (c) => createCheckbox({ parent: c, id: "t13", labelText: "", checked: true }),
  },
  {
    title: "createColorInput",
    description: "Szín kiválasztó.",
    code: `createColorInput({\n  parent: "#app",\n  id: "colorInput",\n  labelText: "Szín:",\n  value: "#3b82f6",\n});`,
    codeLang: "typescript",
    render: (c) => createColorInput({ parent: c, id: "t14", labelText: "", value: "#3b82f6" }),
  },
  {
    title: "createFileInput",
    description: "Fájl kiválasztó.",
    code: `createFileInput({\n  parent: "#app",\n  id: "fileInput",\n  labelText: "Fájl:",\n});`,
    codeLang: "typescript",
    render: (c) => createFileInput({ parent: c, id: "t15", labelText: "" }),
  },
  {
    title: "createRangeInput",
    description: "Csúska min/max/step paraméterrel.",
    code: `createRangeInput({\n  parent: "#app",\n  id: "rangeInput",\n  labelText: "Csúska:",\n  min: 0, max: 100, value: "50",\n});`,
    codeLang: "typescript",
    render: (c) => createRangeInput({ parent: c, id: "t16", labelText: "", min: 0, max: 100, value: "50" }),
  },
  {
    title: "createForm",
    description: "Általáns form tömbbe szedett input konfigurációkkal.",
    code: `createForm({\n  parent: "#app",\n  id: "myForm",\n  inputs: [\n    { type: "text", id: "name", labelText: "Név:" },\n    { type: "email", id: "email", labelText: "Email:" },\n    { type: "submit", id: "submit", value: "Küldés" },\n  ],\n  onSubmit: () => console.log("Submitted!"),\n});`,
    codeLang: "typescript",
    render: (c) => createForm({
      parent: c, id: "demoForm",
      inputs: [
        { type: "text", id: "name", labelText: "" },
        { type: "email", id: "email", labelText: "" },
        { type: "submit", id: "submit", value: "Küldés" },
      ],
      onSubmit: () => console.log("Submitted!"),
    }),
  },
];

renderSections(sections);
done();
