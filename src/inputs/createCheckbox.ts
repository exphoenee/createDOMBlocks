import type { CheckboxParams } from "../types";
import { createInputContainer, createInputChildren } from "../helpers";

/**
 * Jelölő négyzet.
 *
 * @category forms
 * @menu Checkbox
 * @order 13
 * @summary Jelölő négyzet.
 */
export function createCheckbox(params: CheckboxParams): HTMLElement {
  const conf = { ...params, labelfirst: params.labelfirst ?? true, type: "checkbox" as const };
  return createInputContainer(conf, createInputChildren("input", conf));
}
