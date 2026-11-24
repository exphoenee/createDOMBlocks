import type { NumberInputParams } from "../types";
import { createInputContainer, createInputChildren } from "../helpers";

/**
 * Szám input min/max/step paraméterrel.
 *
 * @category forms
 * @menu Number input
 * @order 7
 * @summary Szám input min/max/step paraméterrel.
 */
export function createNumberInput(params: NumberInputParams): HTMLElement {
  const conf = { ...params, labelfirst: params.labelfirst ?? true, type: "number" as const };
  return createInputContainer(conf, createInputChildren("input", conf));
}
