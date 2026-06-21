import { createDOMElem } from "domelemjs";
import type { CreateDOMElemOptions } from "domelemjs";
import type { CardParams } from "../types";

export function createCard(config: CardParams): HTMLElement {
  const children: (CreateDOMElemOptions | HTMLElement)[] = [];

  if (config.title) {
    children.push({
      tag: "div",
      attrs: { class: "card-header" },
      children: [{ tag: "h3", text: config.title }],
    });
  }

  if (config.body) {
    const bodyItems = Array.isArray(config.body) ? config.body : [config.body];
    children.push({
      tag: "div",
      attrs: { class: "card-body" },
      children: bodyItems,
    });
  }

  if (config.footer) {
    const footerItems = Array.isArray(config.footer) ? config.footer : [config.footer];
    children.push({
      tag: "div",
      attrs: { class: "card-footer" },
      children: footerItems,
    });
  }

  const rootAttrs: Record<string, string> = { class: `card${config.class ? ` ${config.class}` : ""}` };
  if (config.id) rootAttrs.id = config.id;

  return createDOMElem({
    tag: "div",
    parent: config.parent,
    attrs: rootAttrs,
    children,
  });
}
