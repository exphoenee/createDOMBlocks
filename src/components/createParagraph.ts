import { createDOMElem } from "../dom";
import type { ParagraphParams } from "../types";

/**
 * Sima bekezdés szöveg.
 *
 * @category content
 * @menu Paragraph
 * @order 3
 * @summary Sima bekezdés szöveg.
 */
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
