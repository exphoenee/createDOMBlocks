import { createDOMElem } from "../dom";
import type { TextValue } from "../i18n";
import type { SegmentedControlParams, SegmentedControlElement, SegmentedOption } from "../types";

/**
 * Gombcsoport egy érték kiválasztására (nézetváltó: rács / carousel, részletes / tömör, szűrő).
 * `radio` módban rádiócsoport (roving tabindex, nyilak, Home / End), `toggle` módban `aria-pressed` gombok.
 * A gombokban a kiválasztott érték egy rejtett `input` mezőben is megvan, így a YAML `bind` is működik.
 *
 * @category buttons
 * @menu SegmentedControl
 * @order 5
 * @summary Gombcsoport egy érték kiválasztására (nézetváltó, szűrő).
 */
export function createSegmentedControl(params: SegmentedControlParams): SegmentedControlElement {
  const radio = (params.mode ?? "radio") === "radio";
  const rootAttrs: Record<string, TextValue> = {
    class: `segmented${params.size === "sm" ? " segmented-sm" : ""}${params.class ? ` ${params.class}` : ""}`,
    role: radio ? "radiogroup" : "group",
  };
  if (params.id) rootAttrs.id = params.id;
  if (params.ariaLabel) rootAttrs["aria-label"] = params.ariaLabel;
  const root = createDOMElem({ tag: "div", parent: params.parent, attrs: rootAttrs });

  // a kiválasztott érték egy rejtett mezőben is (a YAML bind és az űrlapok ebből olvasnak)
  const field = createDOMElem({ tag: "input", parent: root, attrs: { type: "hidden", name: params.name ?? params.id ?? "segmented" } }) as HTMLInputElement;

  let value = params.options.some((o) => o.value === params.value) ? (params.value as string) : (params.options[0]?.value ?? "");
  let buttons: HTMLButtonElement[] = [];

  const buildButton = (option: SegmentedOption): HTMLButtonElement => {
    const btn = createDOMElem({
      tag: "button",
      parent: root,
      attrs: { type: "button", class: "segmented-btn", "data-value": option.value },
    }) as HTMLButtonElement;
    if (option.icon) btn.appendChild(createDOMElem({ tag: "span", attrs: { class: "segmented-icon", "aria-hidden": "true" }, content: option.icon }));
    const label = createDOMElem({ tag: "span", parent: btn, attrs: { class: option.iconOnly ? "segmented-label sr-only" : "segmented-label" }, text: option.label });
    if (option.iconOnly) btn.setAttribute("title", label.textContent ?? "");
    if (option.disabled) btn.disabled = true;
    btn.addEventListener("click", () => select(option.value, true, false));
    return btn;
  };

  const sync = (): void => {
    field.value = value;
    for (const btn of buttons) {
      const on = btn.dataset.value === value;
      btn.classList.toggle("active", on);
      if (radio) {
        btn.setAttribute("role", "radio");
        btn.setAttribute("aria-checked", String(on));
        btn.tabIndex = on ? 0 : -1;
      } else {
        btn.setAttribute("aria-pressed", String(on));
      }
    }
  };

  function select(next: string, user: boolean, focus: boolean): void {
    const btn = buttons.find((b) => b.dataset.value === next);
    if (!btn || btn.disabled) return;
    if (focus) btn.focus();
    if (next === value) return;
    value = next;
    sync();
    if (user) {
      field.dispatchEvent(new Event("input", { bubbles: true }));
      field.dispatchEvent(new Event("change", { bubbles: true }));
      params.onChange?.(next);
    }
  }

  // rádió módban a nyilak a következő / előző (nem tiltott) gombra lépnek és ki is választják
  root.addEventListener("keydown", (e: KeyboardEvent) => {
    if (!radio) return;
    const enabled = buttons.filter((b) => !b.disabled);
    const i = enabled.findIndex((b) => b.dataset.value === value);
    let target: HTMLButtonElement | undefined;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") target = enabled[(i + 1) % enabled.length];
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") target = enabled[(i - 1 + enabled.length) % enabled.length];
    else if (e.key === "Home") target = enabled[0];
    else if (e.key === "End") target = enabled[enabled.length - 1];
    else return;
    e.preventDefault();
    if (target) select(target.dataset.value as string, true, true);
  });

  // a rejtett mező értékének külső írása (YAML bind, űrlap-visszaállítás) is kiválaszt
  const native = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value");
  if (native?.get && native.set) {
    Object.defineProperty(field, "value", {
      configurable: true,
      get: () => native.get!.call(field),
      set: (v: string) => {
        native.set!.call(field, v);
        if (String(v) !== value) select(String(v), false, false);
      },
    });
  }

  buttons = params.options.map(buildButton);
  sync();

  return Object.assign(root, {
    getValue: (): string => value,
    setValue(next: string): void {
      select(next, false, false);
    },
    setOptions(options: SegmentedOption[]): void {
      buttons.forEach((b) => b.remove());
      buttons = options.map(buildButton);
      if (!options.some((o) => o.value === value)) value = options[0]?.value ?? "";
      sync();
    },
  });
}
