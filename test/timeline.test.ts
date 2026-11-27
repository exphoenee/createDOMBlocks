import { describe, it, expect, beforeEach } from "vitest";
import { createTimeline, buildUI } from "../src/index";

beforeEach(() => {
  document.body.innerHTML = '<div id="root"></div>';
});

const items = [
  { period: "2022 –", title: "Senior", description: "Leírás A", badge: "jelenlegi" },
  { period: "2019 – 2022", title: "Junior", description: "Leírás B" },
];

describe("Timeline – frissítő metódusok (B2)", () => {
  it("setCompact: csak az osztály vált, a gyökér és az elemek maradnak", () => {
    const tl = createTimeline({ parent: "root", id: "tl", items });
    const first = tl.querySelector(".timeline-item");
    tl.setCompact(true);
    expect(tl.classList.contains("is-compact")).toBe(true);
    expect(tl.querySelector(".timeline-item")).toBe(first);
    tl.setCompact(false);
    expect(tl.classList.contains("is-compact")).toBe(false);
  });

  it("setItems: a bejegyzések cseréje, a gyökér marad", () => {
    const tl = createTimeline({ parent: "root", id: "tl", items, compact: true });
    tl.setItems([{ period: "2010", title: "Kezdő" }]);
    expect(document.getElementById("tl")).toBe(tl);
    expect([...tl.querySelectorAll(".timeline-title")].map((e) => e.textContent)).toEqual(["Kezdő"]);
    expect(tl.classList.contains("is-compact")).toBe(true);
  });

  it("YAML: a compact és az items állapotváltozása nem építi újra a komponenst", () => {
    const ui = buildUI(
      `
state: { compact: false, entries: [ { period: "2022", title: A }, { period: "2020", title: B } ] }
ui:
  - Timeline#career:
      compact: "\${compact}"
      items: "\${entries}"
`,
      { parent: "root" },
    );
    const root = document.getElementById("career")!;
    ui.state.set("compact", true);
    expect(document.getElementById("career")).toBe(root);
    expect(root.classList.contains("is-compact")).toBe(true);
    ui.state.set("entries", [{ period: "2024", title: "C" }]);
    expect(document.getElementById("career")).toBe(root);
    expect(root.querySelector(".timeline-title")!.textContent).toBe("C");
  });
});
