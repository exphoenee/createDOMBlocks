import type { DateInputParams } from "../types";
import { createInputContainer, createInputChildren } from "../helpers";

/**
 * Dátum kiválasztó.
 *
 * @category forms
 * @menu Date input
 * @order 8
 * @summary Dátum kiválasztó.
 */
export function createDateInput(params: DateInputParams): HTMLElement {
  const conf = { ...params, labelfirst: params.labelfirst ?? true, type: "date" as const };
  return createInputContainer(conf, createInputChildren("input", conf));
}
