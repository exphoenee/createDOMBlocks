import { createDOMElem } from "domelemjs";
import type { CreateDOMElemOptions } from "domelemjs";
import type { NavParams, NavItem } from "../types";

function buildNavItem(item: NavItem): CreateDOMElemOptions {
  const children: CreateDOMElemOptions[] = [];

  if (item.href) {
    const linkAttrs: Record<string, string> = { href: item.href };
    if (item.active) linkAttrs.class = "active";
    children.push({
      tag: "a",
      text: item.text,
      attrs: linkAttrs,
      handleEvent: item.click ? { event: "click", cb: item.click } : undefined,
    });
  } else {
    const spanAttrs: Record<string, string> = {};
    if (item.active) spanAttrs.class = "active";
    children.push({
      tag: "span",
      text: item.text,
      attrs: spanAttrs,
      handleEvent: item.click ? { event: "click", cb: item.click } : undefined,
    });
  }

  if (item.children && item.children.length > 0) {
    children.push({
      tag: "ul",
      attrs: { class: "nav-dropdown" },
      children: item.children.map((child: NavItem) => ({
        tag: "li",
        children: [buildNavItem(child)],
      })),
    });
  }

  return {
    tag: "li",
    attrs: { class: item.active ? "nav-item active" : "nav-item" },
    children,
  };
}

export function createNav(config: NavParams): HTMLElement {
  const navAttrs: Record<string, string> = { class: `nav${config.class ? ` ${config.class}` : ""}` };
  if (config.id) navAttrs.id = config.id;

  return createDOMElem({
    tag: "nav",
    parent: config.parent,
    attrs: navAttrs,
    children: [
      {
        tag: "ul",
        attrs: { class: "nav-list" },
        children: config.items.map((item: NavItem) => buildNavItem(item)),
      },
    ],
  });
}
