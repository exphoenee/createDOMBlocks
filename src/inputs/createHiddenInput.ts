import { createDOMElem } from "domelemjs";
import type { HiddenInputParams } from "../types";
import { createInputElem } from "../helpers";

export function createHiddenInput(params: HiddenInputParams): HTMLElement {
  return createDOMElem({
    ...createInputElem("input", { ...params, type: "hidden" }),
    parent: params.parent,
  });
}
