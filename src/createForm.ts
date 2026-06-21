import { createDOMElem } from "domelemjs";
import type { CreateDOMElemOptions } from "domelemjs";
import type { FormConfig, FormInputConfig } from "./types";

function createFormInput(input: FormInputConfig): CreateDOMElemOptions {
  const type = input.type;

  if (type === "select") {
    const optChildren: CreateDOMElemOptions[] = (input.options || []).map((opt: { text: string; value: string | number }) => {
      const optAttrs: Record<string, string | number | boolean> = { value: opt.value };
      if (input.value != null && input.value === opt.value) optAttrs.selected = true;
      return { tag: "option", text: opt.text, attrs: optAttrs };
    });
    const selectAttrs: Record<string, string> = {
      id: input.id,
      name: input.name || input.id,
      class: `select-input${input.class ? ` ${input.class}` : ""}`,
    };
    return { tag: "select", attrs: selectAttrs, children: optChildren, handleEvent: getEvents(input) };
  }

  if (type === "radio") {
    const radioChildren: CreateDOMElemOptions[] = (input.options || []).map((opt: { text: string; value: string | number }, index: number) => {
      const checked = typeof input.value === "string"
        ? opt.text === input.value
        : typeof input.value === "number"
          ? input.value === index + 1
          : false;
      return {
        tag: "div",
        attrs: { class: "radio-option" },
        children: [
          { tag: "input", attrs: { type: "radio", id: `${input.id}-${opt.value}`, name: input.name || input.id, value: opt.value, checked } },
          { tag: "label", text: opt.text, attrs: { for: `${input.id}-${opt.value}` } },
        ] as CreateDOMElemOptions[],
      };
    });
    return { tag: "div", attrs: { class: `radio-group${input.class ? ` ${input.class}` : ""}` }, children: radioChildren };
  }

  if (type === "textarea") {
    const taAttrs: Record<string, string | number> = {
      id: input.id,
      name: input.name || input.id,
      class: `textarea-input${input.class ? ` ${input.class}` : ""}`,
    };
    if (input.placeholder) taAttrs.placeholder = input.placeholder;
    if (input.rows != null) taAttrs.rows = input.rows;
    if (input.cols != null) taAttrs.cols = input.cols;
    return { tag: "textarea", text: input.value != null ? String(input.value) : undefined, attrs: taAttrs, handleEvent: getEvents(input) };
  }

  if (type === "button" || type === "submit" || type === "reset") {
    const btnAttrs: Record<string, string | number> = {
      type,
      id: input.id,
      name: input.name || input.id,
      class: `${type}-input${input.class ? ` ${input.class}` : ""}`,
    };
    if (input.value != null) btnAttrs.value = input.value;
    else if (input.placeholder) btnAttrs.value = input.placeholder;
    return { tag: "input", attrs: btnAttrs, handleEvent: getEvents(input) };
  }

  if (type === "checkbox") {
    const cbAttrs: Record<string, string | number | boolean> = {
      type: "checkbox",
      id: input.id,
      name: input.name || input.id,
    };
    if (input.value != null) cbAttrs.value = input.value;
    if (input.checked != null) cbAttrs.checked = input.checked;
    const children: CreateDOMElemOptions[] = [
      { tag: "input", attrs: cbAttrs },
    ];
    if (input.labelText) {
      children.push({ tag: "label", text: input.labelText, attrs: { for: input.id } });
    }
    return { tag: "div", attrs: { class: `checkbox-group${input.class ? ` ${input.class}` : ""}` }, children };
  }

  const defAttrs: Record<string, string | number> = {
    type,
    id: input.id,
    name: input.name || input.id,
    class: `${type}-input${input.class ? ` ${input.class}` : ""}`,
  };
  if (input.value != null) defAttrs.value = input.value;
  if (input.placeholder) defAttrs.placeholder = input.placeholder;
  if (input.min != null) defAttrs.min = input.min;
  if (input.max != null) defAttrs.max = input.max;
  if (input.step != null) defAttrs.step = input.step;
  return { tag: "input", attrs: defAttrs, handleEvent: getEvents(input) };
}

function getEvents(input: FormInputConfig): CreateDOMElemOptions["handleEvent"] {
  const events: { event: string; cb: (e: Event) => void }[] = [];
  if (input.onChange) events.push({ event: "change", cb: input.onChange });
  if (input.click) events.push({ event: "click", cb: input.click });
  if (input.handleEvent) {
    events.push(
      ...(Array.isArray(input.handleEvent) ? input.handleEvent : [input.handleEvent])
    );
  }
  return events.length > 0 ? events : undefined;
}

function wrapWithLabel(input: FormInputConfig, elem: CreateDOMElemOptions): CreateDOMElemOptions[] {
  if (!input.labelText) return [elem];
  const label: CreateDOMElemOptions = { tag: "label", text: input.labelText, attrs: { for: input.id } };
  return input.labelfirst !== false ? [label, elem] : [elem, label];
}

export function createForm(config: FormConfig): HTMLElement {
  const children: (CreateDOMElemOptions | HTMLElement)[] = [];
  for (const input of config.inputs) {
    children.push(...wrapWithLabel(input, createFormInput(input)));
  }

  const formAttrs: Record<string, string> = {};
  if (config.id) formAttrs.id = config.id;
  if (config.class) formAttrs.class = config.class;
  if (config.action) formAttrs.action = config.action;
  if (config.method) formAttrs.method = config.method;

  return createDOMElem({
    tag: "form",
    parent: config.parent,
    attrs: formAttrs,
    children,
    handleEvent: config.onSubmit
      ? [{ event: "submit", cb: (e) => { e.preventDefault(); config.onSubmit!(e); } }]
      : undefined,
  });
}
