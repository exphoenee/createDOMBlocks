import { createDOMElem } from "domelemjs";
import type { CreateDOMElemOptions } from "domelemjs";
import type { SelectOption } from "../types";

export interface CustomSelectParams {
  parent: HTMLElement | string;
  id: string;
  class?: string;
  name?: string;
  value?: string | number;
  labelText?: string;
  placeholder?: string;
  options: SelectOption[];
  onChange?: (value: string | number) => void;
}

export function createCustomSelect(config: CustomSelectParams): HTMLElement {
  let selectedValue: string | number | undefined = config.value;
  let isOpen = false;

  const rootAttrs: Record<string, string> = {
    class: `custom-select${config.class ? ` ${config.class}` : ""}`,
    "data-value": selectedValue != null ? String(selectedValue) : "",
  };
  if (config.id) rootAttrs.id = config.id;

  const displayLabel = config.options.find((o) => o.value === selectedValue)?.text || config.placeholder || "";

  const selectedAttrs: Record<string, string> = { class: "custom-select-trigger" };

  const optionsListAttrs: Record<string, string> = { class: "custom-select-options" };

  const optionElements: CreateDOMElemOptions[] = config.options.map((opt: SelectOption) => {
    const optAttrs: Record<string, string> = {
      class: `custom-select-option${opt.value === selectedValue ? " selected" : ""}`,
      "data-value": String(opt.value),
    };
    return {
      tag: "div",
      text: opt.text,
      attrs: optAttrs,
      handleEvent: {
        event: "click",
        cb: () => {
          selectedValue = opt.value;
          root.setAttribute("data-value", String(opt.value));
          triggerSpan.textContent = opt.text;
          triggerSpan.classList.remove("placeholder");

          root.querySelectorAll(".custom-select-option").forEach((el) => {
            el.classList.remove("selected");
          });
          (optionElements.find((_, i) => config.options[i].value === opt.value)?.attrs as Record<string, string>)?.class?.includes("selected");

          const allOpts = root.querySelectorAll(".custom-select-option");
          allOpts.forEach((el) => {
            if (el.getAttribute("data-value") === String(opt.value)) {
              el.classList.add("selected");
            } else {
              el.classList.remove("selected");
            }
          });

          isOpen = false;
          root.classList.remove("open");
          optionsList.style.display = "none";

          config.onChange?.(opt.value);
        },
      },
    };
  });

  const triggerSpan = createDOMElem({
    tag: "span",
    text: displayLabel,
    attrs: { class: `custom-select-trigger${!displayLabel ? " placeholder" : ""}` },
  });

  const optionsList = createDOMElem({
    tag: "div",
    attrs: optionsListAttrs,
    children: optionElements,
    style: { display: "none" },
  });

  const root = createDOMElem({
    tag: "div",
    parent: config.parent,
    attrs: rootAttrs,
    children: [
      ...(config.labelText
        ? [{ tag: "label", text: config.labelText, attrs: { class: "custom-select-label", for: config.id } } as CreateDOMElemOptions]
        : []),
      {
        tag: "div",
        attrs: { class: "custom-select-trigger-wrapper" },
        children: [triggerSpan, { tag: "span", text: "\u25BC", attrs: { class: "custom-select-arrow" } }],
        handleEvent: {
          event: "click",
          cb: () => {
            isOpen = !isOpen;
            root.classList.toggle("open", isOpen);
            optionsList.style.display = isOpen ? "block" : "none";
          },
        },
      },
      optionsList,
    ],
  });

  const closeHandler = (e: MouseEvent) => {
    if (!root.contains(e.target as Node)) {
      isOpen = false;
      root.classList.remove("open");
      optionsList.style.display = "none";
    }
  };
  document.addEventListener("click", closeHandler);

  return root;
}
