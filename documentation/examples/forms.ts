import { initDocPage, renderSections, example } from "../page-components/index";
import { createTextInput, createTelInput, createUrlInput, createSearchInput, createEmailInput, createPasswordInput, createNumberInput, createDateInput, createDatetimeInput, createTimeInput, createMonthInput, createWeekInput, createCheckbox, createColorInput, createFileInput, createRangeInput, createForm } from "../../src/index";

const done = initDocPage();

const sections = [
  example(
    { title: "createTextInput", description: "Szöveg input létrehozása címkével." },
    (parent) => createTextInput({ parent, id: "t1", labelText: "Név:", value: "valami", placeholder: "Ide írj..." }),
  ),
  example(
    { title: "createTelInput", description: "Telefonszám input." },
    (parent) => createTelInput({ parent, id: "t2", labelText: "Telefon:", value: "+36301234567" }),
  ),
  example(
    { title: "createUrlInput", description: "URL input." },
    (parent) => createUrlInput({ parent, id: "t3", labelText: "URL:", value: "https://example.com" }),
  ),
  example(
    { title: "createSearchInput", description: "Keresési mezők." },
    (parent) => createSearchInput({ parent, id: "t4", labelText: "Keresés:", placeholder: "Keress..." }),
  ),
  example(
    { title: "createEmailInput", description: "E-mail input." },
    (parent) => createEmailInput({ parent, id: "t5", labelText: "Email:", value: "test@example.com" }),
  ),
  example(
    { title: "createPasswordInput", description: "Jelszó input." },
    (parent) => createPasswordInput({ parent, id: "t6", labelText: "Jelszó:", placeholder: "****" }),
  ),
  example(
    { title: "createNumberInput", description: "Szám input min/max/step paraméterrel." },
    (parent) => createNumberInput({ parent, id: "t7", labelText: "Szám:", value: "42", min: 0, max: 100, step: 5 }),
  ),
  example(
    { title: "createDateInput", description: "Dátum kiválasztó." },
    (parent) => createDateInput({ parent, id: "t8", labelText: "Dátum:", value: "2024-01-15" }),
  ),
  example(
    { title: "createDatetimeInput", description: "Dátum és idő kiválasztó." },
    (parent) => createDatetimeInput({ parent, id: "t9", labelText: "Dátum-Idő:", value: "2024-01-15T14:30" }),
  ),
  example(
    { title: "createTimeInput", description: "Idő kiválasztó." },
    (parent) => createTimeInput({ parent, id: "t10", labelText: "Idő:", value: "14:30" }),
  ),
  example(
    { title: "createMonthInput", description: "Hónap kiválasztó." },
    (parent) => createMonthInput({ parent, id: "t11", labelText: "Hónap:", value: "2024-01" }),
  ),
  example(
    { title: "createWeekInput", description: "Hét kiválasztó." },
    (parent) => createWeekInput({ parent, id: "t12", labelText: "Hét:", value: "2024-W03" }),
  ),
  example(
    { title: "createCheckbox", description: "Jelölő négyzet." },
    (parent) => createCheckbox({ parent, id: "t13", labelText: "Elfogadom", checked: true }),
  ),
  example(
    { title: "createColorInput", description: "Szín kiválasztó." },
    (parent) => createColorInput({ parent, id: "t14", labelText: "Szín:", value: "#3b82f6" }),
  ),
  example(
    { title: "createFileInput", description: "Fájl kiválasztó." },
    (parent) => createFileInput({ parent, id: "t15", labelText: "Fájl:" }),
  ),
  example(
    { title: "createRangeInput", description: "Csúska min/max/step paraméterrel." },
    (parent) => createRangeInput({ parent, id: "t16", labelText: "Csúska:", min: 0, max: 100, value: "50" }),
  ),
  example(
    { title: "createForm", description: "Általáns form tömbbe szedett input konfigurációkkal." },
    (parent) => createForm({
      parent, id: "demoForm", action: "/api/submit", method: "POST",
      inputs: [
        { type: "text", id: "name", labelText: "Név:" },
        { type: "email", id: "email", labelText: "Email:" },
        { type: "submit", id: "submit", value: "Küldés" },
      ],
      onSubmit: () => console.log("Submitted!"),
    }),
  ),
];

renderSections(sections);
done();
