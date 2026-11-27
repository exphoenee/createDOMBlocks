import type { DatetimeInputParams } from "../types";
import { createInputContainer, createInputChildren } from "../helpers";

/**
 * Dátum és idő kiválasztó.
 *
 * @category forms
 * @menu Datetime input
 * @order 9
 * @summary Dátum és idő kiválasztó.
 */
export function createDatetimeInput(params: DatetimeInputParams): HTMLElement {
  const conf = { ...params, labelfirst: params.labelfirst ?? true, type: "datetime-local" as const };
  return createInputContainer(conf, createInputChildren("input", conf));
}
