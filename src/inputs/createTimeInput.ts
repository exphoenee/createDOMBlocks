import type { TimeInputParams } from "../types";
import { createInputContainer, createInputChildren } from "../helpers";

/**
 * Idő kiválasztó.
 *
 * @category forms
 * @menu Time input
 * @order 10
 * @summary Idő kiválasztó.
 */
export function createTimeInput(params: TimeInputParams): HTMLElement {
  const conf = { ...params, labelfirst: params.labelfirst ?? true, type: "time" as const };
  return createInputContainer(conf, createInputChildren("input", conf));
}
