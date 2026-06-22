import { createDOMElem } from "domelemjs";
import type { CreateDOMElemOptions } from "domelemjs";
import type { CardParams } from "../types";

export function createCard(params: CardParams): HTMLElement {
  const children: (CreateDOMElemOptions | HTMLElement)[] = [];

  if (params.title) {
    children.push({
      tag: "div",
      attrs: { class: "card-header" },
      children: [{ tag: "h3", text: params.title }],
    });
  }

  if (params.body) {
    const bodyItems = Array.isArray(params.body) ? params.body : [params.body];
    children.push({
      tag: "div",
      attrs: { class: "card-body" },
      children: bodyItems,
    });
  }

  if (params.footer) {
    const footerItems = Array.isArray(params.footer) ? params.footer : [params.footer];
    children.push({
      tag: "div",
      attrs: { class: "card-footer" },
      children: footerItems,
    });
  }

  const rootAttrs: Record<string, string> = { class: `card${params.class ? ` ${params.class}` : ""}` };
  if (params.id) rootAttrs.id = params.id;

  return createDOMElem({
    tag: "div",
    parent: params.parent,
    attrs: rootAttrs,
    children,
  });
}
