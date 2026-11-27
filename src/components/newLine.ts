import { createDOMElem } from "../dom";

/**
 * Sortörést (`<br>`) ad a megadott szülőhöz.
 *
 * @group utils
 */
export function newLine(parent: HTMLElement | string): HTMLElement {
  return createDOMElem({ parent, tag: "br" });
}
