import { createDOMElem } from "domelemjs";
import type { FormConfig, FormInputConfig } from "../types";
import { createTextInput } from "../inputs/createTextInput";
import { createTelInput } from "../inputs/createTelInput";
import { createUrlInput } from "../inputs/createUrlInput";
import { createSearchInput } from "../inputs/createSearchInput";
import { createEmailInput } from "../inputs/createEmailInput";
import { createPasswordInput } from "../inputs/createPasswordInput";
import { createNumberInput } from "../inputs/createNumberInput";
import { createDateInput } from "../inputs/createDateInput";
import { createDatetimeInput } from "../inputs/createDatetimeInput";
import { createTimeInput } from "../inputs/createTimeInput";
import { createMonthInput } from "../inputs/createMonthInput";
import { createWeekInput } from "../inputs/createWeekInput";
import { createCheckbox } from "../inputs/createCheckbox";
import { createColorInput } from "../inputs/createColorInput";
import { createFileInput } from "../inputs/createFileInput";
import { createRangeInput } from "../inputs/createRangeInput";
import { createHiddenInput } from "../inputs/createHiddenInput";
import { createButtonInput, createSubmitInput, createResetInput } from "../buttons";
import { createSelect } from "../selection/createSelect";
import { createRadio } from "../selection/createRadio";
import { createTextarea } from "./createTextarea";

type InputFactory = (parent: HTMLElement, input: FormInputConfig) => HTMLElement;

function cast<T>(input: FormInputConfig): T {
  return input as unknown as T;
}

function getInputFactory(type: string): InputFactory | null {
  const map: Record<string, InputFactory> = {
    text:       (p, i) => createTextInput({ ...cast(i), parent: p, type: "text" }),
    tel:        (p, i) => createTelInput({ ...cast(i), parent: p, type: "tel" }),
    url:        (p, i) => createUrlInput({ ...cast(i), parent: p, type: "url" }),
    search:     (p, i) => createSearchInput({ ...cast(i), parent: p, type: "search" }),
    email:      (p, i) => createEmailInput({ ...cast(i), parent: p, type: "email" }),
    password:   (p, i) => createPasswordInput({ ...cast(i), parent: p, type: "password" }),
    number:     (p, i) => createNumberInput({ ...cast(i), parent: p, type: "number" }),
    date:       (p, i) => createDateInput({ ...cast(i), parent: p, type: "date" }),
    "datetime-local": (p, i) => createDatetimeInput({ ...cast(i), parent: p, type: "datetime-local" }),
    time:       (p, i) => createTimeInput({ ...cast(i), parent: p, type: "time" }),
    month:      (p, i) => createMonthInput({ ...cast(i), parent: p, type: "month" }),
    week:       (p, i) => createWeekInput({ ...cast(i), parent: p, type: "week" }),
    checkbox:   (p, i) => createCheckbox({ ...cast(i), parent: p, type: "checkbox" }),
    color:      (p, i) => createColorInput({ ...cast(i), parent: p, type: "color" }),
    file:       (p, i) => createFileInput({ ...cast(i), parent: p, type: "file" }),
    range:      (p, i) => createRangeInput({ ...cast(i), parent: p, type: "range" }),
    hidden:     (p, i) => createHiddenInput({ ...cast(i), parent: p, type: "hidden" }),
    select:     (p, i) => createSelect({ ...cast(i), parent: p, options: i.options || [] }),
    radio:      (p, i) => createRadio({ ...cast(i), parent: p, options: (i.options || []) as any }),
    textarea:   (p, i) => createTextarea({ ...cast({ ...i, type: "textarea" as const }), parent: p }),
    button:     (p, i) => createButtonInput({ ...cast(i), parent: p, type: "button", text: String(i.value ?? i.placeholder ?? "") }),
    submit:     (p, i) => createSubmitInput({ ...cast(i), parent: p, type: "submit", text: String(i.value ?? i.placeholder ?? "Küldés") }),
    reset:      (p, i) => createResetInput({ ...cast(i), parent: p, type: "reset", text: String(i.value ?? i.placeholder ?? "Visszaállítás") }),
  };
  return map[type] || null;
}

export function createForm(params: FormConfig): HTMLElement {
  const formAttrs: Record<string, string> = {};
  if (params.id) formAttrs.id = params.id;
  if (params.class) formAttrs.class = params.class;
  if (params.action) formAttrs.action = params.action;
  if (params.method) formAttrs.method = params.method;

  const form = createDOMElem({
    tag: "form",
    parent: params.parent,
    attrs: formAttrs,
    handleEvent: params.onSubmit
      ? [{ event: "submit", cb: (e) => { e.preventDefault(); params.onSubmit!(e); } }]
      : undefined,
  });

  for (const input of params.inputs) {
    const factory = getInputFactory(input.type);
    if (factory) {
      factory(form, input);
    }
  }

  return form;
}
