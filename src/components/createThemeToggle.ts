import { createDOMElem } from "../dom";
import { builtin, resolveText, t, watchLocale } from "../i18n";
import type { TextValue } from "../i18n";
import type { ThemeToggleParams, ThemeToggleElement } from "../types";

const DEFAULT_THEMES = ["light", "dark"];
const DEFAULT_KEY = "cdb-theme";
const DEFAULT_ICONS: Record<string, string> = { light: "☀️", dark: "🌙" };

function readStored(key: string | null): string | null {
  if (!key) return null;
  try {
    return localStorage.getItem(key);
  } catch {
    return null; // privát mód / tiltott tároló
  }
}

function prefersDark(): boolean {
  try {
    return typeof window.matchMedia === "function" && window.matchMedia("(prefers-color-scheme: dark)").matches;
  } catch {
    return false;
  }
}

/**
 * A festés előtt futó téma-előbetöltő szkript szövege a `<head>`-be (villogás ellen): a mentett témát, ennek
 * hiányában a rendszer beállítását írja a `<html data-theme>` attribútumba, mielőtt az oldal kirajzolódik.
 * A `ThemeToggle` ugyanebből a kulcsból és attribútumból indul, nem dönt újra.
 *
 * @example
 * // build-időben vagy kézzel a <head>-be: <script>…a themeBootstrapScript() kimenete…</script>
 * const snippet = themeBootstrapScript({ storageKey: "portfolio-theme" });
 *
 * @group theme
 */
export function themeBootstrapScript(options: {
  /**
   * A mentett téma kulcsa a localStorage-ban
   * @default "cdb-theme"
   */
  storageKey?: string;
  /**
   * Az elfogadott témák (a mentett érték csak ezek egyike lehet)
   * @default ["light", "dark"]
   */
  themes?: string[];
} = {}): string {
  const key = JSON.stringify(options.storageKey ?? DEFAULT_KEY);
  const themes = JSON.stringify(options.themes ?? DEFAULT_THEMES);
  return (
    `(function(){var d=document.documentElement,k=${key},a=${themes},t=null;` +
    `try{t=localStorage.getItem(k)}catch(e){}` +
    `if(a.indexOf(t)<0){t=window.matchMedia&&matchMedia('(prefers-color-scheme: dark)').matches&&a.indexOf('dark')>-1?'dark':a[0]}` +
    `d.setAttribute('data-theme',t);if(t==='dark'||t==='light')d.style.colorScheme=t})();`
  );
}

/**
 * Témaváltó gomb: a megadott témák között körbe vált (`<html data-theme>`), a választást elmenti, és a
 * kezdő témát a mentett értékből, a már beállított attribútumból (`themeBootstrapScript`) vagy a rendszer
 * beállításából veszi. Alapból a következő téma ikonját mutatja (a gomb a váltást jelzi).
 *
 * @category buttons
 * @menu ThemeToggle
 * @order 6
 * @summary Témaváltó gomb (világos / sötét és saját témák), mentéssel.
 */
export function createThemeToggle(params: ThemeToggleParams): ThemeToggleElement {
  const themes = params.themes?.length ? params.themes : DEFAULT_THEMES;
  const key = params.storageKey === null ? null : (params.storageKey ?? DEFAULT_KEY);
  const icons = { ...DEFAULT_ICONS, ...(params.icons ?? {}) };
  const html = document.documentElement;

  const nameOf = (theme: string): TextValue =>
    params.labels?.[theme] ?? (theme === "light" ? builtin("theme.light", "Világos") : theme === "dark" ? builtin("theme.dark", "Sötét") : theme);
  const nextOf = (theme: string): string => themes[(themes.indexOf(theme) + 1) % themes.length];

  const initial = (): string => {
    if (params.theme && themes.includes(params.theme)) return params.theme;
    const stored = readStored(key);
    if (stored && themes.includes(stored)) return stored;
    const attr = html.getAttribute("data-theme");
    if (attr && themes.includes(attr)) return attr;
    return prefersDark() && themes.includes("dark") ? "dark" : themes[0];
  };

  const rootAttrs: Record<string, TextValue> = {
    type: "button",
    class: `theme-toggle${params.showLabel ? " theme-toggle-labeled" : ""}${params.class ? ` ${params.class}` : ""}`,
  };
  if (params.id) rootAttrs.id = params.id;
  const root = createDOMElem({ tag: "button", parent: params.parent, attrs: rootAttrs }) as HTMLButtonElement;
  const icon = createDOMElem({ tag: "span", parent: root, attrs: { class: "theme-toggle-icon", "aria-hidden": "true" } });
  const label = createDOMElem({ tag: "span", parent: root, attrs: { class: params.showLabel ? "theme-toggle-label" : "theme-toggle-label sr-only" } });

  let theme = initial();

  const render = (): void => {
    const shown = params.display === "current" ? theme : nextOf(theme);
    icon.innerHTML = icons[shown] ?? "";
    label.textContent = resolveText(nameOf(shown));
    const text = t("cdb.theme.switch", { current: resolveText(nameOf(theme)), next: resolveText(nameOf(nextOf(theme))) }, "Téma: {current}. Váltás erre: {next}");
    root.setAttribute("aria-label", text);
    root.title = text;
    root.dataset.theme = theme;
  };

  const apply = (next: string, user: boolean): void => {
    theme = next;
    html.setAttribute("data-theme", theme);
    if (theme === "dark" || theme === "light") html.style.colorScheme = theme;
    if (user && key) {
      try {
        localStorage.setItem(key, theme);
      } catch {
        /* privát mód: nem mentünk */
      }
    }
    render();
    if (user) params.onChange?.(theme);
  };

  root.addEventListener("click", () => apply(nextOf(theme), true));
  watchLocale(root, render);
  apply(theme, false);

  return Object.assign(root, {
    getTheme: (): string => theme,
    setTheme(next: string): void {
      if (themes.includes(next) && next !== theme) apply(next, false);
    },
  });
}
