import { createDOMElem } from "domelemjs";
import type { LinkParams } from "../types";

export function createLink(params: LinkParams): HTMLElement {
  const rootAttrs: Record<string, string> = {
    class: `link${params.class ? ` ${params.class}` : ""}`,
    href: params.href,
  };
  if (params.id) rootAttrs.id = params.id;
  if (params.target) rootAttrs.target = params.target;

  return createDOMElem({
    tag: "a",
    parent: params.parent,
    text: params.text,
    attrs: rootAttrs,
    handleEvent: params.click ? { event: "click", cb: params.click } : undefined,
  });
}
