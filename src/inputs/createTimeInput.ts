import type { TimeInputParams } from "../types";
import { createInputContainer, createInputChildren } from "../helpers";

export function createTimeInput(params: TimeInputParams): HTMLElement {
  const conf = { ...params, labelfirst: params.labelfirst ?? true, type: "time" as const };
  return createInputContainer(conf, createInputChildren("input", conf));
}
