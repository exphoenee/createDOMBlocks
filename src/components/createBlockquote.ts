import { createDOMElem } from "domelemjs";
import type { CreateDOMElemOptions } from "domelemjs";
import type { BlockquoteParams } from "../types";

export function createBlockquote(config: BlockquoteParams): HTMLElement {
  const children: CreateDOMElemOptions[] = [];

  children.push({ tag: "p", text: config.text, attrs: { class: "blockquote-text" } });

  if (config.author) {
    children.push({
      tag: "footer",
      attrs: { class: "blockquote-author" },
      children: [{ tag: "cite", text: `\u2014 ${config.author}` }],
    });
  }

  const rootAttrs: Record<string, string> = { class: `blockquote${config.class ? ` ${config.class}` : ""}` };
  if (config.id) rootAttrs.id = config.id;

  return createDOMElem({ tag: "blockquote", parent: config.parent, attrs: rootAttrs, children });
}
