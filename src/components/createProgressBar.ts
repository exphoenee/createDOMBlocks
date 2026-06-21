import { createDOMElem } from "domelemjs";
import type { CreateDOMElemOptions } from "domelemjs";
import type { ProgressBarParams } from "../types";

export function createProgressBar(config: ProgressBarParams): HTMLElement {
  const max = config.max || 100;
  const percentage = Math.min(Math.max((config.value / max) * 100, 0), 100);

  const children: CreateDOMElemOptions[] = [];

  if (config.label) {
    children.push({ tag: "div", attrs: { class: "progress-label" }, text: config.label });
  }

  children.push({
    tag: "div",
    attrs: { class: "progress-track" },
    children: [
      {
        tag: "div",
        attrs: { class: "progress-fill" },
        style: {
          width: `${percentage}%`,
          backgroundColor: config.color || "#3b82f6",
          height: "100%",
          borderRadius: "inherit",
          transition: "width 0.3s ease",
        },
        text: config.showPercentage ? `${Math.round(percentage)}%` : undefined,
      },
    ],
  });

  const rootAttrs: Record<string, string | number> = {
    class: `progress-bar${config.class ? ` ${config.class}` : ""}`,
    role: "progressbar",
    "aria-valuenow": config.value,
    "aria-valuemin": 0,
    "aria-valuemax": max,
  };
  if (config.id) rootAttrs.id = config.id;

  return createDOMElem({
    tag: "div",
    parent: config.parent,
    attrs: rootAttrs,
    style: { width: "100%", height: "1.5rem", backgroundColor: "#e5e7eb", borderRadius: "0.5rem", overflow: "hidden" },
    children,
  });
}
