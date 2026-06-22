import { createDOMElem } from "domelemjs";
import type { TooltipParams } from "../types";

export function createTooltip(params: TooltipParams): HTMLElement {
  const rootAttrs: Record<string, string> = {
    class: `tooltip-wrapper${params.class ? ` ${params.class}` : ""}`,
    "data-tooltip": params.text,
    "data-tooltip-position": params.position || "top",
  };
  if (params.id) rootAttrs.id = params.id;

  return createDOMElem({
    tag: "div",
    parent: params.parent,
    attrs: rootAttrs,
    children: [
      {
        tag: "span",
        attrs: { class: "tooltip-trigger" },
        children: [
          { tag: "span", text: "\u24D8", attrs: { class: "tooltip-icon" } },
          { tag: "span", text: "Info", attrs: { class: "tooltip-trigger-text" } },
        ],
      },
      { tag: "span", attrs: { class: "tooltip-content" }, text: params.text },
    ],
    handleEvent: params.trigger === "click"
      ? { event: "click", cb: (e: Event) => { (e.currentTarget as HTMLElement).classList.toggle("tooltip-active"); } }
      : undefined,
  });
}
