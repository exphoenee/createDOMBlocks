import { createDOMElem } from "domelemjs";
import type { CreateDOMElemOptions } from "domelemjs";

export interface DrawerMenuItem {
  label: string;
  href?: string;
  children?: DrawerMenuItem[];
}

export interface DrawerParams {
  id?: string;
  title?: string;
  items: DrawerMenuItem[];
  defaultState?: "open" | "closed";
  hasOverlay?: boolean;
  mode?: "overlay" | "push";
}

function buildMenuItem(item: DrawerMenuItem): CreateDOMElemOptions {
  const children: CreateDOMElemOptions[] = [];

  if (item.href) {
    children.push({
      tag: "a",
      text: item.label,
      attrs: { href: item.href, class: "drawer-link" },
    });
  } else {
    children.push({
      tag: "span",
      text: item.label,
      attrs: { class: "drawer-link drawer-link-header" },
    });
  }

  if (item.children && item.children.length > 0) {
    children.push({
      tag: "div",
      attrs: { class: "drawer-submenu" },
      children: item.children.map((child) => ({
        tag: "div",
        attrs: { class: "drawer-subitem" },
        children: [buildMenuItem(child)],
      })),
    });
  }

  return {
    tag: "div",
    attrs: { class: "drawer-item" },
    children,
  };
}

let currentMode: "overlay" | "push" = "overlay";
let initialOpenDone = false;

export function createDrawer(params: DrawerParams): HTMLElement {
  const id = params.id || "sidebar-drawer";
  const defaultState = params.defaultState || "closed";
  const hasOverlay = params.hasOverlay ?? false;
  currentMode = params.mode || "overlay";

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

  const sidebar = createDOMElem({
    tag: "div",
    attrs: { class: `drawer-sidebar${currentMode === "push" ? " drawer-push" : ""}`, id: `${id}-sidebar` },
    children: [
      {
        tag: "div",
        attrs: { class: "drawer-header" },
        children: [
          {
            tag: "span",
            text: params.title || "Menu",
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
      {
        tag: "nav",
        attrs: { class: "drawer-nav" },
        children: params.items.map((item) => buildMenuItem(item)),
      },
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
  const overlay = document.getElementById(`${id}-overlay`);
  const sidebar = document.getElementById(`${id}-sidebar`);
  if (initialOpenDone) {
    document.body.classList.add("drawer-transition");
  }
  if (overlay) overlay.classList.add("open");
  if (sidebar) sidebar.classList.add("open");
  if (currentMode === "push") {
    document.body.classList.add("drawer-push-open");
  }
  initialOpenDone = true;
}

export function closeDrawer(id: string = "sidebar-drawer"): void {
  const overlay = document.getElementById(`${id}-overlay`);
  const sidebar = document.getElementById(`${id}-sidebar`);
  if (initialOpenDone) {
    document.body.classList.add("drawer-transition");
  }
  if (overlay) overlay.classList.remove("open");
  if (sidebar) sidebar.classList.remove("open");
  document.body.classList.remove("drawer-push-open");
}
