/**
 * Dokumentációs oldal: világos / sötét mód.
 *
 * - A választás a `localStorage["theme"]`-ben él ("light" | "dark"); ha nincs, a rendszer beállítása dönt.
 * - A téma a `<html data-theme="…">` attribútumon van (a `style.css` sötét témája erre épül).
 * - A villanás elkerülésére a build minden oldal `<head>`-jébe ugyanezt a logikát inline beszúrja (THEME_BOOT_SCRIPT).
 */
export type Theme = "light" | "dark";

const KEY = "theme";

function stored(): Theme | null {
  try {
    const v = localStorage.getItem(KEY);
    return v === "light" || v === "dark" ? v : null;
  } catch {
    return null;
  }
}

function system(): Theme {
  return typeof matchMedia === "function" && matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function getTheme(): Theme {
  return stored() ?? system();
}

export function applyTheme(theme: Theme): void {
  document.documentElement.dataset.theme = theme;
}

export function setTheme(theme: Theme): void {
  try {
    localStorage.setItem(KEY, theme);
  } catch {
    /* privát mód: a választás csak az oldal életére szól */
  }
  applyTheme(theme);
  listeners.forEach((fn) => fn(theme));
}

const listeners = new Set<(t: Theme) => void>();

/** Témaváltás figyelése (pl. a kapcsoló ikonjának frissítéséhez). */
export function onThemeChange(fn: (t: Theme) => void): void {
  listeners.add(fn);
}

/** Beállítja a témát, és követi a rendszer változását, amíg a felhasználó nem választott kézzel. */
export function initTheme(): void {
  applyTheme(getTheme());
  if (typeof matchMedia === "function") {
    matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
      if (!stored()) {
        const t = system();
        applyTheme(t);
        listeners.forEach((fn) => fn(t));
      }
    });
  }
}
