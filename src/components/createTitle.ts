import { createDOMElem } from "../dom";
import type { TitleParams } from "../types";

const HEADINGS = ["h1", "h2", "h3", "h4", "h5", "h6"] as const;

/**
 * Címsor h1-h6 szintekkel.
 *
 * @category content
 * @menu Title
 * @order 4
 * @summary Címsor h1-h6 szintekkel.
 */
export function createTitle(params: TitleParams, level: number = 1): HTMLElement {
  const index = Math.max(1, Math.min(6, Math.abs(level))) - 1;
  const attrs: Record<string, string> = {};
  if (params.id) attrs.id = params.id;
  if (params.class) attrs.class = params.class;

  return createDOMElem({
    tag: HEADINGS[index],
    text: params.text,
    parent: params.parent,
    attrs,
  });
}
