import type { ColorInputParams } from "../types";
import { createInputContainer, createInputChildren } from "../helpers";

/**
 * Szín kiválasztó.
 *
 * @category forms
 * @menu Color input
 * @order 14
 * @summary Szín kiválasztó.
 */
export function createColorInput(params: ColorInputParams): HTMLElement {
  const conf = { ...params, labelfirst: params.labelfirst ?? true, type: "color" as const };
  return createInputContainer(conf, createInputChildren("input", conf));
}
