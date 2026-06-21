import type { CreateDOMElemOptions } from "domelemjs";
import type { ButtonInputParams } from "../types";
import { createInputElem } from "../helpers";

export function createButtonInput(
  params: ButtonInputParams
): CreateDOMElemOptions {
  return createInputElem("input", {
    ...params,
    type: "button",
  });
}
