import { createDOMElem } from "domelemjs";
import type { CustomWeekPickerParams } from "../types";

export function createCustomWeekPicker(config: CustomWeekPickerParams): HTMLElement {
  let selectedWeek = config.value || "";

  const rootAttrs: Record<string, string> = {
    class: `custom-week-picker${config.class ? ` ${config.class}` : ""}`,
  };
  if (config.id) rootAttrs.id = config.id;

  const inputAttrs: Record<string, string> = {
    type: "text",
    readonly: "true",
    class: "custom-week-picker-input",
    placeholder: config.placeholder || "Valassz hetet...",
  };
  if (config.id) inputAttrs.id = `${config.id}-input`;
  if (selectedWeek) inputAttrs.value = selectedWeek;

  let currentYear = new Date().getFullYear();
  let currentMonth = new Date().getMonth();

  function getWeeksInMonth(year: number, month: number): number[] {
    const weeks: number[] = [];
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const firstWeek = getISOWeek(firstDay);
    const lastWeek = getISOWeek(lastDay);
    for (let w = firstWeek; w <= lastWeek; w++) weeks.push(w);
    return weeks;
  }

  function getISOWeek(date: Date): number {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  }

  const months = ["Januar", "Februar", "Marcius", "Aprilis", "Majus", "Junius", "Julius", "Augusztus", "Szeptember", "October", "November", "December"];

  function render(): ReturnType<typeof createDOMElem>[] {
    const weeks = getWeeksInMonth(currentYear, currentMonth);

    const header = createDOMElem({
      tag: "div",
      attrs: { class: "calendar-header" },
      children: [
        createDOMElem({
          tag: "button",
          text: "\u25C0",
          attrs: { class: "calendar-nav-btn" },
          handleEvent: { event: "click", cb: (e: Event) => {
            e.stopPropagation();
            currentMonth = currentMonth === 0 ? 11 : currentMonth - 1;
            if (currentMonth === 11) currentYear--;
            calendarEl.replaceChildren(...render());
          }},
        }),
        createDOMElem({ tag: "span", text: `${months[currentMonth]} ${currentYear}`, attrs: { class: "calendar-title" } }),
        createDOMElem({
          tag: "button",
          text: "\u25B6",
          attrs: { class: "calendar-nav-btn" },
          handleEvent: { event: "click", cb: (e: Event) => {
            e.stopPropagation();
            currentMonth = currentMonth === 11 ? 0 : currentMonth + 1;
            if (currentMonth === 0) currentYear++;
            calendarEl.replaceChildren(...render());
          }},
        }),
      ],
    });

    const weekList = createDOMElem({
      tag: "div",
      attrs: { class: "week-list" },
      children: weeks.map((w) => {
        const weekStr = `${currentYear}-W${String(w).padStart(2, "0")}`;
        const isSelected = weekStr === selectedWeek;
        return createDOMElem({
          tag: "span",
          text: `${w}. hét`,
          attrs: { class: `week-item${isSelected ? " selected" : ""}` },
          handleEvent: {
            event: "click",
            cb: (e: Event) => {
              e.stopPropagation();
              selectedWeek = weekStr;
              (input as HTMLInputElement).value = weekStr;
              calendarEl.style.display = "none";
              config.onChange?.(weekStr);
            },
          },
        });
      }),
    });

    return [header, weekList];
  }

  const calendarEl = createDOMElem({
    tag: "div",
    attrs: { class: "custom-week-picker-calendar" },
    style: { display: "none" },
  });
  calendarEl.append(...render());

  const input = createDOMElem({
    tag: "input",
    attrs: inputAttrs,
    handleEvent: {
      event: "click",
      cb: (e: Event) => {
        e.stopPropagation();
        const isVisible = calendarEl.style.display !== "none";
        calendarEl.style.display = isVisible ? "none" : "block";
        if (!isVisible) calendarEl.replaceChildren(...render());
      },
    },
  });

  document.addEventListener("click", () => { calendarEl.style.display = "none"; });

  return createDOMElem({
    tag: "div",
    parent: config.parent,
    attrs: rootAttrs,
    children: [
      ...(config.labelText ? [createDOMElem({ tag: "label", text: config.labelText, attrs: { class: "custom-week-picker-label" } })] : []),
      { tag: "div", attrs: { class: "custom-week-picker-wrapper" }, children: [input, calendarEl] },
    ],
  });
}
