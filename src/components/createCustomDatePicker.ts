import { createDOMElem } from "domelemjs";
import type { CustomDatePickerParams } from "../types";

export function createCustomDatePicker(config: CustomDatePickerParams): HTMLElement {
  let selectedDate = config.value || "";

  const rootAttrs: Record<string, string> = {
    class: `custom-date-picker${config.class ? ` ${config.class}` : ""}`,
  };
  if (config.id) rootAttrs.id = config.id;

  const inputAttrs: Record<string, string> = {
    type: "text",
    readonly: "true",
    class: "custom-date-picker-input",
    placeholder: config.placeholder || "Valassz datumot...",
  };
  if (config.id) inputAttrs.id = `${config.id}-input`;
  if (selectedDate) inputAttrs.value = selectedDate;

  const calendarAttrs: Record<string, string> = { class: "custom-date-picker-calendar" };

  function renderCalendar(year: number, month: number): ReturnType<typeof createDOMElem>[] {
    const months = ["Januar", "Februar", "Marcius", "Aprilis", "Majus", "Junius", "Julius", "Augusztus", "Szeptember", "October", "November", "December"];
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();

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
            const prev = month === 0 ? 11 : month - 1;
            const prevYear = month === 0 ? year - 1 : year;
            calendarChildren.replaceChildren(...renderCalendar(prevYear, prev));
          }},
        }),
        createDOMElem({ tag: "span", text: `${months[month]} ${year}`, attrs: { class: "calendar-title" } }),
        createDOMElem({
          tag: "button",
          text: "\u25B6",
          attrs: { class: "calendar-nav-btn" },
          handleEvent: { event: "click", cb: (e: Event) => {
            e.stopPropagation();
            const next = month === 11 ? 0 : month + 1;
            const nextYear = month === 11 ? year + 1 : year;
            calendarChildren.replaceChildren(...renderCalendar(nextYear, next));
          }},
        }),
      ],
    });

    const dayNames = createDOMElem({
      tag: "div",
      attrs: { class: "calendar-days-header" },
      children: ["H", "K", "S", "Cs", "P", "Szo", "V"].map((d) =>
        createDOMElem({ tag: "span", text: d, attrs: { class: "calendar-day-name" } })
      ),
    });

    const grid: ReturnType<typeof createDOMElem>[] = [];
    for (let i = 0; i < firstDay; i++) {
      grid.push(createDOMElem({ tag: "span", attrs: { class: "calendar-day empty" } }));
    }
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      const isSelected = dateStr === selectedDate;
      const isDisabled = (config.min && dateStr < config.min) || (config.max && dateStr > config.max);
      grid.push(createDOMElem({
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
            config.onChange?.(dateStr);
          },
        },
      }));
    }

    return [header, dayNames, createDOMElem({ tag: "div", attrs: { class: "calendar-grid" }, children: grid })];
  }

  const calendarChildren = document.createElement("div");
  const year = new Date().getFullYear();
  const month = new Date().getMonth();
  const calendarEl = createDOMElem({
    tag: "div",
    attrs: calendarAttrs,
    style: { display: "none" },
  });

  const initialChildren = renderCalendar(year, month);
  calendarEl.append(...initialChildren);

  const input = createDOMElem({
    tag: "input",
    attrs: inputAttrs,
    handleEvent: {
      event: "click",
      cb: (e: Event) => {
        e.stopPropagation();
        const isVisible = calendarEl.style.display !== "none";
        calendarEl.style.display = isVisible ? "none" : "block";
        if (!isVisible) {
          calendarEl.replaceChildren(...renderCalendar(
            selectedDate ? parseInt(selectedDate.split("-")[0]) : new Date().getFullYear(),
            selectedDate ? parseInt(selectedDate.split("-")[1]) - 1 : new Date().getMonth()
          ));
        }
      },
    },
  });

  document.addEventListener("click", () => {
    calendarEl.style.display = "none";
  });

  return createDOMElem({
    tag: "div",
    parent: config.parent,
    attrs: rootAttrs,
    children: [
      ...(config.labelText
        ? [createDOMElem({ tag: "label", text: config.labelText, attrs: { class: "custom-date-picker-label" } })]
        : []),
      { tag: "div", attrs: { class: "custom-date-picker-wrapper" }, children: [input, calendarEl] },
    ],
  });
}
