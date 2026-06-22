import { createDOMElem } from "domelemjs";
import type { CreateDOMElemOptions } from "domelemjs";
import type { TabsParams, TabItem } from "../types";

export function createTabs(params: TabsParams): HTMLElement {
  const activeId = params.activeTab || params.tabs[0]?.id;

  const tabButtons: CreateDOMElemOptions[] = params.tabs.map((tab: TabItem) => ({
    tag: "button",
    text: tab.label,
    attrs: {
      class: `tab-button${tab.id === activeId ? " active" : ""}`,
      "data-tab": tab.id,
    },
    handleEvent: {
      event: "click",
      cb: (e: Event) => {
        const target = e.currentTarget as HTMLElement;
        const tabId = target.getAttribute("data-tab");
        const container = target.closest(".tabs") as HTMLElement;
        if (!container) return;
        container.querySelectorAll(".tab-button").forEach((btn) => btn.classList.remove("active"));
        container.querySelectorAll(".tab-panel").forEach((panel) => panel.classList.remove("active"));
        target.classList.add("active");
        const panel = container.querySelector(`[data-tab-panel="${tabId}"]`);
        if (panel) panel.classList.add("active");
      },
    },
  }));

  const tabPanels: CreateDOMElemOptions[] = params.tabs.map((tab: TabItem) => {
    const content = Array.isArray(tab.content) ? tab.content : [tab.content];
    return {
      tag: "div",
      attrs: {
        class: `tab-panel${tab.id === activeId ? " active" : ""}`,
        "data-tab-panel": tab.id,
      },
      children: content,
    };
  });

  const rootAttrs: Record<string, string> = { class: `tabs${params.class ? ` ${params.class}` : ""}` };
  if (params.id) rootAttrs.id = params.id;

  return createDOMElem({
    tag: "div",
    parent: params.parent,
    attrs: rootAttrs,
    children: [
      { tag: "div", attrs: { class: "tab-buttons" }, children: tabButtons },
      { tag: "div", attrs: { class: "tab-panels" }, children: tabPanels },
    ],
  });
}
