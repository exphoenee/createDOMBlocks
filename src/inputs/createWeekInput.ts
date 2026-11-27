import type { WeekInputParams } from "../types";
import { createInputContainer, createInputChildren } from "../helpers";

/**
 * Hét kiválasztó.
 *
 * @category forms
 * @menu Week input
 * @order 12
 * @summary Hét kiválasztó.
 */
export function createWeekInput(params: WeekInputParams): HTMLElement {
  const conf = { ...params, labelfirst: params.labelfirst ?? true, type: "week" as const };
  return createInputContainer(conf, createInputChildren("input", conf));
}
