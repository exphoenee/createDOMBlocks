import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { createTabs, createGrid, createCarousel, createTimeline, createImage } from "../src/index";

beforeEach(() => {
  document.body.innerHTML = '<div id="root"></div>';
});

const flush = () => new Promise((r) => setTimeout(r, 0));
const key = (el: Element, k: string) => el.dispatchEvent(new KeyboardEvent("keydown", { key: k, bubbles: true }));

describe("createTabs", () => {
  const make = (onChange?: (id: string) => void) =>
    createTabs({
      parent: "#root",
      id: "t",
      onChange,
      tabs: [
        { id: "a", label: "A", content: { tag: "p", text: "PA" } },
        { id: "b", label: "B", content: { tag: "p", text: "PB" } },
        { id: "c", label: "C", content: { tag: "p", text: "PC" } },
      ],
    });
  const tabs = (root: HTMLElement) => [...root.querySelectorAll<HTMLElement>("[role=tab]")];

  it("wires ARIA and roving tabindex", () => {
    const root = make();
    const [a, b] = tabs(root);
    expect(a.getAttribute("aria-selected")).toBe("true");
    expect(a.tabIndex).toBe(0);
    expect(b.tabIndex).toBe(-1);
    const panel = root.querySelector("[role=tabpanel]")!;
    expect(a.getAttribute("aria-controls")).toBe(panel.id);
    expect(panel.getAttribute("aria-labelledby")).toBe(a.id);
  });

  it("switches on click, fires onChange once per change", () => {
    const cb = vi.fn();
    const root = make(cb);
    tabs(root)[1].click();
    tabs(root)[1].click();
    expect(cb).toHaveBeenCalledTimes(1);
    expect(cb).toHaveBeenCalledWith("b");
    expect(root.querySelector(".tab-panel.active")!.getAttribute("data-tab-panel")).toBe("b");
  });

  it("arrow keys wrap, Home / End jump and move focus", () => {
    const root = make();
    const t = tabs(root);
    key(t[0], "ArrowLeft");
    expect(t[2].classList.contains("active")).toBe(true);
    expect(document.activeElement).toBe(t[2]);
    key(t[2], "ArrowRight");
    expect(t[0].classList.contains("active")).toBe(true);
    key(t[0], "End");
    expect(t[2].classList.contains("active")).toBe(true);
    key(t[2], "Home");
    expect(t[0].classList.contains("active")).toBe(true);
  });

  it("falls back to the first tab for an unknown activeTab", () => {
    const root = createTabs({ parent: "#root", id: "x", activeTab: "zzz", tabs: [{ id: "a", label: "A", content: { tag: "p" } }] });
    expect(tabs(root)[0].classList.contains("active")).toBe(true);
  });
});

describe("createGrid", () => {
  it("fixed columns", () => {
    const g = createGrid({ parent: "#root", id: "g", columns: 3, gap: "2rem" });
    expect(g.style.gridTemplateColumns).toBe("repeat(3, 1fr)");
  });

  it("minItemWidth gives auto-fill columns and renders children", () => {
    const g = createGrid({ parent: "#root", id: "g", minItemWidth: "200px", children: [{ tag: "span", text: "x" }, document.createElement("i")] });
    expect(g.style.gridTemplateColumns).toContain("auto-fill");
    expect(g.children.length).toBe(2);
  });
});

describe("createCarousel", () => {
  const make = (extra = {}) =>
    createCarousel({
      parent: "#root",
      id: "c",
      slides: [1, 2, 3, 4, 5].map((n) => ({ title: `S${n}` })),
      ...extra,
    });
  const slides = (r: HTMLElement) => [...r.querySelectorAll<HTMLElement>(".carousel-slide")];
  const states = (r: HTMLElement) => slides(r).map((s) => s.dataset.state);

  it("lays out coverflow states and dots", () => {
    const c = make();
    expect(states(c)).toEqual(["active", "next", "hidden-next", "hidden-prev", "prev"]);
    expect(c.querySelectorAll(".carousel-dot").length).toBe(5);
  });

  it("arrows, dots and flanking click navigate; startIndex and onChange work", () => {
    const cb = vi.fn();
    const c = make({ startIndex: 2, onChange: cb });
    expect(states(c)[2]).toBe("active");
    c.querySelector<HTMLElement>(".carousel-next")!.click();
    expect(states(c)[3]).toBe("active");
    expect(cb).toHaveBeenCalledWith(3);
    c.querySelectorAll<HTMLElement>(".carousel-dot")[0].click();
    expect(states(c)[0]).toBe("active");
    slides(c)[4].click(); // prev of 0
    expect(states(c)[4]).toBe("active");
  });

  it("keyboard works on the stage only", () => {
    const c = make();
    const stage = c.querySelector(".carousel-stage")!;
    key(stage, "End");
    expect(states(c)[4]).toBe("active");
    key(stage, "ArrowRight");
    expect(states(c)[0]).toBe("active");
    const inner = document.createElement("button");
    slides(c)[0].appendChild(inner);
    key(inner, "ArrowRight");
    expect(states(c)[0]).toBe("active");
  });

  it("only the active slide is focusable and tabindex is restored", () => {
    const btn = document.createElement("button");
    btn.setAttribute("tabindex", "0");
    const c = createCarousel({ parent: "#root", id: "c2", slides: [{ content: btn }, { content: { tag: "a", attrs: { href: "#" } } }] });
    const [s0, s1] = slides(c);
    expect(s1.querySelector("a")!.getAttribute("tabindex")).toBe("-1");
    expect(s0.querySelector("button")!.getAttribute("tabindex")).toBe("0");
    c.querySelector<HTMLElement>(".carousel-next")!.click();
    expect(btn.getAttribute("tabindex")).toBe("-1");
    expect(s1.querySelector("a")!.hasAttribute("tabindex")).toBe(false);
    c.querySelector<HTMLElement>(".carousel-prev")!.click();
    expect(btn.getAttribute("tabindex")).toBe("0");
  });

  it("applies size variables and custom labels", () => {
    const c = make({ slideWidth: "300px", height: "400px", labels: { prev: "Előző", dot: (n: number) => `Dia ${n}` } });
    expect(c.style.getPropertyValue("--carousel-slide-w")).toBe("300px");
    expect(c.style.getPropertyValue("--carousel-height")).toBe("400px");
    expect(c.querySelector(".carousel-prev")!.getAttribute("aria-label")).toBe("Előző");
    expect(c.querySelector(".carousel-dot")!.getAttribute("aria-label")).toBe("Dia 1");
  });
});

describe("createTimeline", () => {
  const items = [
    { period: "2020", title: "Dev", subtitle: "Acme", description: "Did things", badge: "now" },
    { period: "2018", title: "Junior" },
  ];

  it("renders entries, badge and description", () => {
    const t = createTimeline({ parent: "#root", id: "tl", items });
    expect(t.querySelectorAll(".timeline-item").length).toBe(2);
    expect(t.querySelector(".timeline-badge")!.textContent).toBe("now");
    expect(t.querySelectorAll(".timeline-desc").length).toBe(1);
    expect(t.getAttribute("role")).toBe("list");
  });

  it("compact adds is-compact", () => {
    expect(createTimeline({ parent: "#root", id: "tl", items, compact: true }).classList.contains("is-compact")).toBe(true);
  });
});

describe("createImage", () => {
  const probes: FakeImage[] = [];
  class FakeImage {
    onload: null | (() => void) = null;
    onerror: null | (() => void) = null;
    src = "";
    constructor() {
      probes.push(this);
    }
  }
  const last = () => probes[probes.length - 1];

  beforeEach(() => {
    probes.length = 0;
    vi.stubGlobal("Image", FakeImage);
  });
  afterEach(() => vi.unstubAllGlobals());

  const make = (extra = {}) => createImage({ parent: "#root", id: "i", src: "/a.png", alt: "A", ...extra });

  it("shows the default spinner while loading, then the image", async () => {
    const onLoad = vi.fn();
    const f = make({ onLoad });
    expect(f.dataset.state).toBe("loading");
    expect(f.querySelector(".spinner")).not.toBeNull();
    last().onload!();
    await flush();
    expect(f.dataset.state).toBe("loaded");
    expect(f.querySelector("img")!.getAttribute("src")).toBe("/a.png");
    expect(f.querySelector(".spinner")).toBeNull();
    expect(onLoad).toHaveBeenCalledOnce();
  });

  it("injects a custom spinner (element, factory, false)", () => {
    const mine = document.createElement("i");
    mine.className = "mine";
    expect(make({ id: "i1", spinner: mine }).querySelector(".mine")).toBe(mine);
    expect(make({ id: "i2", spinner: () => ({ tag: "b", text: "…" }) }).querySelector("b")!.textContent).toBe("…");
    expect(make({ id: "i3", spinner: false }).querySelector(".image-layer")!.childNodes.length).toBe(0);
  });

  it("error state with default fallback, retry recovers", async () => {
    const onError = vi.fn();
    const f = make({ onError });
    last().onerror!();
    await flush();
    expect(f.dataset.state).toBe("error");
    expect(f.querySelector("img")!.hasAttribute("src")).toBe(false);
    expect(onError).toHaveBeenCalledOnce();
    f.querySelector<HTMLElement>(".image-retry")!.click();
    expect(f.dataset.state).toBe("loading");
    last().onload!();
    await flush();
    expect(f.dataset.state).toBe("loaded");
  });

  it("custom fallback and automatic retries", async () => {
    const f = make({ fallback: { tag: "em", text: "nope" }, retries: 1 });
    last().onerror!();
    await flush();
    expect(probes.length).toBe(2);
    expect(f.dataset.state).toBe("loading");
    last().onerror!();
    await flush();
    expect(f.querySelector("em")!.textContent).toBe("nope");
  });

  it("times out", async () => {
    vi.useFakeTimers();
    const f = make({ timeout: 50 });
    vi.advanceTimersByTime(60);
    vi.useRealTimers();
    await flush();
    expect(f.dataset.state).toBe("error");
  });

  it("fetch strategy: blob URL on success, errors on HTTP failure / non-image", async () => {
    URL.createObjectURL = vi.fn(() => "blob:fake");
    URL.revokeObjectURL = vi.fn();
    vi.stubGlobal("fetch", vi.fn(async () => ({ ok: true, status: 200, blob: async () => ({ type: "image/png" }) })));
    const f = make({ strategy: "fetch" });
    await flush();
    expect(f.dataset.state).toBe("loaded");
    expect(f.querySelector("img")!.getAttribute("src")).toBe("blob:fake");

    vi.stubGlobal("fetch", vi.fn(async () => ({ ok: false, status: 404, blob: async () => ({ type: "" }) })));
    const onError = vi.fn();
    const g = make({ id: "i2", strategy: "fetch", onError });
    await flush();
    expect(g.dataset.state).toBe("error");
    expect(onError.mock.calls[0][0].message).toContain("404");

    vi.stubGlobal("fetch", vi.fn(async () => ({ ok: true, status: 200, blob: async () => ({ type: "text/html" }) })));
    const h = make({ id: "i3", strategy: "fetch" });
    await flush();
    expect(h.dataset.state).toBe("error");
  });
});

describe("createDrawer több push drawerrel", () => {
  it("az egyik bezárásakor a tartalom eltolása megmarad, amíg másik nyitva van", async () => {
    const { createDrawer, openDrawer, closeDrawer } = await import("../src/index");
    createDrawer({ id: "dA", mode: "push", children: [] });
    createDrawer({ id: "dB", mode: "push", children: [] });
    openDrawer("dA");
    openDrawer("dB");
    closeDrawer("dA");
    expect(document.body.classList.contains("drawer-push-open")).toBe(true);
    closeDrawer("dB");
    expect(document.body.classList.contains("drawer-push-open")).toBe(false);
  });

  it("overlay drawer bezárása nem szünteti meg a push eltolást", async () => {
    const { createDrawer, openDrawer, closeDrawer } = await import("../src/index");
    createDrawer({ id: "dP", mode: "push", children: [] });
    createDrawer({ id: "dO", mode: "overlay", children: [] });
    openDrawer("dP");
    openDrawer("dO");
    closeDrawer("dO");
    expect(document.body.classList.contains("drawer-push-open")).toBe(true);
  });
});
