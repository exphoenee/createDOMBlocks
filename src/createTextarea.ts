import { createDOMElem } from "domelemjs";
import type { TextareaParams } from "./types";

export function createTextarea(params: TextareaParams): HTMLElement {
  const events: { event: string; cb: (e: Event) => void }[] = [];
  if (params.onChange) events.push({ event: "change", cb: params.onChange });
  if (params.click) events.push({ event: "click", cb: params.click });
  if (params.handleEvent) events.push(...(Array.isArray(params.handleEvent) ? params.handleEvent : [params.handleEvent]));

  const taAttrs: Record<string, string | number> = {
    id: params.id,
    name: params.name || params.id,
    class: `textarea-input${params.class ? ` ${params.class}` : ""}`,
  };
  if (params.placeholder) taAttrs.placeholder = params.placeholder;
  if (params.rows != null) taAttrs.rows = params.rows;
  if (params.cols != null) taAttrs.cols = params.cols;

  const textareaEl = createDOMElem({
    tag: "textarea",
    text: params.value != null ? String(params.value) : undefined,
    attrs: taAttrs,
    handleEvent: events.length > 0 ? events : undefined,
  });

  const containerAttrs: Record<string, string> = { class: `textarea-input${params.class ? ` ${params.class}` : ""}` };

  return createDOMElem({
    tag: "div",
    parent: params.parent,
    attrs: containerAttrs,
    children: params.labelText
      ? [createDOMElem({ tag: "label", text: params.labelText, attrs: { for: params.id, class: `textarea-label${params.class ? ` ${params.class}` : ""}` } }), textareaEl]
      : [textareaEl],
  });
}
