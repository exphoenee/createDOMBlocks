import { createDOMElem } from "../dom";
import { builtin, getLocale, resolveText, t, watchLocale } from "../i18n";
import type { TextValue } from "../i18n";
import type { SlotPickerParams, SlotPickerElement, TimeSlot, SlotPickerClassNames } from "../types";

type View = "loading" | "error" | "empty" | "days" | "times";

const DEFAULT_CLASSES: Required<SlotPickerClassNames> = {
  state: "slot-picker-state",
  spinner: "slot-picker-spinner",
  retry: "slot-picker-retry",
  step: "slot-picker-step",
  stepLabel: "slot-picker-step-label",
  back: "slot-picker-back",
  badge: "slot-picker-badge",
  days: "slot-picker-days",
  day: "slot-picker-day",
  dayName: "slot-picker-day-name",
  dayDate: "slot-picker-day-date",
  dayCount: "slot-picker-day-count",
  times: "slot-picker-times",
  time: "slot-picker-time",
};

/**
 * Időpont-foglaló első két lépése: a szabad időpontok betöltése (betöltés / hiba újrapróbálással / üres
 * állapot), a napok kiválasztása, majd az időpont. A dátumok az aktuális nyelven jelennek meg (ha a böngésző
 * nem ismeri a nyelvet, pl. egy kitalált nyelvnél, angolul). A harmadik lépés (az űrlap) az oldal dolga:
 * az `onSelect` a kiválasztott időpontot adja.
 *
 * @category forms
 * @menu SlotPicker
 * @order 28
 * @summary Szabad időpontok betöltése és kiválasztása napra, majd időpontra bontva.
 */
export function createSlotPicker(params: SlotPickerParams): SlotPickerElement {
  const cls = { ...DEFAULT_CLASSES, ...(params.classNames ?? {}) };
  const L = {
    loading: params.labels?.loading ?? builtin("slots.loading", "Szabad időpontok betöltése…"),
    error: params.labels?.error ?? builtin("slots.error", "Nem sikerült betölteni a szabad időpontokat."),
    retry: params.labels?.retry ?? builtin("slots.retry", "Újra"),
    empty: params.labels?.empty ?? builtin("slots.empty", "Nincs szabad időpont."),
    chooseDay: params.labels?.chooseDay ?? builtin("slots.chooseDay", "Válassz napot"),
    chooseTime: params.labels?.chooseTime ?? builtin("slots.chooseTime", "Válassz időpontot"),
    back: params.labels?.back ?? builtin("slots.back", "Vissza"),
  };

  const rootAttrs: Record<string, TextValue> = { class: `slot-picker${params.class ? ` ${params.class}` : ""}` };
  if (params.id) rootAttrs.id = params.id;
  const root = createDOMElem({ tag: "div", parent: params.parent, attrs: rootAttrs });

  let slots: TimeSlot[] = [];
  let view: View = "loading";
  let day: string | null = null;
  let selected: TimeSlot | null = null;
  let request = 0;

  /** A dátumformázás nyelve: az aktuális (vagy megadott), ha a böngésző ismeri, különben angol. */
  const fmtLocale = (): string => {
    const wanted = params.dateLocale ?? getLocale();
    try {
      return Intl.DateTimeFormat.supportedLocalesOf([wanted]).length ? wanted : "en";
    } catch {
      return "en";
    }
  };
  const dayName = (d: Date): string => new Intl.DateTimeFormat(fmtLocale(), { weekday: "long" }).format(d);
  const dateText = (d: Date): string => new Intl.DateTimeFormat(fmtLocale(), { month: "short", day: "numeric", year: "numeric" }).format(d);
  const timeText = (d: Date): string => `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  const dayKey = (slot: TimeSlot): string => {
    const d = new Date(slot.start);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  };
  const byDay = (): Map<string, TimeSlot[]> => {
    const map = new Map<string, TimeSlot[]>();
    for (const slot of [...slots].sort((a, b) => String(a.start).localeCompare(String(b.start)))) {
      const k = dayKey(slot);
      if (!map.has(k)) map.set(k, []);
      map.get(k)!.push(slot);
    }
    return map;
  };

  const el = (tag: string, className: string, attrs: Record<string, string> = {}, text?: string): HTMLElement =>
    createDOMElem({ tag, attrs: { class: className, ...attrs }, ...(text !== undefined ? { text } : {}) });

  function render(): void {
    const parts: HTMLElement[] = [];
    if (view === "loading") {
      const box = el("div", `${cls.state} is-loading`, { role: "status", "aria-live": "polite" });
      box.append(el("span", cls.spinner, { "aria-hidden": "true" }), el("p", "", {}, resolveText(L.loading)));
      parts.push(box);
    } else if (view === "error") {
      const box = el("div", `${cls.state} is-error`, { role: "alert" });
      const retry = el("button", cls.retry, { type: "button" }, resolveText(L.retry));
      retry.addEventListener("click", () => void load());
      box.append(el("p", "", {}, resolveText(L.error)), retry);
      parts.push(box);
    } else if (view === "empty") {
      parts.push(el("div", `${cls.state} is-empty`, { role: "status" }, resolveText(L.empty)));
    } else if (view === "days") {
      const step = el("div", `${cls.step} is-days`);
      step.append(el("p", cls.stepLabel, {}, resolveText(L.chooseDay)));
      const list = el("ul", cls.days, { role: "list" });
      for (const [key, daySlots] of byDay()) {
        const d = new Date(daySlots[0].start);
        const count = t("cdb.slots.count", { count: daySlots.length }, `${daySlots.length}`);
        const btn = el("button", cls.day, { type: "button", "data-day": key, "aria-label": `${dayName(d)}, ${dateText(d)}, ${count}` });
        btn.append(el("span", cls.dayName, {}, dayName(d)), el("span", cls.dayDate, {}, dateText(d)), el("span", cls.dayCount, {}, count));
        btn.addEventListener("click", () => {
          day = key;
          view = "times";
          render();
          root.querySelector<HTMLElement>(`.${cls.time.split(" ")[0]}`)?.focus();
        });
        const li = el("li", "");
        li.append(btn);
        list.append(li);
      }
      step.append(list);
      parts.push(step);
    } else {
      const daySlots = byDay().get(day ?? "") ?? [];
      const d = daySlots[0] ? new Date(daySlots[0].start) : new Date();
      const step = el("div", `${cls.step} is-times`);
      const back = el("button", cls.back, { type: "button" }, `← ${resolveText(L.back)}`);
      back.addEventListener("click", () => {
        view = "days";
        render();
        root.querySelector<HTMLElement>(`[data-day="${day}"]`)?.focus();
      });
      step.append(back, el("p", cls.stepLabel, {}, resolveText(L.chooseTime)), el("div", cls.badge, { "aria-live": "polite" }, `${dayName(d)}, ${dateText(d)}`));
      const list = el("ul", cls.times, { role: "list" });
      for (const slot of daySlots) {
        const label = `${timeText(new Date(slot.start))} – ${timeText(new Date(slot.end))}`;
        const btn = el("button", cls.time, { type: "button", "aria-label": t("cdb.slots.pick", { time: label }, `${label}`) }, label);
        if (selected && selected.start === slot.start) btn.classList.add("is-selected");
        btn.addEventListener("click", () => {
          selected = slot;
          render();
          params.onSelect?.({ ...slot, label: `${dayName(d)}, ${dateText(d)}  |  ${label}` });
        });
        const li = el("li", "");
        li.append(btn);
        list.append(li);
      }
      step.append(list);
      parts.push(step);
    }
    root.replaceChildren(...parts);
    root.dataset.view = view;
  }

  async function load(): Promise<void> {
    const mine = ++request;
    view = "loading";
    day = null;
    selected = null;
    render();
    try {
      const result = await params.loadSlots();
      if (mine !== request) return; // egy újabb betöltés közben elindult
      slots = Array.isArray(result) ? result.filter((s) => s && s.start && s.end) : [];
      view = slots.length ? "days" : "empty";
    } catch {
      if (mine !== request) return;
      view = "error";
    }
    render();
  }

  watchLocale(root, render);
  if (params.autoLoad !== false) void load();
  else render();

  return Object.assign(root, {
    reload: (): Promise<void> => load(),
    reset(): void {
      selected = null;
      day = null;
      view = slots.length ? "days" : view === "loading" ? "loading" : "empty";
      render();
    },
    getSelected: (): TimeSlot | null => selected,
  });
}
