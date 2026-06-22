import { createDOMElem } from "domelemjs";
import type { CreateDOMElemOptions } from "domelemjs";
import type { CarouselParams, CarouselSlide } from "../types";

function buildSlide(slide: CarouselSlide): CreateDOMElemOptions {
  const children: CreateDOMElemOptions[] = [];

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
    role: "listitem",
  };
  if (slide.id) slideAttrs.id = slide.id;

  return {
    tag: "div",
    attrs: slideAttrs,
    children,
  };
}

export function createCarousel(params: CarouselParams): HTMLElement {
  const rootAttrs: Record<string, string> = {
    class: `carousel-wrap${params.class ? ` ${params.class}` : ""}`,
  };
  if (params.id) rootAttrs.id = params.id;

  const stageId = params.id ? `${params.id}-stage` : "carousel-stage";
  const dotsId = params.id ? `${params.id}-dots` : "carousel-dots";
  const showArrows = params.showArrows !== false;
  const showDots = params.showDots !== false;

  const slideElements = params.slides.map((s) => buildSlide(s));

  const navChildren: CreateDOMElemOptions[] = [];

  if (showArrows) {
    navChildren.push({
      tag: "button",
      text: "\u25C0",
      attrs: { class: "carousel-arrow carousel-prev", "aria-label": "Previous" },
    });
  }

  if (showDots) {
    navChildren.push({ tag: "div", attrs: { class: "carousel-dots", id: dotsId, role: "tablist" } });
  }

  if (showArrows) {
    navChildren.push({
      tag: "button",
      text: "\u25B6",
      attrs: { class: "carousel-arrow carousel-next", "aria-label": "Next" },
    });
  }

  const carousel = createDOMElem({
    tag: "div",
    parent: params.parent,
    attrs: rootAttrs,
    children: [
      {
        tag: "div",
        attrs: { class: "carousel-stage", id: stageId, role: "list" },
        children: slideElements,
      },
      { tag: "div", attrs: { class: "carousel-nav", role: "group", "aria-label": "Carousel navigation" }, children: navChildren },
    ],
  });

  initCarouselLogic(carousel, stageId, dotsId, showArrows);

  return carousel;
}

function initCarouselLogic(root: HTMLElement, stageId: string, dotsId: string, showArrows: boolean): void {
  const stage = root.querySelector(`#${stageId}`) as HTMLElement;
  if (!stage) return;

  const slides = Array.from(stage.querySelectorAll(".carousel-slide")) as HTMLElement[];
  const dotsWrap = root.querySelector(`#${dotsId}`) as HTMLElement | null;
  const N = slides.length;
  if (N === 0) return;
  let current = 0;

  const dots: HTMLElement[] = [];
  if (dotsWrap) {
    for (let i = 0; i < N; i++) {
      const d = document.createElement("button");
      d.className = "carousel-dot";
      d.setAttribute("aria-label", `Slide ${i + 1}`);
      d.addEventListener("click", () => goTo(i));
      dotsWrap.appendChild(d);
      dots.push(d);
    }
  }

  function mod(n: number, m: number): number {
    return ((n % m) + m) % m;
  }

  function goTo(idx: number): void {
    current = mod(idx, N);
    const prev = mod(current - 1, N);
    const next = mod(current + 1, N);
    slides.forEach((slide, i) => {
      const stepsAhead = mod(i - current, N);
      if (i === current) slide.dataset.state = "active";
      else if (i === prev) slide.dataset.state = "prev";
      else if (i === next) slide.dataset.state = "next";
      else slide.dataset.state = stepsAhead <= Math.floor(N / 2) ? "hidden-next" : "hidden-prev";
    });
    dots.forEach((d, i) => {
      d.classList.toggle("active", i === current);
    });
  }

  if (showArrows) {
    const nextBtn = root.querySelector(".carousel-next");
    const prevBtn = root.querySelector(".carousel-prev");
    nextBtn?.addEventListener("click", () => goTo(current + 1));
    prevBtn?.addEventListener("click", () => goTo(current - 1));
  }

  stage.addEventListener("click", (e: Event) => {
    const target = (e.target as HTMLElement).closest(".carousel-slide") as HTMLElement | null;
    if (!target) return;
    const state = target.dataset.state;
    if (state === "prev") {
      e.preventDefault();
      goTo(current - 1);
    } else if (state === "next") {
      e.preventDefault();
      goTo(current + 1);
    }
  });

  let startX = 0;
  let startY = 0;
  let dragging = false;

  stage.addEventListener("touchstart", (e: TouchEvent) => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
  }, { passive: true });

  stage.addEventListener("touchend", (e: TouchEvent) => {
    const dx = e.changedTouches[0].clientX - startX;
    const dy = e.changedTouches[0].clientY - startY;
    if (Math.abs(dx) < 30 || Math.abs(dy) > Math.abs(dx) * 0.9) return;
    if (dx < 0) goTo(current + 1);
    else goTo(current - 1);
  }, { passive: true });

  stage.addEventListener("mousedown", (e: MouseEvent) => {
    startX = e.clientX;
    dragging = true;
  });
  stage.addEventListener("mouseup", (e: MouseEvent) => {
    if (!dragging) return;
    dragging = false;
    const dx = e.clientX - startX;
    if (Math.abs(dx) < 40) return;
    if (dx < 0) goTo(current + 1);
    else goTo(current - 1);
  });
  stage.addEventListener("mouseleave", () => {
    dragging = false;
  });

  goTo(0);
}
