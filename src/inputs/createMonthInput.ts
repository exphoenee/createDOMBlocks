import type { MonthInputParams } from "../types";
import { createInputContainer, createInputChildren } from "../helpers";

export function createMonthInput(params: MonthInputParams): HTMLElement {
  const conf = { ...params, labelfirst: params.labelfirst ?? true, type: "month" as const };
  return createInputContainer(conf, createInputChildren("input", conf));
}
