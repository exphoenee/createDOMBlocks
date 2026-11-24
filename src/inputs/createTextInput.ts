import { createDOMElem } from "../dom";
import type { TextInputParams } from "../types";
import { createInputContainer, createInputChildren } from "../helpers";

/**
 * Szöveg input létrehozása címkével.
 *
 * @category forms
 * @menu Text input
 * @order 1
 * @summary Szöveg input létrehozása címkével.
 */
export function createTextInput(params: TextInputParams): HTMLElement {
  const conf = { ...params, labelfirst: params.labelfirst ?? true, type: "text" as const };
  return createInputContainer(conf, createInputChildren("input", conf));
}
