import { describe, it, expect, beforeEach, vi } from "vitest";
import { createGantt, createModal, openModal } from "../src/index";
import type { GanttRow } from "../src/index";

beforeEach(() => {
  document.body.innerHTML = '<div id="root"></div>';
});

const rows: GanttRow[] = [
  {
    id: "r",
    label: "Verseny",
    sublabel: "nov. – ápr.",
    periodLabel: "",
    start: "2026-11-01",
    end: "2027-03-31",
    milestones: [
      { id: "m1", date: "2026-12-05", label: "Jelentkezés", caption: "dec. 5.", meta: "9:00–16:00", placement: "above", flag: { text: "!", title: "Eltérés" } },
      { id: "m2", date: "2027-02-05", label: "Döntő", placement: "below", shape: "diamond" },
      { id: "m3", date: "2027-01-10", label: "Belső pont" },
    ],
  },
];

const make = (extra: Record<string, unknown> = {}) =>
  createGantt({ parent: "root", id: "g", rows, today: "2026-12-20", barStyle: "thin", ...extra });

describe("createGantt – kiegészítések", () => {
  it("üres periodLabel esetén nincs időszak-sor", () => {
    const g = make();
    expect(g.querySelector(".gantt-label-period")).toBeNull();
    expect(g.querySelector(".gantt-label")!.getAttribute("aria-label")).toBe("Verseny");
  });

  it("a kártyán megjelenik a meta sor és a jelvény tooltippel", () => {
    const g = make();
    expect(g.querySelector(".gantt-card-meta")!.textContent).toBe("9:00–16:00");
    const flag = g.querySelector(".gantt-flag") as HTMLElement;
    expect(flag.textContent).toBe("!");
    expect(flag.title).toBe("Eltérés");
  });

  it("selectMilestone kiemel, és újrarajzolás után is megmarad", () => {
    const g = make({ selectedMilestoneId: "m2" });
    const selected = () => [...g.querySelectorAll(".is-selected")].map((e) => (e as HTMLElement).dataset.msId);
    expect(selected()).toEqual(["m2", "m2"]); // kártya + pötty
    g.selectMilestone("m1");
    expect(selected()).toEqual(["m1", "m1"]);
    g.setRows(rows);
    expect(selected()).toEqual(["m1", "m1"]);
    g.selectMilestone(null);
    expect(selected()).toEqual([]);
  });

  it("onMilestoneHover egyszer fut ugyanarra a mérföldkőre, váltáskor újra", () => {
    const onMilestoneHover = vi.fn();
    const g = make({ onMilestoneHover });
    const [c1, c2] = [...g.querySelectorAll(".gantt-card")] as HTMLElement[];
    c1.dispatchEvent(new Event("mouseover", { bubbles: true }));
    c1.dispatchEvent(new Event("mouseover", { bubbles: true }));
    expect(onMilestoneHover).toHaveBeenCalledTimes(1);
    expect(onMilestoneHover.mock.calls[0][0].id).toBe("m1");
    c2.dispatchEvent(new Event("mouseover", { bubbles: true }));
    expect(onMilestoneHover).toHaveBeenCalledTimes(2);
    expect(onMilestoneHover.mock.calls[1][0].id).toBe("m2");
  });

  it("dragScroll: húzásra görget, a húzás utáni kattintást elnyeli", () => {
    const onMilestoneClick = vi.fn();
    const g = make({ dragScroll: true, onMilestoneClick });
    expect(g.classList.contains("is-dragscroll")).toBe(true);
    const scroller = g.querySelector(".gantt-scroll") as HTMLElement;
    const track = g.querySelector(".gantt-track") as HTMLElement;
    scroller.scrollLeft = 100;
    track.dispatchEvent(new MouseEvent("mousedown", { bubbles: true, cancelable: true, button: 0, clientX: 200 }));
    window.dispatchEvent(new MouseEvent("mousemove", { clientX: 150 }));
    expect(scroller.scrollLeft).toBe(150);
    expect(g.classList.contains("is-grabbing")).toBe(true);
    window.dispatchEvent(new MouseEvent("mouseup"));
    expect(g.classList.contains("is-grabbing")).toBe(false);
    // a húzás utáni kattintás nem aktivál mérföldkövet
    (g.querySelector(".gantt-card") as HTMLElement).click();
    expect(onMilestoneClick).not.toHaveBeenCalled();
    (g.querySelector(".gantt-card") as HTMLElement).click();
    expect(onMilestoneClick).toHaveBeenCalledTimes(1);
  });

  it("dragScroll nélkül a lenyomás nem görget", () => {
    const g = make();
    const scroller = g.querySelector(".gantt-scroll") as HTMLElement;
    scroller.scrollLeft = 100;
    g.querySelector(".gantt-track")!.dispatchEvent(new MouseEvent("mousedown", { bubbles: true, button: 0, clientX: 200 }));
    window.dispatchEvent(new MouseEvent("mousemove", { clientX: 100 }));
    window.dispatchEvent(new MouseEvent("mouseup"));
    expect(scroller.scrollLeft).toBe(100);
  });
});

describe("createModal – kiegészítések", () => {
  const content = { modalTitle: "Cím", body: { tag: "p", text: "Tartalom" } };

  it("footer: false esetén nincs OK / Mégse gomb", () => {
    createModal(content, {}, { id: "m1", footer: false });
    expect(document.querySelector("#m1-portal .modal-footer")).toBeNull();
    createModal(content, {}, { id: "m2" });
    expect(document.querySelector("#m2-portal .modal-footer")).not.toBeNull();
  });

  it("closeOnBackdrop: a háttérre kattintás zár, a tartalomra nem", () => {
    const closeAction = vi.fn();
    createModal(content, { closeAction }, { id: "m3", closeOnBackdrop: true });
    openModal("m3");
    const portal = document.getElementById("m3-portal")!;
    (document.getElementById("m3") as HTMLElement).click();
    expect(portal.classList.contains("hidden")).toBe(false);
    portal.click();
    expect(portal.classList.contains("hidden")).toBe(true);
    expect(closeAction).toHaveBeenCalledTimes(1);
  });

  it("closeOnEscape: csak nyitott modált zár, alapból nem reagál", () => {
    const closeAction = vi.fn();
    createModal(content, { closeAction }, { id: "m4", closeOnEscape: true });
    createModal(content, {}, { id: "m5" });
    const esc = () => document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    esc(); // zárt modál: nincs hatás
    expect(closeAction).not.toHaveBeenCalled();
    openModal("m4");
    openModal("m5");
    esc();
    expect(document.getElementById("m4-portal")!.classList.contains("hidden")).toBe(true);
    expect(closeAction).toHaveBeenCalledTimes(1);
    expect(document.getElementById("m5-portal")!.classList.contains("hidden")).toBe(false);
  });
});
