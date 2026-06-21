import { createAlert, createBadge, createSpinner, createProgressBar, createButton, createToast } from "../../src/index";
import { createDOMElem } from "domelemjs";

const alertParent = document.getElementById("app-alert")!;
createAlert({ parent: alertParent, type: "success", title: "Siker!", message: "A mentes sikeres volt." });
createAlert({ parent: alertParent, type: "error", title: "Hiba!", message: "Valami rosszul sikerult." });
createAlert({ parent: alertParent, type: "warning", title: "Figyelem!", message: "Kosd be a biztonsagi ovet." });
createAlert({ parent: alertParent, type: "info", title: "Info", message: "Ez elcsukhato.", dismissible: true });

const badgeParent = document.getElementById("app-badge")!;
createBadge({ parent: badgeParent, text: "Uj", type: "info" }); createDOMElem({ tag: "span", parent: badgeParent, text: " " });
createBadge({ parent: badgeParent, text: "Siker", type: "success" }); createDOMElem({ tag: "span", parent: badgeParent, text: " " });
createBadge({ parent: badgeParent, text: "Hiba", type: "error" }); createDOMElem({ tag: "span", parent: badgeParent, text: " " });
createBadge({ parent: badgeParent, text: "Figyelmeztetes", type: "warning" }); createDOMElem({ tag: "span", parent: badgeParent, text: " " });
createBadge({ parent: badgeParent, text: "Semleges", type: "neutral" });

const spinnerParent = document.getElementById("app-spinner")!;
createSpinner({ parent: spinnerParent, size: "sm" }); createDOMElem({ tag: "span", parent: spinnerParent, text: "  " });
createSpinner({ parent: spinnerParent, size: "md" }); createDOMElem({ tag: "span", parent: spinnerParent, text: "  " });
createSpinner({ parent: spinnerParent, size: "lg" });

const progressParent = document.getElementById("app-progress")!;
createProgressBar({ parent: progressParent, value: 75, label: "Letoltes:", showPercentage: true });
createProgressBar({ parent: progressParent, value: 30, color: "#22c55e", label: "Telepites:", showPercentage: true });

const toastParent = document.getElementById("app-toast")!;
createButton({ parent: toastParent, text: "Toast megjelenitese",
  click: () => createToast({ message: "Ez egy uzenet!", type: "success", duration: 3000 }) });
