import { createDOMElem } from "domelemjs";

export function createPageLoading(): () => void {
  const overlay = createDOMElem({
    tag: "div",
    attrs: { class: "page-loading" },
    children: [
      {
        tag: "div",
        attrs: { class: "page-loading-spinner" },
      },
    ],
  });

  document.body.appendChild(overlay);

  return () => {
    overlay.classList.add("fade-out");
    overlay.addEventListener("transitionend", () => overlay.remove());
  };
}
