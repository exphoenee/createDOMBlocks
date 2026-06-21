import { createDOMElem } from "domelemjs";
import type { CustomMonthPickerParams } from "../types";

export function createCustomMonthPicker(config: CustomMonthPickerParams): HTMLElement {
  let selectedMonth = config.value || "";

  const rootAttrs: Record<string, string> = {
    class: `custom-month-picker${config.class ? ` ${config.class}` : ""}`,
  };
  if (config.id) rootAttrs.id = config.id;

  const months = ["Januar", "Februar", "Marcius", "Aprilis", "Majus", "Junius", "Julius", "Augusztus", "Szeptember", "October", "November", "December"];

  let currentYear = new Date().getFullYear();

  function render(): ReturnType<typeof createDOMElem>[] {
    const header = createDOMElem({
      tag: "div",
      attrs: { class: "calendar-header" },
      children: [
        createDOMElem({
          tag: "button",
          text: "\u25C0",
          attrs: { class: "calendar-nav-btn" },
          handleEvent: { event: "click", cb: (e: Event) => { e.stopPropagation(); currentYear--; calendarEl.replaceChildren(...render()); } },
        }),
        createDOMElem({ tag: "span", text: String(currentYear), attrs: { class: "calendar-title" } }),
        createDOMElem({
          tag: "button",
          text: "\u25B6",
          attrs: { class: "calendar-nav-btn" },
          handleEvent: { event: "click", cb: (e: Event) => { e.stopPropagation(); currentYear++; calendarEl.replaceChildren(...render()); } },
        }),
      ],
    });

    const monthGrid = createDOMElem({
      tag: "div",
      attrs: { class: "month-grid" },
      children: months.map((m, i) => {
        const monthStr = `${currentYear}-${String(i + 1).padStart(2, "0")}`;
        const isSelected = monthStr === selectedMonth;
        return createDOMElem({
          tag: "span",
          text: m.slice(0, 3),
          attrs: { class: `month-item${isSelected ? " selected" : ""}` },
          handleEvent: {
            event: "click",
            cb: (e: Event) => {
              e.stopPropagation();
              selectedMonth = monthStr;
              (input as HTMLInputElement).value = `${m} ${currentYear}`;
              calendarEl.style.display = "none";
              config.onChange?.(monthStr);
            },
          },
        });
      }),
    });

    return [header, monthGrid];
  }

  const calendarEl = createDOMElem({
    tag: "div",
    attrs: { class: "custom-month-picker-calendar" },
    style: { display: "none" },
  });
  calendarEl.append(...render());

  const input = createDOMElem({
    tag: "input",
    attrs: {
      type: "text",
      readonly: "true",
      class: "custom-month-picker-input",
      placeholder: config.placeholder || "Valassz honapot...",
      ...(config.id ? { id: `${config.id}-input` } : {}),
      ...(selectedMonth ? { value: selectedMonth } : {}),
    },
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
      ...(config.labelText ? [createDOMElem({ tag: "label", text: config.labelText, attrs: { class: "custom-month-picker-label" } })] : []),
      { tag: "div", attrs: { class: "custom-month-picker-wrapper" }, children: [input, calendarEl] },
    ],
  });
}
