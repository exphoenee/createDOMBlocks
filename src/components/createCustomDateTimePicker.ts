import { createDOMElem } from "domelemjs";
import type { CustomDateTimePickerParams } from "../types";

export function createCustomDateTimePicker(config: CustomDateTimePickerParams): HTMLElement {
  let selectedDate = config.value || "";

  const rootAttrs: Record<string, string> = {
    class: `custom-datetime-picker${config.class ? ` ${config.class}` : ""}`,
  };
  if (config.id) rootAttrs.id = config.id;

  let currentYear = new Date().getFullYear();
  let currentMonth = new Date().getMonth();
  let selectedTime = "12:00";

  const months = ["Januar", "Februar", "Marcius", "Aprilis", "Majus", "Junius", "Julius", "Augusztus", "Szeptember", "October", "November", "December"];

  function renderCalendar(): ReturnType<typeof createDOMElem>[] {
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();

    const header = createDOMElem({
      tag: "div",
      attrs: { class: "calendar-header" },
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
      const datePart = selectedDate.split("T")[0];
      grid.push(createDOMElem({
        tag: "span", text: String(day),
        attrs: { class: `calendar-day${datePart === dateStr ? " selected" : ""}` },
        handleEvent: {
          event: "click",
          cb: (e: Event) => {
            e.stopPropagation();
            selectedDate = `${dateStr}T${selectedTime}`;
            (input as HTMLInputElement).value = selectedDate;
            calendarEl.style.display = "none";
            config.onChange?.(selectedDate);
          },
        },
      }));
    }

    return [header, dayNames, createDOMElem({ tag: "div", attrs: { class: "calendar-grid" }, children: grid })];
  }

  const calendarEl = createDOMElem({
    tag: "div", attrs: { class: "custom-datetime-picker-calendar" }, style: { display: "none" },
  });
  calendarEl.append(...renderCalendar());

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
          config.onChange?.(selectedDate);
        }
      },
    },
  });

  const input = createDOMElem({
    tag: "input",
    attrs: {
      type: "text", readonly: "true", class: "custom-datetime-picker-input",
      placeholder: config.placeholder || "Valassz datumot es idot...",
      ...(config.id ? { id: `${config.id}-input` } : {}),
      ...(selectedDate ? { value: selectedDate } : {}),
    },
    handleEvent: {
      event: "click",
      cb: (e: Event) => {
        e.stopPropagation();
        calendarEl.style.display = calendarEl.style.display === "none" ? "block" : "none";
      },
    },
  });

  document.addEventListener("click", () => { calendarEl.style.display = "none"; });

  return createDOMElem({
    tag: "div", parent: config.parent, attrs: rootAttrs,
    children: [
      ...(config.labelText ? [createDOMElem({ tag: "label", text: config.labelText, attrs: { class: "custom-datetime-picker-label" } })] : []),
      { tag: "div", attrs: { class: "custom-datetime-picker-wrapper" }, children: [input, calendarEl, timeInput] },
    ],
  });
}
