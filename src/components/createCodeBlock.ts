import { createDOMElem } from "domelemjs";
import type { CreateDOMElemOptions } from "domelemjs";
import type { CodeBlockParams } from "../types";
import { highlightCode } from "./highlighter";

export function createCodeBlock(params: CodeBlockParams): HTMLElement {
  const children: CreateDOMElemOptions[] = [];

  const copyable = params.copyable !== false;
  const hasLanguage = !!params.language;

  // Header row: language label + copy button
  if (hasLanguage || copyable) {
    const headerChildren: CreateDOMElemOptions[] = [];

    if (hasLanguage) {
      headerChildren.push({
        tag: "span",
        text: params.language!.toUpperCase(),
        attrs: { class: "code-language" },
      });
    }

    if (copyable) {
      headerChildren.push({
        tag: "button",
        attrs: {
          class: "code-copy-btn",
          type: "button",
          "data-code": params.code,
        },
        text: "Copy",
        handleEvent: {
          event: "click",
          cb: (e: Event) => {
            const btn = e.currentTarget as HTMLElement;
            const code = btn.getAttribute("data-code") || "";
            navigator.clipboard.writeText(code).then(() => {
              btn.textContent = "Copied!";
              setTimeout(() => {
                btn.textContent = "Copy";
              }, 2000);
            }).catch(() => {
              /* clipboard write failed — silently ignore */
            });
          },
        },
      });
    }

    children.push({
      tag: "div",
      attrs: { class: "code-header" },
      children: headerChildren,
    });
  }

  const highlighted = highlightCode(params.code, params.language);

  children.push({
    tag: "pre",
    attrs: { class: "code-pre" },
    children: [
      {
        tag: "code",
        content: highlighted,
        attrs: { class: `code-content${params.language ? ` language-${params.language}` : ""}` },
      },
    ],
  });

  const rootAttrs: Record<string, string> = {
    class: `code-block${params.class ? ` ${params.class}` : ""}`,
  };
  if (params.id) rootAttrs.id = params.id;

  const opts: CreateDOMElemOptions = {
    tag: "div",
    attrs: rootAttrs,
    children,
  };
  if (params.parent) opts.parent = params.parent;

  return createDOMElem(opts);
}
