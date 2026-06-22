import { createDOMElem } from "domelemjs";
import type { CustomDateTimePickerParams } from "../types";
import {
  buildMonthCalendar,
  setupCalendarCloseHandler,
  toggleCalendar,
} from "./calendar-helper";

export function createCustomDateTimePicker(params: CustomDateTimePickerParams): HTMLElement {
  let selectedDate = params.value || "";
  let currentYear = new Date().getFullYear();
  let currentMonth = new Date().getMonth();
  let selectedTime = "12:00";

  const rootAttrs: Record<string, string> = {
    class: `custom-datetime-picker${params.class ? ` ${params.class}` : ""}`,
  };
  if (params.id) rootAttrs.id = params.id;

  const timeInput = createDOMElem({
    tag: "input",
    attrs: { type: "time", class: "custom-datetime-picker-time", value: selectedTime },
    handleEvent: {
      event: "change",
      cb: (e: Event) => {
        selectedTime = (e.target as HTMLInputElement).value;
        if (selectedDate) {
          const datePart = selectedDate.split("T")[0];
          selectedDate = `${datePart}T${selectedTime}`;
          (input as HTMLInputElement).value = selectedDate;
          params.onChange?.(selectedDate);
        }
      },
    },
  });

  const input = createDOMElem({
    tag: "input",
    attrs: {
      type: "text", readonly: "true", class: "custom-datetime-picker-input",
      placeholder: params.placeholder || "Valassz datumot es idot...",
      ...(params.id ? { id: `${params.id}-input` } : {}),
      ...(selectedDate ? { value: selectedDate } : {}),
    },
    handleEvent: {
      event: "click",
      cb: (e: Event) => {
        e.stopPropagation();
        toggleCalendar(calendarEl, () => calendarEl.replaceChildren(...renderCalendar()));
      },
    },
  });

  const calendarEl = createDOMElem({
    tag: "div", attrs: { class: "custom-datetime-picker-calendar" }, style: { display: "none" },
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
        const datePart = selectedDate.split("T")[0];
        return createDOMElem({
          tag: "span", text: String(day),
          attrs: { class: `calendar-day${datePart === dateStr ? " selected" : ""}` },
          handleEvent: {
            event: "click",
            cb: (e: Event) => {
              e.stopPropagation();
              selectedDate = `${dateStr}T${selectedTime}`;
              (input as HTMLInputElement).value = selectedDate;
              calendarEl.style.display = "none";
              params.onChange?.(selectedDate);
            },
          },
        });
      },
    );
  }

  calendarEl.append(...renderCalendar());
  setupCalendarCloseHandler(calendarEl);

  return createDOMElem({
    tag: "div", parent: params.parent, attrs: rootAttrs,
    children: [
      ...(params.labelText ? [createDOMElem({ tag: "label", text: params.labelText, attrs: { class: "custom-datetime-picker-label" } })] : []),
      { tag: "div", attrs: { class: "custom-datetime-picker-wrapper" }, children: [input, calendarEl, timeInput] },
    ],
  });
}
