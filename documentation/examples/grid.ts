import { initDocPage, renderSections, example } from "../page-components/index";
import { tr } from "../page-components/i18n";
import { createGrid } from "../../src/index";

const done = initDocPage();

const sections = [
  example(
    { title: tr("Grid – fix oszlopszám"), description: tr("A `columns` adja az oszlopok számát (itt 3), a `gap` a cellák közti rést. Minden cella egy rácselem."), component: createGrid },
    (parent) => {
      const cell = (n: number) => ({
        tag: "div",
        text: `Cella ${n}`,
        style: { padding: "1.25rem", background: "#dbeafe", border: "1px solid #3b82f6", borderRadius: "0.5rem", textAlign: "center", fontWeight: "600" },
      });
      return createGrid({ parent, id: "grid-fixed", columns: 3, gap: "1rem", children: [1, 2, 3, 4, 5, 6, 7].map(cell) });
    },
  ),
  example(
    { title: tr("Grid – reszponzív (minItemWidth)"), description: tr("A `minItemWidth` az oszlopok minimális szélességét adja, az oszlopok száma a rendelkezésre álló helyhez igazodik. Húzd keskenyebbre az ablakot, és a cellák újrarendeződnek."), component: createGrid },
    (parent) => {
      const cell = (n: number) => ({
        tag: "div",
        text: `Kártya ${n}`,
        style: { padding: "1.5rem 1rem", background: "#dcfce7", border: "1px solid #22c55e", borderRadius: "0.5rem", textAlign: "center", fontWeight: "600" },
      });
      return createGrid({ parent, id: "grid-responsive", minItemWidth: "160px", gap: "0.75rem", children: [1, 2, 3, 4, 5, 6, 7, 8].map(cell) });
    },
  ),
  example(
    { title: tr("Grid – nagyobb rés, vegyes tartalom"), description: tr("A cellák bármilyen elem lehetnek; a `gap` nagyobb értéke jól láthatóan szétválasztja őket."), component: createGrid },
    (parent) => createGrid({
      parent,
      id: "grid-mixed",
      columns: 2,
      gap: "2rem",
      children: [
        { tag: "div", style: { padding: "1rem", background: "#fef3c7", border: "1px solid #f59e0b", borderRadius: "0.5rem" }, children: [{ tag: "strong", text: "Szöveg" }, { tag: "p", text: "Egy bekezdés a bal oszlopban." }] },
        { tag: "div", style: { padding: "1rem", background: "#fce7f3", border: "1px solid #ec4899", borderRadius: "0.5rem" }, children: [{ tag: "strong", text: "Lista" }, { tag: "ul", style: { listStyle: "disc", paddingLeft: "1.25rem" }, children: [{ tag: "li", text: "Első" }, { tag: "li", text: "Második" }] }] },
        { tag: "div", style: { padding: "1rem", background: "#ede9fe", border: "1px solid #8b5cf6", borderRadius: "0.5rem", gridColumn: "1 / -1" }, children: [{ tag: "strong", text: "Teljes szélességű cella" }, { tag: "p", text: "A `grid-column: 1 / -1` stílussal az egész sort kitölti." }] },
      ],
    }),
  ),
];

renderSections(sections);
done();
