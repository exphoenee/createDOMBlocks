import { createDOMElem } from "domelemjs";
import type { CreateDOMElemOptions } from "domelemjs";
import type { ProgressBarParams } from "../types";

export function createProgressBar(params: ProgressBarParams): HTMLElement {
  const max = params.max || 100;
  const percentage = Math.min(Math.max((params.value / max) * 100, 0), 100);

  const children: CreateDOMElemOptions[] = [];

  if (params.label) {
    children.push({ tag: "div", attrs: { class: "progress-label" }, text: params.label });
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
          backgroundColor: params.color || "#3b82f6",
          height: "100%",
          borderRadius: "inherit",
          transition: "width 0.3s ease",
        },
        text: params.showPercentage ? `${Math.round(percentage)}%` : undefined,
      },
    ],
  });

  const rootAttrs: Record<string, string | number> = {
    class: `progress-bar${params.class ? ` ${params.class}` : ""}`,
    role: "progressbar",
    "aria-valuenow": params.value,
    "aria-valuemin": 0,
    "aria-valuemax": max,
  };
  if (params.id) rootAttrs.id = params.id;

  return createDOMElem({
    tag: "div",
    parent: params.parent,
    attrs: rootAttrs,
    children,
  });
}
