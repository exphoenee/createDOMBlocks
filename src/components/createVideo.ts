import { createDOMElem } from "domelemjs";
import type { CreateDOMElemOptions } from "domelemjs";
import type { VideoParams, ImageState } from "../types";
import { createSpinner } from "./createSpinner";

type Node_ = HTMLElement | CreateDOMElemOptions;

function toElement(n: Node_): HTMLElement {
  return n instanceof HTMLElement ? n : createDOMElem({ ...n, append: false });
}

const EXT_TYPES: Record<string, string> = {
  mp4: "video/mp4",
  m4v: "video/mp4",
  webm: "video/webm",
  ogv: "video/ogg",
  ogg: "video/ogg",
  mov: "video/quicktime",
};

function guessType(src: string): string | undefined {
  const ext = src.split(/[?#]/)[0].split(".").pop()?.toLowerCase();
  return ext ? EXT_TYPES[ext] : undefined;
}

/**
 * Önállóan töltő videó (mp4, webm, ogg ...): betöltés alatt spinner (injektálható),
 * siker esetén a lejátszó, hiba esetén fallback újrapróbálás gombbal. Ugyanúgy viselkedik,
 * mint a `createImage`: a keret a megadott méretű már betöltés és hiba alatt is.
 * A figure `data-state` attribútuma (loading / loaded / error) stílushoz használható.
 */
export function createVideo(params: VideoParams): HTMLElement {
  const retries = params.retries ?? 0;
  const base = params.id || "video";
  const preload = params.preload ?? "metadata";
  const autoplay = params.autoplay ?? false;
  const muted = params.muted ?? autoplay; // az autoplay a böngészőkben némítást igényel

  const video = createDOMElem({
    tag: "video",
    append: false,
    attrs: {
      class: "image-element video-element",
      preload,
      ...(params.controls === false ? {} : { controls: "" }),
      ...(params.loop ? { loop: "" } : {}),
      ...(params.poster ? { poster: params.poster } : {}),
      ...(params.ariaLabel ? { "aria-label": params.ariaLabel } : {}),
      ...(params.width ? { width: String(params.width) } : {}),
      ...(params.height ? { height: String(params.height) } : {}),
    },
  }) as HTMLVideoElement;
  video.muted = muted;
  video.autoplay = autoplay;
  if (params.playsInline !== false) video.setAttribute("playsinline", "");

  const layer = createDOMElem({ tag: "div", append: false, attrs: { class: "image-layer" } });

  // A keret már betöltés / hiba alatt is akkora, mint amekkora a videó lesz (ha a méret ismert)
  const css = (v: number | string): string => (typeof v === "number" ? `${v}px` : v);
  const frameStyle: Record<string, string> = {};
  if (params.width) frameStyle.width = css(params.width);
  if (params.height) frameStyle.height = css(params.height);
  if (typeof params.width === "number" && typeof params.height === "number") {
    frameStyle.aspectRatio = `${params.width} / ${params.height}`;
    frameStyle.height = "auto";
  }
  const sized = !!params.width && !!params.height;
  const frame = createDOMElem({
    tag: "div",
    append: false,
    attrs: { class: "image-frame" },
    style: frameStyle,
    children: [video, layer],
  });

  const children: Array<CreateDOMElemOptions | HTMLElement> = [frame];
  if (params.caption) {
    children.push({ tag: "figcaption", text: params.caption, attrs: { class: "image-caption" } });
  }

  const rootAttrs: Record<string, string> = {
    class: `image-container video-container${sized ? " has-size" : ""}${params.class ? ` ${params.class}` : ""}`,
    "data-state": "loading",
  };
  if (params.id) rootAttrs.id = params.id;

  const root = createDOMElem({ tag: "figure", parent: params.parent, attrs: rootAttrs, children });

  const sources = (Array.isArray(params.src) ? params.src : [{ src: params.src, type: undefined as string | undefined }]).map((s) => ({
    src: s.src,
    type: s.type ?? guessType(s.src),
  }));
  const lastSrc = sources[sources.length - 1].src;

  let state: ImageState | "" = "";
  let token = 0;
  let cleanup: (() => void) | null = null;

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

  const retry = (): void => load();

  function fail(error: Error): void {
    cleanup?.();
    cleanup = null;
    setState("error");
    video.pause();
    video.textContent = "";
    video.removeAttribute("src");
    const fb = params.fallback;
    if (fb === undefined) {
      showLayer(
        createDOMElem({
          tag: "div",
          append: false,
          attrs: { class: "image-error", role: "alert" },
          children: [
            { tag: "span", text: params.errorText ?? "A videó nem tölthető be" },
            {
              tag: "button",
              text: params.retryText ?? "Újra",
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

  function attachSources(): void {
    video.pause();
    video.textContent = "";
    video.removeAttribute("src");
    if (sources.length === 1) {
      video.src = sources[0].src;
    } else {
      for (const s of sources) {
        const el = document.createElement("source");
        el.src = s.src;
        if (s.type) el.type = s.type;
        video.appendChild(el);
      }
    }
    video.load();
  }

  // Több <source> esetén csak az utolsó hibája végleges (előtte a böngésző a következőre lép)
  const isFinalError = (e: Event): boolean => {
    const t = e.target;
    return !(t instanceof HTMLSourceElement) || t === video.lastElementChild;
  };

  function load(attempt = 0): void {
    const mine = ++token;
    cleanup?.();

    if (attempt === 0) {
      setState("loading");
      showSpinner();
    }

    let timer: ReturnType<typeof setTimeout> | undefined;

    const detach = (): void => {
      if (timer) clearTimeout(timer);
      video.removeEventListener("loadedmetadata", onReady);
      video.removeEventListener("loadeddata", onReady);
      video.removeEventListener("error", onError, true);
    };
    const onLateError = (e: Event): void => {
      if (mine !== token || !isFinalError(e)) return;
      fail(new Error(`Failed to play video: ${lastSrc}`));
    };
    function onReady(): void {
      if (mine !== token) return;
      detach();
      showLayer(null);
      setState("loaded");
      params.onLoad?.(video);
      // betöltés utáni (pl. lejátszás közbeni) hiba is fallbackre vált
      video.addEventListener("error", onLateError, true);
      cleanup = () => video.removeEventListener("error", onLateError, true);
    }
    function onError(e: Event): void {
      if (mine !== token || !isFinalError(e)) return;
      detach();
      if (attempt < retries) return load(attempt + 1);
      fail(new Error(`Failed to load video: ${lastSrc}`));
    }

    video.addEventListener("loadedmetadata", onReady);
    video.addEventListener("loadeddata", onReady);
    video.addEventListener("error", onError, true);
    cleanup = detach;

    if (params.timeout) {
      timer = setTimeout(() => {
        if (mine !== token) return;
        detach();
        if (attempt < retries) return load(attempt + 1);
        fail(new Error(`Timed out loading video: ${sources[0].src}`));
      }, params.timeout);
    }

    attachSources();

    // preload="none": a böngésző nem tölt semmit lejátszásig, ezért azonnal készre jelentjük
    if (preload === "none") onReady();
  }

  if (params.lazy && typeof IntersectionObserver !== "undefined") {
    setState("loading");
    showSpinner();
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((en) => en.isIntersecting)) {
        observer.disconnect();
        load();
      }
    });
    observer.observe(root);
  } else {
    load();
  }

  return root;
}
