import { createDOMElem } from "../dom";

export interface AsyncImageParams {
  /** Szülő elem (elem vagy azonosító) */
  parent?: HTMLElement | string;
  /** A kép URL-je */
  src: string;
  /** Alternatív szöveg */
  alt?: string;
  /** CSS osztály */
  class?: string;
  /** Lusta betöltés (`loading="lazy"`) */
  lazy?: boolean;
}

/**
 * Aszinkron betöltődő kép; új kódban a `createImage` az ajánlott.
 *
 * @group utils
 */
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
