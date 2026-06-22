import { createDOMElem } from "domelemjs";
import type { CustomDateRangePickerParams } from "../types";
import {
  buildMonthCalendar,
  setupCalendarCloseHandler,
} from "./calendar-helper";

export function createCustomDateRangePicker(params: CustomDateRangePickerParams): HTMLElement {
  let startDate = params.startValue || "";
  let endDate = params.endValue || "";
  let currentYear = new Date().getFullYear();
  let currentMonth = new Date().getMonth();
  let selectingStart = true;

  const rootAttrs: Record<string, string> = {
    class: `custom-date-range-picker${params.class ? ` ${params.class}` : ""}`,
  };
  if (params.id) rootAttrs.id = params.id;

  const startInput = createDOMElem({
    tag: "input",
    attrs: {
      type: "text", readonly: "true", class: "custom-date-range-picker-input",
      placeholder: "Kezdet...",
      ...(startDate ? { value: startDate } : {}),
    },
  });

  const endInput = createDOMElem({
    tag: "input",
    attrs: {
      type: "text", readonly: "true", class: "custom-date-range-picker-input",
      placeholder: "Veg...",
      ...(endDate ? { value: endDate } : {}),
    },
  });

  const calendarEl = createDOMElem({
    tag: "div", attrs: { class: "custom-date-range-picker-calendar" }, style: { display: "none" },
  });

  function renderCalendar(): ReturnType<typeof createDOMElem>[] {
    return buildMonthCalendar(currentYear, currentMonth,
      // prev
      () => {
        currentMonth = currentMonth === 0 ? 11 : currentMonth - 1;
        if (currentMonth === 11) currentYear--;
        calendarEl.replaceChildren(...renderCalendar());
      },
      // next
      () => {
        currentMonth = currentMonth === 11 ? 0 : currentMonth + 1;
        if (currentMonth === 0) currentYear++;
        calendarEl.replaceChildren(...renderCalendar());
      },
      // day cell builder
      (day, dateStr) => {
        const isStart = dateStr === startDate;
        const isEnd = dateStr === endDate;
        const inRange = startDate && endDate && dateStr > startDate && dateStr < endDate;
        return createDOMElem({
          tag: "span", text: String(day),
          attrs: { class: `calendar-day${isStart ? " range-start" : ""}${isEnd ? " range-end" : ""}${inRange ? " in-range" : ""}` },
          handleEvent: {
            event: "click",
            cb: (e: Event) => {
              e.stopPropagation();
              if (selectingStart) {
                startDate = dateStr;
                endDate = "";
                selectingStart = false;
              } else {
                if (dateStr < startDate) {
                  endDate = startDate;
                  startDate = dateStr;
                } else {
                  endDate = dateStr;
                }
                selectingStart = true;
              }
              (startInput as HTMLInputElement).value = startDate;
              (endInput as HTMLInputElement).value = endDate;
              calendarEl.replaceChildren(...renderCalendar());
              params.onChange?.(startDate, endDate);
            },
          },
        });
      },
    );
  }

  calendarEl.append(...renderCalendar());

  const wrapper = createDOMElem({
    tag: "div", attrs: { class: "custom-date-range-picker-wrapper" },
    children: [
      startInput,
      createDOMElem({ tag: "span", text: " \u2013 ", attrs: { class: "range-separator" } }),
      endInput,
      calendarEl,
    ],
  });

  [startInput, endInput].forEach((inp) => {
    inp.addEventListener("click", (e: Event) => {
      e.stopPropagation();
      calendarEl.style.display = calendarEl.style.display === "none" ? "block" : "none";
    });
  });

  setupCalendarCloseHandler(calendarEl);

  return createDOMElem({
    tag: "div", parent: params.parent, attrs: rootAttrs,
    children: [
      ...(params.labelText ? [createDOMElem({ tag: "label", text: params.labelText, attrs: { class: "custom-date-range-picker-label" } })] : []),
      wrapper,
    ],
  });
}
