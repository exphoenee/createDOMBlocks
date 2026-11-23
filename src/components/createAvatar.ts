import { createDOMElem } from "../dom";
import type { DOMOptions } from "../dom";
import type { AvatarParams } from "../types";

export function createAvatar(params: AvatarParams): HTMLElement {
  const children: DOMOptions[] = [];

  if (params.src) {
    children.push({
      tag: "img",
      attrs: { src: params.src, alt: params.name || "Avatar", class: "avatar-image" },
    });
  } else if (params.name) {
    const initials = params.name
      .split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
    children.push({ tag: "span", text: initials, attrs: { class: "avatar-initials" } });
  }

  const rootAttrs: Record<string, string> = {
    class: `avatar avatar-${params.size || "md"} avatar-${params.shape || "circle"}${params.class ? ` ${params.class}` : ""}`,
  };
  if (params.id) rootAttrs.id = params.id;

  return createDOMElem({ tag: "div", parent: params.parent, attrs: rootAttrs, children });
}
