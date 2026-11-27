import { createDOMElem } from "../dom";
import type { DividerParams } from "../types";

/**
 * Vízszintes vonal elválasztáshoz.
 *
 * @category content
 * @menu Divider
 * @order 11
 * @summary Vízszintes vonal elválasztáshoz.
 */
export function createDivider(params: DividerParams): HTMLElement {
  const rootAttrs: Record<string, string> = { class: `divider${params.class ? ` ${params.class}` : ""}` };
  if (params.id) rootAttrs.id = params.id;

  return createDOMElem({ tag: "hr", parent: params.parent, attrs: rootAttrs });
}
