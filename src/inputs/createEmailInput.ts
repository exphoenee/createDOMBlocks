import type { EmailInputParams } from "../types";
import { createInputContainer, createInputChildren } from "../helpers";

export function createEmailInput(params: EmailInputParams): HTMLElement {
  const conf = { ...params, labelfirst: params.labelfirst ?? true, type: "email" as const };
  return createInputContainer(conf, createInputChildren("input", conf));
}
