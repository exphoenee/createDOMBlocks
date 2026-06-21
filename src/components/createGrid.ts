import { createDOMElem } from "domelemjs";
import type { CreateDOMElemOptions } from "domelemjs";
import type { GridParams } from "../types";

export function createGrid(config: GridParams): HTMLElement {
  const style: Record<string, string> = { display: "grid", gap: config.gap || "1rem" };
  if (config.columns) style.gridTemplateColumns = `repeat(${config.columns}, 1fr)`;

  const attrs: Record<string, string> = { class: `grid${config.class ? ` ${config.class}` : ""}` };
  if (config.id) attrs.id = config.id;

  return createDOMElem({ tag: "div", parent: config.parent, attrs, style });
}
