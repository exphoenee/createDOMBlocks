import { createLocalizedElem as createDOMElem } from "../../src/index";
import type { DOMOptions as CreateDOMElemOptions, TextValue } from "../../src/index";
import { tr, initI18n } from "../page-components/i18n";

// A demó oldalak a dokumentáció nyelvét követik (mentett választás / böngésző nyelve)
void initI18n();

/** Fix magyar szöveg → fordítható; a kész TextValue (tr() / függvény) változatlan marad */
const ref = (v: TextValue): TextValue => (typeof v === "string" ? tr(v) : v);

export type { CreateDOMElemOptions };

export const section = (cls: string, children: CreateDOMElemOptions[]) =>
  ({ tag: "section", attrs: { class: cls }, children } as CreateDOMElemOptions);

export const div = (cls: string, children?: CreateDOMElemOptions[]) =>
  ({ tag: "div", attrs: { class: cls }, ...(children ? { children } : {}) } as CreateDOMElemOptions);

export const heading = (level: 1 | 2 | 3 | 4, text: TextValue, cls = "") =>
  ({ tag: `h${level}`, text: ref(text), ...(cls ? { attrs: { class: cls } } : {}) } as CreateDOMElemOptions);

export const para = (text: TextValue, cls = "") =>
  ({ tag: "p", text: ref(text), ...(cls ? { attrs: { class: cls } } : {}) } as CreateDOMElemOptions);

export const button = (text: TextValue, cls = "demo-btn", onClick?: () => void) =>
  ({
    tag: "button", text: ref(text), attrs: { class: cls },
    ...(onClick ? { handleEvent: { event: "click", cb: onClick } } : {})
  } as CreateDOMElemOptions);

export const chip = (text: TextValue) =>
  ({ tag: "span", text: ref(text), attrs: { class: "demo-chip" } } as CreateDOMElemOptions);

// Kepek: assets/demos/ az osszes demoban (a dist-page gyokerebol relativ).
export const ASSET = "assets/demos/";

export const img = (file: string, alt = "", cls = "") =>
  ({ tag: "img", attrs: { src: `${ASSET}${file}`, alt: tr(alt), loading: "lazy", ...(cls ? { class: cls } : {}) } } as CreateDOMElemOptions);

export const avatarImg = (file: string, alt = "", size = 40, cls = "demo-avatar-img") =>
  ({
    tag: "img",
    attrs: { src: `${ASSET}${file}`, alt: tr(alt), loading: "lazy", class: cls },
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
