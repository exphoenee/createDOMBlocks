import { createDOMElem } from "domelemjs";
import type { ButtonParams } from "../types";
import { toArray } from "../utils";

export function createButton(params: ButtonParams): HTMLElement {
  const handleEvent: { event: string; cb: (e: Event) => void }[] = [];
  if (params.click) handleEvent.push({ event: "click", cb: params.click });
  if (params.handleEvent) handleEvent.push(...toArray(params.handleEvent));

  const attrs: Record<string, string> = {
    class: `btn${params.class ? ` ${params.class}` : ""}`,
  };
  if (params.id) attrs.id = params.id;

  return createDOMElem({
    parent: params.parent,
    tag: "button",
    attrs,
    text: params.text,
    style: params.style,
    handleEvent: handleEvent.length > 0 ? handleEvent : undefined,
  });
}
