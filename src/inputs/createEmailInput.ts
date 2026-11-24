import type { EmailInputParams } from "../types";
import { createInputContainer, createInputChildren } from "../helpers";

/**
 * E-mail input.
 *
 * @category forms
 * @menu Email input
 * @order 5
 * @summary E-mail input.
 */
export function createEmailInput(params: EmailInputParams): HTMLElement {
  const conf = { ...params, labelfirst: params.labelfirst ?? true, type: "email" as const };
  return createInputContainer(conf, createInputChildren("input", conf));
}
