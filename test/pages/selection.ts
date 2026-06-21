import { createSelect, createRadio, createCustomSelect, createTextarea } from "../../src/index";

createSelect({ parent: "#app-select", id: "selectInput", labelText: "", value: 2,
  options: [{ text: "Els\u00F3", value: 1 }, { text: "Masodik", value: 2 }, { text: "Harmadik", value: 3 }] });

createRadio({ parent: "#app-radio", id: "radioInput", labelText: "", value: 2,
  options: [{ text: "Els\u00F3", value: 1 }, { text: "Masodik", value: 2 }, { text: "Harmadik", value: 3 }] });

createCustomSelect({ parent: "#app-custom", id: "customSelect", labelText: "",
  placeholder: "Valassz opciot...",
  options: [{ text: "Budapest", value: "bp" }, { text: "Debrecen", value: "dc" }, { text: "Szeged", value: "sz" }],
  onChange: (val: string | number) => console.log("Custom select:", val) });

createTextarea({ parent: "#app-textarea", id: "textarea", labelText: "", value: "Szoveg...", rows: 5, cols: 40 });
