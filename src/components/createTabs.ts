import { createDOMElem } from "../dom";
import type { DOMOptions } from "../dom";
import type { TextValue } from "../i18n";
import type { TabsParams, TabItem } from "../types";

/**
 * Tabok a WAI-ARIA tabs minta szerint: roving tabindex, nyilak (körbeér), Home / End,
 * a fókusz aktivál.
 */
export function createTabs(params: TabsParams): HTMLElement {
  const activeId = params.tabs.some((t) => t.id === params.activeTab) ? params.activeTab : params.tabs[0]?.id;
  const base = params.id || "tabs";

  const tabButtons: DOMOptions[] = params.tabs.map((tab: TabItem) => {
    const on = tab.id === activeId;
    return {
      tag: "button",
      text: tab.label,
      attrs: {
        type: "button",
        class: `tab-button${on ? " active" : ""}`,
        role: "tab",
        id: `${base}-tab-${tab.id}`,
        "aria-controls": `${base}-panel-${tab.id}`,
        "aria-selected": String(on),
        tabindex: on ? "0" : "-1",
        "data-tab": tab.id,
      },
    };
  });

  const tabPanels: DOMOptions[] = params.tabs.map((tab: TabItem) => {
    const on = tab.id === activeId;
    const content = Array.isArray(tab.content) ? tab.content : [tab.content];
    return {
      tag: "div",
      attrs: {
        class: `tab-panel${on ? " active" : ""}`,
        role: "tabpanel",
        id: `${base}-panel-${tab.id}`,
        "aria-labelledby": `${base}-tab-${tab.id}`,
        tabindex: "0",
        "data-tab-panel": tab.id,
      },
      children: content,
    };
  });

  const rootAttrs: Record<string, string> = { class: `tabs${params.class ? ` ${params.class}` : ""}` };
  if (params.id) rootAttrs.id = params.id;

  const listAttrs: Record<string, TextValue> = { class: "tab-buttons", role: "tablist" };
  if (params.ariaLabel) listAttrs["aria-label"] = params.ariaLabel;

  const root = createDOMElem({
    tag: "div",
    parent: params.parent,
    attrs: rootAttrs,
    children: [
      { tag: "div", attrs: listAttrs, children: tabButtons },
      { tag: "div", attrs: { class: "tab-panels" }, children: tabPanels },
    ],
  });

  const buttons = Array.from(root.querySelectorAll<HTMLElement>(".tab-button"));
  const panels = Array.from(root.querySelectorAll<HTMLElement>(".tab-panel"));

  function select(btn: HTMLElement, focus: boolean): void {
    const id = btn.dataset.tab as string;
    const changed = !btn.classList.contains("active");
    buttons.forEach((b) => {
      const on = b === btn;
      b.classList.toggle("active", on);
      b.setAttribute("aria-selected", String(on));
      b.tabIndex = on ? 0 : -1;
    });
    panels.forEach((p) => p.classList.toggle("active", p.dataset.tabPanel === id));
    if (focus) btn.focus();
    if (changed) params.onChange?.(id);
  }

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => select(btn, false));
    btn.addEventListener("keydown", (e: KeyboardEvent) => {
      const i = buttons.indexOf(btn);
      let next: HTMLElement | undefined;
      if (e.key === "ArrowRight") next = buttons[(i + 1) % buttons.length];
      else if (e.key === "ArrowLeft") next = buttons[(i - 1 + buttons.length) % buttons.length];
      else if (e.key === "Home") next = buttons[0];
      else if (e.key === "End") next = buttons[buttons.length - 1];
      else return;
      e.preventDefault();
      select(next, true);
    });
  });

  return root;
}
