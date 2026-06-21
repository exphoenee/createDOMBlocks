import { createDOMElem } from "domelemjs";
import type { ContainerParams } from "../types";

export function createContainer(config: ContainerParams): HTMLElement {
  const rootAttrs: Record<string, string> = { class: `container${config.class ? ` ${config.class}` : ""}` };
  if (config.id) rootAttrs.id = config.id;

  return createDOMElem({ tag: "div", parent: config.parent, attrs: rootAttrs, children: config.children });
}
