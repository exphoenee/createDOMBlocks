import { createDOMElem } from "domelemjs";
import type { BadgeParams } from "../types";

export function createBadge(params: BadgeParams): HTMLElement {
  const rootAttrs: Record<string, string> = { class: `badge badge-${params.type || "neutral"}${params.class ? ` ${params.class}` : ""}` };
  if (params.id) rootAttrs.id = params.id;

  return createDOMElem({ tag: "span", parent: params.parent, attrs: rootAttrs, text: params.text });
}
