import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { createGantt, setLocale, tr, registerMessages } from "../src/index";
import type { GanttRow } from "../src/index";

beforeEach(() => {
  document.body.innerHTML = '<div id="root"></div>';
});

afterEach(() => {
  setLocale("hu");
});

const rows: GanttRow[] = [
  { id: "a", label: "Alfa", sublabel: "Cég A", group: "work", start: "2024-01", end: "2024-06", milestones: [{ date: "2024-03", label: "Mérföldkő" }] },
  { id: "b", label: "Béta", group: "work", start: "2024-04", end: "2024-12" },
  { id: "c", label: "Gamma", group: "other", start: "2024-02", end: null },
];

const make = (extra: Record<string, unknown> = {}) =>
  createGantt({
    parent: "root",
    id: "g",
    rows,
    groups: [
      { id: "work", label: "Munka" },
      { id: "other", label: "Egyéb" },
    ],
    today: "2024-07-15",
    ...extra,
  });

const labels = (g: HTMLElement) => [...g.querySelectorAll(".gantt-label-title")].map((e) => e.textContent);
const pct = (e: Element | null, prop: "left" | "width") => parseFloat((e as HTMLElement).style[prop]);

describe("createGantt", () => {
  it("sorokat, csoportfejlécet és sávokat rajzol", () => {
    const g = make();
    expect(g.id).toBe("g");
    expect(g.querySelectorAll(".gantt-row")).toHaveLength(3);
    expect(g.querySelectorAll(".gantt-group")).toHaveLength(2);
    expect(g.querySelectorAll(".gantt-bar")).toHaveLength(3);
    expect(labels(g)).toEqual(["Alfa", "Béta", "Gamma"]);
  });

  it("a sáv helyzete az időtengelyhez igazodik (hónap pontosságú vég a hónap végéig tart)", () => {
    const g = make({ from: "2024-01", to: "2024-12" });
    const bar = g.querySelector('.gantt-bar[data-row="a"]');
    expect(pct(bar, "left")).toBeCloseTo(0, 1);
    expect(pct(bar, "width")).toBeCloseTo((6 / 12) * 100, 1); // január–június = 6 hónap
  });

  it("a nap pontosságú dátum napra pontos", () => {
    const g = createGantt({
      parent: "root",
      id: "g2",
      rows: [{ id: "x", label: "X", start: "2024-01-01", end: "2024-01-31" }],
      from: "2024-01",
      to: "2024-02",
    });
    const bar = g.querySelector(".gantt-bar");
    expect(pct(bar, "left")).toBeCloseTo(0, 1);
    expect(pct(bar, "width")).toBeCloseTo(50, 1); // januári 31 nap = az 1 hónapos tengely fele (2 hónap)
  });

  it("a végtelen (end: null) sáv tart még és is-current osztályt kap", () => {
    const g = make();
    const bar = g.querySelector('.gantt-bar[data-row="c"]') as HTMLElement;
    expect(bar.classList.contains("is-current")).toBe(true);
    expect(g.querySelector('.gantt-bar[data-row="a"]')!.classList.contains("is-current")).toBe(false);
    expect(g.querySelector('.gantt-row[data-id="c"] .gantt-label-period')!.textContent).toContain("jelenleg");
  });

  it("a mai nap vonala és buborékja megjelenik, ha a tartományban van; kikapcsolható", () => {
    const g = make();
    expect(g.querySelector(".gantt-today")).not.toBeNull();
    expect(g.querySelector(".gantt-today-bubble")!.textContent).toBe("Ma");
    const off = make({ id: "g3", showToday: false });
    expect(off.querySelector(".gantt-today")).toBeNull();
    const noBubble = make({ id: "g4", todayLabel: false });
    expect(noBubble.querySelector(".gantt-today")).not.toBeNull();
    expect(noBubble.querySelector(".gantt-today-bubble")).toBeNull();
  });

  it("kattintásra kijelöl, újabb kattintásra megszünteti, és hívja a visszahívásokat", () => {
    const onRowClick = vi.fn();
    const onSelect = vi.fn();
    const g = make({ onRowClick, onSelect });
    const label = g.querySelector('.gantt-row[data-id="b"] .gantt-label') as HTMLElement;
    label.click();
    expect(g.getSelected()).toBe("b");
    expect(g.querySelector('.gantt-row[data-id="b"]')!.classList.contains("is-active")).toBe(true);
    expect(label.getAttribute("aria-pressed")).toBe("true");
    expect(onSelect).toHaveBeenLastCalledWith(expect.objectContaining({ id: "b" }));
    expect(onRowClick).toHaveBeenCalledTimes(1);

    (g.querySelector('.gantt-bar[data-row="b"]') as HTMLElement).click();
    expect(g.getSelected()).toBeNull();
    expect(onSelect).toHaveBeenLastCalledWith(null);
  });

  it("selectable: false esetén nincs kijelölés, de a visszahívás él", () => {
    const onRowClick = vi.fn();
    const g = make({ selectable: false, onRowClick });
    (g.querySelector('.gantt-row[data-id="a"] .gantt-label') as HTMLElement).click();
    expect(g.getSelected()).toBeNull();
    expect(onRowClick).toHaveBeenCalled();
  });

  it("select() programozottan kijelöl, selectedId kezdetben", () => {
    const g = make({ selectedId: "c" });
    expect(g.getSelected()).toBe("c");
    g.select("a");
    expect(g.querySelector('.gantt-row[data-id="a"]')!.classList.contains("is-active")).toBe(true);
    expect(g.querySelector('.gantt-row[data-id="c"]')!.classList.contains("is-active")).toBe(false);
    g.select(null);
    expect(g.getSelected()).toBeNull();
  });

  it("Enter billentyű is kijelöl", () => {
    const g = make();
    const label = g.querySelector('.gantt-row[data-id="a"] .gantt-label') as HTMLElement;
    label.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
    expect(g.getSelected()).toBe("a");
  });

  it("a mérföldkő kattintása nem jelöl ki sort, és megkapja a mérföldkövet és a sort", () => {
    const onMilestoneClick = vi.fn();
    const g = make({ onMilestoneClick });
    const mark = g.querySelector(".gantt-mark") as HTMLElement;
    expect(mark.getAttribute("aria-label")).toBe("Mérföldkő");
    mark.click();
    expect(onMilestoneClick).toHaveBeenCalledWith(expect.objectContaining({ label: "Mérföldkő" }), expect.objectContaining({ id: "a" }));
    expect(g.getSelected()).toBeNull();
  });

  it("kártyás mérföldkő: magasabb sor, kártya, összekötő; a gyémánt kiemelt", () => {
    const g = createGantt({
      parent: "root",
      id: "g5",
      barStyle: "thin",
      today: "2024-07-01",
      rows: [
        {
          id: "k",
          label: "Verseny",
          start: "2024-02",
          end: "2024-06",
          milestones: [
            { date: "2024-03-10", label: "Selejtező", caption: "márc. 10.", placement: "above" },
            { date: "2024-05-20", label: "Döntő", placement: "below", shape: "diamond" },
          ],
        },
      ],
    });
    expect(g.querySelectorAll(".gantt-card")).toHaveLength(2);
    expect(g.querySelector(".gantt-card.is-above .gantt-card-caption")!.textContent).toBe("márc. 10.");
    expect(g.querySelector(".gantt-card.is-below")!.classList.contains("is-final")).toBe(true);
    expect(g.querySelector(".gantt-mark.is-diamond")).not.toBeNull();
    expect((g.querySelector(".gantt-row") as HTMLElement).style.height).toBe("128px");
    expect(g.classList.contains("is-thin")).toBe(true);
    expect(g.querySelector(".gantt-bar-text")).toBeNull();
  });

  it("dimPast: az elmúlt mérföldkövek halványak", () => {
    const g = createGantt({
      parent: "root",
      id: "g6",
      dimPast: true,
      today: "2024-05-01",
      rows: [{ id: "d", label: "D", start: "2024-01", end: "2024-12", milestones: [{ date: "2024-02", label: "múlt" }, { date: "2024-09", label: "jövő" }] }],
    });
    const marks = g.querySelectorAll(".gantt-mark");
    expect(marks[0].classList.contains("is-past")).toBe(true);
    expect(marks[1].classList.contains("is-past")).toBe(false);
  });

  it("setRows lecseréli a sorokat; a már nem létező kijelölés megszűnik", () => {
    const g = make({ selectedId: "c" });
    g.setRows(rows.filter((r) => r.id !== "c"));
    expect(labels(g)).toEqual(["Alfa", "Béta"]);
    expect(g.getSelected()).toBeNull();
    g.setRows([]);
    expect(g.querySelector(".gantt-empty")!.textContent).toBe("Nincs megjeleníthető sor");
  });

  it("negyedéves és havi tengely", () => {
    const quarters = make({ axis: "quarters", from: "2024-01", to: "2024-12" });
    expect([...quarters.querySelectorAll(".gantt-tick")].map((e) => e.textContent)).toEqual(["Q1", "Q2", "Q3", "Q4"]);
    const months = make({ id: "gm", axis: "months", monthWidth: 0, from: "2024-01", to: "2024-04" });
    expect(months.querySelectorAll(".gantt-tick")).toHaveLength(4); // a `to` hónap vége is benne van
    expect(months.classList.contains("is-fit")).toBe(true);
    expect(months.querySelector(".gantt-year")!.textContent).toBe("2024");
  });

  it("húzással csoporton belül átrendezhető, csoporthatáron át nem", () => {
    const onReorder = vi.fn();
    const g = make({ draggableRows: true, onReorder });
    const drag = (type: string, el: Element, extra: Record<string, unknown> = {}) => {
      const ev = new Event(type, { bubbles: true, cancelable: true });
      Object.assign(ev, { clientY: 0, dataTransfer: null }, extra);
      el.dispatchEvent(ev);
    };
    const labelOf = (id: string) => g.querySelector(`.gantt-row[data-id="${id}"] .gantt-label`)!;
    const rowOf = (id: string) => g.querySelector(`.gantt-row[data-id="${id}"]`)!;

    expect((labelOf("a") as HTMLElement).draggable).toBe(true);
    // a -> b mögé (b sor alsó fele: clientY nagyobb, mint a téglalap közepe = 0)
    drag("dragstart", labelOf("a"));
    drag("dragover", rowOf("b"), { clientY: 10 });
    drag("drop", rowOf("b"));
    expect(g.getOrder()).toEqual(["b", "a", "c"]);
    expect(onReorder).toHaveBeenCalledWith(["b", "a", "c"]);
    expect(labels(g)).toEqual(["Béta", "Alfa", "Gamma"]);

    // másik csoportba nem mozgatható
    drag("dragstart", labelOf("a"));
    drag("dragover", rowOf("c"), { clientY: 10 });
    drag("drop", rowOf("c"));
    expect(g.getOrder()).toEqual(["b", "a", "c"]);
    expect(onReorder).toHaveBeenCalledTimes(1);
  });

  it("Alt+nyíl billentyűvel is átrendezhető", () => {
    const g = make({ draggableRows: true });
    const label = g.querySelector('.gantt-row[data-id="a"] .gantt-label') as HTMLElement;
    label.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", altKey: true, bubbles: true }));
    expect(g.getOrder()).toEqual(["b", "a", "c"]);
  });

  it("húzás nélküli módban a sor nem húzható", () => {
    const g = make();
    expect((g.querySelector(".gantt-label") as HTMLElement).draggable).toBe(false);
  });

  it("érvénytelen dátumra érthető hibát dob", () => {
    expect(() => createGantt({ parent: "root", id: "bad", rows: [{ id: "x", label: "X", start: "nem dátum" }] })).toThrow(/érvénytelen dátum/);
  });

  describe("nyelvesítés", () => {
    it("nyelvváltáskor a feliratok, hónapnevek és időszakok frissülnek, a kijelölés megmarad", () => {
      registerMessages("hu", { "t.alpha": "Alfa feladat" });
      registerMessages("en", { "t.alpha": "Alpha task" });
      const g = createGantt({
        parent: "root",
        id: "gi",
        axis: "months",
        monthWidth: 40,
        from: "2024-01",
        to: "2024-04",
        today: "2024-02-10",
        rows: [{ id: "a", label: tr("t.alpha"), start: "2024-01", end: null }],
      });
      g.select("a");
      expect(labels(g)).toEqual(["Alfa feladat"]);
      expect(g.querySelector(".gantt-label-period")!.textContent).toContain("jelenleg");
      expect(g.querySelector(".gantt-today-bubble")!.textContent).toBe("Ma");
      expect(g.querySelector(".gantt-corner")!.textContent).toBe("Feladat");
      const huMonths = [...g.querySelectorAll(".gantt-tick")].map((e) => e.textContent);

      setLocale("en");
      expect(labels(g)).toEqual(["Alpha task"]);
      expect(g.querySelector(".gantt-label-period")!.textContent).toContain("present");
      expect(g.querySelector(".gantt-today-bubble")!.textContent).toBe("Today");
      expect(g.querySelector(".gantt-corner")!.textContent).toBe("Task");
      expect([...g.querySelectorAll(".gantt-tick")].map((e) => e.textContent)).not.toEqual(huMonths);
      expect(g.getSelected()).toBe("a");
      expect(g.querySelector('.gantt-row[data-id="a"]')!.classList.contains("is-active")).toBe(true);
    });
  });
});
