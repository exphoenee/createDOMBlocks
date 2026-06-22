import { createDOMElem } from "domelemjs";
import type { CreateDOMElemOptions } from "domelemjs";
import type { ImageParams } from "../types";

export function createImage(params: ImageParams): HTMLElement {
  const children: CreateDOMElemOptions[] = [];

  const imgAttrs: Record<string, string | number> = {
    src: params.src,
    alt: params.alt || "",
    class: "image-element",
  };
  if (params.lazy) imgAttrs.loading = "lazy";
  if (params.width) imgAttrs.width = params.width;
  if (params.height) imgAttrs.height = params.height;

  children.push({ tag: "img", attrs: imgAttrs });

  if (params.caption) {
    children.push({ tag: "figcaption", text: params.caption, attrs: { class: "image-caption" } });
  }

  const rootAttrs: Record<string, string> = { class: `image-container${params.class ? ` ${params.class}` : ""}` };
  if (params.id) rootAttrs.id = params.id;

  return createDOMElem({ tag: "figure", parent: params.parent, attrs: rootAttrs, children });
}
