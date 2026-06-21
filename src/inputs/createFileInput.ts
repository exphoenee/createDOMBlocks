import type { FileInputParams } from "../types";
import { createInputContainer, createInputChildren } from "../helpers";

export function createFileInput(params: FileInputParams): HTMLElement {
  const conf = { ...params, labelfirst: params.labelfirst ?? true, type: "file" as const };
  return createInputContainer(conf, createInputChildren("input", conf));
}
