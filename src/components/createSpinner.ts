import { createDOMElem } from "domelemjs";
import type { SpinnerParams } from "../types";

export function createSpinner(params: SpinnerParams): HTMLElement {
  const sizeMap: Record<string, string> = { sm: "1rem", md: "2rem", lg: "3rem" };
  const size = sizeMap[params.size || "md"];

  const rootAttrs: Record<string, string> = {
    class: `spinner spinner-${params.size || "md"}${params.class ? ` ${params.class}` : ""}`,
    role: "status",
    "aria-label": "Loading",
  };
  if (params.id) rootAttrs.id = params.id;

  return createDOMElem({
    tag: "div",
    parent: params.parent,
    attrs: rootAttrs,
    style: {
      width: size,
      height: size,
      border: `3px solid ${params.color || "#ccc"}`,
      borderTopColor: params.color || "#333",
      borderRadius: "50%",
      animation: "spin 0.8s linear infinite",
    },
  });
}
