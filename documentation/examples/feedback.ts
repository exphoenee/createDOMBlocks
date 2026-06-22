import { initDocPage, renderSections, example } from "../page-components/index";
import { createAlert, createBadge, createSpinner, createProgressBar, createButton, createToast } from "../../src/index";
import { createDOMElem } from "domelemjs";

const done = initDocPage();

const sections = [
  example(
    { title: "createAlert", description: "Figyelmeztető üzenet típusonként: success, error, warning, info.", component: createAlert },
    (parent) => {
      createAlert({ parent, id: "fb-a1", type: "success", title: "Siker!", message: "Mentés sikeres." });
      createAlert({ parent, id: "fb-a2", type: "error", title: "Hiba!", message: "Valami rossz." });
      createAlert({ parent, id: "fb-a3", type: "warning", title: "Figyelem!", message: "Vigyázz!" });
      createAlert({ parent, id: "fb-a4", type: "info", title: "Info", message: "Elcsukható.", dismissible: true });
    },
  ),
  example(
    { title: "createBadge", description: "Állapot jelző pici szöveggel.", component: createBadge },
    (parent) => {
      createBadge({ parent, id: "fb-b1", text: "Új", type: "info" }); createDOMElem({ tag: "span", parent, text: " " });
      createBadge({ parent, id: "fb-b2", text: "Siker", type: "success" }); createDOMElem({ tag: "span", parent, text: " " });
      createBadge({ parent, id: "fb-b3", text: "Hiba", type: "error" });
    },
  ),
  example(
    { title: "createSpinner", description: "Töltés indikátor meretre váltással.", component: createSpinner },
    (parent) => {
      createSpinner({ parent, id: "fb-s1", size: "sm" }); createDOMElem({ tag: "span", parent, text: "  " });
      createSpinner({ parent, id: "fb-s2", size: "md" }); createDOMElem({ tag: "span", parent, text: "  " });
      createSpinner({ parent, id: "fb-s3", size: "lg" });
    },
  ),
  example(
    { title: "createProgressBar", description: "Folyamatjelző egyéni színnel és százalék kijelzéssel.", component: createProgressBar },
    (parent) => {
      createProgressBar({ parent, id: "fb-p1", value: 75, label: "Letöltés:", showPercentage: true });
      createProgressBar({ parent, id: "fb-p2", value: 30, color: "#22c55e", label: "Telepítés:", showPercentage: true });
    },
  ),
  example(
    { title: "createToast", description: "Ideiglenes értesítés.", component: createToast },
    (parent) => {
      createButton({ parent, id: "fb-toast-btn", text: "Toast megjelenítése",
        click: () => createToast({ parent: document.body, id: "fb-toast", message: "Értesítés!", type: "success", duration: 3000, width: "300px" }) });
    },
  ),
];

renderSections(sections);
done();
