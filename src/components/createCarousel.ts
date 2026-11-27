import { createDOMElem } from "../dom";
import { builtin, t, watchLocale } from "../i18n";
import type { TextValue } from "../i18n";
import type { DOMOptions } from "../dom";
import type { CarouselParams, CarouselSlide, CarouselElement } from "../types";

function buildSlide(slide: CarouselSlide): DOMOptions {
  const children: DOMOptions[] = [];

  if (slide.icon) {
    children.push({ tag: "div", text: slide.icon, attrs: { class: "carousel-slide-icon" } });
  }
  if (slide.title) {
    children.push({ tag: "span", text: slide.title, attrs: { class: "carousel-slide-title" } });
  }
  if (slide.description) {
    children.push({ tag: "span", text: slide.description, attrs: { class: "carousel-slide-desc" } });
  }
  if (slide.content) {
    const contentItems = Array.isArray(slide.content) ? slide.content : [slide.content];
    children.push({ tag: "div", attrs: { class: "carousel-slide-content" }, children: contentItems });
  }
  if (slide.cta) {
    const ctaAttrs: Record<string, string> = { class: "carousel-slide-cta" };
    if (slide.cta.href) ctaAttrs.href = slide.cta.href;

    children.push({
      tag: slide.cta.href ? "a" : "button",
      text: slide.cta.text,
      attrs: ctaAttrs,
      ...(slide.cta.click ? { handleEvent: { event: "click", cb: slide.cta.click } } : {}),
    });
  }

  const slideAttrs: Record<string, string> = {
    ...(slide.attrs ?? {}),
    class: `carousel-slide${slide.class ? ` ${slide.class}` : ""}`,
    role: "group",
    "aria-roledescription": "slide",
  };
  if (slide.id) {
    slideAttrs.id = slide.id;
    slideAttrs["data-slide-id"] = slide.id;
  }

  return {
    tag: "div",
    attrs: slideAttrs,
    children,
  };
}

/**
 * Egyszerű carousel 3D perspective effektekkel, nyíl navigációval és dot indikátorokkal.
 *
 * @category interactive
 * @menu Carousel
 * @order 3
 * @summary Egyszerű carousel 3D perspective effektekkel, nyíl navigációval és dot indikátorokkal.
 */
export function createCarousel(params: CarouselParams): CarouselElement {
  const labels = params.labels ?? {};
  const rootAttrs: Record<string, TextValue> = {
    class: `carousel-wrap${params.class ? ` ${params.class}` : ""}`,
  };
  if (params.id) rootAttrs.id = params.id;

  const showArrows = params.showArrows !== false;
  const showDots = params.showDots !== false;

  const navChildren: DOMOptions[] = [];
  if (showArrows) {
    navChildren.push({
      tag: "button",
      text: "\u25C0",
      attrs: { type: "button", class: "carousel-arrow carousel-prev", "aria-label": labels.prev ?? builtin("carousel.prev", "Previous") },
    });
  }
  if (showDots) {
    navChildren.push({ tag: "div", attrs: { class: "carousel-dots", role: "group" } });
  }
  if (showArrows) {
    navChildren.push({
      tag: "button",
      text: "\u25B6",
      attrs: { type: "button", class: "carousel-arrow carousel-next", "aria-label": labels.next ?? builtin("carousel.next", "Next") },
    });
  }

  const carousel = createDOMElem({
    tag: "div",
    parent: params.parent,
    attrs: rootAttrs,
    children: [
      {
        tag: "div",
        attrs: {
          class: "carousel-stage",
          role: "region",
          "aria-roledescription": "carousel",
          "aria-label": labels.stage ?? builtin("carousel.stage", "Carousel"),
          tabindex: "0",
        },
        children: (params.slides ?? []).map((s) => buildSlide(s)),
      },
      { tag: "div", attrs: { class: "carousel-nav", role: "group", "aria-label": labels.nav ?? builtin("carousel.nav", "Carousel navigation") }, children: navChildren },
    ],
  });

  if (params.slideWidth) carousel.style.setProperty("--carousel-slide-w", params.slideWidth);
  if (params.height) carousel.style.setProperty("--carousel-height", params.height);

  return Object.assign(carousel, initCarouselLogic(carousel, params));
}

const FOCUSABLE = "a, button, input, select, textarea, [tabindex]";

/** Csak az aktív slide vesz részt a tab sorrendben; az eredeti tabindex a data-tabindex-ben marad. */
function setSlideFocus(slide: HTMLElement, active: boolean): void {
  slide.setAttribute("aria-hidden", active ? "false" : "true");
  slide.querySelectorAll<HTMLElement>(FOCUSABLE).forEach((el) => {
    if (active) {
      const orig = el.dataset.tabindex;
      if (orig === undefined) return;
      if (orig === "") el.removeAttribute("tabindex");
      else el.setAttribute("tabindex", orig);
    } else {
      if (el.dataset.tabindex === undefined) el.dataset.tabindex = el.getAttribute("tabindex") ?? "";
      el.setAttribute("tabindex", "-1");
    }
  });
}

function mod(n: number, m: number): number {
  return ((n % m) + m) % m;
}

/**
 * A carousel működése. A diák listája dinamikus: a színpad (`.carousel-stage`) minden elem-gyereke egy dia
 * (a YAML-ban egy `each` is rajzolhatja őket), a változást MutationObserver követi, a `setSlides` kulcs
 * (`id`) szerint cseréli a diákat. Változáskor az aktív dia megmarad, ha még létezik.
 */
function initCarouselLogic(root: HTMLElement, params: CarouselParams): Pick<CarouselElement, "goTo" | "getIndex" | "setSlides"> {
  const stage = root.querySelector<HTMLElement>(".carousel-stage")!;
  const dotsWrap = root.querySelector<HTMLElement>(".carousel-dots");
  const prevBtn = root.querySelector<HTMLElement>(".carousel-prev");
  const nextBtn = root.querySelector<HTMLElement>(".carousel-next");
  let slides: HTMLElement[] = [];
  let current = 0;
  let dots: HTMLElement[] = [];

  const dotLabel = (n: number): string => (params.labels?.dot ? params.labels.dot(n) : t("cdb.carousel.dot", { n }, "Slide {n}"));
  // nyelvváltáskor a pöttyök feliratai is frissülnek
  watchLocale(root, () => dots.forEach((d, i) => d.setAttribute("aria-label", dotLabel(i + 1))));

  /** A színpad elem-gyerekei a diák; a kívülről (pl. YAML each) érkezők is megkapják a dia osztályát és szerepét. */
  function collect(): void {
    slides = Array.from(stage.children).filter((el): el is HTMLElement => el instanceof HTMLElement);
    for (const slide of slides) {
      slide.classList.add("carousel-slide");
      if (!slide.hasAttribute("role")) slide.setAttribute("role", "group");
      slide.setAttribute("aria-roledescription", "slide");
    }
    if (!dotsWrap) return;
    dots = slides.map((_, i) => {
      const d = document.createElement("button");
      d.type = "button";
      d.className = "carousel-dot";
      d.setAttribute("aria-label", dotLabel(i + 1));
      d.addEventListener("click", () => goTo(i));
      return d;
    });
    dotsWrap.replaceChildren(...dots);
  }

  function goTo(idx: number): void {
    const N = slides.length;
    if (N === 0) return;
    const previous = current;
    current = mod(idx, N);
    const prev = mod(current - 1, N);
    const next = mod(current + 1, N);
    slides.forEach((slide, i) => {
      let state: string;
      if (i === current) state = "active";
      else if (i === prev) state = "prev";
      else if (i === next) state = "next";
      else state = mod(i - current, N) <= Math.floor(N / 2) ? "hidden-next" : "hidden-prev";
      slide.dataset.state = state;
      setSlideFocus(slide, state === "active");
    });
    dots.forEach((d, i) => {
      d.classList.toggle("active", i === current);
      d.setAttribute("aria-current", String(i === current));
    });
    if (previous !== current) params.onChange?.(current);
  }

  /** A dia-lista újraolvasása; az aktív dia megmarad, ha még létezik, különben a helyén lévő lesz aktív. */
  function refresh(): void {
    const active = slides[current];
    collect();
    const kept = active ? slides.indexOf(active) : -1;
    const idx = kept >= 0 ? kept : Math.min(current, slides.length - 1);
    const before = current;
    current = Math.max(0, idx);
    goTo(current);
    // az aktív dia ugyanaz maradt, csak a sorszáma változott: a figyelő is tudjon róla
    if (before !== current) params.onChange?.(current);
  }

  prevBtn?.addEventListener("click", () => goTo(current - 1));
  nextBtn?.addEventListener("click", () => goTo(current + 1));

  // A szomszédos slide-ra kattintva arra lép; az aktív slide saját vezérlői működnek.
  stage.addEventListener("click", (e: Event) => {
    const slide = (e.target as HTMLElement).closest<HTMLElement>(".carousel-slide");
    if (!slide || slide.parentElement !== stage) return;
    const state = slide.dataset.state;
    if (state === "prev" || state === "next") {
      e.preventDefault();
      e.stopPropagation();
      goTo(current + (state === "next" ? 1 : -1));
    }
  });

  // Húzás / swipe Pointer Events-szel; a függőleges görgetés a böngészőé (touch-action: pan-y).
  let slideW = 210;
  const measure = (): void => {
    slideW = slides[0]?.offsetWidth || slideW;
  };
  const clamp = (v: number, min: number, max: number): number => Math.min(max, Math.max(min, v));
  const drag = { active: false, startX: 0, startY: 0, moved: false, suppress: false };

  stage.addEventListener("pointerdown", (e: PointerEvent) => {
    if (drag.active) return;
    if (e.pointerType === "mouse" && e.button !== 0) return;
    measure();
    drag.active = true;
    drag.startX = e.clientX;
    drag.startY = e.clientY;
    drag.moved = false;
    drag.suppress = false;
    // Itt még nincs pointer capture: egy sima koppintás clickjét a stage-hez irányítaná.
  });

  stage.addEventListener("pointermove", (e: PointerEvent) => {
    if (!drag.active) return;
    const dx = e.clientX - drag.startX;
    const dy = e.clientY - drag.startY;
    if (!drag.moved) {
      if (Math.abs(dx) < 6 && Math.abs(dy) < 6) return;
      if (Math.abs(dy) > Math.abs(dx)) {
        drag.active = false;
        return;
      }
      drag.moved = true;
      stage.classList.add("is-dragging");
      try {
        stage.setPointerCapture(e.pointerId);
      } catch {
        /* szintetikus pointer */
      }
    }
    if (Math.abs(dx) > 8) drag.suppress = true;
    stage.style.setProperty("--carousel-drag", `${clamp(dx, -slideW * 0.5, slideW * 0.5)}px`);
  });

  stage.addEventListener("pointerup", (e: PointerEvent) => {
    if (!drag.active) return;
    const dx = e.clientX - drag.startX;
    drag.active = false;
    stage.classList.remove("is-dragging");
    if (!drag.moved) return;
    stage.style.setProperty("--carousel-drag", "0px");
    if (Math.abs(dx) >= Math.max(40, slideW * 0.18)) goTo(dx < 0 ? current + 1 : current - 1);
  });

  stage.addEventListener("pointercancel", () => {
    if (!drag.active) return;
    drag.active = false;
    stage.classList.remove("is-dragging");
    stage.style.setProperty("--carousel-drag", "0px");
  });

  // A húzást záró clicket (link, gomb, szomszédos slide) elnyeli.
  stage.addEventListener(
    "click",
    (e: Event) => {
      if (drag.suppress) {
        e.preventDefault();
        e.stopPropagation();
        drag.suppress = false;
      }
    },
    true
  );
  stage.addEventListener("dragstart", (e: Event) => e.preventDefault());

  // Billentyűzet: csak ha maga a stage vagy egy nyíl fókuszált (a slide-ban lévő vezérlők nyilait nem veszi el).
  const onKey = (e: KeyboardEvent): void => {
    if (e.target !== stage && e.target !== prevBtn && e.target !== nextBtn) return;
    if (e.key === "ArrowRight") goTo(current + 1);
    else if (e.key === "ArrowLeft") goTo(current - 1);
    else if (e.key === "Home") goTo(0);
    else if (e.key === "End") goTo(slides.length - 1);
    else return;
    e.preventDefault();
  };
  [stage, prevBtn, nextBtn].forEach((el) => el?.addEventListener("keydown", onKey as EventListener));

  // A diák kívülről is változhatnak (YAML each a színpadban): a változás után újraolvassuk a listát.
  if (typeof MutationObserver !== "undefined") {
    new MutationObserver((records) => {
      const elementChanged = records.some((r) => [...Array.from(r.addedNodes), ...Array.from(r.removedNodes)].some((n) => n.nodeType === 1));
      if (elementChanged) refresh();
    }).observe(stage, { childList: true });
  }

  collect();
  current = Math.min(Math.max(0, params.startIndex ?? 0), Math.max(0, slides.length - 1));
  // a kezdő állapot beállítása (a kezdő index nem "változás", ezért az onChange nem hívódik)
  const initial = current;
  current = -1;
  if (slides.length) {
    const silent = params.onChange;
    params = { ...params, onChange: undefined };
    goTo(initial);
    params = { ...params, onChange: silent };
  } else current = 0;

  return {
    goTo,
    getIndex: () => current,
    setSlides(next: CarouselSlide[]): void {
      const byId = new Map(slides.filter((el) => el.dataset.slideId).map((el) => [el.dataset.slideId as string, el]));
      const fresh = next.map((slide) => (slide.id && byId.get(slide.id)) || createDOMElem(buildSlide(slide)));
      stage.replaceChildren(...fresh); // egyetlen csere: a megmaradó diák (és a betöltött képeik) ugyanazok
      refresh();
    },
  };
}
