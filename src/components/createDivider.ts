import { createDOMElem } from "domelemjs";
import type { DividerParams } from "../types";

export function createDivider(params: DividerParams): HTMLElement {
  const rootAttrs: Record<string, string> = { class: `divider${params.class ? ` ${params.class}` : ""}` };
  if (params.id) rootAttrs.id = params.id;

  return createDOMElem({ tag: "hr", parent: params.parent, attrs: rootAttrs });
}
