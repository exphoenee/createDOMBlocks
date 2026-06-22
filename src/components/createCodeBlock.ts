import { createDOMElem } from "domelemjs";
import type { CreateDOMElemOptions } from "domelemjs";
import type { CodeBlockParams } from "../types";
import { highlightCode } from "./highlighter";

export function createCodeBlock(params: CodeBlockParams): HTMLElement {
  const children: CreateDOMElemOptions[] = [];

  if (params.language) {
    children.push({
      tag: "div",
      text: params.language.toUpperCase(),
      attrs: { class: "code-language" },
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
