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
  parent: HTMLElement | string;
  id: string;
  type?: string;
  class?: string;
  name?: string;
  value?: string | number;
  placeholder?: string;
  labelText?: string;
  labelfirst?: boolean;
  checked?: boolean;
  onChange?: (e: Event) => void;
  click?: (e: Event) => void;
  handleEvent?: EventHandler | EventHandler[];
  min?: number;
  max?: number;
  step?: number;
  start?: number;
  rows?: number;
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
  text: string;
  value: string | number;
}

export interface SelectParams extends BaseInputParams {
  options: SelectOption[];
}

export interface RadioOption {
  text: string;
  value: string | number;
  onChange?: (e: Event) => void;
  click?: (e: Event) => void;
  handleEvent?: EventHandler | EventHandler[];
}

export interface RadioParams extends BaseInputParams {
  options: RadioOption[];
}

export interface TextareaParams extends BaseInputParams {
  type?: "textarea";
}

export interface ButtonParams {
  parent: HTMLElement | string;
  id: string;
  class?: string;
  text?: string;
  style?: CreateDOMElemOptions["style"];
  click?: (e: Event) => void;
  handleEvent?: EventHandler | EventHandler[];
}

export interface ButtonInputParams extends BaseInputParams {
  type?: "button" | "submit" | "reset";
  text?: string;
}

export interface ParagraphParams {
  parent: HTMLElement | string;
  text?: string;
  id: string;
  class?: string;
}

export interface TitleParams {
  parent: HTMLElement | string;
  text?: string;
  id: string;
  class?: string;
}

export interface ListParams {
  parent: HTMLElement | string;
  id: string;
  class?: string;
  start?: number;
}

export interface TableCellNames {
  sum?: string;
  total?: string;
  rowNr?: string;
}

export interface TableParams {
  parent: HTMLElement | string;
  id: string;
  class?: string;
  hasHeader?: boolean;
  hasFooter?: boolean;
  showHeader?: boolean;
  showFooter?: boolean;
  addRowNumbers?: boolean;
  sumRowValues?: boolean;
  cellNames?: TableCellNames;
  precision?: number;
}

export interface ModalParams {
  parent?: HTMLElement | string;
  id: string;
  class?: string;
}

export interface ModalContent {
  modalTitle: string;
  body: CreateDOMElemOptions | CreateDOMElemOptions[];
}

export interface ModalActions {
  okAction?: (e?: Event) => void;
  cancelAction?: (e?: Event) => void;
  closeAction?: (e?: Event) => void;
}

export interface FormInputConfig {
  type: InputType;
  id: string;
  class?: string;
  name?: string;
  value?: string | number;
  placeholder?: string;
  labelText?: string;
  labelfirst?: boolean;
  checked?: boolean;
  min?: number;
  max?: number;
  step?: number;
  rows?: number;
  cols?: number;
  onChange?: (e: Event) => void;
  click?: (e: Event) => void;
  handleEvent?: EventHandler | EventHandler[];
  options?: SelectOption[];
}

export interface FormConfig {
  parent: HTMLElement | string;
  id: string;
  class?: string;
  action?: string;
  method?: "GET" | "POST" | "PUT" | "DELETE";
  inputs: FormInputConfig[];
  onSubmit?: (e: Event) => void;
}

export interface CardParams {
  parent: HTMLElement | string;
  id: string;
  class?: string;
  title?: string;
  body?: CreateDOMElemOptions | CreateDOMElemOptions[];
  footer?: CreateDOMElemOptions | CreateDOMElemOptions[];
}

export interface ContainerParams {
  parent: HTMLElement | string;
  id: string;
  class?: string;
  children?: (CreateDOMElemOptions | HTMLElement)[];
}

export interface GridParams {
  parent: HTMLElement | string;
  id: string;
  class?: string;
  columns?: number;
  gap?: string;
}

export interface NavItem {
  text: string;
  href?: string;
  click?: (e: Event) => void;
  active?: boolean;
  children?: NavItem[];
}

export interface NavParams {
  parent: HTMLElement | string;
  id: string;
  class?: string;
  items: NavItem[];
}

export interface BreadcrumbItem {
  text: string;
  href?: string;
  click?: (e: Event) => void;
}

export interface BreadcrumbParams {
  parent: HTMLElement | string;
  id: string;
  class?: string;
  items: BreadcrumbItem[];
  separator?: string;
}

export interface TabItem {
  id: string;
  label: string;
  content: CreateDOMElemOptions | CreateDOMElemOptions[];
}

export interface TabsParams {
  parent: HTMLElement | string;
  id: string;
  class?: string;
  tabs: TabItem[];
  activeTab?: string;
}

export interface AlertParams {
  parent: HTMLElement | string;
  id: string;
  class?: string;
  type?: "success" | "error" | "warning" | "info";
  title?: string;
  message: string;
  dismissible?: boolean;
  onDismiss?: (e?: Event) => void;
}

export interface ToastParams {
  parent: HTMLElement | string;
  id: string;
  class?: string;
  type?: "success" | "error" | "warning" | "info";
  message: string;
  duration?: number;
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
  width?: string;
}

export interface BadgeParams {
  parent: HTMLElement | string;
  id: string;
  class?: string;
  text?: string;
  type?: "success" | "error" | "warning" | "info" | "neutral";
}

export interface SpinnerParams {
  parent: HTMLElement | string;
  id: string;
  class?: string;
  size?: "sm" | "md" | "lg";
  color?: string;
}

export interface ProgressBarParams {
  parent: HTMLElement | string;
  id: string;
  class?: string;
  value: number;
  max?: number;
  label?: string;
  showPercentage?: boolean;
  color?: string;
}

export interface ImageParams {
  parent: HTMLElement | string;
  id: string;
  class?: string;
  src: string;
  alt?: string;
  caption?: string;
  width?: number | string;
  height?: number | string;
  lazy?: boolean;
}

export interface LinkParams {
  parent: HTMLElement | string;
  id: string;
  class?: string;
  text: string;
  href: string;
  target?: "_blank" | "_self" | "_parent" | "_top";
  click?: (e: Event) => void;
}

export interface CodeBlockParams {
  parent: HTMLElement | string;
  id: string;
  class?: string;
  code: string;
  language?: string;
  copyable?: boolean;
}

export interface BlockquoteParams {
  parent: HTMLElement | string;
  id: string;
  class?: string;
  text: string;
  author?: string;
}

export interface DividerParams {
  parent: HTMLElement | string;
  id: string;
  class?: string;
}

export interface AccordionItem {
  id: string;
  title: string;
  content: CreateDOMElemOptions | CreateDOMElemOptions[];
  open?: boolean;
}

export interface AccordionParams {
  parent: HTMLElement | string;
  id: string;
  class?: string;
  items: AccordionItem[];
  multiple?: boolean;
}

export interface TooltipParams {
  parent: HTMLElement | string;
  id: string;
  class?: string;
  text: string;
  position?: "top" | "bottom" | "left" | "right";
  trigger?: "hover" | "click";
}

export interface AvatarParams {
  parent: HTMLElement | string;
  id: string;
  class?: string;
  src?: string;
  name?: string;
  size?: "sm" | "md" | "lg";
  shape?: "circle" | "square";
}

export interface CustomSelectParams {
  parent: HTMLElement | string;
  id: string;
  class?: string;
  name?: string;
  value?: string | number;
  labelText?: string;
  placeholder?: string;
  options: SelectOption[];
  onChange?: (value: string | number) => void;
}

export interface CustomDatePickerParams {
  parent: HTMLElement | string;
  id: string;
  class?: string;
  value?: string;
  min?: string;
  max?: string;
  labelText?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
}

export interface CustomWeekPickerParams {
  parent: HTMLElement | string;
  id: string;
  class?: string;
  value?: string;
  min?: string;
  max?: string;
  labelText?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
}

export interface CustomMonthPickerParams {
  parent: HTMLElement | string;
  id: string;
  class?: string;
  value?: string;
  min?: string;
  max?: string;
  labelText?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
}

export interface CustomDateTimePickerParams {
  parent: HTMLElement | string;
  id: string;
  class?: string;
  value?: string;
  min?: string;
  max?: string;
  labelText?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
}

export interface CustomDateRangePickerParams {
  parent: HTMLElement | string;
  id: string;
  class?: string;
  startValue?: string;
  endValue?: string;
  min?: string;
  max?: string;
  labelText?: string;
  placeholder?: string;
  onChange?: (start: string, end: string) => void;
}

export interface DragAndDropFileInputParams {
  parent: HTMLElement | string;
  id: string;
  class?: string;
  accept?: string[];
  multiple?: boolean;
  maxFiles?: number;
  labelText?: string;
  dropText?: string;
  onFiles?: (files: File[]) => void;
}

export interface DrawerMenuItem {
  label: string;
  href?: string;
  children?: DrawerMenuItem[];
}

/** Alias for backward compatibility – use MenuItem instead */
export type MenuItem = DrawerMenuItem;

export interface MenuParams {
  id: string;
  items: MenuItem[];
}

export interface DrawerParams {
  id: string;
  title?: string;
  children?: (CreateDOMElemOptions | HTMLElement)[];
  items?: DrawerMenuItem[];
  defaultState?: "open" | "closed";
  hasOverlay?: boolean;
  mode?: "overlay" | "push";
}

export interface CarouselSlide {
  id?: string;
  class?: string;
  icon?: string;
  title?: string;
  description?: string;
  cta?: { text: string; href?: string; click?: (e: Event) => void };
  content?: CreateDOMElemOptions | CreateDOMElemOptions[];
}

export interface CarouselParams {
  parent: HTMLElement | string;
  id: string;
  class?: string;
  slides: CarouselSlide[];
  showArrows?: boolean;
  showDots?: boolean;
}
