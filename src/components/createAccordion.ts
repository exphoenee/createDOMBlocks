import { createDOMElem } from "domelemjs";
import type { CreateDOMElemOptions } from "domelemjs";
import type { AccordionParams, AccordionItem } from "../types";

function buildAccordionItem(item: AccordionItem, multiple: boolean): CreateDOMElemOptions {
  const content = Array.isArray(item.content) ? item.content : [item.content];

  return {
    tag: "div",
    attrs: {
      class: `accordion-item${item.open ? " open" : ""}`,
      "data-accordion-item": item.id,
    },
    children: [
      {
        tag: "button",
        attrs: {
          class: "accordion-header",
          "data-accordion-toggle": item.id,
          "aria-expanded": item.open ? "true" : "false",
        },
        children: [
          { tag: "span", text: item.title, attrs: { class: "accordion-title" } },
          { tag: "span", text: "\u25BC", attrs: { class: "accordion-icon" } },
        ],
        handleEvent: {
          event: "click",
          cb: (e: Event) => {
            const button = e.currentTarget as HTMLElement;
            const accordionItem = button.closest(".accordion-item") as HTMLElement;
            if (!accordionItem) return;
            const isOpen = accordionItem.classList.contains("open");
            if (!multiple) {
              const accordion = accordionItem.closest(".accordion");
              accordion?.querySelectorAll(".accordion-item.open").forEach((el) => {
                el.classList.remove("open");
                el.querySelector(".accordion-header")?.setAttribute("aria-expanded", "false");
              });
            }
            accordionItem.classList.toggle("open", !isOpen);
            button.setAttribute("aria-expanded", (!isOpen).toString());
          },
        },
      },
      {
        tag: "div",
        attrs: {
          class: `accordion-content${item.open ? " open" : ""}`,
          "data-accordion-content": item.id,
        },
        children: content,
      },
    ],
  };
}

export function createAccordion(config: AccordionParams): HTMLElement {
  const rootAttrs: Record<string, string> = { class: `accordion${config.class ? ` ${config.class}` : ""}` };
  if (config.id) rootAttrs.id = config.id;

  return createDOMElem({
    tag: "div",
    parent: config.parent,
    attrs: rootAttrs,
    children: config.items.map((item: AccordionItem) => buildAccordionItem(item, config.multiple || false)),
  });
}
