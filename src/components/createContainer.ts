import { createDOMElem } from "domelemjs";
import type { ContainerParams } from "../types";

export function createContainer(params: ContainerParams): HTMLElement {
  const rootAttrs: Record<string, string> = { class: `container${params.class ? ` ${params.class}` : ""}` };
  if (params.id) rootAttrs.id = params.id;

  return createDOMElem({ tag: "div", parent: params.parent, attrs: rootAttrs, children: params.children });
}
