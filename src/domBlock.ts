import { createDOMElem } from "domelemjs";
import type { CreateDOMElemOptions } from "domelemjs";

export class DOMBlock {
  readonly elem: HTMLElement;

  constructor(recipe: CreateDOMElemOptions) {
    this.elem = createDOMElem(recipe);
  }
}
