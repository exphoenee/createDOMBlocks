import type { RangeInputParams } from "../types";
import { createInputContainer, createInputChildren } from "../helpers";

export function createRangeInput(params: RangeInputParams): HTMLElement {
  const conf = { ...params, labelfirst: params.labelfirst ?? true, type: "range" as const };
  return createInputContainer(conf, createInputChildren("input", conf));
}
