import { createDOMElem } from "domelemjs";
import type { CreateDOMElemOptions } from "domelemjs";

export type { CreateDOMElemOptions };

export const section = (cls: string, children: CreateDOMElemOptions[]) =>
  ({ tag: "section", attrs: { class: cls }, children } as CreateDOMElemOptions);

export const div = (cls: string, children?: CreateDOMElemOptions[]) =>
  ({ tag: "div", attrs: { class: cls }, ...(children ? { children } : {}) } as CreateDOMElemOptions);

export const heading = (level: 1 | 2 | 3 | 4, text: string, cls = "") =>
  ({ tag: `h${level}`, text, ...(cls ? { attrs: { class: cls } } : {}) } as CreateDOMElemOptions);

export const para = (text: string, cls = "") =>
  ({ tag: "p", text, ...(cls ? { attrs: { class: cls } } : {}) } as CreateDOMElemOptions);

export const button = (text: string, cls = "demo-btn", onClick?: () => void) =>
  ({
    tag: "button", text, attrs: { class: cls },
    ...(onClick ? { handleEvent: { event: "click", cb: onClick } } : {})
  } as CreateDOMElemOptions);

export const chip = (text: string) =>
  ({ tag: "span", text, attrs: { class: "demo-chip" } } as CreateDOMElemOptions);

// Kepek: assets/demos/ az osszes demoban (a dist-page gyokerebol relativ).
export const ASSET = "assets/demos/";

export const img = (file: string, alt = "", cls = "") =>
  ({ tag: "img", attrs: { src: `${ASSET}${file}`, alt, loading: "lazy", ...(cls ? { class: cls } : {}) } } as CreateDOMElemOptions);

export const avatarImg = (file: string, alt = "", size = 40, cls = "demo-avatar-img") =>
  ({
    tag: "img",
    attrs: { src: `${ASSET}${file}`, alt, loading: "lazy", class: cls },
    style: { width: `${size}px`, height: `${size}px`, borderRadius: "50%", objectFit: "cover", flexShrink: "0" }
  } as CreateDOMElemOptions);

export const card = (cls: string, children: CreateDOMElemOptions[]) =>
  ({ tag: "div", attrs: { class: `demo-card ${cls}`.trim() }, children } as CreateDOMElemOptions);

export const avatar = (initials: string, size = 40, bg = "var(--d-accent)") =>
  ({
    tag: "div", text: initials,
    attrs: {
      class: "demo-avatar",
      style: { width: `${size}px`, height: `${size}px`, borderRadius: "50%", background: bg, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: `${Math.round(size * 0.38)}px`, fontWeight: "600", flexShrink: "0" }
    }
  } as CreateDOMElemOptions);

export const stars = (rating: number, max = 5, cls = "demo-stars") => {
  const children: CreateDOMElemOptions[] = [];
  for (let i = 1; i <= max; i++) {
    children.push({ tag: "span", text: i <= rating ? "\u2605" : "\u2606", attrs: { class: i <= rating ? "demo-star demo-star--filled" : "demo-star" } });
  }
  return ({ tag: "div", attrs: { class: cls }, children } as CreateDOMElemOptions);
};

export const stepper = (initial = 1) => {
  let value = initial;
  const valueSpan = { tag: "span" as const, text: String(value), attrs: { class: "demo3-stepper-value" } };
  const update = () => { valueSpan.text = String(value); };
  return ({
    tag: "div",
    attrs: { class: "demo3-stepper" },
    children: [
      { tag: "div", text: "\u2212", attrs: { class: "demo3-stepper-btn" }, handleEvent: { event: "click", cb: () => { if (value > 1) { value--; update(); } } } },
      valueSpan,
      { tag: "div", text: "+", attrs: { class: "demo3-stepper-btn" }, handleEvent: { event: "click", cb: () => { value++; update(); } } },
    ]
  } as CreateDOMElemOptions);
};
