import { createDOMElem } from "domelemjs";
import type { CreateDOMElemOptions } from "domelemjs";
import type { BlockquoteParams } from "../types";

export function createBlockquote(params: BlockquoteParams): HTMLElement {
  const children: CreateDOMElemOptions[] = [];

  children.push({ tag: "p", text: params.text, attrs: { class: "blockquote-text" } });

  if (params.author) {
    children.push({
      tag: "footer",
      attrs: { class: "blockquote-author" },
      children: [{ tag: "cite", text: `\u2014 ${params.author}` }],
    });
  }

  const rootAttrs: Record<string, string> = { class: `blockquote${params.class ? ` ${params.class}` : ""}` };
  if (params.id) rootAttrs.id = params.id;

  return createDOMElem({ tag: "blockquote", parent: params.parent, attrs: rootAttrs, children });
}
