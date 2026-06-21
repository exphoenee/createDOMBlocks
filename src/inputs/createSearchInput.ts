import type { SearchInputParams } from "../types";
import { createInputContainer, createInputChildren } from "../helpers";

export function createSearchInput(params: SearchInputParams): HTMLElement {
  const conf = { ...params, labelfirst: params.labelfirst ?? true, type: "search" as const };
  return createInputContainer(conf, createInputChildren("input", conf));
}
