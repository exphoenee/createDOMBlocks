/**
 * Example DSL — Single Source of Truth for documented code examples.
 *
 * Usage:
 *   example(
 *     { title: "createButtonInput", description: "…" },
 *     (parent) => createButtonInput({ parent, id: "btnInput", text: "Button input" }),
 *   )
 *
 * A custom webpack loader (scripts/example-loader.mjs) extracts the arrow
 * function body at build time and injects the `code` field automatically.
 * If the loader hasn't run (e.g. fallback), the `code` stays empty – a
 * minimal `toString()` fallback is applied in that case so the page doesn't
 * break.
 */

export interface ExampleMeta {
  title: string;
  description: string;
  /** Build-time injected by the webpack loader */
  code?: string;
  /** Build-time injected by the webpack loader */
  codeLang?: string;
}

export interface DocSection extends ExampleMeta {
  code: string;
  render: (container: HTMLElement) => void;
}

let exampleFallbackWarned = false;

/**
 * Creates a DocSection from metadata and a render function.
 *
 * At build time the loader injects the raw TypeScript source of the
 * render body into the meta object as `code`.  At runtime this function
 * simply spreads meta and attaches the render.
 *
 * Fallback: if `code` is empty (loader didn't run), use `render.toString()`
 * stripped of the parameter prefix as a best-effort display string.
 */
export function example(
  meta: ExampleMeta,
  renderFn: (parent: HTMLElement) => void,
): DocSection {
  // The loader injects code + codeLang onto meta via object spread.
  // If it didn't, fall back to toString() (Opcio C in the plan).
  const metaAny = meta as unknown as Record<string, unknown>;
  let code = typeof metaAny.code === "string" ? metaAny.code : "";

  if (!code && !exampleFallbackWarned) {
    console.warn(
      "[example] code field is empty – the webpack loader may not have run. " +
      "Falling back to render.toString().",
    );
    exampleFallbackWarned = true;
  }

  if (!code) {
    // Fallback: strip the arrow prefix "(parent) => " or "(c) => "
    const fnStr = renderFn.toString().replace(/^\s*(?:parent|c)\s*=>\s*/, "").trim();
    code = fnStr;
  }

  return {
    ...meta,
    code,
    codeLang: meta.codeLang ?? metaAny.codeLang as string | undefined,
    render: renderFn,
  } as DocSection;
}
