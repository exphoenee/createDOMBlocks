import type { UrlInputParams } from "../types";
import { createInputContainer, createInputChildren } from "../helpers";

/**
 * URL input.
 *
 * @category forms
 * @menu Url input
 * @order 3
 * @summary URL input.
 */
export function createUrlInput(params: UrlInputParams): HTMLElement {
  const conf = { ...params, labelfirst: params.labelfirst ?? true, type: "url" as const };
  return createInputContainer(conf, createInputChildren("input", conf));
}
