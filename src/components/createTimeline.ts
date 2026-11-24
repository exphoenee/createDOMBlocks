import { createDOMElem } from "../dom";
import type { DOMOptions } from "../dom";
import type { TextValue } from "../i18n";
import type { TimelineParams, TimelineItem } from "../types";

function buildItem(item: TimelineItem): DOMOptions {
  const head: DOMOptions[] = [{ tag: "span", text: item.period, attrs: { class: "timeline-period" } }];
  if (item.badge) head.push({ tag: "span", text: item.badge, attrs: { class: "timeline-badge" } });

  const card: DOMOptions[] = [
    { tag: "div", attrs: { class: "timeline-head" }, children: head },
    { tag: "h3", text: item.title, attrs: { class: "timeline-title" } },
  ];
  if (item.subtitle) card.push({ tag: "div", text: item.subtitle, attrs: { class: "timeline-subtitle" } });
  if (item.description) card.push({ tag: "p", text: item.description, attrs: { class: "timeline-desc" } });

  return {
    tag: "div",
    attrs: { class: "timeline-item", role: "listitem" },
    children: [
      { tag: "span", attrs: { class: "timeline-dot", "aria-hidden": "true" } },
      { tag: "div", attrs: { class: "timeline-card" }, children: card },
    ],
  };
}

/**
 * Függőleges idővonal, váltakozó oldalú kártyákkal (keskeny képernyőn egy oszlop).
 * Kompakt nézetben a leírások rejtettek: az `is-compact` osztály kapcsolásával váltható.
 *
 * @category interactive
 * @menu Timeline
 * @order 4
 * @summary Váltakozó oldalú kártyák; keskeny képernyőn egy oszlop.
 */
export function createTimeline(params: TimelineParams): HTMLElement {
  const attrs: Record<string, TextValue> = {
    class: `timeline${params.compact ? " is-compact" : ""}${params.class ? ` ${params.class}` : ""}`,
    role: "list",
  };
  if (params.id) attrs.id = params.id;
  if (params.ariaLabel) attrs["aria-label"] = params.ariaLabel;

  return createDOMElem({
    tag: "div",
    parent: params.parent,
    attrs,
    children: params.items.map(buildItem),
  });
}
