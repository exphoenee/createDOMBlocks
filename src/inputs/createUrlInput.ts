import type { UrlInputParams } from "../types";
import { createInputContainer, createInputChildren } from "../helpers";

export function createUrlInput(params: UrlInputParams): HTMLElement {
  const conf = { ...params, labelfirst: params.labelfirst ?? true, type: "url" as const };
  return createInputContainer(conf, createInputChildren("input", conf));
}
