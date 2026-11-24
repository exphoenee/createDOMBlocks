import { createDOMElem } from "../dom";
import type { DOMOptions } from "../dom";
import type { ModalContent, ModalActions, ModalParams } from "../types";
import { createButton } from "../buttons/createButton";
import { builtin } from "../i18n";

export function openModal(id: string): void {
  const portal = document.getElementById(`${id}-portal`);
  if (portal) {
    document.body.appendChild(portal);
    portal.style.display = "flex";
    portal.style.opacity = "1";
    portal.classList.remove("hidden");
  }
}

export function closeModal(id: string): void {
  const portal = document.getElementById(`${id}-portal`);
  if (portal) {
    portal.classList.add("hidden");
    portal.style.opacity = "0";
    portal.addEventListener("transitionend", () => {
      portal.style.display = "none";
    }, { once: true });
  }
}

const toCss = (v: string | number): string => (typeof v === "number" ? `${v}px` : v);

export function createModal(
  content: ModalContent,
  actions: ModalActions,
  params: ModalParams
): HTMLElement {
  const bodyChildren = Array.isArray(content.body) ? content.body : [content.body];

  const modal = createDOMElem({
    tag: "div",
    attrs: {
      class: "modal-portal hidden",
      id: `${params.id}-portal`,
    },
    style: {
      position: "fixed",
      width: "100vw",
      height: "100vh",
      top: "0",
      left: "0",
      background: "rgba(0,0,0,0.5)",
      zIndex: "9999",
      transition: "opacity 0.3s ease-in-out",
      display: "none",
      opacity: "0",
      justifyContent: "center",
      alignItems: "center",
    },
    children: [{
      tag: "div",
      style: {
        background: "var(--bg)",
        color: "var(--text)",
        padding: "1.5rem",
        borderRadius: "var(--radius-lg)",
        boxShadow: "var(--shadow-lg)",
        minWidth: params.width !== undefined ? "0" : "320px",
        ...(params.width !== undefined ? { width: toCss(params.width) } : {}),
        maxWidth: toCss(params.maxWidth ?? "90vw"),
        maxHeight: "90vh",
        overflow: "auto",
      },
      attrs: {
        class: `modal${params.class ? ` ${params.class}` : ""}`,
        id: params.id,
      },
      children: [
        {
          tag: "div",
          attrs: { class: "modal-title-container" },
          style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" },
          children: [
            {
              tag: "h2",
              attrs: { class: "modal-title" },
              text: content.modalTitle,
              style: { margin: 0, fontSize: "1.25rem" },
            },
            createButton({
              id: `${params.id}-close-btn`,
              class: "modal-close-btn",
              parent: document.body,
              text: "\u00D7",
              style: { fontSize: "1.5rem", cursor: "pointer", background: "none", border: "none", padding: "0.25rem", lineHeight: 1 },
              click: () => {
                closeModal(params.id);
                actions.closeAction?.();
              },
            }),
          ],
        },
        {
          tag: "div",
          attrs: { class: "modal-body" },
          children: bodyChildren,
        },
        ...(params.footer === false ? [] : [{
          tag: "div",
          attrs: { class: "modal-footer" },
          style: { display: "flex", justifyContent: "flex-end", gap: "0.5rem", marginTop: "1rem", borderTop: "1px solid var(--border)", paddingTop: "1rem" },
          children: [
            createButton({
              id: `${params.id}-cancel-btn`,
              parent: document.body,
              class: "modal-cancel-btn",
              click: () => { actions.cancelAction?.(); closeModal(params.id); },
              text: params.labels?.cancel ?? builtin("modal.cancel", "Mégse"),
            }),
            createButton({
              id: `${params.id}-ok-btn`,
              parent: document.body,
              class: "modal-ok-btn",
              click: () => { actions.okAction?.(); closeModal(params.id); },
              text: params.labels?.ok ?? builtin("modal.ok", "OK"),
            }),
          ],
        }]),
      ],
    }],
  });

  document.body.appendChild(modal);

  if (params.closeOnBackdrop) {
    modal.addEventListener("click", (e) => {
      if (e.target !== modal) return;
      closeModal(params.id);
      actions.closeAction?.();
    });
  }
  if (params.closeOnEscape) {
    const onKey = (e: KeyboardEvent): void => {
      if (!modal.isConnected) {
        document.removeEventListener("keydown", onKey);
        return;
      }
      if (e.key !== "Escape" || modal.classList.contains("hidden") || modal.style.display === "none") return;
      closeModal(params.id);
      actions.closeAction?.();
    };
    document.addEventListener("keydown", onKey);
  }

  return modal;
}
