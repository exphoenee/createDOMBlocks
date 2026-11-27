import { describe, it, expect, beforeEach, vi } from "vitest";
import { createCarousel, buildUI } from "../src/index";

beforeEach(() => {
  document.body.innerHTML = '<div id="root"></div>';
});

const tick = () => new Promise<void>((r) => setTimeout(r, 0));
const slides = (r: HTMLElement) => [...r.querySelectorAll<HTMLElement>(".carousel-stage > .carousel-slide")];
const active = (r: HTMLElement) => slides(r).find((s) => s.dataset.state === "active");

describe("Carousel – dinamikus diák (B1)", () => {
  it("setSlides: az azonos id-jú diák DOM-ja marad, az aktív dia marad, a pöttyök követik", () => {
    const onChange = vi.fn();
    const c = createCarousel({
      parent: "root",
      id: "c",
      onChange,
      slides: [
        { id: "a", title: "A" },
        { id: "b", title: "B" },
        { id: "c", title: "C" },
      ],
    });
    c.goTo(1);
    const b = active(c)!;
    expect(b.dataset.slideId).toBe("b");
    c.setSlides([
      { id: "x", title: "X" },
      { id: "b", title: "B" },
    ]);
    expect(slides(c).length).toBe(2);
    expect(active(c)).toBe(b);
    expect(c.getIndex()).toBe(1);
    expect(c.querySelectorAll(".carousel-dot").length).toBe(2);
  });

  it("ha az aktív dia eltűnik, a helyén lévő lesz aktív; üres listánál sem hibázik", () => {
    const c = createCarousel({ parent: "root", id: "c", slides: [{ id: "a" }, { id: "b" }, { id: "c" }] });
    c.goTo(2);
    c.setSlides([{ id: "a" }, { id: "b" }]);
    expect(c.getIndex()).toBe(1);
    c.setSlides([]);
    expect(slides(c).length).toBe(0);
    expect(c.querySelectorAll(".carousel-dot").length).toBe(0);
    c.setSlides([{ id: "z" }]);
    expect(active(c)!.dataset.slideId).toBe("z");
  });

  it("a dián saját attribútum is megadható", () => {
    const c = createCarousel({ parent: "root", id: "c", slides: [{ id: "a", attrs: { "data-category": "game" } }] });
    expect(slides(c)[0].getAttribute("data-category")).toBe("game");
  });

  it("YAML: a diák each-csel a színpadba rajzolhatók, a szűrés után a carousel követi", async () => {
    const ui = buildUI(
      `
state:
  filter: all
  projects:
    - { id: p1, name: Első, kind: game }
    - { id: p2, name: Második, kind: library }
    - { id: p3, name: Harmadik, kind: game }
ui:
  - Carousel#projects:
      children:
        - each: { in: "\${projects}", as: project, key: project.id }
          do:
            - if: "\${filter == 'all' || project.kind == filter}"
              then:
                - article.project-card:
                    data-id: "\${project.id}"
                    text: "\${project.name}"
`,
      { parent: "root" },
    );
    const c = document.getElementById("projects")!;
    await tick();
    expect(slides(c).length).toBe(3);
    expect(c.querySelectorAll(".carousel-dot").length).toBe(3);
    expect(slides(c)[0].getAttribute("role")).toBe("group");
    ui.state.set("filter", "game");
    await tick();
    expect(slides(c).map((s) => s.dataset.id)).toEqual(["p1", "p3"]);
    expect(c.querySelectorAll(".carousel-dot").length).toBe(2);
    expect(active(c)).toBeDefined();
  });
});
