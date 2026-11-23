import { createDOMElem } from "../dom";
import { resolveText } from "../i18n";
import type { DOMOptions } from "../dom";
import type { BlockquoteParams } from "../types";

export function createBlockquote(params: BlockquoteParams): HTMLElement {
  const children: DOMOptions[] = [];

  children.push({ tag: "p", text: params.text, attrs: { class: "blockquote-text" } });

  if (params.author) {
    children.push({
      tag: "footer",
      attrs: { class: "blockquote-author" },
      children: [{ tag: "cite", text: typeof params.author === "string" ? `\u2014 ${params.author}` : () => `\u2014 ${resolveText(params.author)}` }],
    });
  }

  const rootAttrs: Record<string, string> = { class: `blockquote${params.class ? ` ${params.class}` : ""}` };
  if (params.id) rootAttrs.id = params.id;

  return createDOMElem({ tag: "blockquote", parent: params.parent, attrs: rootAttrs, children });
}
