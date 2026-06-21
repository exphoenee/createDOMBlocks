import { createDOMElem } from "domelemjs";
import type { CreateDOMElemOptions } from "domelemjs";
import type { ImageParams } from "../types";

export function createImage(config: ImageParams): HTMLElement {
  const children: CreateDOMElemOptions[] = [];

  const imgAttrs: Record<string, string | number> = {
    src: config.src,
    alt: config.alt || "",
    class: "image-element",
  };
  if (config.lazy) imgAttrs.loading = "lazy";
  if (config.width) imgAttrs.width = config.width;
  if (config.height) imgAttrs.height = config.height;

  children.push({ tag: "img", attrs: imgAttrs });

  if (config.caption) {
    children.push({ tag: "figcaption", text: config.caption, attrs: { class: "image-caption" } });
  }

  const rootAttrs: Record<string, string> = { class: `image-container${config.class ? ` ${config.class}` : ""}` };
  if (config.id) rootAttrs.id = config.id;

  return createDOMElem({ tag: "figure", parent: config.parent, attrs: rootAttrs, children });
}
