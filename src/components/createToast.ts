import { createDOMElem } from "domelemjs";
import type { ToastParams } from "../types";

export function createToast(config: ToastParams): HTMLElement {
  const duration = config.duration || 3000;
  const position = config.position || "top-right";

  const positionStyles: Record<string, Record<string, string>> = {
    "top-right": { top: "1rem", right: "1rem" },
    "top-left": { top: "1rem", left: "1rem" },
    "bottom-right": { bottom: "1rem", right: "1rem" },
    "bottom-left": { bottom: "1rem", left: "1rem" },
  };

  const rootAttrs: Record<string, string> = {
    class: `toast toast-${config.type || "info"}${config.class ? ` ${config.class}` : ""}`,
    role: "status",
    "aria-live": "polite",
  };
  if (config.id) rootAttrs.id = config.id;

  const toast = createDOMElem({
    tag: "div",
    parent: config.parent || "body",
    attrs: rootAttrs,
    style: { position: "fixed", ...positionStyles[position], zIndex: "9999" },
    children: [
      { tag: "span", text: config.message, attrs: { class: "toast-message" } },
      {
        tag: "button",
        text: "\u00D7",
        attrs: { class: "toast-close" },
        handleEvent: {
          event: "click",
          cb: (e: Event) => {
            const t = (e.currentTarget as HTMLElement).closest(".toast");
            if (t) { (t as HTMLElement).style.opacity = "0"; setTimeout(() => (t as HTMLElement).style.display = "none", 300); }
          },
        },
      },
    ],
  });

  setTimeout(() => {
    (toast as HTMLElement).style.opacity = "0";
    setTimeout(() => (toast as HTMLElement).style.display = "none", 300);
  }, duration);

  return toast;
}
