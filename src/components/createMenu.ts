import { createDOMElem } from "domelemjs";
import type { CreateDOMElemOptions } from "domelemjs";
import type { MenuItem, MenuParams } from "../types";

const normalize = (p: string): string => p.replace(/\/index\.html$/, "/").replace(/\/+$/, "") || "/";

/** Az adott href az aktuális oldalra mutat-e */
function isCurrent(href?: string): boolean {
  if (!href || href.startsWith("#") || typeof location === "undefined") return false;
  try {
    return normalize(new URL(href, location.href).pathname) === normalize(location.pathname);
  } catch {
    return false;
  }
}

/** Az elem vagy bármely leszármazottja az aktuális oldal-e */
function containsCurrent(item: MenuItem): boolean {
  return isCurrent(item.href) || (item.children?.some(containsCurrent) ?? false);
}

let uid = 0;

function buildMenuItem(item: MenuItem, collapsible: boolean): CreateDOMElemOptions {
  const children: CreateDOMElemOptions[] = [];
  const hasChildren = !!item.children && item.children.length > 0;
  const foldable = collapsible && hasChildren;
  const open = foldable && (item.open ?? containsCurrent(item));
  const submenuId = `drawer-submenu-${++uid}`;

  if (foldable) {
    children.push({
      tag: "button",
      attrs: {
        type: "button",
        class: "drawer-link drawer-link-header drawer-toggle",
        "aria-expanded": String(open),
        "aria-controls": submenuId,
      },
      children: [
        { tag: "span", text: item.label },
        { tag: "span", attrs: { class: "drawer-chevron", "aria-hidden": "true" } },
      ],
      handleEvent: {
        event: "click",
        cb: (e: Event) => {
          const btn = e.currentTarget as HTMLElement;
          const wrapper = btn.closest(".drawer-item") as HTMLElement;
          const nowOpen = !wrapper.classList.contains("is-open");
          wrapper.classList.toggle("is-open", nowOpen);
          btn.setAttribute("aria-expanded", String(nowOpen));
        },
      },
    });
  } else if (item.href) {
    const current = isCurrent(item.href);
    children.push({
      tag: "a",
      text: item.label,
      attrs: { href: item.href, class: `drawer-link${current ? " active" : ""}`, ...(current ? { "aria-current": "page" } : {}) },
    });
  } else {
    children.push({
      tag: "span",
      text: item.label,
      attrs: { class: "drawer-link drawer-link-header" },
    });
  }

  if (hasChildren) {
    children.push({
      tag: "div",
      attrs: { class: "drawer-submenu", id: submenuId },
      children: item.children!.map((child) => ({
        tag: "div",
        attrs: { class: "drawer-subitem" },
        children: [buildMenuItem(child, collapsible)],
      })),
    });
  }

  return {
    tag: "div",
    attrs: { class: `drawer-item${foldable ? " is-foldable" : ""}${open ? " is-open" : ""}` },
    children,
  };
}

export function createMenu(params: MenuParams): HTMLElement {
  const collapsible = params.collapsible ?? false;
  return createDOMElem({
    tag: "nav",
    attrs: { class: "drawer-nav", id: `${params.id}-nav` },
    children: params.items.map((item) => buildMenuItem(item, collapsible)),
  });
}
