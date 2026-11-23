/**
 * Nyelvesítés (i18n) a komponensekhez.
 *
 * - Üzenetkatalógusok: `registerMessages(locale, { kulcs: "szöveg" })`, `loadMessages(locale, url)`
 * - Aktuális nyelv: `setLocale("en")`, `getLocale()`; változáskor minden `TextValue`-val létrehozott szöveg
 *   magától frissül (nem kell újra létrehozni a komponenseket, az állapotuk megmarad).
 * - Fordítás: `t(kulcs, paraméterek)` azonnali szöveget ad; `tr(kulcs, paraméterek)` "élő" hivatkozást,
 *   amit a komponensek bármelyik szöveges paramétere elfogad, és nyelvváltáskor újraszámol.
 */

/** Egy nyelv üzenetei: kulcs → szöveg. Többes szám: `kulcs_one`, `kulcs_other` (Intl.PluralRules szerint). */
export type Messages = Record<string, string>;

/** Behelyettesíthető paraméterek: `{name}` a szövegben. A `count` többes számot is választ. */
export type MessageParams = Record<string, string | number>;

/** Fordítási kulcsra mutató "élő" szöveg; a `tr()` állítja elő. */
export interface TextRef {
  readonly kind: "tr";
  readonly key: string;
  readonly params?: MessageParams;
  /** Ha egyik katalógusban sincs a kulcs, ez jelenik meg (alapból maga a kulcs) */
  readonly fallback?: string;
}

/**
 * Bármely komponens szöveges paramétere ezt fogadja:
 * - `string`: fix szöveg (nem változik nyelvváltáskor)
 * - `tr("kulcs")`: fordítási kulcs, nyelvváltáskor automatikusan frissül
 * - `() => string`: tetszőleges függvény (pl. `() => t("kulcs", { n })`), nyelvváltáskor újraszámolódik
 */
export type TextValue = string | TextRef | (() => string);

const catalogs = new Map<string, Messages>();
let locale = "hu";
let fallbackLocale = "hu";

/**
 * Egymásba ágyazott üzenetfa: a levelek szövegek (vagy számok). A beágyazás pontokkal lapul egyetlen kulccsá
 * (`{ form: { save: "Mentés" } }` → `form.save`). Az olyan csomópont, amelynek kulcsai csupa többes szám-kategória
 * (`zero`, `one`, `two`, `few`, `many`, `other`, és van `other`), `kulcs_one`, `kulcs_other` … kulcsokká alakul.
 */
export interface MessagesTree {
  [key: string]: string | number | MessagesTree;
}

const PLURAL_CATEGORIES = new Set(["zero", "one", "two", "few", "many", "other"]);

function isPluralNode(node: MessagesTree): boolean {
  const keys = Object.keys(node);
  return keys.length > 0 && "other" in node && keys.every((k) => PLURAL_CATEGORIES.has(k) && typeof node[k] !== "object");
}

/**
 * Egymásba ágyazott objektumból lapos `kulcs → szöveg` térkép (a `registerMessages` ezt automatikusan elvégzi).
 * @example flattenMessages({ form: { name: "Név" }, items: { one: "{count} elem", other: "{count} elem" } })
 *          // { "form.name": "Név", "items_one": "{count} elem", "items_other": "{count} elem" }
 */
export function flattenMessages(tree: MessagesTree, prefix = ""): Messages {
  const out: Messages = {};
  for (const [key, value] of Object.entries(tree)) {
    if (value == null) continue;
    const path = prefix ? `${prefix}.${key}` : key;
    if (typeof value === "object") {
      if (isPluralNode(value)) {
        for (const [cat, text] of Object.entries(value)) out[`${path}_${cat}`] = String(text);
      } else {
        Object.assign(out, flattenMessages(value, path));
      }
    } else {
      out[path] = String(value);
    }
  }
  return out;
}

/** Üzenetek hozzáadása egy nyelvhez (a meglévő kulcsok felülíródnak). Lapos és egymásba ágyazott objektumot is elfogad. Nem vált nyelvet. */
export function registerMessages(lang: string, messages: Messages | MessagesTree): void {
  catalogs.set(lang, { ...(catalogs.get(lang) ?? {}), ...flattenMessages(messages as MessagesTree) });
}

/**
 * Több nyelv egyszerre egyetlen objektumból: `{ hu: { ... }, en: { ... } }`. A `prefix` minden kulcs elé kerül.
 * @example registerTranslations({ hu: { form: { save: "Mentés" } }, en: { form: { save: "Save" } } });
 */
export function registerTranslations(translations: Record<string, MessagesTree>, options: { prefix?: string } = {}): void {
  for (const [lang, tree] of Object.entries(translations)) {
    registerMessages(lang, options.prefix ? flattenMessages(tree, options.prefix) : tree);
  }
}

/** A típus-szintű fordítási hivatkozás-fa: minden levél egy `TextRef` (lásd `defineMessages`) */
type PluralCategory = "zero" | "one" | "two" | "few" | "many" | "other";

export type MessageRefs<T> = {
  [K in keyof T]: T[K] extends string | number
    ? TextRef
    : T[K] extends { other: string | number }
      ? Exclude<keyof T[K], PluralCategory> extends never
        ? TextRef // többes számú csomópont: egyetlen kulcs, a count paraméter választ kategóriát
        : MessageRefs<T[K]>
      : T[K] extends MessagesTree
        ? MessageRefs<T[K]>
        : never;
};

function buildRefs(trees: MessagesTree[], prefix: string): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  const keys = new Set(trees.flatMap((t) => Object.keys(t)));
  for (const key of keys) {
    const path = prefix ? `${prefix}.${key}` : key;
    const nodes = trees.map((t) => t[key]).filter((v) => v != null);
    const objects = nodes.filter((v): v is MessagesTree => typeof v === "object");
    if (objects.length && objects.every(isPluralNode)) {
      // többes számú csomópont: egyetlen kulcs (a count paraméter választ kategóriát)
      out[key] = tr(path);
    } else if (objects.length) {
      out[key] = buildRefs(objects, path);
    } else {
      out[key] = tr(path);
    }
  }
  return out;
}

/**
 * Egyetlen hívással: regisztrálja az összes nyelv üzeneteit, és visszaadja a kulcsokra mutató, **típusos** `tr()`
 * hivatkozások fáját. Nem kell kulcs-stringeket gépelni, az IDE kiegészít, az elgépelés fordítási hiba.
 *
 * @example
 * const m = defineMessages({
 *   hu: { form: { name: "Név", save: "Mentés" } },
 *   en: { form: { name: "Name", save: "Save" } },
 * });
 * createTextInput({ parent, id: "n", labelText: m.form.name });   // nyelvváltáskor frissül
 * createButtonInput({ parent, id: "s", text: m.form.save });
 */
export function defineMessages<T extends Record<string, MessagesTree>>(
  translations: T,
  options: { prefix?: string } = {},
): MessageRefs<T[keyof T]> {
  registerTranslations(translations, options);
  return buildRefs(Object.values(translations), options.prefix ?? "") as MessageRefs<T[keyof T]>;
}

/**
 * Üzenetek betöltése JSON URL-ről vagy aszinkron függvényből, majd regisztrálása.
 * @example await loadMessages("de", "/locales/de.json"); setLocale("de");
 */
export async function loadMessages(lang: string, source: string | (() => Promise<Messages | MessagesTree>), init?: RequestInit): Promise<void> {
  let messages: Messages | MessagesTree;
  if (typeof source === "function") {
    messages = await source();
  } else {
    const res = await fetch(source, init);
    if (!res.ok) throw new Error(`Failed to load messages for "${lang}": HTTP ${res.status} (${source})`);
    messages = (await res.json()) as MessagesTree;
  }
  registerMessages(lang, messages);
}

/** A regisztrált nyelvek kódjai */
export function getLocales(): string[] {
  return [...catalogs.keys()];
}

export function getLocale(): string {
  return locale;
}

/** Visszaeső nyelv: ennek a katalógusából pótoljuk a hiányzó kulcsokat (alapból "hu") */
export function setFallbackLocale(lang: string): void {
  fallbackLocale = lang;
  notify();
}

export function getFallbackLocale(): string {
  return fallbackLocale;
}

function lookup(key: string, params?: MessageParams): string | undefined {
  const plural = params && typeof params.count === "number" ? pluralSuffix(params.count) : null;
  for (const lang of [locale, locale.split("-")[0], fallbackLocale]) {
    const dict = catalogs.get(lang);
    if (!dict) continue;
    if (plural && `${key}_${plural}` in dict) return dict[`${key}_${plural}`];
    if (key in dict) return dict[key];
  }
  return undefined;
}

function pluralSuffix(count: number): string {
  try {
    return new Intl.PluralRules(locale).select(count);
  } catch {
    return count === 1 ? "one" : "other";
  }
}

function interpolate(text: string, params?: MessageParams): string {
  if (!params) return text;
  return text.replace(/\{(\w+)\}/g, (m, name: string) => (name in params ? String(params[name]) : m));
}

/**
 * Azonnali fordítás az aktuális nyelven. Hiányzó kulcsnál a visszaeső nyelv, majd a `fallback`, végül a kulcs.
 * Figyelem: az eredmény sima szöveg, nyelvváltáskor nem frissül; komponens-paraméterbe `tr()`-t vagy `() => t(...)`-t adj.
 */
export function t(key: string, params?: MessageParams, fallback?: string): string {
  return interpolate(lookup(key, params) ?? fallback ?? key, params);
}

/** "Élő" fordítási hivatkozás: bármelyik komponens-szöveg paraméterbe adható, nyelvváltáskor frissül. */
export function tr(key: string, params?: MessageParams, fallback?: string): TextRef {
  return { kind: "tr", key, params, fallback };
}

export function isTextRef(v: unknown): v is TextRef {
  return typeof v === "object" && v !== null && (v as TextRef).kind === "tr" && typeof (v as TextRef).key === "string";
}

/** Igaz, ha az érték nyelvváltáskor újraszámolódik (TextRef vagy függvény) */
export function isReactiveText(v: unknown): v is TextRef | (() => string) {
  return typeof v === "function" || isTextRef(v);
}

/** A szöveg aktuális értéke (üres string, ha nincs megadva) */
export function resolveText(v: TextValue | undefined | null): string {
  if (v == null) return "";
  if (typeof v === "string") return v;
  if (typeof v === "function") return String(v());
  return t(v.key, v.params, v.fallback);
}

/* -------------------------------------------------------------------------------------------------
 * Újrarenderelés nyelvváltáskor
 * ----------------------------------------------------------------------------------------------- */

interface Watcher {
  ref: WeakRef<Element> | { deref: () => Element | undefined };
  run: (el: Element) => void;
  /** hányszor láttuk egymás után a DOM-on kívül */
  strikes: number;
}

const watchers = new Set<Watcher>();
const listeners = new Set<(lang: string) => void>();

const weak = (el: Element): Watcher["ref"] =>
  typeof WeakRef === "function" ? new WeakRef(el) : { deref: () => el };

/**
 * Egy elem frissítése nyelvváltáskor. A hivatkozás gyenge (az elem eldobható); a `run` függvény ne tartson
 * erős hivatkozást az elemre kívülről, az elemet paraméterként kapja. A DOM-ból két egymást követő
 * nyelvváltáskor is kimaradt elemeket a rendszer elfelejti.
 */
export function watchLocale<T extends Element>(el: T, run: (el: T) => void): void {
  watchers.add({ ref: weak(el), run: run as (el: Element) => void, strikes: 0 });
}

/** Nyelvváltás figyelése (pl. saját állapot frissítéséhez). Visszaadja a leiratkozó függvényt. */
export function onLocaleChange(cb: (lang: string) => void): () => void {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

function notify(): void {
  for (const w of [...watchers]) {
    const el = w.ref.deref();
    if (!el) {
      watchers.delete(w);
      continue;
    }
    // A DOM-ból kimaradt elemet is frissítjük (később visszakerülhet), de két kör után elfelejtjük
    if (el.isConnected) w.strikes = 0;
    else if (++w.strikes > 2) {
      watchers.delete(w);
      continue;
    }
    try {
      w.run(el);
    } catch (e) {
      console.error("[createDOMBlocks] i18n update failed", e);
    }
  }
  for (const cb of [...listeners]) cb(locale);
}

/**
 * Nyelv váltása: frissíti az összes szöveget, amit `tr()`-rel / függvénnyel adtál át, a beépített feliratokat,
 * és beállítja a `<html lang>` attribútumot. Ha a katalógus még nincs betöltve, előbb hívd a `loadMessages`-t.
 */
export function setLocale(lang: string, options: { updateHtmlLang?: boolean } = {}): void {
  if (lang === locale) return;
  locale = lang;
  if (options.updateHtmlLang !== false && typeof document !== "undefined") document.documentElement.lang = lang;
  notify();
}

/** Beépített szöveg segéd: `cdb.<kulcs>` a könyvtár katalógusából, alapból a megadott (magyar) szöveggel */
export function builtin(key: string, fallback: string): TextRef {
  return tr(`cdb.${key}`, undefined, fallback);
}
