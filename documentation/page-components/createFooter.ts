import { createLocalizedElem as createDOMElem } from "../../src/index";
import { tr } from "./i18n";

export interface FooterParams {
  copyright?: string;
}

export function createFooter(params: FooterParams = {}): HTMLElement {
  const year = new Date().getFullYear();
  const copyright = params.copyright || `\u00A9 2022\u2013${year} Viktor Bozzay. MIT License.`;

  const footer = createDOMElem({
    tag: "footer",
    attrs: { class: "site-footer" },
    children: [
      {
        tag: "div",
        attrs: { class: "footer-inner" },
        children: [
          {
            tag: "div",
            attrs: { class: "footer-left" },
            children: [
              {
                tag: "span",
                text: copyright,
                attrs: { class: "footer-copyright" },
              },
            ],
          },
          {
            tag: "div",
            attrs: { class: "footer-right" },
            children: [
              {
                tag: "a",
                text: tr("Ismerd meg a készítőt \u2192"),
                attrs: {
                  href: "https://viktor.bozzay.online",
                  target: "_blank",
                  class: "footer-creator-btn",
                },
              },
            ],
          },
        ],
      },
    ],
  });

  const portals = document.querySelectorAll(
    ".drawer-overlay, .drawer-sidebar, .modal-portal"
  );
  const lastPortal = portals.length > 0 ? portals[portals.length - 1] : null;

  if (lastPortal) {
    document.body.insertBefore(footer, lastPortal);
  } else {
    document.body.appendChild(footer);
  }

  return footer;
}
