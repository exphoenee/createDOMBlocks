import type { WeekInputParams } from "../types";
import { createInputContainer, createInputChildren } from "../helpers";

export function createWeekInput(params: WeekInputParams): HTMLElement {
  const conf = { ...params, labelfirst: params.labelfirst ?? true, type: "week" as const };
  return createInputContainer(conf, createInputChildren("input", conf));
}
