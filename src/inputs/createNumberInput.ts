import type { NumberInputParams } from "../types";
import { createInputContainer, createInputChildren } from "../helpers";

export function createNumberInput(params: NumberInputParams): HTMLElement {
  const conf = { ...params, labelfirst: params.labelfirst ?? true, type: "number" as const };
  return createInputContainer(conf, createInputChildren("input", conf));
}
