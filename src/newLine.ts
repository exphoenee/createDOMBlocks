import { createDOMElem } from "domelemjs";
import type { CreateDOMElemOptions } from "domelemjs";

export function newLine(parent: HTMLElement | string): HTMLElement {
  return createDOMElem({ parent, tag: "br" });
}
