import { createDOMElem } from "../dom";
import type { BadgeParams } from "../types";

/**
 * Állapot jelző pici szöveggel.
 *
 * @category feedback
 * @menu Badge
 * @order 2
 * @summary Állapot jelző pici szöveggel.
 */
export function createBadge(params: BadgeParams): HTMLElement {
  const rootAttrs: Record<string, string> = { class: `badge badge-${params.type || "neutral"}${params.class ? ` ${params.class}` : ""}` };
  if (params.id) rootAttrs.id = params.id;

  return createDOMElem({ tag: "span", parent: params.parent, attrs: rootAttrs, text: params.text });
}
