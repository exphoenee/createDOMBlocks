import type { RangeInputParams } from "../types";
import { createInputContainer, createInputChildren } from "../helpers";

/**
 * Csúska min/max/step paraméterrel.
 *
 * @category forms
 * @menu Range input
 * @order 16
 * @summary Csúska min/max/step paraméterrel.
 */
export function createRangeInput(params: RangeInputParams): HTMLElement {
  const conf = { ...params, labelfirst: params.labelfirst ?? true, type: "range" as const };
  return createInputContainer(conf, createInputChildren("input", conf));
}
