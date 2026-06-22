import { createDOMElem } from "domelemjs";
import type { CustomWeekPickerParams } from "../types";
import {
  MONTHS,
  createCalendarHeader,
  setupCalendarCloseHandler,
  toggleCalendar,
  getWeeksInMonth,
} from "./calendar-helper";

export function createCustomWeekPicker(params: CustomWeekPickerParams): HTMLElement {
  let selectedWeek = params.value || "";
  let currentYear = new Date().getFullYear();
  let currentMonth = new Date().getMonth();

  const rootAttrs: Record<string, string> = {
    class: `custom-week-picker${params.class ? ` ${params.class}` : ""}`,
  };
  if (params.id) rootAttrs.id = params.id;

  const input = createDOMElem({
    tag: "input",
    attrs: {
      type: "text",
      readonly: "true",
      class: "custom-week-picker-input",
      placeholder: params.placeholder || "Valassz hetet...",
      ...(params.id ? { id: `${params.id}-input` } : {}),
      ...(selectedWeek ? { value: selectedWeek } : {}),
    },
    handleEvent: {
      event: "click",
      cb: (e: Event) => {
        e.stopPropagation();
        toggleCalendar(calendarEl, () => calendarEl.replaceChildren(...render()));
      },
    },
  });

  const calendarEl = createDOMElem({
    tag: "div",
    attrs: { class: "custom-week-picker-calendar" },
    style: { display: "none" },
  });

  function render(): ReturnType<typeof createDOMElem>[] {
    const weeks = getWeeksInMonth(currentYear, currentMonth);

    return [
      createCalendarHeader(
        `${MONTHS[currentMonth]} ${currentYear}`,
        () => {
          currentMonth = currentMonth === 0 ? 11 : currentMonth - 1;
          if (currentMonth === 11) currentYear--;
          calendarEl.replaceChildren(...render());
        },
        () => {
          currentMonth = currentMonth === 11 ? 0 : currentMonth + 1;
          if (currentMonth === 0) currentYear++;
          calendarEl.replaceChildren(...render());
        },
      ),
      createDOMElem({
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
                params.onChange?.(weekStr);
              },
            },
          });
        }),
      }),
    ];
  }

  calendarEl.append(...render());
  setupCalendarCloseHandler(calendarEl);

  return createDOMElem({
    tag: "div",
    parent: params.parent,
    attrs: rootAttrs,
    children: [
      ...(params.labelText ? [createDOMElem({ tag: "label", text: params.labelText, attrs: { class: "custom-week-picker-label" } })] : []),
      { tag: "div", attrs: { class: "custom-week-picker-wrapper" }, children: [input, calendarEl] },
    ],
  });
}
