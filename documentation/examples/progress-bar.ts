import { initDocPage, renderSections, example } from "../page-components/index";
import { createProgressBar } from "../../src/index";

const done = initDocPage();

const sections = [
  example(
    { title: "createProgressBar", description: "Folyamatjelző egyéni színnel és százalék kijelzéssel.", component: createProgressBar },
    (parent) => {
      createProgressBar({ parent, id: "fb-p1", value: 75, label: "Letöltés:", showPercentage: true });
      createProgressBar({ parent, id: "fb-p2", value: 30, color: "#22c55e", label: "Telepítés:", showPercentage: true });
    },
  ),
];

renderSections(sections);
done();
