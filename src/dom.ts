import { createDOMElem as baseCreateDOMElem } from "domelemjs";
import type { CreateDOMElemOptions } from "domelemjs";
import { isReactiveText, resolveText, watchLocale } from "./i18n";
import type { TextValue } from "./i18n";

/** Attribútum-érték: a szokásos típusok, vagy nyelvfüggő szöveg (pl. placeholder, aria-label, title) */
type AttrValue = string | number | boolean | Record<string, string> | Array<Record<string, string>> | TextValue | undefined;
export type DOMAttrs = Record<string, AttrValue> | Array<Record<string, AttrValue>>;

/**
 * A `createDOMElem` opciói, kibővítve nyelvesítéssel: a `text` és az attribútumok értéke lehet
 * `tr("kulcs")` vagy függvény is, ilyenkor az elem nyelvváltáskor magától frissül.
 */
export interface DOMOptions extends Omit<CreateDOMElemOptions, "text" | "attrs" | "children"> {
  text?: TextValue;
  attrs?: DOMAttrs;
  children?: Array<DOMOptions | HTMLElement>;
}

const TOKEN = "data-cdb-i18n";
let seq = 0;

interface Binding {
  text?: TextValue;
  attrs: Record<string, TextValue>;
}

/**
 * Szöveg beállítása úgy, hogy az elem gyerek-elemei (pl. egy gombban lévő ikon) megmaradjanak:
 * csak az első szövegcsomópont cserélődik.
 */
export function setElementText(el: Element, text: string): void {
  if (el.children.length === 0) {
    el.textContent = text;
    return;
  }
  const node = [...el.childNodes].find((n) => n.nodeType === 3);
  if (node) node.nodeValue = text;
  else el.insertBefore(document.createTextNode(text), el.firstChild);
}

function prepare(opts: DOMOptions, bindings: Map<string, Binding>): CreateDOMElemOptions {
  const out: Record<string, unknown> = { ...opts };
  let binding: Binding | undefined;

  if (opts.text !== undefined && typeof opts.text !== "string") {
    binding = { attrs: {} };
    binding.text = opts.text;
    out.text = resolveText(opts.text);
  }

  if (opts.attrs) {
    const list = Array.isArray(opts.attrs) ? opts.attrs : [opts.attrs];
    const resolved = list.map((rec) => {
      const r: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(rec)) {
        if (isReactiveText(v)) {
          binding ??= { attrs: {} };
          binding.attrs[k] = v;
          r[k] = resolveText(v);
        } else {
          r[k] = v;
        }
      }
      return r;
    });
    out.attrs = resolved;
  }

  if (opts.children) {
    out.children = opts.children.map((c) => (c instanceof HTMLElement ? c : prepare(c, bindings)));
  }

  if (binding) {
    const token = String(++seq);
    bindings.set(token, binding);
    out.attrs = [...((out.attrs as unknown[]) ?? []), { [TOKEN]: token }];
  }
  return out as unknown as CreateDOMElemOptions;
}

/**
 * `createDOMElem` nyelvesítéssel: a `text` és az attribútumok `tr()` hivatkozást vagy függvényt is
 * elfogadnak, ezeket az elem nyelvváltáskor automatikusan újraszámolja.
 */
export function createDOMElem(options: DOMOptions): HTMLElement {
  const bindings = new Map<string, Binding>();
  const root = baseCreateDOMElem(prepare(options, bindings));
  if (bindings.size === 0) return root;

  const tagged = [root, ...root.querySelectorAll<HTMLElement>(`[${TOKEN}]`)].filter((el) => el.hasAttribute(TOKEN));
  for (const el of tagged) {
    const binding = bindings.get(el.getAttribute(TOKEN) as string);
    el.removeAttribute(TOKEN);
    if (!binding) continue;
    const { text, attrs } = binding;
    // a closure csak a forrás-szövegeket tartja, az elemet paraméterként kapja (gyenge hivatkozás)
    watchLocale(el, (e) => {
      if (text !== undefined) setElementText(e, resolveText(text));
      for (const [name, source] of Object.entries(attrs)) e.setAttribute(name, resolveText(source));
    });
  }
  return root;
}
