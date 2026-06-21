import { createTextInput, createTelInput, createUrlInput, createSearchInput, createEmailInput, createPasswordInput, createNumberInput, createDateInput, createDatetimeInput, createTimeInput, createMonthInput, createWeekInput, createCheckbox, createColorInput, createFileInput, createRangeInput, createForm } from "../../src/index";

createTextInput({ parent: "#app-text", id: "textInput", labelText: "", value: "valami", placeholder: "Ide irj...", name: "szoveg" });
createTelInput({ parent: "#app-tel", id: "telInput", labelText: "", value: "+36301234567", placeholder: "+36..." });
createUrlInput({ parent: "#app-url", id: "urlInput", labelText: "", value: "https://example.com", placeholder: "https://..." });
createSearchInput({ parent: "#app-search", id: "searchInput", labelText: "", placeholder: "Keress..." });
createEmailInput({ parent: "#app-email", id: "emailInput", labelText: "", value: "test@example.com" });
createPasswordInput({ parent: "#app-pass", id: "passInput", labelText: "", placeholder: "****" });
createNumberInput({ parent: "#app-num", id: "numInput", labelText: "", value: "42", min: 0, max: 100, step: 5 });
createDateInput({ parent: "#app-date", id: "dateInput", labelText: "", value: "2024-01-15" });
createDatetimeInput({ parent: "#app-datetime", id: "datetimeInput", labelText: "", value: "2024-01-15T14:30" });
createTimeInput({ parent: "#app-time", id: "timeInput", labelText: "", value: "14:30" });
createMonthInput({ parent: "#app-month", id: "monthInput", labelText: "", value: "2024-01" });
createWeekInput({ parent: "#app-week", id: "weekInput", labelText: "", value: "2024-W03" });
createCheckbox({ parent: "#app-cb", id: "checkbox", labelText: "", checked: true });
createColorInput({ parent: "#app-color", id: "colorInput", labelText: "", value: "#3b82f6" });
createFileInput({ parent: "#app-file", id: "fileInput", labelText: "" });
createRangeInput({ parent: "#app-range", id: "rangeInput", labelText: "", min: 0, max: 100, value: "50" });
createForm({
  parent: "#app-form", id: "myForm",
  inputs: [
    { type: "text", id: "name", labelText: "", placeholder: "Teljes nev" },
    { type: "email", id: "email", labelText: "" },
    { type: "select", id: "role", labelText: "", options: [{ text: "Admin", value: "admin" }, { text: "User", value: "user" }] },
    { type: "textarea", id: "msg", labelText: "", rows: 3 },
    { type: "checkbox", id: "accept", labelText: "" },
    { type: "submit", id: "submit", value: "Kuldes" },
  ],
  onSubmit: () => console.log("Form submitted!"),
});
