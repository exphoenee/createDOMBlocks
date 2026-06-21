import { createDOMElem } from "domelemjs";
import type { RadioParams } from "../types";

export function createRadio(params: RadioParams): HTMLElement {
  const radioOptions = params.options.map((option, index) => {
    const checked = typeof params.value === "string"
      ? option.text === params.value
      : typeof params.value === "number"
        ? params.value === index + 1
        : false;

    return createDOMElem({
      tag: "div",
      attrs: { class: "radio-option" },
      children: [
        createDOMElem({
          tag: "input",
          attrs: { type: "radio", id: `${params.id}-${option.value}`, name: params.name || params.id, value: option.value, checked },
        }),
        createDOMElem({
          tag: "label",
          text: option.text,
          attrs: { for: `${params.id}-${option.value}` },
        }),
      ],
    });
  });

  return createDOMElem({
    tag: "div",
    parent: params.parent,
    attrs: { class: `radio-group${params.class ? ` ${params.class}` : ""}` },
    children: radioOptions,
  });
}
