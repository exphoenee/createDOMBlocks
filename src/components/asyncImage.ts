import { createDOMElem } from "domelemjs";

export interface AsyncImageParams {
  parent?: HTMLElement | string;
  src: string;
  alt?: string;
  class?: string;
  lazy?: boolean;
}

export function asyncImage(params: AsyncImageParams): HTMLElement {
  const attrs: Record<string, string | boolean> = {
    src: params.src,
    alt: params.alt || "",
    class: `async-image${params.class ? ` ${params.class}` : ""}`,
  };
  if (params.lazy) attrs.loading = "lazy";

  return createDOMElem({
    tag: "img",
    parent: params.parent,
    attrs,
  });
}
