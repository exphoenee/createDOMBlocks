import { initDocPage, renderSections, example } from "../page-components/index";
import { tr } from "../page-components/i18n";
import { createGantt, createButton, createParagraph } from "../../src/index";
import type { GanttRow } from "../../src/index";

const done = initDocPage();

const career: GanttRow[] = [
  { id: "aegex", label: "Senior fejlesztő", sublabel: "Aegex", group: "career", color: "#ff7024", start: "2023-02", end: null,
    milestones: [{ date: "2024-01", label: "Új architektúra" }, { date: "2025-06", label: "Kiadási ciklus felezése" }] },
  { id: "telekom", label: "Fejlesztő", sublabel: "Telekom", group: "career", color: "#e05aab", start: "2021-03", end: "2023-01",
    milestones: [{ date: "2022-05", label: "CI/CD bevezetése" }] },
  { id: "scolia", label: "Junior fejlesztő", sublabel: "Scolia", group: "career", color: "#22c55e", start: "2019-09", end: "2021-02" },
  { id: "club", label: "Önkéntes mentor", sublabel: "Általános iskola", group: "community", color: "#06b6d4", start: "2025-02", end: null },
];

const competitions: GanttRow[] = [
  { id: "hack", label: "Hack and Code", sublabel: "Radnóti SZKI", color: "#6366f1", start: "2026-11-12", end: "2027-03-20",
    milestones: [
      { date: "2026-11-12", label: "Jelentkezés", caption: "nov. 12.", placement: "above" },
      { date: "2027-01-23", label: "Iskolai forduló", caption: "jan. 23.", placement: "below" },
      { date: "2027-03-20", label: "Döntő", caption: "márc. 20.", placement: "above", shape: "diamond" },
    ] },
  { id: "neumann", label: "Neumann János", sublabel: "Programozási verseny", color: "#22c55e", start: "2026-12-05", end: "2027-04-10",
    milestones: [
      { date: "2026-12-05", label: "Regisztráció", caption: "dec. 5.", placement: "above" },
      { date: "2027-02-13", label: "Megyei forduló", caption: "febr. 13.", placement: "below" },
      { date: "2027-04-10", label: "Döntő", caption: "ápr. 10.", placement: "above", shape: "diamond" },
    ] },
];

const sections = [
  example(
    {
      title: tr("Gantt – karrier idővonal"),
      description: tr("Sávok csoportokba rendezve, mérföldkövekkel és a mai nap vonalával. A sorra vagy a sávra kattintva kijelölhető, a sorok a bal oldali címkénél fogva húzással (vagy Alt + nyíllal) átrendezhetők."),
      component: createGantt,
    },
    (parent) => {
      const detail = createParagraph({ parent, id: "demo-gantt-detail", text: tr("Kattints egy sorra a részletekért.") });
      return createGantt({
        parent,
        id: "demo-gantt-career",
        ariaLabel: "Karrier",
        rows: career,
        groups: [
          { id: "career", label: tr("Karrier") },
          { id: "community", label: tr("Közösség") },
        ],
        draggableRows: true,
        onSelect: (row) => {
          detail.textContent = row ? `${row.label} – ${row.sublabel}` : "";
        },
      });
    },
  ),
  example(
    {
      title: tr("Gantt – versenynaptár (kártyás mérföldkövek)"),
      description: tr("`monthWidth: 0` esetén az időtengely a rendelkezésre álló szélességhez igazodik. A vékony sávhoz (`barStyle: \"thin\"`) a mérföldkövek kártyaként a sáv fölé vagy alá kerülnek, a gyémánt a kiemelt (pl. döntő) esemény."),
    },
    (parent) => {
      const clicked = createParagraph({ parent, id: "demo-gantt-clicked", text: tr("Kattints egy mérföldkőre.") });
      return createGantt({
        parent,
        id: "demo-gantt-competitions",
        rows: competitions,
        monthWidth: 0,
        barStyle: "thin",
        dimPast: true,
        onMilestoneClick: (milestone, row) => {
          clicked.textContent = `${row.label}: ${milestone.caption} – ${milestone.label}`;
        },
      });
    },
  ),
  example(
    {
      title: tr("Gantt – sorok szűrése"),
      description: tr("A `setRows()` kicseréli a sorokat, a kijelölés és a görgetés megmarad."),
    },
    (parent) => {
      const gantt = createGantt({ parent, id: "demo-gantt-filter", rows: competitions, monthWidth: 0, barStyle: "thin" });
      createButton({ parent, id: "demo-gantt-all", text: tr("Mind"), click: () => gantt.setRows(competitions) });
      createButton({ parent, id: "demo-gantt-first", text: "Hack and Code", click: () => gantt.setRows(competitions.slice(0, 1)) });
      return gantt;
    },
  ),
];

renderSections(sections);
done();
