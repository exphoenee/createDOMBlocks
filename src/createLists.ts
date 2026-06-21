import { createDOMElem } from "domelemjs";
import type { ListParams } from "./types";

export function createUnorderedList(data: string[], params: ListParams): HTMLElement {
  const attrs: Record<string, string> = {
    class: `unsorted-list${params.class ? ` ${params.class}` : ""}`,
  };
  if (params.id) attrs.id = params.id;

  return createDOMElem({
    parent: params.parent,
    tag: "ul",
    attrs,
    children: data.map((item, index) => ({
      tag: "li",
      text: item,
      attrs: { id: `${params.id}-${index}`, class: "list-elem" },
    })),
  });
}

export function createOrderedList(data: string[], params: ListParams): HTMLElement {
  const attrs: Record<string, string | number> = {
    class: `ordered-list${params.class ? ` ${params.class}` : ""}`,
  };
  if (params.id) attrs.id = params.id;
  if (params.start != null) attrs.start = params.start;

  return createDOMElem({
    parent: params.parent,
    tag: "ol",
    attrs,
    children: data.map((item, index) => ({
      tag: "li",
      text: item,
      attrs: { id: `${params.id}-${index}`, class: "list-elem" },
    })),
  });
}
