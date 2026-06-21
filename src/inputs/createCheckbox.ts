import type { CheckboxParams } from "../types";
import { createInputContainer, createInputChildren } from "../helpers";

export function createCheckbox(params: CheckboxParams): HTMLElement {
  const conf = { ...params, labelfirst: params.labelfirst ?? true, type: "checkbox" as const };
  return createInputContainer(conf, createInputChildren("input", conf));
}
