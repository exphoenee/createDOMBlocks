import { createDOMElem } from "domelemjs";
import type { BadgeParams } from "../types";

export function createBadge(config: BadgeParams): HTMLElement {
  const rootAttrs: Record<string, string> = { class: `badge badge-${config.type || "neutral"}${config.class ? ` ${config.class}` : ""}` };
  if (config.id) rootAttrs.id = config.id;

  return createDOMElem({ tag: "span", parent: config.parent, attrs: rootAttrs, text: config.text });
}
