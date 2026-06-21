import { createCustomDatePicker, createCustomWeekPicker, createCustomMonthPicker, createCustomDateTimePicker, createCustomDateRangePicker, createDragAndDropFileInput } from "../../src/index";
import { createDOMElem } from "domelemjs";

const app = document.getElementById("app")!;

function h2(text: string) {
  createDOMElem({ tag: "h2", parent: app, text });
}

function pre(code: string) {
  createDOMElem({ tag: "pre", parent: app, text: code, attrs: { style: "background:#1e293b;color:#e2e8f0;padding:1rem;border-radius:0.5rem;font-size:0.8125rem;overflow-x:auto;margin-bottom:1rem;" } });
}

function result(): HTMLElement {
  const div = document.createElement("div");
  div.style.cssText = "padding:1rem;border:2px dashed #e5e7eb;border-radius:0.5rem;margin-bottom:2rem;";
  app.appendChild(div);
  return div;
}

// Custom DatePicker
h2("createCustomDatePicker");
pre(`createCustomDatePicker({
  parent: "#app",
  id: "datePicker",
  labelText: "Datum:",
  placeholder: "Valassz datumot...",
  onChange: (val) => console.log("Valasztott:", val),
});`);
createCustomDatePicker({ parent: result(), id: "datePicker1", labelText: "", placeholder: "Valassz datumot...",
  onChange: (val: string) => console.log("Datum:", val) });

// Custom Week Picker
h2("createCustomWeekPicker");
pre(`createCustomWeekPicker({
  parent: "#app",
  id: "weekPicker",
  labelText: "Het:",
  placeholder: "Valassz hetet...",
  onChange: (val) => console.log("Valasztott:", val),
});`);
createCustomWeekPicker({ parent: result(), id: "weekPicker1", labelText: "", placeholder: "Valassz hetet...",
  onChange: (val: string) => console.log("Het:", val) });

// Custom Month Picker
h2("createCustomMonthPicker");
pre(`createCustomMonthPicker({
  parent: "#app",
  id: "monthPicker",
  labelText: "Honap:",
  placeholder: "Valassz honapot...",
  onChange: (val) => console.log("Valasztott:", val),
});`);
createCustomMonthPicker({ parent: result(), id: "monthPicker1", labelText: "", placeholder: "Valassz honapot...",
  onChange: (val: string) => console.log("Honap:", val) });

// Custom DateTime Picker
h2("createCustomDateTimePicker");
pre(`createCustomDateTimePicker({
  parent: "#app",
  id: "dateTimePicker",
  labelText: "Datum-Ido:",
  placeholder: "Valassz datumot es idot...",
  onChange: (val) => console.log("Valasztott:", val),
});`);
createCustomDateTimePicker({ parent: result(), id: "dateTimePicker1", labelText: "", placeholder: "Valassz datumot es idot...",
  onChange: (val: string) => console.log("Datum-Ido:", val) });

// Custom Date Range Picker
h2("createCustomDateRangePicker");
pre(`createCustomDateRangePicker({
  parent: "#app",
  id: "dateRangePicker",
  labelText: "Datumtartomany:",
  placeholder: "Valassz datumtartomanyt...",
  onChange: (start, end) => console.log("Tartomany:", start, "-", end),
});`);
createCustomDateRangePicker({ parent: result(), id: "dateRangePicker1", labelText: "", placeholder: "Valassz datumtartomanyt...",
  onChange: (start: string, end: string) => console.log("Tartomany:", start, "-", end) });

// Drag and Drop File Input
h2("createDragAndDropFileInput");
pre(`createDragAndDropFileInput({
  parent: "#app",
  id: "fileDrop",
  labelText: "Fajl feltoltese:",
  dropText: "Huzd ide a fajlokat",
  accept: [".jpg", ".png", ".pdf"],
  multiple: true,
  maxFiles: 5,
  onFiles: (files) => console.log("Valasztott fajlok:", files),
});`);
createDragAndDropFileInput({ parent: result(), id: "fileDrop1", labelText: "",
  dropText: "Huzd ide a fajlokat vagy kattints a tallozashoz",
  accept: [".jpg", ".png", ".pdf"],
  multiple: true,
  maxFiles: 5,
  onFiles: (files: File[]) => console.log("Valasztott fajlok:", files.map(f => f.name)) });
