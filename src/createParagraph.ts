import { createDOMElem } from "domelemjs";
import type { ParagraphParams } from "./types";

export function createParagraph(params: ParagraphParams): HTMLElement {
  const attrs: Record<string, string> = {};
  if (params.id) attrs.id = params.id;
  if (params.class) attrs.class = params.class;

  return createDOMElem({
    tag: "p",
    text: params.text,
    parent: params.parent,
    attrs,
  });
}
