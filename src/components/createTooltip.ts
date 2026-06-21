import { createDOMElem } from "domelemjs";
import type { TooltipParams } from "../types";

export function createTooltip(config: TooltipParams): HTMLElement {
  const rootAttrs: Record<string, string> = {
    class: `tooltip-wrapper${config.class ? ` ${config.class}` : ""}`,
    "data-tooltip": config.text,
    "data-tooltip-position": config.position || "top",
  };
  if (config.id) rootAttrs.id = config.id;

  return createDOMElem({
    tag: "div",
    parent: config.parent,
    attrs: rootAttrs,
    children: [{ tag: "span", attrs: { class: "tooltip-content" }, text: config.text }],
    handleEvent: config.trigger === "click"
      ? { event: "click", cb: (e: Event) => { (e.currentTarget as HTMLElement).classList.toggle("tooltip-active"); } }
      : undefined,
  });
}
