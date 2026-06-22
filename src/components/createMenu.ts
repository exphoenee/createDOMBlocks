import { createDOMElem } from "domelemjs";
import type { CreateDOMElemOptions } from "domelemjs";
import type { MenuItem, MenuParams } from "../types";

function buildMenuItem(item: MenuItem): CreateDOMElemOptions {
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

export function createMenu(params: MenuParams): HTMLElement {
  return createDOMElem({
    tag: "nav",
    attrs: { class: "drawer-nav", id: `${params.id}-nav` },
    children: params.items.map((item) => buildMenuItem(item)),
  });
}
