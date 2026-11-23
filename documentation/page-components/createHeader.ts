import { createDOMElem } from "domelemjs";
import { getTheme, setTheme, onThemeChange } from "./theme";
import type { Theme } from "./theme";

const SUN =
  '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>';
const MOON =
  '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';

export interface HeaderParams {
  title?: string;
  onMenuClick?: () => void;
}

export function createHeader(params: HeaderParams = {}): HTMLElement {
  const header = createDOMElem({
    tag: "header",
    attrs: { class: "site-header" },
    children: [
      {
        tag: "div",
        attrs: { class: "header-inner" },
        children: [
          {
            tag: "div",
            attrs: { class: "header-left" },
            children: [
              {
                tag: "button",
                text: "\u2630",
                attrs: { class: "header-menu-btn", "aria-label": "Menu" },
                handleEvent: params.onMenuClick
                  ? { event: "click", cb: params.onMenuClick }
                  : undefined,
              },
              {
                tag: "a",
                text: params.title || "createDOMBlocks",
                attrs: { href: "index.html", class: "header-logo" },
              },
            ],
          },
          {
            tag: "div",
            attrs: { class: "header-right" },
            children: [
              {
                tag: "a",
                text: "GitHub",
                attrs: {
                  href: "https://github.com/exphoenee/createDOMBlocks",
                  target: "_blank",
                  class: "header-link",
                },
              },
              {
                tag: "a",
                text: "v2.1.0",
                attrs: { class: "header-version" },
              },
              {
                tag: "button",
                attrs: { class: "header-theme-btn", type: "button", id: "theme-toggle" },
                handleEvent: {
                  event: "click",
                  cb: () => setTheme(getTheme() === "dark" ? "light" : "dark"),
                },
              },
            ],
          },
        ],
      },
    ],
  });

  document.body.insertBefore(header, document.body.firstChild);

  // A gomb mindig a "másik" módot ajánlja: sötétben a nap, világosban a hold ikon látszik.
  const btn = header.querySelector("#theme-toggle") as HTMLButtonElement;
  const render = (theme: Theme): void => {
    const dark = theme === "dark";
    btn.innerHTML = dark ? SUN : MOON;
    btn.setAttribute("aria-label", dark ? "Váltás világos módra" : "Váltás sötét módra");
    btn.setAttribute("title", dark ? "Világos mód" : "Sötét mód");
    btn.setAttribute("aria-pressed", String(dark));
  };
  render(getTheme());
  onThemeChange(render);
  return header;
}
