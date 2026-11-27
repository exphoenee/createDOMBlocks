import { createDOMElem } from "../dom";
import type { ButtonInputParams } from "../types";
import { createInputElem } from "../helpers";

/**
 * Reset gomb, form visszaállításhoz.
 *
 * @category buttons
 * @menu Reset input
 * @order 3
 * @summary Reset gomb, form visszaállításhoz.
 */
export function createResetInput(
  params: ButtonInputParams
): HTMLElement {
  // a felirat a value attribútum: lehet nyelvfüggő szöveg (tr() / függvény) is
  const base = createInputElem("input", { ...params, type: "reset", value: undefined });
  const label = params.text ?? params.value;
  return createDOMElem({
    ...base,
    attrs: { ...base.attrs, ...(label != null ? { value: label } : {}) },
    parent: params.parent,
  });
}
