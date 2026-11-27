import { describe, it, expect, beforeEach, vi } from "vitest";
import { createSegmentedControl, buildUI } from "../src/index";

beforeEach(() => {
  document.body.innerHTML = '<div id="root"></div>';
});

const options = [
  { value: "grid", label: "Rács" },
  { value: "carousel", label: "Carousel" },
  { value: "list", label: "Lista", disabled: true },
];
const btn = (root: HTMLElement, v: string) => root.querySelector<HTMLButtonElement>(`[data-value="${v}"]`)!;

describe("SegmentedControl (C3)", () => {
  it("radio mód: radiogroup, aria-checked, roving tabindex, alapból az első", () => {
    const sc = createSegmentedControl({ parent: "root", id: "view", options, ariaLabel: "Nézet" });
    expect(sc.getAttribute("role")).toBe("radiogroup");
    expect(sc.getAttribute("aria-label")).toBe("Nézet");
    expect(sc.getValue()).toBe("grid");
    expect(btn(sc, "grid").getAttribute("aria-checked")).toBe("true");
    expect(btn(sc, "grid").tabIndex).toBe(0);
    expect(btn(sc, "carousel").tabIndex).toBe(-1);
  });

  it("kattintás: választ és onChange-et hív; tiltott opció nem választható", () => {
    const onChange = vi.fn();
    const sc = createSegmentedControl({ parent: "root", id: "view", options, onChange });
    btn(sc, "carousel").click();
    expect(sc.getValue()).toBe("carousel");
    expect(onChange).toHaveBeenCalledWith("carousel");
    btn(sc, "list").click();
    expect(sc.getValue()).toBe("carousel");
    btn(sc, "carousel").click(); // ugyanaz: nincs újabb értesítés
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it("nyilak, Home / End: a tiltott opciót átugorja, körbeér, a fókusz követi", () => {
    const sc = createSegmentedControl({ parent: "root", id: "view", options, value: "grid" });
    const key = (k: string) => sc.dispatchEvent(new KeyboardEvent("keydown", { key: k, bubbles: true }));
    key("ArrowRight");
    expect(sc.getValue()).toBe("carousel");
    key("ArrowRight"); // a "list" tiltott → vissza az elsőre
    expect(sc.getValue()).toBe("grid");
    key("End");
    expect(sc.getValue()).toBe("carousel");
    expect(document.activeElement).toBe(btn(sc, "carousel"));
  });

  it("toggle mód: aria-pressed gombok, nincs radiogroup", () => {
    const sc = createSegmentedControl({ parent: "root", id: "f", options, mode: "toggle", value: "carousel" });
    expect(sc.getAttribute("role")).toBe("group");
    expect(btn(sc, "carousel").getAttribute("aria-pressed")).toBe("true");
    expect(btn(sc, "grid").getAttribute("aria-pressed")).toBe("false");
    expect(btn(sc, "grid").hasAttribute("aria-checked")).toBe(false);
  });

  it("setValue nem hív onChange-et; setOptions cseréli az opciókat", () => {
    const onChange = vi.fn();
    const sc = createSegmentedControl({ parent: "root", id: "v", options, onChange });
    sc.setValue("carousel");
    expect(sc.getValue()).toBe("carousel");
    expect(onChange).not.toHaveBeenCalled();
    sc.setOptions([{ value: "a", label: "A" }, { value: "b", label: "B" }]);
    expect(sc.getValue()).toBe("a");
    expect(sc.querySelectorAll(".segmented-btn").length).toBe(2);
  });

  it("csak ikonos opció: a felirat képernyőolvasónak marad, tooltipként is", () => {
    const sc = createSegmentedControl({ parent: "root", id: "i", options: [{ value: "g", label: "Rács", icon: "▦", iconOnly: true }] });
    const b = btn(sc, "g");
    expect(b.querySelector(".segmented-label")!.classList.contains("sr-only")).toBe(true);
    expect(b.getAttribute("title")).toBe("Rács");
    expect(b.querySelector(".segmented-icon")!.textContent).toBe("▦");
  });

  it("YAML: bind kétirányú, a komponens nem épül újra", () => {
    const ui = buildUI(
      `
state: { view: grid }
ui:
  - SegmentedControl#view-switch:
      bind: view
      options:
        - { value: grid, label: Rács }
        - { value: carousel, label: Carousel }
  - p#out: "\${view}"
`,
      { parent: "root" },
    );
    const sc = document.getElementById("view-switch")!;
    btn(sc, "carousel").click();
    expect(ui.state.get("view")).toBe("carousel");
    expect(document.getElementById("out")!.textContent).toBe("carousel");
    ui.state.set("view", "grid");
    expect(document.getElementById("view-switch")).toBe(sc);
    expect(btn(sc, "grid").getAttribute("aria-checked")).toBe("true");
  });
});
