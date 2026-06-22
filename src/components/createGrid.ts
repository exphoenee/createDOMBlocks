import { createDOMElem } from "domelemjs";
import type { CreateDOMElemOptions } from "domelemjs";
import type { GridParams } from "../types";

export function createGrid(params: GridParams): HTMLElement {
  const style: Record<string, string> = { display: "grid", gap: params.gap || "1rem" };
  if (params.columns) style.gridTemplateColumns = `repeat(${params.columns}, 1fr)`;

  const attrs: Record<string, string> = { class: `grid${params.class ? ` ${params.class}` : ""}` };
  if (params.id) attrs.id = params.id;

  return createDOMElem({ tag: "div", parent: params.parent, attrs, style });
}
