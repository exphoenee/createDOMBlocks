import { createDOMElem } from "domelemjs";
import type { ButtonInputParams } from "../types";
import { createInputElem } from "../helpers";

export function createButtonInput(
  params: ButtonInputParams
): HTMLElement {
  return createDOMElem({
    ...createInputElem("input", { ...params, type: "button", value: params.text ?? params.value }),
    parent: params.parent,
  });
}
