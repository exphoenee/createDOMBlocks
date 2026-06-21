import type { ColorInputParams } from "../types";
import { createInputContainer, createInputChildren } from "../helpers";

export function createColorInput(params: ColorInputParams): HTMLElement {
  const conf = { ...params, labelfirst: params.labelfirst ?? true, type: "color" as const };
  return createInputContainer(conf, createInputChildren("input", conf));
}
