import { createDOMElem } from "domelemjs";

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
            ],
          },
        ],
      },
    ],
  });

  document.body.insertBefore(header, document.body.firstChild);
  return header;
}
