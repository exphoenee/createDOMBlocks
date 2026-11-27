import { initDocPage, renderSections, example } from "../page-components/index";
import { tr } from "../page-components/i18n";
import { createSegmentedControl, createParagraph } from "../../src/index";

const done = initDocPage();

const gridIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>';
const carouselIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="9" height="16" rx="2"/><rect x="12" y="4" width="9" height="16" rx="2"/></svg>';

const sections = [
  example(
    { title: tr("Nézetváltó"), description: tr("Rádiócsoport: egy érték, nyilakkal és Home / End billentyűvel léptethető."), component: createSegmentedControl },
    (parent) => {
      const out = createParagraph({ parent, id: "demo-segmented-out", text: "grid" });
      return createSegmentedControl({
        parent,
        id: "demo-segmented-1",
        ariaLabel: "Nézet",
        value: "grid",
        options: [
          { value: "grid", label: "Rács", icon: gridIcon },
          { value: "carousel", label: "Carousel", icon: carouselIcon },
        ],
        onChange: (value) => (out.textContent = value),
      });
    },
  ),
  example(
    { title: tr("Szűrő (toggle mód)"), description: tr("aria-pressed gombok, kisebb méretben; egy opció tiltott.") },
    (parent) =>
      createSegmentedControl({
        parent,
        id: "demo-segmented-2",
        mode: "toggle",
        size: "sm",
        ariaLabel: "Szűrő",
        value: "all",
        options: [
          { value: "all", label: "Mind" },
          { value: "open", label: "Nyitott" },
          { value: "done", label: "Kész" },
          { value: "archived", label: "Archivált", disabled: true },
        ],
      }),
  ),
  example(
    { title: tr("Csak ikon"), description: tr("A felirat a képernyőolvasónak és a tooltipnek marad.") },
    (parent) =>
      createSegmentedControl({
        parent,
        id: "demo-segmented-3",
        ariaLabel: "Nézet",
        options: [
          { value: "grid", label: "Rács", icon: gridIcon, iconOnly: true },
          { value: "carousel", label: "Carousel", icon: carouselIcon, iconOnly: true },
        ],
      }),
  ),
];

renderSections(sections);
done();
