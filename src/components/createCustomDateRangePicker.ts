import { createDOMElem } from "domelemjs";
import type { CustomDateRangePickerParams } from "../types";

export function createCustomDateRangePicker(config: CustomDateRangePickerParams): HTMLElement {
  let startDate = config.startValue || "";
  let endDate = config.endValue || "";

  const rootAttrs: Record<string, string> = {
    class: `custom-date-range-picker${config.class ? ` ${config.class}` : ""}`,
  };
  if (config.id) rootAttrs.id = config.id;

  let currentYear = new Date().getFullYear();
  let currentMonth = new Date().getMonth();
  let selectingStart = true;

  const months = ["Januar", "Februar", "Marcius", "Aprilis", "Majus", "Junius", "Julius", "Augusztus", "Szeptember", "October", "November", "December"];

  function renderCalendar(): ReturnType<typeof createDOMElem>[] {
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();

    const header = createDOMElem({
      tag: "div", attrs: { class: "calendar-header" },
      children: [
        createDOMElem({
          tag: "button", text: "\u25C0", attrs: { class: "calendar-nav-btn" },
          handleEvent: { event: "click", cb: (e: Event) => {
            e.stopPropagation();
            currentMonth = currentMonth === 0 ? 11 : currentMonth - 1;
            if (currentMonth === 11) currentYear--;
            calendarEl.replaceChildren(...renderCalendar());
          }},
        }),
        createDOMElem({ tag: "span", text: `${months[currentMonth]} ${currentYear}`, attrs: { class: "calendar-title" } }),
        createDOMElem({
          tag: "button", text: "\u25B6", attrs: { class: "calendar-nav-btn" },
          handleEvent: { event: "click", cb: (e: Event) => {
            e.stopPropagation();
            currentMonth = currentMonth === 11 ? 0 : currentMonth + 1;
            if (currentMonth === 0) currentYear++;
            calendarEl.replaceChildren(...renderCalendar());
          }},
        }),
      ],
    });

    const dayNames = createDOMElem({
      tag: "div", attrs: { class: "calendar-days-header" },
      children: ["H", "K", "S", "Cs", "P", "Szo", "V"].map((d) =>
        createDOMElem({ tag: "span", text: d, attrs: { class: "calendar-day-name" } })
      ),
    });

    const grid: ReturnType<typeof createDOMElem>[] = [];
    for (let i = 0; i < firstDay; i++) grid.push(createDOMElem({ tag: "span", attrs: { class: "calendar-day empty" } }));
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      const isStart = dateStr === startDate;
      const isEnd = dateStr === endDate;
      const inRange = startDate && endDate && dateStr > startDate && dateStr < endDate;
      grid.push(createDOMElem({
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
            config.onChange?.(startDate, endDate);
          },
        },
      }));
    }

    return [header, dayNames, createDOMElem({ tag: "div", attrs: { class: "calendar-grid" }, children: grid })];
  }

  const calendarEl = createDOMElem({
    tag: "div", attrs: { class: "custom-date-range-picker-calendar" }, style: { display: "none" },
  });
  calendarEl.append(...renderCalendar());

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

  document.addEventListener("click", () => { calendarEl.style.display = "none"; });

  return createDOMElem({
    tag: "div", parent: config.parent, attrs: rootAttrs,
    children: [
      ...(config.labelText ? [createDOMElem({ tag: "label", text: config.labelText, attrs: { class: "custom-date-range-picker-label" } })] : []),
      wrapper,
    ],
  });
}
