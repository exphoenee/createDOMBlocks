import { createDOMElem } from "domelemjs";

export function asyncImage(): HTMLElement {
  return createDOMElem({
    tag: "img",
    attrs: { class: "async-image" },
  });
}
