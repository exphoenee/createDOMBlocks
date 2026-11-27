import { createDOMElem } from "../dom";
import type { DOMOptions } from "../dom";
import type { ImageParams, ImageState } from "../types";
import { createSpinner } from "./createSpinner";
import { builtin } from "../i18n";

type Node_ = HTMLElement | DOMOptions;

function toElement(n: Node_): HTMLElement {
  return n instanceof HTMLElement ? n : createDOMElem({ ...n, append: false });
}

/**
 * Önállóan töltő kép: betöltés alatt spinner (injektálható), siker esetén a kép,
 * hiba esetén fallback újrapróbálás gombbal. A figure `data-state` attribútuma
 * (loading / loaded / error) stílushoz használható.
 *
 * @category content
 * @menu Image
 * @order 7
 * @summary Kép captionnal.
 */
export function createImage(params: ImageParams): HTMLElement {
  const strategy = params.strategy ?? "image";
  const retries = params.retries ?? 0;
  const base = params.id || "image";

  const img = createDOMElem({
    tag: "img",
    append: false,
    attrs: {
      class: "image-element",
      alt: params.alt || "",
      decoding: "async",
      ...(params.width ? { width: String(params.width) } : {}),
      ...(params.height ? { height: String(params.height) } : {}),
    },
  }) as HTMLImageElement;

  const layer = createDOMElem({ tag: "div", append: false, attrs: { class: "image-layer" } });
  // A keret már betöltés / hiba alatt is akkora, mint amekkora a kép lesz (ha a méret ismert)
  const css = (v: number | string): string => (typeof v === "number" ? `${v}px` : v);
  const frameStyle: Record<string, string> = {};
  if (params.width) frameStyle.width = css(params.width);
  if (params.height) frameStyle.height = css(params.height);
  if (typeof params.width === "number" && typeof params.height === "number") {
    // számmal megadott méretnél az arány megmarad, ha a konténer keskenyebb
    frameStyle.aspectRatio = `${params.width} / ${params.height}`;
    frameStyle.height = "auto";
  }
  const sized = !!params.width && !!params.height;
  const frame = createDOMElem({
    tag: "div",
    append: false,
    attrs: { class: "image-frame" },
    style: frameStyle,
    children: [img, layer],
  });

  const children: Array<DOMOptions | HTMLElement> = [frame];
  if (params.caption) {
    children.push({ tag: "figcaption", text: params.caption, attrs: { class: "image-caption" } });
  }

  const rootAttrs: Record<string, string> = {
    class: `image-container${sized ? " has-size" : ""}${params.class ? ` ${params.class}` : ""}`,
    "data-state": "loading",
  };
  if (params.id) rootAttrs.id = params.id;

  const root = createDOMElem({ tag: "figure", parent: params.parent, attrs: rootAttrs, children });

  let src = params.src;
  let state: ImageState | "" = "";
  let token = 0;
  let controller: AbortController | null = null;
  let blobUrl: string | null = null;

  const setState = (s: ImageState): void => {
    if (s === state) return;
    state = s;
    root.dataset.state = s;
    root.setAttribute("aria-busy", String(s === "loading"));
    params.onStateChange?.(s);
  };

  const showLayer = (el: HTMLElement | null): void => {
    layer.textContent = "";
    if (el) layer.appendChild(el);
  };

  const releaseBlob = (): void => {
    if (blobUrl) URL.revokeObjectURL(blobUrl);
    blobUrl = null;
  };

  const showSpinner = (): void => {
    const s = params.spinner;
    if (s === false) return showLayer(null);
    if (s === undefined) {
      layer.textContent = "";
      createSpinner({ parent: layer, id: `${base}-spinner`, size: "md" });
      return;
    }
    showLayer(toElement(typeof s === "function" ? s() : s));
  };

  const retry = (): void => void load();

  function fail(error: Error): void {
    setState("error");
    img.removeAttribute("src");
    const fb = params.fallback;
    if (fb === undefined) {
      showLayer(
        createDOMElem({
          tag: "div",
          append: false,
          attrs: { class: "image-error", role: "alert" },
          children: [
            { tag: "span", text: params.errorText ?? builtin("image.error", "A kép nem tölthető be") },
            {
              tag: "button",
              text: params.retryText ?? builtin("image.retry", "Újra"),
              attrs: { type: "button", class: "image-retry" },
              handleEvent: { event: "click", cb: retry },
            },
          ],
        })
      );
    } else {
      showLayer(toElement(typeof fb === "function" ? fb(error, retry) : fb));
    }
    params.onError?.(error);
  }

  function viaImage(url: string, signal: AbortSignal): Promise<string> {
    return new Promise((resolve, reject) => {
      const probe = new Image();
      const cleanup = (): void => {
        probe.onload = probe.onerror = null;
        signal.removeEventListener("abort", onAbort);
      };
      const onAbort = (): void => {
        cleanup();
        probe.src = "";
        reject(new DOMException("Aborted", "AbortError"));
      };
      signal.addEventListener("abort", onAbort);
      probe.onload = () => {
        cleanup();
        resolve(url);
      };
      probe.onerror = () => {
        cleanup();
        reject(new Error(`Failed to load image: ${url}`));
      };
      probe.src = url;
    });
  }

  async function viaFetch(url: string, signal: AbortSignal): Promise<string> {
    const response = await fetch(url, { ...params.fetchInit, signal });
    if (!response.ok) throw new Error(`HTTP ${response.status} for ${url}`);
    const blob = await response.blob();
    if (blob.type && !blob.type.startsWith("image/")) throw new Error(`Not an image (${blob.type}): ${url}`);
    releaseBlob();
    blobUrl = URL.createObjectURL(blob);
    return blobUrl;
  }

  async function load(attempt = 0): Promise<void> {
    const mine = ++token;
    controller?.abort();
    controller = new AbortController();
    const { signal } = controller;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let timedOut = false;
    if (params.timeout) {
      timer = setTimeout(() => {
        timedOut = true;
        controller?.abort();
      }, params.timeout);
    }

    if (attempt === 0) {
      setState("loading");
      showSpinner();
    }

    try {
      const shown = await (strategy === "fetch" ? viaFetch(src, signal) : viaImage(src, signal));
      if (mine !== token) return;
      img.src = shown;
      showLayer(null);
      setState("loaded");
      params.onLoad?.(img);
    } catch (e) {
      if (mine !== token) return;
      const error = timedOut
        ? new Error(`Timed out loading image: ${src}`)
        : e instanceof Error
          ? e
          : new Error(String(e));
      if (attempt < retries) return load(attempt + 1);
      fail(error);
    } finally {
      if (timer) clearTimeout(timer);
    }
  }

  if (params.lazy && typeof IntersectionObserver !== "undefined") {
    setState("loading");
    showSpinner();
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((en) => en.isIntersecting)) {
        observer.disconnect();
        void load();
      }
    });
    observer.observe(root);
  } else {
    void load();
  }

  return root;
}
