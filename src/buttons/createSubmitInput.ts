import { createDOMElem } from "../dom";
import type { ButtonInputParams } from "../types";
import { createInputElem } from "../helpers";

/**
 * Submit gomb, form-ok küldéséhez.
 *
 * @category buttons
 * @menu Submit input
 * @order 2
 * @summary Submit gomb, form-ok küldéséhez.
 */
export function createSubmitInput(
  params: ButtonInputParams
): HTMLElement {
  // a felirat a value attribútum: lehet nyelvfüggő szöveg (tr() / függvény) is
  const base = createInputElem("input", { ...params, type: "submit", value: undefined });
  const label = params.text ?? params.value;
  return createDOMElem({
    ...base,
    attrs: { ...base.attrs, ...(label != null ? { value: label } : {}) },
    parent: params.parent,
  });
}
