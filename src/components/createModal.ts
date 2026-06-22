import { createDOMElem } from "domelemjs";
import type { CreateDOMElemOptions } from "domelemjs";
import type { ModalContent, ModalActions, ModalParams } from "../types";
import { createButton } from "../buttons/createButton";

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
        background: "white",
        padding: "1.5rem",
        borderRadius: "1rem",
        boxShadow: "0 0.5rem 1rem rgba(0,0,0,0.5)",
        minWidth: "320px",
        maxWidth: "90vw",
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
        {
          tag: "div",
          attrs: { class: "modal-footer" },
          style: { display: "flex", justifyContent: "flex-end", gap: "0.5rem", marginTop: "1rem", borderTop: "1px solid #e5e7eb", paddingTop: "1rem" },
          children: [
            createButton({
              id: `${params.id}-cancel-btn`,
              parent: document.body,
              class: "modal-cancel-btn",
              click: () => { actions.cancelAction?.(); closeModal(params.id); },
              text: "Mégse",
            }),
            createButton({
              id: `${params.id}-ok-btn`,
              parent: document.body,
              class: "modal-ok-btn",
              click: () => { actions.okAction?.(); closeModal(params.id); },
              text: "OK",
            }),
          ],
        },
      ],
    }],
  });

  document.body.appendChild(modal);

  return modal;
}
