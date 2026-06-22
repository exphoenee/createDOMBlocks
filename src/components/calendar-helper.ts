import { createDOMElem } from "domelemjs";

export const MONTHS = [
  "Januar", "Februar", "Marcius", "Aprilis", "Majus", "Junius",
  "Julius", "Augusztus", "Szeptember", "October", "November", "December",
] as const;

export const DAY_NAMES = ["H", "K", "S", "Cs", "P", "Szo", "V"] as const;

export const MONTH_NAMES_SHORT = MONTHS.map((m) => m.slice(0, 3)) as readonly string[];

/** Format a date as YYYY-MM-DD */
export function formatDateStr(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

/** Get the number of days in a given month */
export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

/** Get the day of week (0=Sunday) for the first day of a month */
export function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

/** Create calendar month/year header with prev/next navigation */
export function createCalendarHeader(
  title: string,
  onPrev: () => void,
  onNext: () => void,
): ReturnType<typeof createDOMElem> {
  return createDOMElem({
    tag: "div",
    attrs: { class: "calendar-header" },
    children: [
      createDOMElem({
        tag: "button",
        text: "\u25C0",
        attrs: { class: "calendar-nav-btn" },
        handleEvent: { event: "click", cb: (e: Event) => { e.stopPropagation(); onPrev(); } },
      }),
      createDOMElem({ tag: "span", text: title, attrs: { class: "calendar-title" } }),
      createDOMElem({
        tag: "button",
        text: "\u25B6",
        attrs: { class: "calendar-nav-btn" },
        handleEvent: { event: "click", cb: (e: Event) => { e.stopPropagation(); onNext(); } },
      }),
    ],
  });
}

/** Create the day names header row */
export function createDayNamesHeader(): ReturnType<typeof createDOMElem> {
  return createDOMElem({
    tag: "div",
    attrs: { class: "calendar-days-header" },
    children: DAY_NAMES.map((d) =>
      createDOMElem({ tag: "span", text: d, attrs: { class: "calendar-day-name" } })
    ),
  });
}

/** Create an empty day cell */
export function createEmptyDay(): ReturnType<typeof createDOMElem> {
  return createDOMElem({ tag: "span", attrs: { class: "calendar-day empty" } });
}

/** Create a day cell with optional selected/disabled styling and click handler */
export function createDayCell(
  day: number,
  extraClass: string,
  onClick?: (e: Event) => void,
): ReturnType<typeof createDOMElem> {
  return createDOMElem({
    tag: "span",
    text: String(day),
    attrs: { class: `calendar-day${extraClass}` },
    handleEvent: onClick ? { event: "click", cb: onClick } : undefined,
  });
}

/** Build a full day grid for a month (empty cells + day cells) */
export function createDayGrid(
  year: number,
  month: number,
  dayCellBuilder: (day: number, dateStr: string) => ReturnType<typeof createDOMElem>,
): ReturnType<typeof createDOMElem> {
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const grid: ReturnType<typeof createDOMElem>[] = [];

  for (let i = 0; i < firstDay; i++) {
    grid.push(createEmptyDay());
  }
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = formatDateStr(year, month, day);
    grid.push(dayCellBuilder(day, dateStr));
  }

  return createDOMElem({ tag: "div", attrs: { class: "calendar-grid" }, children: grid });
}

/** Build a full month calendar layout: header + day names + day grid */
export function buildMonthCalendar(
  year: number,
  month: number,
  onPrev: () => void,
  onNext: () => void,
  dayCellBuilder: (day: number, dateStr: string) => ReturnType<typeof createDOMElem>,
): ReturnType<typeof createDOMElem>[] {
  return [
    createCalendarHeader(`${MONTHS[month]} ${year}`, onPrev, onNext),
    createDayNamesHeader(),
    createDayGrid(year, month, dayCellBuilder),
  ];
}

/** Register a document click handler to close a calendar element */
export function setupCalendarCloseHandler(calendarEl: HTMLElement): void {
  document.addEventListener("click", () => {
    calendarEl.style.display = "none";
  });
}

/** Toggle calendar visibility and re-render */
export function toggleCalendar(
  calendarEl: HTMLElement,
  rerender: () => void,
): void {
  const isVisible = calendarEl.style.display !== "none";
  calendarEl.style.display = isVisible ? "none" : "block";
  if (!isVisible) rerender();
}

/** Get ISO week number for a date */
export function getISOWeek(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

/** Get list of ISO week numbers in a month */
export function getWeeksInMonth(year: number, month: number): number[] {
  const weeks: number[] = [];
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const firstWeek = getISOWeek(firstDay);
  const lastWeek = getISOWeek(lastDay);
  for (let w = firstWeek; w <= lastWeek; w++) weeks.push(w);
  return weeks;
}
