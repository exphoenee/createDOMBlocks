import { createDOMElem } from "domelemjs";

export function newLine(parent: HTMLElement | string): HTMLElement {
  return createDOMElem({ parent, tag: "br" });
}
