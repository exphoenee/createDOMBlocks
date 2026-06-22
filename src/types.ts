import type { CreateDOMElemOptions, EventHandler } from "domelemjs";

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
  placeholder?: string;
  /** Címke szövege */
  labelText?: string;
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
  text: string;
  /** Opció értéke */
  value: string | number;
}

export interface SelectParams extends BaseInputParams {
  /** Legördülő opciók tömbje */
  options: SelectOption[];
}

export interface RadioOption {
  /** Megjelenő szöveg */
  text: string;
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
  text?: string;
  /** Gomb stílusa */
  style?: CreateDOMElemOptions["style"];
  /** Kattintás esemény */
  click?: (e: Event) => void;
  /** Egyéb eseménykezelők */
  handleEvent?: EventHandler | EventHandler[];
}

export interface ButtonInputParams extends BaseInputParams {
  /**
   * Gomb típusa
   * @default "button"
   */
  type?: "button" | "submit" | "reset";
  /** Gomb szövege */
  text?: string;
}

export interface ParagraphParams {
  /** Szülő elem */
  parent: HTMLElement | string;
  /** Bekezdés szövege */
  text?: string;
  /** Bekezdés egyedi azonosítója */
  id: string;
  /** CSS osztály */
  class?: string;
}

export interface TitleParams {
  /** Szülő elem */
  parent: HTMLElement | string;
  /** Címsor szövege */
  text?: string;
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
  sum?: string;
  /** Végösszeg oszlop fejléce */
  total?: string;
  /** Sorszám oszlop fejléce */
  rowNr?: string;
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
}

export interface ModalParams {
  /** Szülő elem (ha nincs megadva, body-hoz fűződik) */
  parent?: HTMLElement | string;
  /** Modál egyedi azonosítója */
  id: string;
  /** CSS osztály */
  class?: string;
}

export interface ModalContent {
  /** Modál címe */
  modalTitle: string;
  /** Modál tartalma */
  body: CreateDOMElemOptions | CreateDOMElemOptions[];
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
  placeholder?: string;
  /** Címke szövege */
  labelText?: string;
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
  title?: string;
  /** Kártya tartalma */
  body?: CreateDOMElemOptions | CreateDOMElemOptions[];
  /** Kártya lábléce */
  footer?: CreateDOMElemOptions | CreateDOMElemOptions[];
}

export interface ContainerParams {
  /** Szülő elem */
  parent: HTMLElement | string;
  /** Konténer egyedi azonosítója */
  id: string;
  /** CSS osztály */
  class?: string;
  /** Gyermek elemek */
  children?: (CreateDOMElemOptions | HTMLElement)[];
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
}

export interface NavItem {
  /** Megjelenő szöveg */
  text: string;
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
  text: string;
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
  label: string;
  /** Tab tartalma */
  content: CreateDOMElemOptions | CreateDOMElemOptions[];
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
  title?: string;
  /** Alert üzenete */
  message: string;
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
  message: string;
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
  text?: string;
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
  label?: string;
  /**
   * Százalék megjelenítése
   * @default false
   */
  showPercentage?: boolean;
  /** Progress bar színe */
  color?: string;
}

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
  alt?: string;
  /** Kép felirat */
  caption?: string;
  /** Kép szélessége */
  width?: number | string;
  /** Kép magassága */
  height?: number | string;
  /**
   * Lusta betöltés
   * @default false
   */
  lazy?: boolean;
}

export interface LinkParams {
  /** Szülő elem */
  parent: HTMLElement | string;
  /** Link egyedi azonosítója */
  id: string;
  /** CSS osztály */
  class?: string;
  /** Link szövege */
  text: string;
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
  text: string;
  /** Idézet szerzője */
  author?: string;
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
  title: string;
  /** Accordion elem tartalma */
  content: CreateDOMElemOptions | CreateDOMElemOptions[];
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
  text: string;
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
  labelText?: string;
  /** Placeholder szöveg */
  placeholder?: string;
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
  labelText?: string;
  /** Placeholder szöveg */
  placeholder?: string;
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
  labelText?: string;
  /** Placeholder szöveg */
  placeholder?: string;
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
  labelText?: string;
  /** Placeholder szöveg */
  placeholder?: string;
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
  labelText?: string;
  /** Placeholder szöveg */
  placeholder?: string;
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
  labelText?: string;
  /** Placeholder szöveg */
  placeholder?: string;
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
  labelText?: string;
  /** Drop zóna szövege */
  dropText?: string;
  /** Callback a fájlok kiválasztása után */
  onFiles?: (files: File[]) => void;
}

export interface DrawerMenuItem {
  /** Megjelenő szöveg */
  label: string;
  /** Link cél URL. Ha nincs megadva, szöveges fejléc lesz */
  href?: string;
  /** Almenü pontok */
  children?: DrawerMenuItem[];
}

/** Alias for backward compatibility – use MenuItem instead */
export type MenuItem = DrawerMenuItem;

export interface MenuParams {
  /** Menü egyedi azonosítója */
  id: string;
  /** Menüpontok tömbje */
  items: MenuItem[];
}

export interface DrawerParams {
  /** Drawer egyedi azonosítója */
  id: string;
  /** Drawer címe */
  title?: string;
  /** Gyermek elemek (createMenu helyett) */
  children?: (CreateDOMElemOptions | HTMLElement)[];
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
  title?: string;
  /** Slide leírása */
  description?: string;
  /** Call-to-action gomb (href nélkül button, href-fel link) */
  cta?: { text: string; href?: string; click?: (e: Event) => void };
  /** Egyedi tartalom a slide-ban */
  content?: CreateDOMElemOptions | CreateDOMElemOptions[];
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
}
