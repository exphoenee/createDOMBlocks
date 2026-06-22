import { createDOMElem } from "domelemjs";
import type { CustomMonthPickerParams } from "../types";
import {
  MONTHS,
  MONTH_NAMES_SHORT,
  createCalendarHeader,
  setupCalendarCloseHandler,
  toggleCalendar,
} from "./calendar-helper";

export function createCustomMonthPicker(params: CustomMonthPickerParams): HTMLElement {
  let selectedMonth = params.value || "";
  let currentYear = new Date().getFullYear();

  const rootAttrs: Record<string, string> = {
    class: `custom-month-picker${params.class ? ` ${params.class}` : ""}`,
  };
  if (params.id) rootAttrs.id = params.id;

  const calendarEl = createDOMElem({
    tag: "div",
    attrs: { class: "custom-month-picker-calendar" },
    style: { display: "none" },
  });

  function render(): ReturnType<typeof createDOMElem>[] {
    return [
      createCalendarHeader(
        String(currentYear),
        () => { currentYear--; calendarEl.replaceChildren(...render()); },
        () => { currentYear++; calendarEl.replaceChildren(...render()); },
      ),
      createDOMElem({
        tag: "div",
        attrs: { class: "month-grid" },
        children: MONTHS.map((m, i) => {
          const monthStr = `${currentYear}-${String(i + 1).padStart(2, "0")}`;
          const isSelected = monthStr === selectedMonth;
          return createDOMElem({
            tag: "span",
            text: MONTH_NAMES_SHORT[i],
            attrs: { class: `month-item${isSelected ? " selected" : ""}` },
            handleEvent: {
              event: "click",
              cb: (e: Event) => {
                e.stopPropagation();
                selectedMonth = monthStr;
                (input as HTMLInputElement).value = `${m} ${currentYear}`;
                calendarEl.style.display = "none";
                params.onChange?.(monthStr);
              },
            },
          });
        }),
      }),
    ];
  }

  calendarEl.append(...render());

  const input = createDOMElem({
    tag: "input",
    attrs: {
      type: "text",
      readonly: "true",
      class: "custom-month-picker-input",
      placeholder: params.placeholder || "Valassz honapot...",
      ...(params.id ? { id: `${params.id}-input` } : {}),
      ...(selectedMonth ? { value: selectedMonth } : {}),
    },
    handleEvent: {
      event: "click",
      cb: (e: Event) => {
        e.stopPropagation();
        toggleCalendar(calendarEl, () => calendarEl.replaceChildren(...render()));
      },
    },
  });

  setupCalendarCloseHandler(calendarEl);

  return createDOMElem({
    tag: "div",
    parent: params.parent,
    attrs: rootAttrs,
    children: [
      ...(params.labelText ? [createDOMElem({ tag: "label", text: params.labelText, attrs: { class: "custom-month-picker-label" } })] : []),
      { tag: "div", attrs: { class: "custom-month-picker-wrapper" }, children: [input, calendarEl] },
    ],
  });
}
