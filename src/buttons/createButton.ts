import { createDOMElem } from "domelemjs";
import type { ButtonParams } from "../types";
import { toArray } from "../utils";

const TICK_MS = 100;

/**
 * Letiltja a gombot `ms` ideig, a jobb felső sarokban visszaszámláló badge-dzsel.
 * Lejáratkor `onDone` hívódik.
 */
function startCountdown(button: HTMLButtonElement, ms: number, onDone?: () => void): void {
  const badge = createDOMElem({ tag: "span", attrs: { class: "btn-countdown-badge", "aria-hidden": "true" } }) as HTMLElement;
  const end = Date.now() + ms;
  const render = () => { badge.textContent = (Math.max(0, end - Date.now()) / 1000).toFixed(1); };

  button.disabled = true;
  button.classList.add("is-counting");
  button.appendChild(badge);
  render();

  const timer = setInterval(() => {
    if (Date.now() < end) { render(); return; }
    clearInterval(timer);
    badge.remove();
    button.classList.remove("is-counting");
    button.disabled = false;
    onDone?.();
  }, TICK_MS);
}

export function createButton(params: ButtonParams): HTMLElement {
  const handleEvent: { event: string; cb: (e: Event) => void }[] = [];

  if (params.click) {
    const click = params.click;
    if (params.throttle && params.throttle > 0) {
      const ms = params.throttle;
      handleEvent.push({
        event: "click",
        cb: (e) => {
          click(e);
          startCountdown(e.currentTarget as HTMLButtonElement, ms);
        },
      });
    } else if (params.debounce && params.debounce > 0) {
      const ms = params.debounce;
      handleEvent.push({
        event: "click",
        cb: (e) => {
          startCountdown(e.currentTarget as HTMLButtonElement, ms, () => click(e));
        },
      });
    } else {
      handleEvent.push({ event: "click", cb: click });
    }
  }
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
