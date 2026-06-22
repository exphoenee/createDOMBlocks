import { createDOMElem } from "domelemjs";
import type { ToastParams } from "../types";

/** Cache for toast containers keyed by position */
const containerCache = new Map<string, HTMLElement>();

function getContainer(position: string, width?: string): HTMLElement {
  const existing = containerCache.get(position);
  if (existing && document.body.contains(existing)) return existing;

  const attrs: Record<string, string> = { class: `toast-container toast-container-${position}` };
  if (width) {
    attrs.style = `width: ${width}; max-width: ${width}`;
  }

  const container = createDOMElem({
    tag: "div",
    parent: "body",
    attrs,
  });

  containerCache.set(position, container);
  return container;
}

function removeToast(toast: HTMLElement): void {
  toast.style.opacity = "0";
  setTimeout(() => {
    if (toast.parentNode) {
      toast.parentNode.removeChild(toast);
    }
  }, 300);
}

export function createToast(params: ToastParams): HTMLElement {
  const duration = params.duration || 3000;
  const position = params.position || "top-right";

  const container = getContainer(position, params.width);

  const rootAttrs: Record<string, string> = {
    class: `toast toast-${params.type || "info"}${params.class ? ` ${params.class}` : ""}`,
    role: "status",
    "aria-live": "polite",
  };
  if (params.id) rootAttrs.id = params.id;

  const toast = createDOMElem({
    tag: "div",
    parent: container,
    attrs: rootAttrs,
    children: [
      { tag: "span", text: params.message, attrs: { class: "toast-message" } },
      {
        tag: "button",
        text: "\u00D7",
        attrs: { class: "toast-close" },
        handleEvent: {
          event: "click",
          cb: (e: Event) => {
            const t = (e.currentTarget as HTMLElement).closest(".toast") as HTMLElement | null;
            if (t) removeToast(t);
          },
        },
      },
    ],
  });

  setTimeout(() => removeToast(toast), duration);

  return toast;
}
