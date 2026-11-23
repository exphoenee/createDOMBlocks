import { initDocPage, renderSections, example } from "../page-components/index";
import { tr } from "../page-components/i18n";
import { createAlert } from "../../src/index";

const done = initDocPage();

const sections = [
  example(
    { title: tr("Alert"), description: tr("Figyelmeztető üzenet típusonként: success, error, warning, info."), component: createAlert },
    (parent) => {
      createAlert({ parent, id: "fb-a1", type: "success", title: "Siker!", message: "Mentés sikeres." });
      createAlert({ parent, id: "fb-a2", type: "error", title: "Hiba!", message: "Valami rossz." });
      createAlert({ parent, id: "fb-a3", type: "warning", title: "Figyelem!", message: "Vigyázz!" });
      createAlert({ parent, id: "fb-a4", type: "info", title: "Info", message: "Elcsukható.", dismissible: true });
    },
  ),
];

renderSections(sections);
done();
