import { initDocPage, renderSections, example } from "../page-components/index";
import { createTimeline, createButton } from "../../src/index";

const done = initDocPage();

const items = [
  { period: "2022 – jelenleg", title: "Senior fejlesztő", subtitle: "Példa Kft.", description: "Komponenskönyvtár fejlesztése, kódátvizsgálás, mentorálás.", badge: "jelenlegi" },
  { period: "2019 – 2022", title: "Fejlesztő", subtitle: "Minta Zrt.", description: "Webalkalmazások fejlesztése TypeScript-tel." },
  { period: "2017 – 2019", title: "Junior fejlesztő", subtitle: "Teszt Bt.", description: "Első lépések a professzionális fejlesztésben." },
];

const sections = [
  example(
    { title: "Alap idővonal", description: "Váltakozó oldalú kártyák; keskeny képernyőn egy oszlop.", component: createTimeline },
    (parent) => createTimeline({ parent, id: "demo-timeline-1", items, ariaLabel: "Munkatapasztalat" }),
  ),
  example(
    { title: "Kompakt nézet", description: "Az `is-compact` osztály rejti a leírásokat; kapcsolóval váltható." },
    (parent) => {
      const timeline = createTimeline({ parent, id: "demo-timeline-2", items, compact: true });
      createButton({
        parent,
        id: "demo-timeline-toggle",
        text: "Kompakt / részletes",
        click: () => timeline.classList.toggle("is-compact"),
      });
      return timeline;
    },
  ),
];

renderSections(sections);
done();
