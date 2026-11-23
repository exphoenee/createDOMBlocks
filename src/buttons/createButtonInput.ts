import { createDOMElem } from "../dom";
import type { ButtonInputParams } from "../types";
import { createInputElem } from "../helpers";

export function createButtonInput(
  params: ButtonInputParams
): HTMLElement {
  // a felirat a value attribútum: lehet nyelvfüggő szöveg (tr() / függvény) is
  const base = createInputElem("input", { ...params, type: "button", value: undefined });
  const label = params.text ?? params.value;
  return createDOMElem({
    ...base,
    attrs: { ...base.attrs, ...(label != null ? { value: label } : {}) },
    parent: params.parent,
  });
}
