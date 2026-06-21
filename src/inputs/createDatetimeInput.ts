import type { DatetimeInputParams } from "../types";
import { createInputContainer, createInputChildren } from "../helpers";

export function createDatetimeInput(params: DatetimeInputParams): HTMLElement {
  const conf = { ...params, labelfirst: params.labelfirst ?? true, type: "datetime-local" as const };
  return createInputContainer(conf, createInputChildren("input", conf));
}
