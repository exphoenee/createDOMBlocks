import { createDOMElem } from "../dom";
import type { DOMOptions } from "../dom";
import type { AlertParams } from "../types";
import { builtin } from "../i18n";

export function createAlert(params: AlertParams): HTMLElement {
  const children: DOMOptions[] = [];

  if (params.title) {
    children.push({ tag: "strong", text: params.title, attrs: { class: "alert-title" } });
  }

  children.push({ tag: "span", text: params.message, attrs: { class: "alert-message" } });

  if (params.dismissible) {
    children.push({
      tag: "button",
      text: "\u00D7",
      attrs: { class: "alert-close", "aria-label": builtin("alert.close", "Close") },
      handleEvent: {
        event: "click",
        cb: (e: Event) => {
          const alert = (e.currentTarget as HTMLElement).closest(".alert");
          if (alert) (alert as HTMLElement).style.display = "none";
          params.onDismiss?.();
        },
      },
    });
  }

  const rootAttrs: Record<string, string> = {
    class: `alert alert-${params.type || "info"}${params.class ? ` ${params.class}` : ""}`,
    role: "alert",
  };
  if (params.id) rootAttrs.id = params.id;

  return createDOMElem({ tag: "div", parent: params.parent, attrs: rootAttrs, children });
}
