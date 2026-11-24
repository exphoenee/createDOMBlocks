import type { MonthInputParams } from "../types";
import { createInputContainer, createInputChildren } from "../helpers";

/**
 * Hónap kiválasztó.
 *
 * @category forms
 * @menu Month input
 * @order 11
 * @summary Hónap kiválasztó.
 */
export function createMonthInput(params: MonthInputParams): HTMLElement {
  const conf = { ...params, labelfirst: params.labelfirst ?? true, type: "month" as const };
  return createInputContainer(conf, createInputChildren("input", conf));
}
