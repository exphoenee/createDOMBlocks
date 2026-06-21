import type { PasswordInputParams } from "../types";
import { createInputContainer, createInputChildren } from "../helpers";

export function createPasswordInput(params: PasswordInputParams): HTMLElement {
  const conf = { ...params, labelfirst: params.labelfirst ?? true, type: "password" as const };
  return createInputContainer(conf, createInputChildren("input", conf));
}
