import type { TelInputParams } from "../types";
import { createInputContainer, createInputChildren } from "../helpers";

/**
 * Telefonszám input.
 *
 * @category forms
 * @menu Tel input
 * @order 2
 * @summary Telefonszám input.
 */
export function createTelInput(params: TelInputParams): HTMLElement {
  const conf = { ...params, labelfirst: params.labelfirst ?? true, type: "tel" as const };
  return createInputContainer(conf, createInputChildren("input", conf));
}
