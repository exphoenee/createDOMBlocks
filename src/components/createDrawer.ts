import { createDOMElem } from "../dom";
import type { DOMOptions } from "../dom";
import type { DrawerParams } from "../types";
import { builtin } from "../i18n";
import { createMenu } from "./createMenu";

/**
 * Oldalsó panel ami felülúszik a tartalmon, overlay réteggel.
 *
 * @category navigation
 * @menu Drawer
 * @order 5
 * @summary Oldalsó panel ami felülúszik a tartalmon, overlay réteggel.
 */
export function createDrawer(params: DrawerParams): HTMLElement {
  const id = params.id;
  const defaultState = params.defaultState || "closed";
  const hasOverlay = params.hasOverlay ?? false;
  const mode = params.mode || "overlay";

  let overlay: HTMLElement | null = null;

  if (hasOverlay) {
    overlay = createDOMElem({
      tag: "div",
      attrs: { class: "drawer-overlay", id: `${id}-overlay` },
      handleEvent: {
        event: "click",
        cb: () => closeDrawer(id),
      },
    });
  }

  // Backward compatibility: if items is provided (without children), wrap in createMenu
  const drawerChildren: (DOMOptions | HTMLElement)[] = params.children
    ? params.children
    : params.items
      ? [createMenu({ id, items: params.items })]
      : [];

  const sidebar = createDOMElem({
    tag: "div",
    attrs: {
      class: `drawer-sidebar${mode === "push" ? " drawer-push" : ""}`,
      id: `${id}-sidebar`,
      "data-drawer-mode": mode,
    },
    children: [
      {
        tag: "div",
        attrs: { class: "drawer-header" },
        children: [
          {
            tag: "span",
            text: params.title || builtin("drawer.title", "Menu"),
            attrs: { class: "drawer-title" },
          },
          {
            tag: "button",
            text: "\u00D7",
            attrs: { class: "drawer-close-btn" },
            handleEvent: {
              event: "click",
              cb: () => closeDrawer(id),
            },
          },
        ],
      },
      ...drawerChildren,
    ],
  });

  if (overlay) document.body.appendChild(overlay);
  document.body.appendChild(sidebar);

  if (defaultState === "open") {
    openDrawer(id);
  }

  return sidebar;
}

export function openDrawer(id: string = "sidebar-drawer"): void {
  const sidebar = document.getElementById(`${id}-sidebar`) as HTMLElement | null;
  if (!sidebar) return;

  const mode = sidebar.dataset.drawerMode || "overlay";
  const openedBefore = sidebar.dataset.drawerOpenedBefore === "true";

  if (openedBefore) {
    document.body.classList.add("drawer-transition");
  } else {
    sidebar.dataset.drawerOpenedBefore = "true";
  }

  const overlay = document.getElementById(`${id}-overlay`);
  if (overlay) overlay.classList.add("open");
  sidebar.classList.add("open");

  if (mode === "push") {
    document.body.classList.add("drawer-push-open");
  }
}

export function closeDrawer(id: string = "sidebar-drawer"): void {
  const sidebar = document.getElementById(`${id}-sidebar`) as HTMLElement | null;
  if (!sidebar) return;

  const openedBefore = sidebar.dataset.drawerOpenedBefore === "true";

  if (openedBefore) {
    document.body.classList.add("drawer-transition");
  }

  const overlay = document.getElementById(`${id}-overlay`);
  if (overlay) overlay.classList.remove("open");
  sidebar.classList.remove("open");

  // A tartalom eltolása csak akkor szűnik meg, ha már egyetlen push módú drawer sincs nyitva
  if (!document.querySelector(".drawer-sidebar.drawer-push.open")) {
    document.body.classList.remove("drawer-push-open");
  }
}
