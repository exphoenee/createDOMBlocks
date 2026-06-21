import { createDOMElem } from "domelemjs";
import type { CreateDOMElemOptions } from "domelemjs";
import type { CodeBlockParams } from "../types";
import { highlightCode } from "./highlighter";

export function createCodeBlock(config: CodeBlockParams): HTMLElement {
  const children: CreateDOMElemOptions[] = [];

  if (config.language) {
    children.push({
      tag: "div",
      text: config.language.toUpperCase(),
      attrs: { class: "code-language" },
    });
  }

  const highlighted = highlightCode(config.code, config.language);

  children.push({
    tag: "pre",
    attrs: { class: "code-pre" },
    children: [
      {
        tag: "code",
        content: highlighted,
        attrs: { class: `code-content${config.language ? ` language-${config.language}` : ""}` },
      },
    ],
  });

  const rootAttrs: Record<string, string> = {
    class: `code-block${config.class ? ` ${config.class}` : ""}`,
  };
  if (config.id) rootAttrs.id = config.id;

  const opts: CreateDOMElemOptions = {
    tag: "div",
    attrs: rootAttrs,
    children,
  };
  if (config.parent) opts.parent = config.parent;

  return createDOMElem(opts);
}
