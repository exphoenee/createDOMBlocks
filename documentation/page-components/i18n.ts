/**
 * A dokumentációs oldal nyelvesítése (magyar + angol), a könyvtár saját i18n mechanizmusával.
 *
 * Természetes nyelvű kulcsok: a kulcs maga a magyar szöveg, ezért a magyar nyelv "identitás"
 * (nincs katalógusa), és a hiányzó angol fordítás automatikusan a magyar eredetire esik vissza.
 * Az angol fordítások az `assets/locales/en.json`-ban vannak (kulcs: magyar szöveg → érték: angol szöveg).
 *
 * - Szöveg: `tr("Magyar szöveg")` (élő hivatkozás, nyelvváltáskor frissül), `t("...")` (azonnali szöveg)
 * - Statikus HTML: a `.page-title`, `.page-subtitle` és a `data-i18n` / `data-i18n-html` elemek
 * - Nyelv: `?lang=en`, a `localStorage["lang"]`, majd a böngésző nyelve dönt; a fejléc gombja vált
 * - A `scripts/check-i18n.mjs` kigyűjti az összes megjelenő kulcsot, és jelzi, ha az `en.json`-ból hiányzik
 */
import { loadMessages, setLocale, getLocale, setFallbackLocale, watchLocale, tr as libTr, t as libT } from "../../src/index";
import type { MessageParams, TextRef, TextValue } from "../../src/index";

export type Lang = "hu" | "en";

declare global {
  interface Window {
    /** Ha be van állítva, minden tr() / t() hívás kulcsát ide gyűjtjük (kigyűjtő szkript) */
    __i18nKeys?: Set<string>;
  }
}

function collect(key: string): void {
  if (typeof window !== "undefined") window.__i18nKeys?.add(key);
}

/** "Élő" fordítási hivatkozás; kulcs: a magyar szöveg */
export function tr(key: string, params?: MessageParams): TextRef {
  collect(key);
  return libTr(key, params);
}

/** Azonnali fordítás az aktuális nyelven (nyelvváltáskor nem frissül, függvényben használd) */
export function t(key: string, params?: MessageParams): string {
  collect(key);
  return libT(key, params);
}

const STORAGE_KEY = "lang";
let loading: Promise<void> | null = null;
let docLang: Lang = "hu";

/** Az oldal (dokumentáció) nyelve; a demók saját nyelvváltásától független */
export function getDocLang(): Lang {
  return docLang;
}

function storedLang(): Lang | null {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    return v === "en" || v === "hu" ? v : null;
  } catch {
    return null;
  }
}

/** A kezdő nyelv: ?lang= → mentett választás → böngésző nyelve → magyar */
export function detectLang(): Lang {
  const fromUrl = new URLSearchParams(location.search).get("lang");
  if (fromUrl === "en" || fromUrl === "hu") return fromUrl;
  const stored = storedLang();
  if (stored) return stored;
  return (navigator.language || "hu").toLowerCase().startsWith("hu") ? "hu" : "en";
}

/** Az angol katalógus betöltése (egyszer); a magyarnak nincs katalógusa (a kulcs a szöveg) */
function ensureEnglish(): Promise<void> {
  loading ??= loadMessages("en", "assets/locales/en.json").catch((e) => {
    console.warn("[docs i18n] Az angol fordítás nem tölthető be, magyar szöveg marad:", e);
  });
  return loading;
}

/** Nyelv váltása (és megjegyzése). Az angolhoz előbb betölti a katalógust. */
export async function setDocLang(lang: Lang): Promise<void> {
  try {
    localStorage.setItem(STORAGE_KEY, lang);
  } catch {
    /* privát mód */
  }
  if (lang === "en") await ensureEnglish();
  docLang = lang;
  // a hiányzó kulcsokat (pl. a demó német nyelvénél) a dokumentáció nyelve pótolja
  setFallbackLocale(lang);
  setLocale(lang);
  document.documentElement.lang = lang;
  listeners.forEach((fn) => fn(lang));
}

const listeners = new Set<(l: Lang) => void>();

/** A dokumentáció nyelvváltásának figyelése (pl. a nyelvváltó gomb felirata) */
export function onDocLangChange(fn: (l: Lang) => void): void {
  listeners.add(fn);
}

const STATIC_SELECTOR = ".page-title, .page-subtitle, [data-i18n], [data-i18n-html]";

/**
 * A statikus HTML-ben lévő szövegek fordítása: a kulcs az elem eredeti (magyar) szövege.
 * `data-i18n-html`: a szöveg HTML-t tartalmaz (pl. <strong>). A `<title>` is követi a nyelvet.
 */
export function translateStaticDOM(root: ParentNode = document): void {
  root.querySelectorAll<HTMLElement>(STATIC_SELECTOR).forEach((el) => {
    if (el.dataset.i18nKey) return;
    const html = el.hasAttribute("data-i18n-html");
    const key = (html ? el.innerHTML : el.textContent ?? "").trim();
    if (!key) return;
    el.dataset.i18nKey = key;
    collect(key);
    watchLocale(el, (e) => {
      const k = e.dataset.i18nKey as string;
      if (html) e.innerHTML = libT(k);
      else e.textContent = libT(k);
    });
  });

  // <title>: "Oldalnév | createDOMBlocks"
  if (root === document && !document.documentElement.dataset.i18nTitle) {
    const [page, ...rest] = document.title.split(" | ");
    const suffix = rest.length ? ` | ${rest.join(" | ")}` : "";
    document.documentElement.dataset.i18nTitle = "1";
    collect(page);
    watchLocale(document.documentElement, () => {
      document.title = `${libT(page)}${suffix}`;
    });
  }
}

/**
 * Az oldal nyelvének beállítása. Visszaadja azt a Promise-t, amelyik akkor teljesül, ha a (szükséges)
 * katalógus betöltődött és a nyelv érvényesült; a betöltő overlay addig marad.
 */
export function initI18n(): Promise<void> {
  const lang = detectLang();
  docLang = lang;
  document.documentElement.lang = lang;
  setFallbackLocale(lang);
  translateStaticDOM();
  if (lang === "en") {
    return ensureEnglish().then(() => {
      setLocale("en");
      listeners.forEach((fn) => fn(lang));
    });
  }
  // a magyar a nyelvi kulcs maga; az angol katalógust előre töltjük, hogy a váltás azonnali legyen
  void ensureEnglish();
  return Promise.resolve();
}

export { getLocale };

/**
 * Objektum-sorokból táblázat-adat: a fejlécek és a (nem "keep" oszlopú) cellák fordíthatók.
 * A `keep` oszlopok (kód, azonosító, értékek) változatlanul maradnak.
 */
export function trRows(rows: Record<string, string>[], keep: string[] = []): TextValue[][] {
  const headers = Object.keys(rows[0] ?? {});
  return [
    headers.map((h) => tr(h)),
    ...rows.map((r) => headers.map((h) => (keep.includes(h) ? r[h] : r[h] ? tr(r[h]) : ""))),
  ];
}
