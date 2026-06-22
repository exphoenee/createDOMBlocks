import { createDOMElem } from "domelemjs";
import type { CustomDatePickerParams } from "../types";
import {
  buildMonthCalendar,
  setupCalendarCloseHandler,
  toggleCalendar,
} from "./calendar-helper";

export function createCustomDatePicker(params: CustomDatePickerParams): HTMLElement {
  let selectedDate = params.value || "";

  const rootAttrs: Record<string, string> = {
    class: `custom-date-picker${params.class ? ` ${params.class}` : ""}`,
  };
  if (params.id) rootAttrs.id = params.id;

  const input = createDOMElem({
    tag: "input",
    attrs: {
      type: "text",
      readonly: "true",
      class: "custom-date-picker-input",
      placeholder: params.placeholder || "Valassz datumot...",
      ...(params.id ? { id: `${params.id}-input` } : {}),
      ...(selectedDate ? { value: selectedDate } : {}),
    },
    handleEvent: {
      event: "click",
      cb: (e: Event) => {
        e.stopPropagation();
        toggleCalendar(calendarEl, () => {
          const y = selectedDate ? parseInt(selectedDate.split("-")[0]) : new Date().getFullYear();
          const m = selectedDate ? parseInt(selectedDate.split("-")[1]) - 1 : new Date().getMonth();
          calendarEl.replaceChildren(...renderCalendar(y, m));
        });
      },
    },
  });

  const calendarEl = createDOMElem({
    tag: "div",
    attrs: { class: "custom-date-picker-calendar" },
    style: { display: "none" },
  });

  function renderCalendar(year: number, month: number): ReturnType<typeof createDOMElem>[] {
    return buildMonthCalendar(year, month,
      // prev
      () => {
        const prev = month === 0 ? 11 : month - 1;
        const prevYear = month === 0 ? year - 1 : year;
        calendarEl.replaceChildren(...renderCalendar(prevYear, prev));
      },
      // next
      () => {
        const next = month === 11 ? 0 : month + 1;
        const nextYear = month === 11 ? year + 1 : year;
        calendarEl.replaceChildren(...renderCalendar(nextYear, next));
      },
      // day cell builder
      (day, dateStr) => {
        const isSelected = dateStr === selectedDate;
        const isDisabled = (params.min && dateStr < params.min) || (params.max && dateStr > params.max);
        return createDOMElem({
          tag: "span",
          text: String(day),
          attrs: { class: `calendar-day${isSelected ? " selected" : ""}${isDisabled ? " disabled" : ""}` },
          handleEvent: isDisabled ? undefined : {
            event: "click",
            cb: (e: Event) => {
              e.stopPropagation();
              selectedDate = dateStr;
              (input as HTMLInputElement).value = dateStr;
              calendarEl.style.display = "none";
              params.onChange?.(dateStr);
            },
          },
        });
      },
    );
  }

  calendarEl.append(...renderCalendar(new Date().getFullYear(), new Date().getMonth()));
  setupCalendarCloseHandler(calendarEl);

  return createDOMElem({
    tag: "div",
    parent: params.parent,
    attrs: rootAttrs,
    children: [
      ...(params.labelText
        ? [createDOMElem({ tag: "label", text: params.labelText, attrs: { class: "custom-date-picker-label" } })]
        : []),
      { tag: "div", attrs: { class: "custom-date-picker-wrapper" }, children: [input, calendarEl] },
    ],
  });
}
