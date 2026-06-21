import { createDOMElem } from "domelemjs";
import type { DividerParams } from "../types";

export function createDivider(config: DividerParams): HTMLElement {
  const rootAttrs: Record<string, string> = { class: `divider${config.class ? ` ${config.class}` : ""}` };
  if (config.id) rootAttrs.id = config.id;

  return createDOMElem({ tag: "hr", parent: config.parent, attrs: rootAttrs });
}
