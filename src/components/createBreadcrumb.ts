import { createDOMElem } from "domelemjs";
import type { CreateDOMElemOptions } from "domelemjs";
import type { BreadcrumbParams, BreadcrumbItem } from "../types";

export function createBreadcrumb(config: BreadcrumbParams): HTMLElement {
  const separator = config.separator || "/";
  const children: CreateDOMElemOptions[] = [];

  config.items.forEach((item: BreadcrumbItem, index: number) => {
    if (index > 0) {
      children.push({ tag: "span", text: separator, attrs: { class: "breadcrumb-separator" } });
    }
    const isLast = index === config.items.length - 1;
    if (item.href && !isLast) {
      children.push({
        tag: "a",
        text: item.text,
        attrs: { href: item.href, class: "breadcrumb-link" },
        handleEvent: item.click ? { event: "click", cb: item.click } : undefined,
      });
    } else {
      children.push({
        tag: "span",
        text: item.text,
        attrs: { class: isLast ? "breadcrumb-current" : "breadcrumb-link" },
        handleEvent: item.click ? { event: "click", cb: item.click } : undefined,
      });
    }
  });

  const rootAttrs: Record<string, string> = { class: `breadcrumb${config.class ? ` ${config.class}` : ""}` };
  if (config.id) rootAttrs.id = config.id;

  return createDOMElem({
    tag: "nav",
    parent: config.parent,
    attrs: rootAttrs,
    children: [
      {
        tag: "ol",
        attrs: { class: "breadcrumb-list" },
        children: children.map((child: CreateDOMElemOptions) => ({
          tag: "li",
          attrs: { class: "breadcrumb-item" },
          children: [child],
        })),
      },
    ],
  });
}
