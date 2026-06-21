import { createDOMElem } from "domelemjs";
import type { LinkParams } from "../types";

export function createLink(config: LinkParams): HTMLElement {
  const rootAttrs: Record<string, string> = {
    class: `link${config.class ? ` ${config.class}` : ""}`,
    href: config.href,
  };
  if (config.id) rootAttrs.id = config.id;
  if (config.target) rootAttrs.target = config.target;

  return createDOMElem({
    tag: "a",
    parent: config.parent,
    text: config.text,
    attrs: rootAttrs,
    handleEvent: config.click ? { event: "click", cb: config.click } : undefined,
  });
}
