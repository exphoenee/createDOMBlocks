import { createDOMElem } from "../dom";
import { builtin, getLocale, onLocaleChange, setLocale, t, watchLocale } from "../i18n";
import type { TextValue } from "../i18n";
import type { LocaleSwitcherParams, LocaleSwitcherElement, LocaleOption } from "../types";

/**
 * Nyelvváltó: gombsor, legördülő menü, vagy `auto` módban keskeny képernyőn legördülő, szélesen gombsor.
 * Váltáskor a könyvtár `setLocale`-jét hívja (minden `tr()` / YAML `t:` szöveg frissül), majd az `onChange`-et
 * (az alkalmazás saját teendőihez: URL `?lang=`, mentés, `<html lang>`, meta-adatok). Ha a nyelvet máshol
 * váltják, a kijelölés követi.
 *
 * @category navigation
 * @menu LocaleSwitcher
 * @order 6
 * @summary Nyelvváltó gombsor vagy legördülő menü, a könyvtár nyelvesítéséhez kötve.
 */
export function createLocaleSwitcher(params: LocaleSwitcherParams): LocaleSwitcherElement {
  const mode = params.mode ?? "auto";
  const breakpoint = params.breakpoint ?? 768;
  const updateLibrary = params.updateLibrary !== false;
  const base = params.id || "locale-switcher";
  let locales: LocaleOption[] = params.locales;

  const initialValue = (): string => {
    const wanted = params.value ?? getLocale();
    return locales.some((l) => l.code === wanted) ? wanted : (locales[0]?.code ?? "");
  };
  let value = initialValue();

  const rootAttrs: Record<string, TextValue> = {
    class: `locale-switcher${params.menuAlign === "end" ? " is-align-end" : ""}${params.class ? ` ${params.class}` : ""}`,
    role: "group",
    "aria-label": params.ariaLabel ?? builtin("locale.label", "Nyelv"),
  };
  if (params.id) rootAttrs.id = params.id;
  const root = createDOMElem({ tag: "div", parent: params.parent, attrs: rootAttrs });

  const trigger = createDOMElem({
    tag: "button",
    parent: root,
    attrs: { type: "button", class: "locale-switcher-trigger", "aria-haspopup": "true", "aria-expanded": "false", "aria-controls": `${base}-list` },
  }) as HTMLButtonElement;
  const triggerCode = createDOMElem({ tag: "span", parent: trigger, attrs: { class: "locale-switcher-code" } });
  createDOMElem({ tag: "span", parent: trigger, attrs: { class: "locale-switcher-caret", "aria-hidden": "true" }, text: "▾" });
  const list = createDOMElem({ tag: "div", parent: root, attrs: { class: "locale-switcher-list", id: `${base}-list` } });
  let options: HTMLButtonElement[] = [];

  const shortOf = (l: LocaleOption): string => l.short ?? l.code.toUpperCase();

  const buildOptions = (): void => {
    list.replaceChildren();
    options = locales.map((l) => {
      const btn = createDOMElem({
        tag: "button",
        parent: list,
        attrs: { type: "button", class: "locale-switcher-option", "data-locale": l.code, lang: l.code, title: l.label, "aria-label": l.label },
      }) as HTMLButtonElement;
      if (l.icon) createDOMElem({ tag: "span", parent: btn, attrs: { class: "locale-switcher-icon", "aria-hidden": "true" }, content: l.icon });
      createDOMElem({ tag: "span", parent: btn, attrs: { class: "locale-switcher-code" }, text: shortOf(l) });
      createDOMElem({ tag: "span", parent: btn, attrs: { class: "locale-switcher-name" }, text: l.label });
      btn.addEventListener("click", () => {
        choose(l.code, true);
        if (isDropdown()) close(true);
      });
      return btn;
    });
  };

  const isDropdown = (): boolean => root.classList.contains("is-dropdown");
  const isOpen = (): boolean => root.classList.contains("is-open");

  const sync = (): void => {
    const current = locales.find((l) => l.code === value);
    triggerCode.textContent = current ? shortOf(current) : "";
    const label = t("cdb.locale.current", { name: current?.label ?? value }, "Nyelv: {name}");
    trigger.setAttribute("aria-label", label);
    trigger.title = label;
    options.forEach((btn) => {
      const on = btn.dataset.locale === value;
      btn.classList.toggle("active", on);
      btn.setAttribute("aria-pressed", String(on));
    });
  };

  function choose(code: string, user: boolean): void {
    if (!locales.some((l) => l.code === code)) return;
    const changed = code !== value;
    value = code;
    sync();
    if (!user || !changed) return;
    if (updateLibrary && getLocale() !== code) setLocale(code);
    params.onChange?.(code);
  }

  const open = (): void => {
    if (!isDropdown() || isOpen()) return;
    root.classList.add("is-open");
    trigger.setAttribute("aria-expanded", "true");
    (options.find((b) => b.dataset.locale === value) ?? options[0])?.focus();
  };
  function close(focusTrigger: boolean): void {
    if (!isOpen()) return;
    root.classList.remove("is-open");
    trigger.setAttribute("aria-expanded", "false");
    if (focusTrigger) trigger.focus();
  }

  trigger.addEventListener("click", () => (isOpen() ? close(false) : open()));
  trigger.addEventListener("keydown", (e: KeyboardEvent) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      open();
    }
  });
  list.addEventListener("keydown", (e: KeyboardEvent) => {
    const i = options.indexOf(document.activeElement as HTMLButtonElement);
    let next: HTMLButtonElement | undefined;
    if (e.key === "Escape" && isDropdown()) {
      e.preventDefault();
      close(true);
      return;
    }
    const horizontal = !isDropdown();
    if (e.key === (horizontal ? "ArrowRight" : "ArrowDown")) next = options[(i + 1) % options.length];
    else if (e.key === (horizontal ? "ArrowLeft" : "ArrowUp")) next = options[(i - 1 + options.length) % options.length];
    else if (e.key === "Home") next = options[0];
    else if (e.key === "End") next = options[options.length - 1];
    else if (e.key === "Tab" && isDropdown()) close(false);
    if (next) {
      e.preventDefault();
      next.focus();
    }
  });
  const onOutside = (e: Event): void => {
    if (!root.isConnected) {
      document.removeEventListener("click", onOutside);
      return;
    }
    if (isOpen() && !root.contains(e.target as Node)) close(false);
  };
  document.addEventListener("click", onOutside);

  // alak: gombsor vagy legördülő (auto: a töréspont szerint, átméretezéskor is)
  const applyMode = (): void => {
    let dropdown = mode === "dropdown";
    if (mode === "auto") {
      try {
        dropdown = typeof window.matchMedia === "function" && window.matchMedia(`(max-width: ${breakpoint}px)`).matches;
      } catch {
        dropdown = false;
      }
    }
    if (!dropdown) close(false);
    root.classList.toggle("is-dropdown", dropdown);
    root.classList.toggle("is-buttons", !dropdown);
  };
  if (mode === "auto" && typeof window.matchMedia === "function") {
    try {
      window.matchMedia(`(max-width: ${breakpoint}px)`).addEventListener?.("change", applyMode);
    } catch {
      /* régi böngésző: marad a kezdeti alak */
    }
  }

  // ha a nyelvet máshol váltják (pl. setLocale), a kijelölés követi
  const stop = onLocaleChange((lang) => {
    if (!root.isConnected && root.parentNode === null) {
      stop();
      return;
    }
    if (locales.some((l) => l.code === lang) && lang !== value) choose(lang, false);
  });
  watchLocale(root, sync);

  buildOptions();
  applyMode();
  sync();

  return Object.assign(root, {
    getValue: (): string => value,
    setValue(code: string): void {
      choose(code, false);
    },
    setLocales(next: LocaleOption[]): void {
      locales = next;
      buildOptions();
      if (!locales.some((l) => l.code === value)) value = locales[0]?.code ?? "";
      sync();
    },
    close(): void {
      close(false);
    },
  });
}
