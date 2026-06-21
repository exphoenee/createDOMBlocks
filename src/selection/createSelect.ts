import { createDOMElem } from "domelemjs";
import type { SelectParams } from "../types";

export function createSelect(params: SelectParams): HTMLElement {
  const optionChildren = params.options.map((opt) => {
    const optAttrs: Record<string, string | number | boolean> = { value: opt.value };
    if (params.value != null && params.value === opt.value) optAttrs.selected = true;
    return { tag: "option", text: opt.text, attrs: optAttrs };
  });

  const events: { event: string; cb: (e: Event) => void }[] = [];
  if (params.onChange) events.push({ event: "change", cb: params.onChange });
  if (params.click) events.push({ event: "click", cb: params.click });
  if (params.handleEvent) events.push(...(Array.isArray(params.handleEvent) ? params.handleEvent : [params.handleEvent]));

  const selectAttrs: Record<string, string | number> = {
    name: params.name || params.id,
    class: `select-input${params.class ? ` ${params.class}` : ""}`,
  };
  if (params.id) selectAttrs.id = params.id;

  const selectElem = {
    tag: "select",
    text: params.value != null ? String(params.value) : undefined,
    attrs: selectAttrs,
    children: optionChildren,
    handleEvent: events.length > 0 ? events : undefined,
  };

  const selectChildren: (typeof selectElem | { tag: string; text: string; attrs: Record<string, string> })[] =
    params.labelText
      ? [{
          tag: "label",
          text: params.labelText,
          attrs: { for: params.id, class: `select-label${params.class ? ` ${params.class}` : ""}` },
        }, selectElem]
      : [selectElem];

  if (params.labelfirst === false) selectChildren.reverse();

  const containerAttrs: Record<string, string> = {
    class: `select-input${params.class ? ` ${params.class}` : ""}`,
  };

  return createDOMElem({
    tag: "div",
    parent: params.parent,
    attrs: containerAttrs,
    children: selectChildren,
  });
}
