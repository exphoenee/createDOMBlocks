import { buildUI } from "./build";
import type { BuildOptions, UI } from "./build";
import { SpecError } from "./errors";

/**
 * Oldal felépítése YAML-ból, egy lépésben.
 *
 * A `source` lehet:
 * - YAML szöveg,
 * - a leírást tartalmazó `<script type="text/yaml" id="...">` elem azonosítója `#id` alakban
 *   (ez `file://` alól is működik, ellentétben a `fetch`-csel),
 * - már beolvasott objektum.
 */
export function mountYaml(target: HTMLElement | string, source: string | Record<string, unknown>, options: Omit<BuildOptions, "parent"> = {}): UI {
  let spec: unknown = source;
  if (typeof source === "string" && /^#[\w-]+$/.test(source.trim())) {
    const el = document.getElementById(source.trim().slice(1));
    if (!el) throw new SpecError(`nem található a leírást tartalmazó elem: ${source}`);
    spec = el.textContent ?? "";
  }
  return buildUI(spec, { ...options, parent: target });
}
