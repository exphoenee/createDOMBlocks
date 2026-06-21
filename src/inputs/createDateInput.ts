import type { DateInputParams } from "../types";
import { createInputContainer, createInputChildren } from "../helpers";

export function createDateInput(params: DateInputParams): HTMLElement {
  const conf = { ...params, labelfirst: params.labelfirst ?? true, type: "date" as const };
  return createInputContainer(conf, createInputChildren("input", conf));
}
