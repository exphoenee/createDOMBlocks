import { createDOMElem } from "../dom";
import { builtin, t, watchLocale } from "../i18n";
import type { TextValue } from "../i18n";
import type { DOMOptions } from "../dom";
import type { CarouselParams, CarouselSlide } from "../types";

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
    class: `carousel-slide${slide.class ? ` ${slide.class}` : ""}`,
    role: "group",
    "aria-roledescription": "slide",
  };
  if (slide.id) slideAttrs.id = slide.id;

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
export function createCarousel(params: CarouselParams): HTMLElement {
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
        children: params.slides.map((s) => buildSlide(s)),
      },
      { tag: "div", attrs: { class: "carousel-nav", role: "group", "aria-label": labels.nav ?? builtin("carousel.nav", "Carousel navigation") }, children: navChildren },
    ],
  });

  if (params.slideWidth) carousel.style.setProperty("--carousel-slide-w", params.slideWidth);
  if (params.height) carousel.style.setProperty("--carousel-height", params.height);

  initCarouselLogic(carousel, params);
  return carousel;
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

function initCarouselLogic(root: HTMLElement, params: CarouselParams): void {
  const stage = root.querySelector<HTMLElement>(".carousel-stage");
  if (!stage) return;

  const slides = Array.from(stage.querySelectorAll<HTMLElement>(":scope > .carousel-slide"));
  const dotsWrap = root.querySelector<HTMLElement>(".carousel-dots");
  const prevBtn = root.querySelector<HTMLElement>(".carousel-prev");
  const nextBtn = root.querySelector<HTMLElement>(".carousel-next");
  const N = slides.length;
  if (N === 0) return;
  let current = 0;

  const dots: HTMLElement[] = [];
  const dotLabel = (n: number): string => (params.labels?.dot ? params.labels.dot(n) : t("cdb.carousel.dot", { n }, "Slide {n}"));
  // nyelvváltáskor a pöttyök feliratai is frissülnek
  watchLocale(root, () => dots.forEach((d, i) => d.setAttribute("aria-label", dotLabel(i + 1))));
  if (dotsWrap) {
    for (let i = 0; i < N; i++) {
      const d = document.createElement("button");
      d.type = "button";
      d.className = "carousel-dot";
      d.setAttribute("aria-label", dotLabel(i + 1));
      d.addEventListener("click", () => goTo(i));
      dotsWrap.appendChild(d);
      dots.push(d);
    }
  }

  function goTo(idx: number): void {
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

  prevBtn?.addEventListener("click", () => goTo(current - 1));
  nextBtn?.addEventListener("click", () => goTo(current + 1));

  // A szomszédos slide-ra kattintva arra lép; az aktív slide saját vezérlői működnek.
  stage.addEventListener("click", (e: Event) => {
    const slide = (e.target as HTMLElement).closest<HTMLElement>(".carousel-slide");
    if (!slide) return;
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
    slideW = slides[0].offsetWidth || slideW;
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
    else if (e.key === "End") goTo(N - 1);
    else return;
    e.preventDefault();
  };
  [stage, prevBtn, nextBtn].forEach((el) => el?.addEventListener("keydown", onKey as EventListener));

  goTo(params.startIndex ?? 0);
}
