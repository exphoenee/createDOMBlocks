import { createDOMElem } from "../dom";
import type { DOMOptions } from "../dom";
import type { CustomSelectParams, SelectOption } from "../types";
import { resolveText, watchLocale } from "../i18n";

/**
 * Custom legördülő egyéni stílussal.
 *
 * @category forms
 * @menu Custom select
 * @order 20
 * @summary Custom legördülő egyéni stílussal.
 */
export function createCustomSelect(params: CustomSelectParams): HTMLElement {
  let selectedValue: string | number | undefined = params.value;
  let isOpen = false;

  const rootAttrs: Record<string, string> = {
    class: `custom-select${params.class ? ` ${params.class}` : ""}`,
    "data-value": selectedValue != null ? String(selectedValue) : "",
  };
  if (params.id) rootAttrs.id = params.id;

  /** A trigger felirata: a kiválasztott opció szövege, különben a placeholder (az aktuális nyelven) */
  const triggerText = (): string => resolveText(params.options.find((o) => o.value === selectedValue)?.text ?? params.placeholder);
  const displayLabel = triggerText();

  const selectedAttrs: Record<string, string> = { class: "custom-select-trigger" };

  const optionsListAttrs: Record<string, string> = { class: "custom-select-options" };

  const optionElements: DOMOptions[] = params.options.map((opt: SelectOption) => {
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
          triggerSpan.textContent = triggerText();
          triggerSpan.classList.remove("placeholder");

          root.querySelectorAll(".custom-select-option").forEach((el) => {
            el.classList.remove("selected");
          });
          (optionElements.find((_, i) => params.options[i].value === opt.value)?.attrs as Record<string, string>)?.class?.includes("selected");

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

          params.onChange?.(opt.value);
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
    parent: params.parent,
    attrs: rootAttrs,
    children: [
      ...(params.labelText
        ? [{ tag: "label", text: params.labelText, attrs: { class: "custom-select-label", for: params.id } } as DOMOptions]
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
  // nyelvváltáskor a trigger felirata az aktuális kiválasztás szerint frissül
  watchLocale(root, () => {
    triggerSpan.textContent = triggerText();
    triggerSpan.classList.toggle("placeholder", !triggerSpan.textContent);
  });

  return root;
}
