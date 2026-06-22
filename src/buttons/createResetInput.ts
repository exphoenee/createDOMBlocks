import { createDOMElem } from "domelemjs";
import type { ButtonInputParams } from "../types";
import { createInputElem } from "../helpers";

export function createResetInput(
  params: ButtonInputParams
): HTMLElement {
  return createDOMElem({
    ...createInputElem("input", { ...params, type: "reset", value: params.text ?? params.value }),
    parent: params.parent,
  });
}
