import { createDOMElem } from "domelemjs";
import type { EventHandler } from "domelemjs";
import type { BaseInputParams } from "./types";

export function createInputElem(
  elemType: string,
  params: BaseInputParams
): { tag: string; text?: string; attrs: Record<string, string | number | boolean>; handleEvent?: EventHandler[] } {
  const events: EventHandler[] = [];
  if (params.onChange) events.push({ event: "change", cb: params.onChange });
  if (params.click) events.push({ event: "click", cb: params.click });
  if (params.handleEvent) {
    events.push(
      ...(Array.isArray(params.handleEvent) ? params.handleEvent : [params.handleEvent])
    );
  }

  const attrs: Record<string, string | number | boolean> = {
    name: params.name || params.id,
    class: `${params.type || elemType}-input${params.class ? ` ${params.class}` : ""}`,
  };

  if (params.id) attrs.id = params.id;
  if (params.value != null) attrs.value = params.value;
  if (params.type) attrs.type = params.type;
  if (params.checked != null) attrs.checked = params.checked;
  if (params.placeholder) attrs.placeholder = params.placeholder;
  if (params.min != null) attrs.min = params.min;
  if (params.max != null) attrs.max = params.max;
  if (params.step != null) attrs.step = params.step;
  if (params.rows != null) attrs.rows = params.rows;
  if (params.cols != null) attrs.cols = params.cols;
  if (params.start != null) attrs.start = params.start;

  return {
    tag: elemType,
    text: params.value != null ? String(params.value) : undefined,
    attrs,
    handleEvent: events.length > 0 ? events : undefined,
  };
}

export function createInputChildren(
  elemType: string,
  params: BaseInputParams
): ReturnType<typeof createDOMElem>[] {
  const inputOpts = createInputElem(elemType, params);
  const inputEl = createDOMElem(inputOpts);

  if (!params.labelText) return [inputEl];

  const labelEl = createDOMElem({
    tag: "label",
    text: params.labelText,
    attrs: {
      for: params.id,
      class: `${elemType}-label${params.class ? ` ${params.class}` : ""}`,
    },
  });

  return params.labelfirst !== false ? [labelEl, inputEl] : [inputEl, labelEl];
}

export function createInputContainer(
  params: BaseInputParams,
  children: ReturnType<typeof createDOMElem>[]
): HTMLElement {
  return createDOMElem({
    tag: "div",
    parent: params.parent,
    attrs: {
      class: `${params.type || "text"}-input${params.class ? ` ${params.class}` : ""}`,
    },
    children,
  });
}
