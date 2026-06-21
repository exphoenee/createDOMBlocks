import { initDocPage, renderSections } from "../page-components/index";
import { createAlert, createBadge, createSpinner, createProgressBar, createButton, createToast } from "../../src/index";
import { createDOMElem } from "domelemjs";
import type { DocSection } from "../page-components/index";

const done = initDocPage();

const sections: DocSection[] = [
  {
    title: "createAlert",
    description: "Figyelmeztető üzenet típusonként: success, error, warning, info.",
    code: `createAlert({ parent: "#app", type: "success", title: "Siker!", message: "Mentés sikeres." });\ncreateAlert({ parent: "#app", type: "error", title: "Hiba!", message: "Valami rossz." });\ncreateAlert({ parent: "#app", type: "warning", title: "Figyelem!", message: "Vigyázz!" });\ncreateAlert({ parent: "#app", type: "info", title: "Info", message: "Elcsukható.", dismissible: true });`,
    codeLang: "typescript",
    render: (c) => {
      createAlert({ parent: c, type: "success", title: "Siker!", message: "Mentés sikeres." });
      createAlert({ parent: c, type: "error", title: "Hiba!", message: "Valami rossz." });
      createAlert({ parent: c, type: "warning", title: "Figyelem!", message: "Vigyázz!" });
      createAlert({ parent: c, type: "info", title: "Info", message: "Elcsukható.", dismissible: true });
    },
  },
  {
    title: "createBadge",
    description: "Állapot jelző pici szöveggel.",
    code: `createBadge({ parent: "#app", text: "Új", type: "info" });\ncreateBadge({ parent: "#app", text: "Siker", type: "success" });\ncreateBadge({ parent: "#app", text: "Hiba", type: "error" });`,
    codeLang: "typescript",
    render: (c) => {
      createBadge({ parent: c, text: "Új", type: "info" }); createDOMElem({ tag: "span", parent: c, text: " " });
      createBadge({ parent: c, text: "Siker", type: "success" }); createDOMElem({ tag: "span", parent: c, text: " " });
      createBadge({ parent: c, text: "Hiba", type: "error" });
    },
  },
  {
    title: "createSpinner",
    description: "Töltés indikátor meretre váltással.",
    code: `createSpinner({ parent: "#app", size: "sm" });\ncreateSpinner({ parent: "#app", size: "md" });\ncreateSpinner({ parent: "#app", size: "lg" });`,
    codeLang: "typescript",
    render: (c) => {
      createSpinner({ parent: c, size: "sm" }); createDOMElem({ tag: "span", parent: c, text: "  " });
      createSpinner({ parent: c, size: "md" }); createDOMElem({ tag: "span", parent: c, text: "  " });
      createSpinner({ parent: c, size: "lg" });
    },
  },
  {
    title: "createProgressBar",
    description: "Folyamatjelző egyéni színnel és százalék kijelzéssel.",
    code: `createProgressBar({ parent: "#app", value: 75, label: "Letöltés:", showPercentage: true });\ncreateProgressBar({ parent: "#app", value: 30, color: "#22c55e", label: "Telepítés:", showPercentage: true });`,
    codeLang: "typescript",
    render: (c) => {
      createProgressBar({ parent: c, value: 75, label: "Letöltés:", showPercentage: true });
      createProgressBar({ parent: c, value: 30, color: "#22c55e", label: "Telepítés:", showPercentage: true });
    },
  },
  {
    title: "createToast",
    description: "Ideiglenes értesítés.",
    code: `createButton({\n  parent: "#app",\n  text: "Toast megjelenítése",\n  click: () => createToast({ message: "Értesítés!", type: "success" }),\n});`,
    codeLang: "typescript",
    render: (c) => {
      createButton({ parent: c, text: "Toast megjelenítése",
        click: () => createToast({ message: "Értesítés!", type: "success", duration: 3000 }) });
    },
  },
];

renderSections(sections);
done();
