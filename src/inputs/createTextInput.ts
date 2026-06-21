import { createDOMElem } from "domelemjs";
import type { TextInputParams } from "../types";
import { createInputContainer, createInputChildren } from "../helpers";

export function createTextInput(params: TextInputParams): HTMLElement {
  const conf = { ...params, labelfirst: params.labelfirst ?? true, type: "text" as const };
  return createInputContainer(conf, createInputChildren("input", conf));
}
