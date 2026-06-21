import { createDOMElem } from "domelemjs";
import type { CreateDOMElemOptions } from "domelemjs";
import type { CodeBlockParams } from "../types";

export function createCodeBlock(config: CodeBlockParams): HTMLElement {
  const children: CreateDOMElemOptions[] = [];

  if (config.language) {
    children.push({ tag: "div", text: config.language, attrs: { class: "code-language" } });
  }

  children.push({
    tag: "pre",
    attrs: { class: "code-pre" },
    children: [
      {
        tag: "code",
        text: config.code,
        attrs: { class: `code-content${config.language ? ` language-${config.language}` : ""}` },
      },
    ],
  });

  const rootAttrs: Record<string, string> = { class: `code-block${config.class ? ` ${config.class}` : ""}` };
  if (config.id) rootAttrs.id = config.id;

  return createDOMElem({ tag: "div", parent: config.parent, attrs: rootAttrs, children });
}
