import { createDOMElem } from "domelemjs";
import type { ButtonInputParams } from "../types";
import { createInputElem } from "../helpers";

export function createSubmitInput(
  params: ButtonInputParams
): HTMLElement {
  return createDOMElem({
    ...createInputElem("input", { ...params, type: "submit", value: params.text ?? params.value }),
    parent: params.parent,
  });
}
