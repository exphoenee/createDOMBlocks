import { createDOMElem } from "domelemjs";
import type { CreateDOMElemOptions } from "domelemjs";
import type { AlertParams } from "../types";

export function createAlert(config: AlertParams): HTMLElement {
  const children: CreateDOMElemOptions[] = [];

  if (config.title) {
    children.push({ tag: "strong", text: config.title, attrs: { class: "alert-title" } });
  }

  children.push({ tag: "span", text: config.message, attrs: { class: "alert-message" } });

  if (config.dismissible) {
    children.push({
      tag: "button",
      text: "\u00D7",
      attrs: { class: "alert-close" },
      handleEvent: {
        event: "click",
        cb: (e: Event) => {
          const alert = (e.currentTarget as HTMLElement).closest(".alert");
          if (alert) (alert as HTMLElement).style.display = "none";
          config.onDismiss?.();
        },
      },
    });
  }

  const rootAttrs: Record<string, string> = {
    class: `alert alert-${config.type || "info"}${config.class ? ` ${config.class}` : ""}`,
    role: "alert",
  };
  if (config.id) rootAttrs.id = config.id;

  return createDOMElem({ tag: "div", parent: config.parent, attrs: rootAttrs, children });
}
