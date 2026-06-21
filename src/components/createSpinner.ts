import { createDOMElem } from "domelemjs";
import type { SpinnerParams } from "../types";

export function createSpinner(config: SpinnerParams): HTMLElement {
  const sizeMap: Record<string, string> = { sm: "1rem", md: "2rem", lg: "3rem" };
  const size = sizeMap[config.size || "md"];

  const rootAttrs: Record<string, string> = {
    class: `spinner spinner-${config.size || "md"}${config.class ? ` ${config.class}` : ""}`,
    role: "status",
    "aria-label": "Loading",
  };
  if (config.id) rootAttrs.id = config.id;

  return createDOMElem({
    tag: "div",
    parent: config.parent,
    attrs: rootAttrs,
    style: {
      width: size,
      height: size,
      border: `3px solid ${config.color || "#ccc"}`,
      borderTopColor: config.color || "#333",
      borderRadius: "50%",
      animation: "spin 0.8s linear infinite",
    },
  });
}
