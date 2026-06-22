import { initDocPage, renderSections } from "../page-components/index";
import { createAlert, createBadge, createSpinner, createProgressBar, createButton, createToast } from "../../src/index";
import { createDOMElem } from "domelemjs";
import type { DocSection } from "../page-components/index";

const done = initDocPage();

const sections: DocSection[] = [
  {
    title: "createAlert",
    description: "Figyelmeztető üzenet típusonként: success, error, warning, info.",
    code: `createAlert({ parent: "#app", id: "alert1", type: "success", title: "Siker!", message: "Mentés sikeres." });\ncreateAlert({ parent: "#app", id: "alert2", type: "error", title: "Hiba!", message: "Valami rossz." });\ncreateAlert({ parent: "#app", id: "alert3", type: "warning", title: "Figyelem!", message: "Vigyázz!" });\ncreateAlert({ parent: "#app", id: "alert4", type: "info", title: "Info", message: "Elcsukható.", dismissible: true });`,
    codeLang: "typescript",
    render: (c) => {
      createAlert({ parent: c, id: "fb-a1", type: "success", title: "Siker!", message: "Mentés sikeres." });
      createAlert({ parent: c, id: "fb-a2", type: "error", title: "Hiba!", message: "Valami rossz." });
      createAlert({ parent: c, id: "fb-a3", type: "warning", title: "Figyelem!", message: "Vigyázz!" });
      createAlert({ parent: c, id: "fb-a4", type: "info", title: "Info", message: "Elcsukható.", dismissible: true });
    },
  },
  {
    title: "createBadge",
    description: "Állapot jelző pici szöveggel.",
    code: `createBadge({ parent: "#app", id: "badge1", text: "Új", type: "info" });\ncreateBadge({ parent: "#app", id: "badge2", text: "Siker", type: "success" });\ncreateBadge({ parent: "#app", id: "badge3", text: "Hiba", type: "error" });`,
    codeLang: "typescript",
    render: (c) => {
      createBadge({ parent: c, id: "fb-b1", text: "Új", type: "info" }); createDOMElem({ tag: "span", parent: c, text: " " });
      createBadge({ parent: c, id: "fb-b2", text: "Siker", type: "success" }); createDOMElem({ tag: "span", parent: c, text: " " });
      createBadge({ parent: c, id: "fb-b3", text: "Hiba", type: "error" });
    },
  },
  {
    title: "createSpinner",
    description: "Töltés indikátor meretre váltással.",
    code: `createSpinner({ parent: "#app", id: "spin1", size: "sm" });\ncreateSpinner({ parent: "#app", id: "spin2", size: "md" });\ncreateSpinner({ parent: "#app", id: "spin3", size: "lg" });`,
    codeLang: "typescript",
    render: (c) => {
      createSpinner({ parent: c, id: "fb-s1", size: "sm" }); createDOMElem({ tag: "span", parent: c, text: "  " });
      createSpinner({ parent: c, id: "fb-s2", size: "md" }); createDOMElem({ tag: "span", parent: c, text: "  " });
      createSpinner({ parent: c, id: "fb-s3", size: "lg" });
    },
  },
  {
    title: "createProgressBar",
    description: "Folyamatjelző egyéni színnel és százalék kijelzéssel.",
    code: `createProgressBar({ parent: "#app", id: "pb1", value: 75, label: "Letöltés:", showPercentage: true });\ncreateProgressBar({ parent: "#app", id: "pb2", value: 30, color: "#22c55e", label: "Telepítés:", showPercentage: true });`,
    codeLang: "typescript",
    render: (c) => {
      createProgressBar({ parent: c, id: "fb-p1", value: 75, label: "Letöltés:", showPercentage: true });
      createProgressBar({ parent: c, id: "fb-p2", value: 30, color: "#22c55e", label: "Telepítés:", showPercentage: true });
    },
  },
  {
    title: "createToast",
    description: "Ideiglenes értesítés.",
    code: `createButton({\n  parent: "#app",\n  id: "toastBtn",\n  text: "Toast megjelenítése",\n  click: () => createToast({ id: "toast1", message: "Értesítés!", type: "success" }),\n});`,
    codeLang: "typescript",
    render: (c) => {
      createButton({ parent: c, id: "fb-toast-btn", text: "Toast megjelenítése",
        click: () => createToast({ parent: document.body, id: "fb-toast", message: "Értesítés!", type: "success", duration: 3000 }) });
    },
  },
];

renderSections(sections);
done();
