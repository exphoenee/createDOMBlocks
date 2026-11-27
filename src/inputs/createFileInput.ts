import type { FileInputParams } from "../types";
import { createInputContainer, createInputChildren } from "../helpers";

/**
 * Fájl kiválasztó.
 *
 * @category forms
 * @menu File input
 * @order 15
 * @summary Fájl kiválasztó.
 */
export function createFileInput(params: FileInputParams): HTMLElement {
  const conf = { ...params, labelfirst: params.labelfirst ?? true, type: "file" as const };
  return createInputContainer(conf, createInputChildren("input", conf));
}
