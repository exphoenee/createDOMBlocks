import type { EventHandler } from "domelemjs";
import type { DOMOptions } from "./dom";
import type { TextValue } from "./i18n";

export type InputType =
  | "text"
  | "tel"
  | "url"
  | "search"
  | "email"
  | "password"
  | "number"
  | "date"
  | "datetime-local"
  | "time"
  | "month"
  | "week"
  | "checkbox"
  | "color"
  | "file"
  | "range"
  | "hidden"
  | "radio"
  | "button"
  | "submit"
  | "reset"
  | "select"
  | "textarea";

export interface BaseInputParams {
  /** Szülő elem */
  parent: HTMLElement | string;
  /** Input egyedi azonosítója */
  id: string;
  /** Input típusa */
  type?: string;
  /** CSS osztály */
  class?: string;
  /** Input name attribútuma */
  name?: string;
  /** Input értéke */
  value?: string | number;
  /** Placeholder szöveg */
  placeholder?: TextValue;
  /** Címke szövege */
  labelText?: TextValue;
  /**
   * Címke megjelenése input előtt (alapértelmezett: true)
   * @default true
   */
  labelfirst?: boolean;
  /** Checkbox/radio bejelölve */
  checked?: boolean;
  /** Érték változás esemény */
  onChange?: (e: Event) => void;
  /** Kattintás esemény */
  click?: (e: Event) => void;
  /** Egyéb eseménykezelők */
  handleEvent?: EventHandler | EventHandler[];
  /** Minimum érték (number/range inputoknál) */
  min?: number;
  /** Maximum érték (number/range inputoknál) */
  max?: number;
  /** Lépésköz (number/range inputoknál) */
  step?: number;
  /** Kezdő érték */
  start?: number;
  /** Sorok száma (textarea) */
  rows?: number;
  /** Oszlopok száma (textarea) */
  cols?: number;
}

export interface TextInputParams extends BaseInputParams {
  type?: "text";
}

export interface TelInputParams extends BaseInputParams {
  type?: "tel";
}

export interface UrlInputParams extends BaseInputParams {
  type?: "url";
}

export interface SearchInputParams extends BaseInputParams {
  type?: "search";
}

export interface EmailInputParams extends BaseInputParams {
  type?: "email";
}

export interface PasswordInputParams extends BaseInputParams {
  type?: "password";
  /**
   * Szem ikonos gomb a mező jobb oldalán, amivel a jelszó megjeleníthető / elrejthető
   * @default true
   */
  showToggle?: boolean;
  /**
   * A gomb elérhetőségi felirata, amíg a jelszó rejtett
   * @default "Jelszó megjelenítése"
   */
  showLabel?: TextValue;
  /**
   * A gomb elérhetőségi felirata, amíg a jelszó látható
   * @default "Jelszó elrejtése"
   */
  hideLabel?: TextValue;
}

export interface NumberInputParams extends BaseInputParams {
  type?: "number";
}

export interface DateInputParams extends BaseInputParams {
  type?: "date";
}

export interface DatetimeInputParams extends BaseInputParams {
  type?: "datetime-local";
}

export interface TimeInputParams extends BaseInputParams {
  type?: "time";
}

export interface MonthInputParams extends BaseInputParams {
  type?: "month";
}

export interface WeekInputParams extends BaseInputParams {
  type?: "week";
}

export interface CheckboxParams extends BaseInputParams {
  type?: "checkbox";
}

export interface ColorInputParams extends BaseInputParams {
  type?: "color";
}

export interface FileInputParams extends BaseInputParams {
  type?: "file";
}

export interface RangeInputParams extends BaseInputParams {
  type?: "range";
}

export interface HiddenInputParams extends BaseInputParams {
  type?: "hidden";
}

export interface SelectOption {
  /** Megjelenő szöveg */
  text: TextValue;
  /** Opció értéke */
  value: string | number;
}

export interface SelectParams extends BaseInputParams {
  /** Legördülő opciók tömbje */
  options: SelectOption[];
}

export interface RadioOption {
  /** Megjelenő szöveg */
  text: TextValue;
  /** Opció értéke */
  value: string | number;
  /** Érték változás esemény */
  onChange?: (e: Event) => void;
  /** Kattintás esemény */
  click?: (e: Event) => void;
  /** Egyéb eseménykezelők */
  handleEvent?: EventHandler | EventHandler[];
}

export interface RadioParams extends BaseInputParams {
  /** Radio gomb opciók tömbje */
  options: RadioOption[];
}

export interface TextareaParams extends BaseInputParams {
  /**
   * Input típusa
   * @default "textarea"
   */
  type?: "textarea";
}

export interface ButtonParams {
  /** Szülő elem */
  parent: HTMLElement | string;
  /** Gomb egyedi azonosítója */
  id: string;
  /** CSS osztály */
  class?: string;
  /** Gomb szövege */
  text?: TextValue;
  /** Gomb stílusa */
  style?: DOMOptions["style"];
  /** Kattintás esemény */
  click?: (e: Event) => void;
  /** Egyéb eseménykezelők */
  handleEvent?: EventHandler | EventHandler[];
  /**
   * Throttle (ms): a `click` azonnal lefut, majd a gomb a megadott ideig disabled,
   * a jobb felső sarokban visszaszámláló badge-dzsel.
   */
  throttle?: number;
  /**
   * Debounce (ms): a `click` a megadott várakozás letelte után fut le; addig a gomb disabled,
   * a jobb felső sarokban visszaszámláló badge-dzsel. Ha `throttle` is meg van adva, a `throttle` az érvényes.
   */
  debounce?: number;
}

export interface ButtonInputParams extends BaseInputParams {
  /**
   * Gomb típusa
   * @default "button"
   */
  type?: "button" | "submit" | "reset";
  /** Gomb szövege */
  text?: TextValue;
}

export interface ParagraphParams {
  /** Szülő elem */
  parent: HTMLElement | string;
  /** Bekezdés szövege */
  text?: TextValue;
  /** Bekezdés egyedi azonosítója */
  id: string;
  /** CSS osztály */
  class?: string;
}

export interface TitleParams {
  /** Szülő elem */
  parent: HTMLElement | string;
  /** Címsor szövege */
  text?: TextValue;
  /** Címsor egyedi azonosítója */
  id: string;
  /** CSS osztály */
  class?: string;
}

export interface ListParams {
  /** Szülő elem */
  parent: HTMLElement | string;
  /** Lista egyedi azonosítója */
  id: string;
  /** CSS osztály */
  class?: string;
  /** Kezdő szám (rendezett listánál) */
  start?: number;
}

export interface TableCellNames {
  /** Összeg oszlop fejléce */
  sum?: TextValue;
  /** Végösszeg oszlop fejléce */
  total?: TextValue;
  /** Sorszám oszlop fejléce */
  rowNr?: TextValue;
}

export interface TableLabels {
  /** A szűrőmező placeholderje */
  filter?: TextValue;
  /** A szűrőmező elérhetőségi neve */
  filterAria?: TextValue;
  /** Előző oldal gomb */
  prev?: TextValue;
  /** Következő oldal gomb */
  next?: TextValue;
  /** Oldal (elérhetőségi felirat) */
  page?: TextValue;
  /** Oldalméret választó felirata */
  rowsPerPage?: TextValue;
  /** Az "összes sor" opció felirata az oldalméret-választóban */
  all?: TextValue;
  /** Üres találati lista szövege */
  noResults?: TextValue;
  /** Növekvő rendezés jelzése */
  sortAsc?: TextValue;
  /** Csökkenő rendezés jelzése */
  sortDesc?: TextValue;
  /** Az összesítő sor szövege (alapból "1–10 / 53") */
  info?: (state: { from: number; to: number; total: number; all: number }) => string;
}

export interface TableServerQuery {
  /** A kért oldal (1-től) */
  page: number;
  /** Oldalméret; `"all"` esetén az összes sor */
  pageSize: number | "all";
  /** A szűrőmező aktuális szövege (üres, ha nincs szűrés) */
  filter: string;
  /** A kért rendezés; `null`, ha nincs */
  sort: { column: string; index: number; direction: "asc" | "desc" } | null;
}

export interface TableServerSide {
  /** Az összes sor száma a szerveren (a lapozó ebből számolja az oldalakat) */
  total: number;
  /**
   * Lapozás / oldalméret / rendezés / szűrés változáskor hívódik (az előző / következő gombokra és az
   * oldalszámokra is). A hívó lekéri az adatot, és a `setData`-val adja vissza; amíg nem érkezik meg,
   * a táblázat `is-loading` állapotú, a lapozó gombjai letiltottak.
   */
  onChange: (query: TableServerQuery) => void;
  /**
   * A kezdő oldal száma (a `createTable` első paramétere ennek az oldalnak a sorai)
   * @default 1
   */
  page?: number;
  /**
   * A szűrőmezőbe gépelés és a lekérdezés közti várakozás ms-ban
   * @default 300
   */
  filterDebounce?: number;
}

export interface TableElement extends HTMLElement {
  /**
   * Új sorok megjelenítése (szerveroldali lapozásnál az aktuális oldal sorai, fejléc nélkül;
   * objektum-sorok a kezdeti adat kulcsai szerint). A `total` frissíti az összes sor számát,
   * a `page` az oldalszámot. Megszünteti a betöltés állapotot.
   */
  setData: (rows: Record<string, string | number | TextValue>[] | (string | number | TextValue)[][], opts?: { total?: number; page?: number }) => void;
  /** Betöltés állapot kézi állítása (pl. hiba után `setLoading(false)`) */
  setLoading: (on?: boolean) => void;
  /** Az aktuális lekérdezés (oldal, oldalméret, szűrő, rendezés) */
  getQuery: () => TableServerQuery;
  /** Az aktuális lekérdezés újrafuttatása (az `onChange` újra hívódik) */
  reload: () => void;
}

export interface TableParams {
  /** Szülő elem */
  parent: HTMLElement | string;
  /** Táblázat egyedi azonosítója */
  id: string;
  /** CSS osztály */
  class?: string;
  /**
   * Fejléc sor használata
   * @default false
   */
  hasHeader?: boolean;
  /**
   * Lábléc sor használata
   * @default false
   */
  hasFooter?: boolean;
  /**
   * Fejléc megjelenítése
   * @default true
   */
  showHeader?: boolean;
  /**
   * Lábléc megjelenítése
   * @default true
   */
  showFooter?: boolean;
  /**
   * Sorszámok hozzáadása
   * @default false
   */
  addRowNumbers?: boolean;
  /**
   * Sorok összegzése
   * @default false
   */
  sumRowValues?: boolean;
  /** Oszlopnevek testreszabása */
  cellNames?: TableCellNames;
  /** Tizedesjegyek száma */
  precision?: number;
  /**
   * Rendezhető oszlopok: a fejlécre kattintva növekvő → csökkenő → eredeti sorrend
   * @default false
   */
  sortable?: boolean;
  /**
   * Szűrőmező a táblázat felett (a sorok bármely cellájában keres, kis- és nagybetűre érzéketlenül).
   * Bekapcsolva a visszatérési érték egy `.table-container`, amely a `<table>`-t és a vezérlőket tartalmazza.
   * @default false
   */
  filterable?: boolean;
  /**
   * Lapozás: ennyi sor jelenik meg egy oldalon. Bekapcsolva a visszatérési érték egy `.table-container`.
   * A lábléc összegei az összes sorra vonatkoznak. Ha nincs megadva, de van `pageSizeOptions`,
   * az első szám a lista elejéről az alapértelmezett (ha csak `"all"` van, akkor az összes sor).
   */
  pageSize?: number;
  /**
   * Oldalméret-választó (select) a megadott sorrendben, pl. `[5, 10, 15]` vagy `[10, 25, 50, 100, "all"]`.
   * A `"all"` az "Mind" opció: minden sor egy oldalon. A lista bekapcsolja a lapozást is.
   */
  pageSizeOptions?: (number | "all")[];
  /** Feliratok (fordításhoz) */
  labels?: TableLabels;
  /**
   * Szerveroldali lapozás / rendezés / szűrés: a táblázat nem dolgozik a sorokkal, hanem az `onChange`-ben
   * kéri az adatot, a választ a visszaadott elem `setData`-jával kell megadni. Az első paraméter az induló
   * oldal sorai. Ilyenkor a lábléc (összegek) nem jelenik meg, mert csak az aktuális oldalt ismeri.
   */
  serverSide?: TableServerSide;
}

export interface ModalParams {
  /** Szülő elem (ha nincs megadva, body-hoz fűződik) */
  parent?: HTMLElement | string;
  /** Modál egyedi azonosítója */
  id: string;
  /** CSS osztály */
  class?: string;
  /**
   * A modál szélessége (CSS érték, pl. "600px", "50vw", "40rem"; a szám pixelnek számít).
   * Keskeny képernyőn a `maxWidth` (90vw) korlátozza.
   * @default "320px" (minimális szélesség, a tartalomhoz igazodik)
   */
  width?: string | number;
  /**
   * A modál maximális szélessége (CSS érték vagy szám pixelben)
   * @default "90vw"
   */
  maxWidth?: string | number;
  /** A gombok feliratai (nyelvfüggő szöveg is lehet); alapból a beépített "Mégse" / "OK" */
  labels?: {
    ok?: TextValue;
    cancel?: TextValue;
  };
}

export interface ModalContent {
  /** Modál címe */
  modalTitle: TextValue;
  /** Modál tartalma */
  body: DOMOptions | DOMOptions[];
}

export interface ModalActions {
  /** OK gomb eseménykezelő */
  okAction?: (e?: Event) => void;
  /** Mégse gomb eseménykezelő */
  cancelAction?: (e?: Event) => void;
  /** Bezárás gomb eseménykezelő */
  closeAction?: (e?: Event) => void;
}

export interface FormInputConfig {
  /** Input típusa */
  type: InputType;
  /** Input egyedi azonosítója */
  id: string;
  /** CSS osztály */
  class?: string;
  /** Input name attribútuma */
  name?: string;
  /** Input értéke */
  value?: string | number;
  /** Placeholder szöveg */
  placeholder?: TextValue;
  /** Címke szövege */
  labelText?: TextValue;
  /**
   * Címke megjelenése input előtt
   * @default true
   */
  labelfirst?: boolean;
  /** Checkbox/radio bejelölve */
  checked?: boolean;
  /** Minimum érték */
  min?: number;
  /** Maximum érték */
  max?: number;
  /** Lépésköz */
  step?: number;
  /** Sorok száma (textarea) */
  rows?: number;
  /** Oszlopok száma (textarea) */
  cols?: number;
  /** Érték változás esemény */
  onChange?: (e: Event) => void;
  /** Kattintás esemény */
  click?: (e: Event) => void;
  /** Egyéb eseménykezelők */
  handleEvent?: EventHandler | EventHandler[];
  /** Select/radio opciók */
  options?: SelectOption[];
}

export interface FormConfig {
  /** Szülő elem */
  parent: HTMLElement | string;
  /** Form egyedi azonosítója */
  id: string;
  /** CSS osztály */
  class?: string;
  /** Form action URL */
  action?: string;
  /** HTTP metódus */
  method?: "GET" | "POST" | "PUT" | "DELETE";
  /** Input konfigurációk tömbje */
  inputs: FormInputConfig[];
  /** Submit esemény callback */
  onSubmit?: (e: Event) => void;
}

export interface CardParams {
  /** Szülő elem */
  parent: HTMLElement | string;
  /** Kártya egyedi azonosítója */
  id: string;
  /** CSS osztály */
  class?: string;
  /** Kártya címe */
  title?: TextValue;
  /** Kártya tartalma */
  body?: DOMOptions | DOMOptions[];
  /** Kártya lábléce */
  footer?: DOMOptions | DOMOptions[];
}

export interface ContainerParams {
  /** Szülő elem */
  parent: HTMLElement | string;
  /** Konténer egyedi azonosítója */
  id: string;
  /** CSS osztály */
  class?: string;
  /** Gyermek elemek */
  children?: (DOMOptions | HTMLElement)[];
}

export interface GridParams {
  /** Szülő elem */
  parent: HTMLElement | string;
  /** Rács egyedi azonosítója */
  id: string;
  /** CSS osztály */
  class?: string;
  /** Oszlopok száma */
  columns?: number;
  /** Rácselemek közötti rés */
  gap?: string;
  /**
   * Egy oszlop minimális szélessége (pl. "280px"). A szabad szélességhez igazodik az oszlopok száma
   * (`repeat(auto-fill, minmax(min, 1fr))`). A `columns` megadása felülírja.
   */
  minItemWidth?: string;
  /** Rácselemek */
  children?: (DOMOptions | HTMLElement)[];
}

export interface NavItem {
  /** Megjelenő szöveg */
  text: TextValue;
  /** Link URL */
  href?: string;
  /** Kattintás esemény */
  click?: (e: Event) => void;
  /** Aktív állapot */
  active?: boolean;
  /** Almenü pontok */
  children?: NavItem[];
}

export interface NavParams {
  /** Szülő elem */
  parent: HTMLElement | string;
  /** Navigáció egyedi azonosítója */
  id: string;
  /** CSS osztály */
  class?: string;
  /** Menüpontok tömbje */
  items: NavItem[];
}

export interface BreadcrumbItem {
  /** Megjelenő szöveg */
  text: TextValue;
  /** Link URL */
  href?: string;
  /** Kattintás esemény */
  click?: (e: Event) => void;
}

export interface BreadcrumbParams {
  /** Szülő elem */
  parent: HTMLElement | string;
  /** Breadcrumb egyedi azonosítója */
  id: string;
  /** CSS osztály */
  class?: string;
  /** Morzsa menüpontok tömbje */
  items: BreadcrumbItem[];
  /**
   * Elválasztó karakter
   * @default "/"
   */
  separator?: string;
}

export interface TabItem {
  /** Tab egyedi azonosítója */
  id: string;
  /** Tab fejléce */
  label: TextValue;
  /** Tab tartalma */
  content: DOMOptions | DOMOptions[];
}

export interface TabsParams {
  /** Szülő elem */
  parent: HTMLElement | string;
  /** Tabok egyedi azonosítója */
  id: string;
  /** CSS osztály */
  class?: string;
  /** Tabok tömbje */
  tabs: TabItem[];
  /** Aktív tab azonosítója */
  activeTab?: string;
  /** A tablist elérhetőségi neve (aria-label) */
  ariaLabel?: TextValue;
  /** Tabváltáskor hívódik, az új tab azonosítójával */
  onChange?: (tabId: string) => void;
}

export interface AlertParams {
  /** Szülő elem */
  parent: HTMLElement | string;
  /** Alert egyedi azonosítója */
  id: string;
  /** CSS osztály */
  class?: string;
  /**
   * Alert típusa
   * @default "info"
   */
  type?: "success" | "error" | "warning" | "info";
  /** Alert címe */
  title?: TextValue;
  /** Alert üzenete */
  message: TextValue;
  /**
   * Bezárható-e
   * @default false
   */
  dismissible?: boolean;
  /** Bezárás esemény callback */
  onDismiss?: (e?: Event) => void;
}

export interface ToastParams {
  /** Szülő elem */
  parent: HTMLElement | string;
  /** Toast egyedi azonosítója */
  id: string;
  /** CSS osztály */
  class?: string;
  /**
   * Toast típusa
   * @default "info"
   */
  type?: "success" | "error" | "warning" | "info";
  /** Toast üzenete */
  message: TextValue;
  /**
   * Megjelenítés időtartama ms-ben
   * @default 3000
   */
  duration?: number;
  /**
   * Toast pozíciója a képernyőn
   * @default "top-right"
   */
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
  /** Toast szélessége */
  width?: string;
}

export interface BadgeParams {
  /** Szülő elem */
  parent: HTMLElement | string;
  /** Badge egyedi azonosítója */
  id: string;
  /** CSS osztály */
  class?: string;
  /** Badge szövege */
  text?: TextValue;
  /**
   * Badge típusa
   * @default "neutral"
   */
  type?: "success" | "error" | "warning" | "info" | "neutral";
}

export interface SpinnerParams {
  /** Szülő elem */
  parent: HTMLElement | string;
  /** Spinner egyedi azonosítója */
  id: string;
  /** CSS osztály */
  class?: string;
  /**
   * Spinner mérete
   * @default "md"
   */
  size?: "sm" | "md" | "lg";
  /** Spinner színe */
  color?: string;
}

export interface ProgressBarParams {
  /** Szülő elem */
  parent: HTMLElement | string;
  /** Progress bar egyedi azonosítója */
  id: string;
  /** CSS osztály */
  class?: string;
  /** Jelenlegi érték */
  value: number;
  /**
   * Maximum érték
   * @default 100
   */
  max?: number;
  /** Címke szöveg */
  label?: TextValue;
  /**
   * Százalék megjelenítése
   * @default false
   */
  showPercentage?: boolean;
  /** Progress bar színe */
  color?: string;
}

export type ImageState = "loading" | "loaded" | "error";

export interface ImageParams {
  /** Szülő elem */
  parent: HTMLElement | string;
  /** Kép egyedi azonosítója */
  id: string;
  /** CSS osztály */
  class?: string;
  /** Kép URL */
  src: string;
  /** Alternatív szöveg */
  alt?: TextValue;
  /** Kép felirat */
  caption?: TextValue;
  /** Kép szélessége */
  width?: number | string;
  /** Kép magassága */
  height?: number | string;
  /**
   * A betöltés csak akkor indul, ha a kép a látótérbe kerül
   * @default false
   */
  lazy?: boolean;
  /**
   * Betöltés alatt mutatott elem: kész elem, `createDOMElem` opciók vagy factory.
   * Alapértelmezetten a `createSpinner`. `false` esetén nem jelenik meg semmi.
   */
  spinner?: HTMLElement | DOMOptions | (() => HTMLElement | DOMOptions) | false;
  /**
   * Hiba esetén mutatott elem. Alapértelmezetten hibaüzenet újrapróbálás gombbal.
   */
  fallback?: HTMLElement | DOMOptions | ((error: Error, retry: () => void) => HTMLElement | DOMOptions);
  /**
   * Az alapértelmezett hibaüzenet szövege
   * @default "A kép nem tölthető be"
   */
  errorText?: TextValue;
  /**
   * Az újrapróbálás gomb szövege
   * @default "Újra"
   */
  retryText?: TextValue;
  /**
   * Letöltési mód. `"image"`: `Image` objektummal tölt (cross-origin is működik).
   * `"fetch"`: `fetch()`-csel tölt, blob URL-t használ (HTTP hibák, megszakítható, CORS szükséges).
   * @default "image"
   */
  strategy?: "image" | "fetch";
  /** Extra beállítások a `fetch()`-hez (`strategy: "fetch"`) */
  fetchInit?: RequestInit;
  /** Időkorlát ms-ban; túllépéskor hiba */
  timeout?: number;
  /**
   * Automatikus újrapróbálások száma a hibaállapot előtt
   * @default 0
   */
  retries?: number;
  /** A kép betöltődésekor hívódik */
  onLoad?: (img: HTMLImageElement) => void;
  /** Végleges hiba esetén hívódik */
  onError?: (error: Error) => void;
  /** Állapotváltáskor hívódik */
  onStateChange?: (state: ImageState) => void;
}

export interface VideoSource {
  /** Videó URL (mp4, webm, ogg ...) */
  src: string;
  /** MIME típus (pl. "video/webm"); ha nincs megadva, a kiterjesztésből következtetjük */
  type?: string;
}

export interface VideoParams {
  /** Szülő elem */
  parent: HTMLElement | string;
  /** Videó egyedi azonosítója */
  id: string;
  /** CSS osztály */
  class?: string;
  /**
   * Videó URL (mp4, webm, ogg ...), vagy több forrás tömbje; a böngésző az első lejátszhatót használja
   */
  src: string | VideoSource[];
  /** Előnézeti kép a lejátszás megkezdéséig */
  poster?: string;
  /** Videó felirat */
  caption?: TextValue;
  /** Elérhetőségi felirat a lejátszónak */
  ariaLabel?: TextValue;
  /** Videó szélessége (a keret betöltés és hiba alatt is ekkora) */
  width?: number | string;
  /** Videó magassága (a keret betöltés és hiba alatt is ekkora) */
  height?: number | string;
  /**
   * Lejátszó vezérlők megjelenítése
   * @default true
   */
  controls?: boolean;
  /**
   * Automatikus lejátszás (a böngészők miatt némítva indul)
   * @default false
   */
  autoplay?: boolean;
  /**
   * Végtelenített lejátszás
   * @default false
   */
  loop?: boolean;
  /**
   * Némítás (autoplay esetén alapból igaz)
   * @default false
   */
  muted?: boolean;
  /**
   * Inline lejátszás mobilon (nem lép teljes képernyőre)
   * @default true
   */
  playsInline?: boolean;
  /**
   * Mennyit töltsön előre a böngésző. `"none"` esetén a videó azonnal kész állapotú, a hibát csak lejátszáskor jelzi.
   * @default "metadata"
   */
  preload?: "none" | "metadata" | "auto";
  /**
   * A betöltés csak akkor indul, ha a videó a látótérbe kerül
   * @default false
   */
  lazy?: boolean;
  /**
   * Betöltés alatt mutatott elem: kész elem, `createDOMElem` opciók vagy factory.
   * Alapértelmezetten a `createSpinner`. `false` esetén nem jelenik meg semmi.
   */
  spinner?: HTMLElement | DOMOptions | (() => HTMLElement | DOMOptions) | false;
  /**
   * Hiba esetén mutatott elem. Alapértelmezetten hibaüzenet újrapróbálás gombbal.
   */
  fallback?: HTMLElement | DOMOptions | ((error: Error, retry: () => void) => HTMLElement | DOMOptions);
  /**
   * Az alapértelmezett hibaüzenet szövege
   * @default "A videó nem tölthető be"
   */
  errorText?: TextValue;
  /**
   * Az újrapróbálás gomb szövege
   * @default "Újra"
   */
  retryText?: TextValue;
  /** Időkorlát ms-ban; túllépéskor hiba */
  timeout?: number;
  /**
   * Automatikus újrapróbálások száma a hibaállapot előtt
   * @default 0
   */
  retries?: number;
  /** A videó betöltődésekor (metaadatok készen) hívódik */
  onLoad?: (video: HTMLVideoElement) => void;
  /** Végleges hiba esetén hívódik */
  onError?: (error: Error) => void;
  /** Állapotváltáskor hívódik */
  onStateChange?: (state: ImageState) => void;
}

export interface MusicTrack {
  /** Hangfájl URL (mp3, ogg, wav, m4a ...) */
  src: string;
  /** MIME típus (pl. "audio/mpeg"); opcionális */
  type?: string;
  /** Szám címe */
  title?: TextValue;
  /** Előadó */
  artist?: TextValue;
  /** Borítókép URL */
  cover?: string;
}

export type MusicPlayerState = "paused" | "playing" | "loading" | "error";

export interface MusicPlayerParams {
  /** Szülő elem */
  parent: HTMLElement | string;
  /** Lejátszó egyedi azonosítója */
  id: string;
  /** CSS osztály */
  class?: string;
  /** Számok (egy szám is lehet, ekkor nincs lejátszási lista) */
  tracks: MusicTrack[];
  /**
   * Kezdő szám indexe
   * @default 0
   */
  startIndex?: number;
  /**
   * Automatikus lejátszás (a böngészők csak felhasználói művelet után engedik)
   * @default false
   */
  autoplay?: boolean;
  /**
   * Ismétlés: `"none"` nincs, `"one"` az aktuális szám, `"all"` a teljes lista
   * @default "none"
   */
  loop?: "none" | "one" | "all";
  /**
   * Kezdő hangerő (0–1)
   * @default 1
   */
  volume?: number;
  /**
   * A lejátszási lista megjelenítése (több számnál)
   * @default true
   */
  showPlaylist?: boolean;
  /**
   * Hangerő-szabályzó megjelenítése
   * @default true
   */
  showVolume?: boolean;
  /** Elérhetőségi feliratok (fordításhoz) */
  labels?: {
    play?: TextValue;
    pause?: TextValue;
    prev?: TextValue;
    next?: TextValue;
    seek?: TextValue;
    volume?: TextValue;
    mute?: TextValue;
    unmute?: TextValue;
    playlist?: TextValue;
    /** A hibaüzenet szövege, ha a szám nem játszható le */
    error?: TextValue;
  };
  /** Lejátszás indulásakor hívódik */
  onPlay?: (track: MusicTrack, index: number) => void;
  /** Szünetelteléskor hívódik */
  onPause?: (track: MusicTrack, index: number) => void;
  /** Számváltáskor hívódik, az új szám indexével */
  onTrackChange?: (track: MusicTrack, index: number) => void;
  /** A lista (vagy az egyetlen szám) végének elérésekor hívódik */
  onEnded?: () => void;
  /** Állapotváltáskor hívódik */
  onStateChange?: (state: MusicPlayerState) => void;
}

export interface LinkParams {
  /** Szülő elem */
  parent: HTMLElement | string;
  /** Link egyedi azonosítója */
  id: string;
  /** CSS osztály */
  class?: string;
  /** Link szövege */
  text: TextValue;
  /** Link URL */
  href: string;
  /**
   * Link target attribútuma
   * @default "_self"
   */
  target?: "_blank" | "_self" | "_parent" | "_top";
  /** Kattintás esemény */
  click?: (e: Event) => void;
}

export interface CodeBlockParams {
  /** Szülő elem */
  parent: HTMLElement | string;
  /** Kódblokk egyedi azonosítója */
  id: string;
  /** CSS osztály */
  class?: string;
  /** Kód tartalma */
  code: string;
  /** Programozási nyelv (syntax highlighting) */
  language?: string;
  /**
   * Másolás gomb megjelenítése
   * @default true
   */
  copyable?: boolean;
}

export interface BlockquoteParams {
  /** Szülő elem */
  parent: HTMLElement | string;
  /** Idézet egyedi azonosítója */
  id: string;
  /** CSS osztály */
  class?: string;
  /** Idézet szövege */
  text: TextValue;
  /** Idézet szerzője */
  author?: TextValue;
}

export interface DividerParams {
  /** Szülő elem */
  parent: HTMLElement | string;
  /** Elválasztó egyedi azonosítója */
  id: string;
  /** CSS osztály */
  class?: string;
}

export interface AccordionItem {
  /** Accordion elem egyedi azonosítója */
  id: string;
  /** Accordion elem címe */
  title: TextValue;
  /** Accordion elem tartalma */
  content: DOMOptions | DOMOptions[];
  /**
   * Alapértelmezetten nyitva
   * @default false
   */
  open?: boolean;
}

export interface AccordionParams {
  /** Szülő elem */
  parent: HTMLElement | string;
  /** Accordion egyedi azonosítója */
  id: string;
  /** CSS osztály */
  class?: string;
  /** Accordion elemek tömbje */
  items: AccordionItem[];
  /**
   * Több elem egyidejű nyitva tartása
   * @default false
   */
  multiple?: boolean;
}

export interface TooltipParams {
  /** Szülő elem */
  parent: HTMLElement | string;
  /** Tooltip egyedi azonosítója */
  id: string;
  /** CSS osztály */
  class?: string;
  /** Tooltip szövege */
  text: TextValue;
  /**
   * Tooltip pozíciója
   * @default "top"
   */
  position?: "top" | "bottom" | "left" | "right";
  /**
   * Trigger esemény
   * @default "hover"
   */
  trigger?: "hover" | "click";
}

export interface AvatarParams {
  /** Szülő elem */
  parent: HTMLElement | string;
  /** Avatar egyedi azonosítója */
  id: string;
  /** CSS osztály */
  class?: string;
  /** Kép URL (ha nincs, monogram jelenik meg) */
  src?: string;
  /** Név (monogramhoz) */
  name?: string;
  /**
   * Avatar mérete
   * @default "md"
   */
  size?: "sm" | "md" | "lg";
  /**
   * Avatar alakja
   * @default "circle"
   */
  shape?: "circle" | "square";
}

export interface CustomSelectParams {
  /** Szülő elem */
  parent: HTMLElement | string;
  /** Select egyedi azonosítója */
  id: string;
  /** CSS osztály */
  class?: string;
  /** Select name attribútuma */
  name?: string;
  /** Select értéke */
  value?: string | number;
  /** Címke szövege */
  labelText?: TextValue;
  /** Placeholder szöveg */
  placeholder?: TextValue;
  /** Opciók tömbje */
  options: SelectOption[];
  /** Érték változás esemény */
  onChange?: (value: string | number) => void;
}

export interface CustomDatePickerParams {
  /** Szülő elem */
  parent: HTMLElement | string;
  /** Dátumválasztó egyedi azonosítója */
  id: string;
  /** CSS osztály */
  class?: string;
  /** Kezdő dátum érték (YYYY-MM-DD) */
  value?: string;
  /** Minimális dátum (YYYY-MM-DD) */
  min?: string;
  /** Maximális dátum (YYYY-MM-DD) */
  max?: string;
  /** Címke szövege */
  labelText?: TextValue;
  /** Placeholder szöveg */
  placeholder?: TextValue;
  /** Érték változás esemény */
  onChange?: (value: string) => void;
}

export interface CustomWeekPickerParams {
  /** Szülő elem */
  parent: HTMLElement | string;
  /** Hétválasztó egyedi azonosítója */
  id: string;
  /** CSS osztály */
  class?: string;
  /** Kezdő hét érték (YYYY-Www) */
  value?: string;
  /** Minimális hét (YYYY-Www) */
  min?: string;
  /** Maximális hét (YYYY-Www) */
  max?: string;
  /** Címke szövege */
  labelText?: TextValue;
  /** Placeholder szöveg */
  placeholder?: TextValue;
  /** Érték változás esemény */
  onChange?: (value: string) => void;
}

export interface CustomMonthPickerParams {
  /** Szülő elem */
  parent: HTMLElement | string;
  /** Hónapválasztó egyedi azonosítója */
  id: string;
  /** CSS osztály */
  class?: string;
  /** Kezdő hónap érték (YYYY-MM) */
  value?: string;
  /** Minimális hónap (YYYY-MM) */
  min?: string;
  /** Maximális hónap (YYYY-MM) */
  max?: string;
  /** Címke szövege */
  labelText?: TextValue;
  /** Placeholder szöveg */
  placeholder?: TextValue;
  /** Érték változás esemény */
  onChange?: (value: string) => void;
}

export interface CustomDateTimePickerParams {
  /** Szülő elem */
  parent: HTMLElement | string;
  /** Dátum-idő választó egyedi azonosítója */
  id: string;
  /** CSS osztály */
  class?: string;
  /** Kezdő dátum-idő érték (YYYY-MM-DDTHH:mm) */
  value?: string;
  /** Minimális dátum-idő (YYYY-MM-DDTHH:mm) */
  min?: string;
  /** Maximális dátum-idő (YYYY-MM-DDTHH:mm) */
  max?: string;
  /** Címke szövege */
  labelText?: TextValue;
  /** Placeholder szöveg */
  placeholder?: TextValue;
  /** Érték változás esemény */
  onChange?: (value: string) => void;
}

export interface CustomDateRangePickerParams {
  /** Szülő elem */
  parent: HTMLElement | string;
  /** Dátumtartomány választó egyedi azonosítója */
  id: string;
  /** CSS osztály */
  class?: string;
  /** Kezdő dátum (YYYY-MM-DD) */
  startValue?: string;
  /** Vég dátum (YYYY-MM-DD) */
  endValue?: string;
  /** Minimális dátum (YYYY-MM-DD) */
  min?: string;
  /** Maximális dátum (YYYY-MM-DD) */
  max?: string;
  /** Címke szövege */
  labelText?: TextValue;
  /** Placeholder szöveg */
  placeholder?: TextValue;
  /** Érték változás esemény (start, end) */
  onChange?: (start: string, end: string) => void;
}

export interface DragAndDropFileInputParams {
  /** Szülő elem */
  parent: HTMLElement | string;
  /** Egyedi azonosító */
  id: string;
  /** CSS osztály */
  class?: string;
  /** Támogatott fájlkiterjesztések (pl. [".jpg", ".pdf"]) */
  accept?: string[];
  /** Több fájl feltöltésének engedélyezése */
  multiple?: boolean;
  /** Maximum feltölthető fájlok száma */
  maxFiles?: number;
  /** Címke szöveg */
  labelText?: TextValue;
  /** Drop zóna szövege */
  dropText?: TextValue;
  /** Callback a fájlok kiválasztása után */
  onFiles?: (files: File[]) => void;
}

export interface DrawerMenuItem {
  /** Megjelenő szöveg */
  label: TextValue;
  /** Link cél URL. Ha nincs megadva, szöveges fejléc lesz */
  href?: string;
  /** Almenü pontok */
  children?: DrawerMenuItem[];
  /**
   * Összecsukható menünél a csoport kezdetben nyitva van-e.
   * Alapból csak az nyitott, amelyik az aktuális oldalt tartalmazza.
   */
  open?: boolean;
}

/** Alias for backward compatibility – use MenuItem instead */
export type MenuItem = DrawerMenuItem;

export interface MenuParams {
  /** Menü egyedi azonosítója */
  id: string;
  /** Menüpontok tömbje */
  items: MenuItem[];
  /**
   * A gyermekekkel rendelkező csoportok összecsukhatók (fejlécre kattintva nyílnak/zárulnak).
   * Az aktuális oldalt tartalmazó csoport kezdetben nyitva van.
   * @default false
   */
  collapsible?: boolean;
}

export interface DrawerParams {
  /** Drawer egyedi azonosítója */
  id: string;
  /** Drawer címe */
  title?: TextValue;
  /** Gyermek elemek (createMenu helyett) */
  children?: (DOMOptions | HTMLElement)[];
  /** Menüpontok (ha nincs children, createMenu-be csomagolva jelennek meg) */
  items?: DrawerMenuItem[];
  /**
   * Alapértelmezett állapot
   * @default "closed"
   */
  defaultState?: "open" | "closed";
  /**
   * Overlay réteg megjelenítése
   * @default false
   */
  hasOverlay?: boolean;
  /**
   * Drawer mód
   * @default "overlay"
   */
  mode?: "overlay" | "push";
}

export interface CarouselSlide {
  /** Slide egyedi azonosítója */
  id?: string;
  /** Slide CSS osztálya */
  class?: string;
  /** Ikon szöveg/emoji */
  icon?: string;
  /** Slide címe */
  title?: TextValue;
  /** Slide leírása */
  description?: TextValue;
  /** Call-to-action gomb (href nélkül button, href-fel link) */
  cta?: { text: TextValue; href?: string; click?: (e: Event) => void };
  /** Egyedi tartalom a slide-ban */
  content?: DOMOptions | HTMLElement | (DOMOptions | HTMLElement)[];
}

export interface CarouselParams {
  /** Szülő elem */
  parent: HTMLElement | string;
  /** Carousel egyedi azonosítója */
  id: string;
  /** Carousel CSS osztálya */
  class?: string;
  /** Slide-ok tömbje */
  slides: CarouselSlide[];
  /**
   * Nyíl megjelenítése
   * @default true
   */
  showArrows?: boolean;
  /**
   * Dot indikátorok megjelenítése
   * @default true
   */
  showDots?: boolean;
  /**
   * Kezdő slide indexe
   * @default 0
   */
  startIndex?: number;
  /** Aktív slide váltáskor hívódik, az új indexszel */
  onChange?: (index: number) => void;
  /** Egy slide szélessége (CSS érték, pl. "320px"); a `--carousel-slide-w` változót állítja */
  slideWidth?: string;
  /** A színpad magassága (CSS érték, pl. "420px"); a `--carousel-height` változót állítja */
  height?: string;
  /** Elérhetőségi feliratok (fordításhoz) */
  labels?: {
    stage?: TextValue;
    nav?: TextValue;
    prev?: TextValue;
    next?: TextValue;
    /** A pötty felirata, 1-alapú sorszámmal */
    dot?: (n: number) => string;
  };
}

export interface TimelineItem {
  /** Időszak, pl. "2021 – jelenleg" */
  period: TextValue;
  /** Cím / pozíció */
  title: TextValue;
  /** Alcím (pl. cég) */
  subtitle?: TextValue;
  /** Leírás; kompakt nézetben rejtett */
  description?: TextValue;
  /** Kiemelt kis jelvény, pl. "jelenlegi" */
  badge?: TextValue;
}

export interface TimelineParams {
  /** Szülő elem */
  parent: HTMLElement | string;
  /** Idővonal egyedi azonosítója */
  id: string;
  /** CSS osztály */
  class?: string;
  /** Bejegyzések */
  items: TimelineItem[];
  /**
   * Kompakt nézet (a leírások rejtettek)
   * @default false
   */
  compact?: boolean;
  /** Az idővonal elérhetőségi neve (aria-label) */
  ariaLabel?: TextValue;
}
