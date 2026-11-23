import { createDOMElem } from "../dom";

export function newLine(parent: HTMLElement | string): HTMLElement {
  return createDOMElem({ parent, tag: "br" });
}
