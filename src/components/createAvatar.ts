import { createDOMElem } from "domelemjs";
import type { CreateDOMElemOptions } from "domelemjs";
import type { AvatarParams } from "../types";

export function createAvatar(config: AvatarParams): HTMLElement {
  const children: CreateDOMElemOptions[] = [];

  if (config.src) {
    children.push({
      tag: "img",
      attrs: { src: config.src, alt: config.name || "Avatar", class: "avatar-image" },
    });
  } else if (config.name) {
    const initials = config.name
      .split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
    children.push({ tag: "span", text: initials, attrs: { class: "avatar-initials" } });
  }

  const rootAttrs: Record<string, string> = {
    class: `avatar avatar-${config.size || "md"} avatar-${config.shape || "circle"}${config.class ? ` ${config.class}` : ""}`,
  };
  if (config.id) rootAttrs.id = config.id;

  return createDOMElem({ tag: "div", parent: config.parent, attrs: rootAttrs, children });
}
