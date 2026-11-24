import type { GanttDate, GanttElement, GanttGroup, GanttMilestone, GanttParams, GanttRow } from "../types";
import { builtin, getLocale, resolveText, watchLocale } from "../i18n";

/* ===== Dátumkezelés ===== */

interface ParsedDate {
  y: number;
  /** 0–11 */
  m: number;
  /** a hónap napja; null: csak hónap pontosságú dátum */
  d: number | null;
}

function parseDate(v: GanttDate): ParsedDate {
  if (v instanceof Date) return { y: v.getFullYear(), m: v.getMonth(), d: v.getDate() };
  const match = /^\s*(\d{4})-(\d{1,2})(?:-(\d{1,2}))?/.exec(v);
  if (match) return { y: Number(match[1]), m: Number(match[2]) - 1, d: match[3] ? Number(match[3]) : null };
  const date = new Date(v);
  if (isNaN(date.getTime())) throw new Error(`createGantt: érvénytelen dátum: "${String(v)}"`);
  return { y: date.getFullYear(), m: date.getMonth(), d: date.getDate() };
}

const daysIn = (y: number, m: number): number => new Date(y, m + 1, 0).getDate();

/**
 * Tört hónap-szám az időtengelyen (év*12 + hónap + a hónapon belüli hányad).
 * `start`: a hónap / nap eleje, `end`: a hónap / nap vége (befejezett időszaknál), `mid`: a közepe.
 */
function monthPos(p: ParsedDate, edge: "start" | "end" | "mid"): number {
  const base = p.y * 12 + p.m;
  if (p.d === null) return base + (edge === "start" ? 0 : edge === "end" ? 1 : 0.5);
  const dim = daysIn(p.y, p.m);
  return base + (edge === "start" ? p.d - 1 : edge === "end" ? p.d : p.d - 0.5) / dim;
}

const DEFAULT_COLORS = ["#6366f1", "#22c55e", "#f59e0b", "#06b6d4", "#e05aab", "#8b5cf6", "#ff7024", "#ef4444"];

/* ===== Állapot ===== */

interface GanttState {
  params: GanttParams;
  rows: GanttRow[];
  selected: string | null;
  colors: Map<string, string>;
  dragged: string | null;
  selectedMs: string | null;
}

const states = new WeakMap<HTMLElement, GanttState>();

function assignColors(state: GanttState, rows: GanttRow[]): void {
  for (const r of rows) {
    if (!state.colors.has(r.id)) state.colors.set(r.id, DEFAULT_COLORS[state.colors.size % DEFAULT_COLORS.length]);
  }
}

function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className?: string,
  text?: string,
): HTMLElementTagNameMap[K] {
  const e = document.createElement(tag);
  if (className) e.className = className;
  if (text !== undefined) e.textContent = text;
  return e;
}

const pctStr = (n: number): string => `${Math.round(n * 1000) / 1000}%`;

/* ===== Megjelenítés ===== */

interface Layout {
  from: number;
  to: number;
  total: number;
  pct: (abs: number) => number;
  todayAbs: number;
  fit: boolean;
  trackWidth: number;
}

/** A még tartó sáv vége: a mai nap + `ongoingDays` */
function ongoingEndPos(params: GanttParams): number {
  const t = parseDate(params.today ?? new Date());
  const d = new Date(t.y, t.m, t.d ?? 1);
  d.setDate(d.getDate() + (params.ongoingDays ?? 30));
  return monthPos(parseDate(d), "start");
}

function computeLayout(state: GanttState): Layout {
  const { params, rows } = state;
  const today = parseDate(params.today ?? new Date());
  const todayAbs = monthPos(today, "mid");
  const ongoingEnd = ongoingEndPos(params);

  const values: number[] = [];
  for (const r of rows) {
    values.push(monthPos(parseDate(r.start), "start"));
    values.push(r.end ? monthPos(parseDate(r.end), "end") : ongoingEnd);
    for (const m of r.milestones ?? []) values.push(monthPos(parseDate(m.date), "mid"));
  }

  let from = params.from ? Math.floor(monthPos(parseDate(params.from), "start")) : NaN;
  let to = params.to ? Math.ceil(monthPos(parseDate(params.to), "end")) : NaN;
  if (isNaN(from)) from = values.length ? Math.floor(Math.min(...values)) : Math.floor(todayAbs);
  if (isNaN(to)) to = values.length ? Math.ceil(Math.max(...values)) : from + 12;
  if (to <= from) to = from + 1;
  const total = to - from;
  const monthWidth = params.monthWidth ?? 20;
  return {
    from,
    to,
    total,
    pct: (abs) => ((abs - from) / total) * 100,
    todayAbs,
    fit: monthWidth <= 0,
    trackWidth: total * monthWidth,
  };
}

function formatMonthYear(p: ParsedDate): string {
  const date = new Date(p.y, p.m, p.d ?? 1);
  const opts: Intl.DateTimeFormatOptions = p.d === null ? { year: "numeric", month: "short" } : { year: "numeric", month: "short", day: "numeric" };
  return new Intl.DateTimeFormat(getLocale(), opts).format(date);
}

function periodText(row: GanttRow): string {
  if (row.periodLabel !== undefined) return resolveText(row.periodLabel);
  const start = formatMonthYear(parseDate(row.start));
  const end = row.end ? formatMonthYear(parseDate(row.end)) : resolveText(builtin("gantt.ongoing", "jelenleg"));
  return `${start} – ${end}`;
}

function buildAxis(state: GanttState, layout: Layout): { axis: HTMLElement; lines: HTMLElement[] } {
  const { params } = state;
  const { from, to, total, pct } = layout;
  const monthWidth = params.monthWidth ?? 20;
  const mode =
    params.axis && params.axis !== "auto"
      ? params.axis
      : layout.fit
        ? total <= 18 ? "months" : "quarters"
        : monthWidth >= 36 ? "months" : "quarters";

  const axis = el("div", "gantt-axis");
  const years = el("div", "gantt-years");
  const sub = el("div", "gantt-sub");
  const lines: HTMLElement[] = [];

  for (let y = Math.floor(from / 12); y <= Math.floor((to - 1) / 12); y++) {
    const a = Math.max(from, y * 12);
    const b = Math.min(to, (y + 1) * 12);
    const cell = el("div", "gantt-year", String(y));
    cell.style.left = pctStr(pct(a));
    cell.style.width = pctStr(pct(b) - pct(a));
    years.appendChild(cell);
  }

  const step = mode === "months" ? 1 : 3;
  const monthFmt = new Intl.DateTimeFormat(getLocale(), { month: "short" });
  for (let s = Math.floor(from / step) * step; s < to; s += step) {
    const a = Math.max(from, s);
    const b = Math.min(to, s + step);
    const label = mode === "months" ? monthFmt.format(new Date(2000, ((s % 12) + 12) % 12, 1)) : `Q${(((s % 12) + 12) % 12) / 3 + 1}`;
    const cell = el("div", "gantt-tick", label);
    cell.style.left = pctStr(pct(a));
    cell.style.width = pctStr(pct(b) - pct(a));
    sub.appendChild(cell);
    if (s > from) {
      const line = el("div", `gantt-line${s % 12 === 0 ? " is-year" : ""}`);
      line.style.left = pctStr(pct(s));
      lines.push(line);
    }
  }
  axis.append(years, sub);
  return { axis, lines };
}

function buildMilestone(
  state: GanttState,
  row: GanttRow,
  ms: GanttMilestone,
  idx: number,
  layout: Layout,
  track: HTMLElement,
): void {
  const abs = monthPos(parseDate(ms.date), "mid");
  const left = pctStr(layout.pct(abs));
  const placement = ms.placement ?? "inside";
  const label = resolveText(ms.label);
  const past = !!state.params.dimPast && abs < layout.todayAbs;
  const color = ms.color;

  const picked = ms.id !== undefined && ms.id === state.selectedMs ? " is-selected" : "";
  const mark = el("button", `gantt-mark is-${ms.shape ?? "dot"}${past ? " is-past" : ""}${picked}`);
  mark.type = "button";
  if (ms.id !== undefined) mark.dataset.msId = ms.id;
  mark.dataset.row = row.id;
  mark.dataset.ms = String(idx);
  mark.style.left = left;
  mark.setAttribute("aria-label", label);
  if (color) mark.style.setProperty("--gantt-ms-color", color);

  if (placement === "inside") {
    mark.title = label;
    mark.appendChild(el("span", "gantt-tip", label));
    track.appendChild(mark);
    return;
  }

  const line = el("span", `gantt-ms-line is-${placement}${past ? " is-past" : ""}`);
  line.style.left = left;
  if (color) line.style.setProperty("--gantt-ms-color", color);

  const card = el("button", `gantt-card is-${placement}${past ? " is-past" : ""}${ms.shape === "diamond" ? " is-final" : ""}${picked}`);
  card.type = "button";
  if (ms.id !== undefined) card.dataset.msId = ms.id;
  card.dataset.row = row.id;
  card.dataset.ms = String(idx);
  card.style.left = left;
  if (color) card.style.setProperty("--gantt-ms-color", color);
  if (ms.caption !== undefined) card.appendChild(el("span", "gantt-card-caption", resolveText(ms.caption)));
  card.appendChild(el("span", "gantt-card-label", label));
  if (ms.meta !== undefined) card.appendChild(el("span", "gantt-card-meta", resolveText(ms.meta)));
  if (ms.flag) {
    const flag = el("span", "gantt-flag", resolveText(ms.flag.text));
    if (ms.flag.title !== undefined) flag.title = resolveText(ms.flag.title);
    card.appendChild(flag);
  }
  track.append(line, card, mark);
}

function buildRow(state: GanttState, row: GanttRow, layout: Layout): HTMLElement {
  const { params } = state;
  const hasCards = (row.milestones ?? []).some((m) => m.placement === "above" || m.placement === "below");
  const height = hasCards ? params.cardRowHeight ?? 128 : params.rowHeight ?? 60;
  const color = row.color ?? state.colors.get(row.id) ?? DEFAULT_COLORS[0];
  const period = periodText(row);
  const title = resolveText(row.label);

  const rowEl = el("div", `gantt-row${hasCards ? " has-cards" : ""}${state.selected === row.id ? " is-active" : ""}`);
  rowEl.dataset.id = row.id;
  rowEl.style.height = `${height}px`;
  rowEl.style.setProperty("--gantt-color", color);

  const label = el("div", "gantt-label");
  label.tabIndex = 0;
  label.setAttribute("role", "button");
  label.setAttribute("aria-pressed", String(state.selected === row.id));
  label.setAttribute("aria-label", period ? `${title}, ${period}` : title);
  if (params.draggableRows) label.draggable = true;
  label.appendChild(el("div", "gantt-label-title", title));
  if (row.sublabel !== undefined) label.appendChild(el("div", "gantt-label-sub", resolveText(row.sublabel)));
  if (period) label.appendChild(el("div", "gantt-label-period", period));

  const track = el("div", "gantt-track");
  const startPct = Math.max(0, layout.pct(monthPos(parseDate(row.start), "start")));
  const ongoing = !row.end;
  const endAbs = row.end ? monthPos(parseDate(row.end), "end") : ongoingEndPos(params);
  const endPct = Math.min(100, layout.pct(endAbs));
  const bar = el("div", `gantt-bar${ongoing ? " is-current" : ""}`);
  bar.dataset.row = row.id;
  bar.tabIndex = 0;
  bar.setAttribute("role", "button");
  bar.setAttribute("aria-label", `${period ? `${title}, ${period}` : title}${ongoing ? `, ${resolveText(builtin("gantt.current", "folyamatban"))}` : ""}`);
  bar.style.left = pctStr(startPct);
  bar.style.width = pctStr(Math.max(0.4, endPct - startPct));
  if (!hasCards || params.barStyle !== "thin") {
    const text = row.barLabel !== undefined ? resolveText(row.barLabel) : [title, row.sublabel !== undefined ? resolveText(row.sublabel) : ""].filter(Boolean).join(" · ");
    bar.appendChild(el("span", "gantt-bar-text", params.barStyle === "thin" ? "" : text));
  }
  track.appendChild(bar);

  (row.milestones ?? []).forEach((ms, i) => buildMilestone(state, row, ms, i, layout, track));
  rowEl.append(label, track);
  return rowEl;
}

function orderedSections(state: GanttState): { group: GanttGroup | null; rows: GanttRow[] }[] {
  const groups = state.params.groups ?? [];
  const known = new Set(groups.map((g) => g.id));
  const sections: { group: GanttGroup | null; rows: GanttRow[] }[] = [];
  const loose = state.rows.filter((r) => !r.group || !known.has(r.group));
  if (loose.length) sections.push({ group: null, rows: loose });
  for (const g of groups) {
    const rows = state.rows.filter((r) => r.group === g.id);
    if (rows.length) sections.push({ group: g, rows });
  }
  return sections;
}

function render(root: GanttElement): void {
  const state = states.get(root);
  if (!state) return;
  const { params } = state;
  const prevScroll = root.querySelector<HTMLElement>(".gantt-scroll")?.scrollLeft;

  const layout = computeLayout(state);
  const labelWidth = params.labelWidth ?? 220;
  root.classList.toggle("is-fit", layout.fit);
  root.classList.toggle("is-thin", params.barStyle === "thin");
  root.classList.toggle("is-dragscroll", !!params.dragScroll);
  root.style.setProperty("--gantt-label-w", `${labelWidth}px`);
  root.style.setProperty("--gantt-track-w", layout.fit ? "480px" : `${layout.trackWidth}px`);
  root.textContent = "";

  if (state.rows.length === 0) {
    root.appendChild(el("div", "gantt-empty", resolveText(params.emptyText ?? builtin("gantt.empty", "Nincs megjeleníthető sor"))));
    return;
  }

  const showToday = params.showToday !== false && layout.todayAbs >= layout.from && layout.todayAbs <= layout.to;
  const showBubble = showToday && params.todayLabel !== false;

  const scroll = el("div", "gantt-scroll");
  const chart = el("div", "gantt-chart");

  const head = el("div", `gantt-head${showBubble ? " has-today" : ""}`);
  const corner = el("div", "gantt-corner", resolveText(params.labelHeader ?? builtin("gantt.task", "Feladat")));
  const { axis, lines } = buildAxis(state, layout);
  head.append(corner, axis);
  chart.appendChild(head);

  const body = el("div", "gantt-body");
  let n = 0;
  for (const section of orderedSections(state)) {
    if (section.group) {
      const g = el("div", "gantt-group");
      g.append(el("div", "gantt-group-label", resolveText(section.group.label)), el("div", "gantt-group-track"));
      body.appendChild(g);
    }
    for (const row of section.rows) {
      const r = buildRow(state, row, layout);
      if (n++ % 2 === 1) r.classList.add("is-alt");
      body.appendChild(r);
    }
  }
  chart.appendChild(body);

  const overlay = el("div", "gantt-overlay");
  overlay.setAttribute("aria-hidden", "true");
  const grid = el("div", "gantt-grid");
  lines.forEach((l) => grid.appendChild(l));
  overlay.appendChild(grid);
  if (showToday) {
    const now = el("div", "gantt-today");
    now.style.left = pctStr(layout.pct(layout.todayAbs));
    const date = new Intl.DateTimeFormat(getLocale(), { month: "short", day: "numeric" }).format(
      (() => {
        const t = parseDate(params.today ?? new Date());
        return new Date(t.y, t.m, t.d ?? 1);
      })(),
    );
    now.title = date;
    if (showBubble) {
      now.appendChild(el("span", "gantt-today-bubble", resolveText(params.todayLabel === undefined || params.todayLabel === false ? builtin("gantt.today", "Ma") : params.todayLabel)));
    }
    overlay.appendChild(now);
  }
  chart.appendChild(overlay);

  scroll.appendChild(chart);
  root.appendChild(scroll);
  if (prevScroll !== undefined) scroll.scrollLeft = prevScroll;
}

/* ===== Viselkedés ===== */

function applySelection(root: GanttElement): void {
  const state = states.get(root);
  if (!state) return;
  root.querySelectorAll<HTMLElement>(".gantt-row").forEach((r) => {
    const active = r.dataset.id === state.selected;
    r.classList.toggle("is-active", active);
    r.querySelector(".gantt-label")?.setAttribute("aria-pressed", String(active));
  });
}

function select(root: GanttElement, id: string | null, notify: boolean): void {
  const state = states.get(root);
  if (!state) return;
  const row = id === null ? null : state.rows.find((r) => r.id === id) ?? null;
  state.selected = row ? row.id : null;
  applySelection(root);
  if (notify) state.params.onSelect?.(row);
}

function selectMilestone(root: GanttElement, id: string | null): void {
  const state = states.get(root);
  if (!state) return;
  state.selectedMs = id;
  root.querySelectorAll<HTMLElement>(".gantt-mark, .gantt-card").forEach((m) => {
    m.classList.toggle("is-selected", id !== null && m.dataset.msId === id);
  });
}

function moveRow(root: GanttElement, id: string, targetId: string, after: boolean): void {
  const state = states.get(root);
  if (!state || id === targetId) return;
  const from = state.rows.findIndex((r) => r.id === id);
  const target = state.rows.find((r) => r.id === targetId);
  if (from < 0 || !target || state.rows[from].group !== target.group) return;
  const [moved] = state.rows.splice(from, 1);
  const to = state.rows.findIndex((r) => r.id === targetId);
  state.rows.splice(after ? to + 1 : to, 0, moved);
  render(root);
  state.params.onReorder?.(state.rows.map((r) => r.id));
}

function scrollToToday(root: GanttElement, mode: "today" | "start" | "end" = "today"): void {
  const scroll = root.querySelector<HTMLElement>(".gantt-scroll");
  const state = states.get(root);
  if (!scroll || !state) return;
  if (mode === "start") {
    scroll.scrollLeft = 0;
    return;
  }
  if (mode === "end") {
    scroll.scrollLeft = scroll.scrollWidth;
    return;
  }
  const layout = computeLayout(state);
  const labelWidth = state.params.labelWidth ?? 220;
  const trackWidth = Math.max(0, scroll.scrollWidth - labelWidth);
  const x = (layout.pct(layout.todayAbs) / 100) * trackWidth - 0.35 * Math.max(0, scroll.clientWidth - labelWidth);
  scroll.scrollLeft = Math.max(0, x);
}

function wire(root: GanttElement): void {
  const lookup = (target: HTMLElement): { row: GanttRow; ms: GanttMilestone } | null => {
    const state = states.get(root);
    const msEl = target.closest<HTMLElement>(".gantt-mark, .gantt-card");
    if (!state || !msEl || !root.contains(msEl)) return null;
    const row = state.rows.find((r) => r.id === msEl.dataset.row);
    const ms = row?.milestones?.[Number(msEl.dataset.ms)];
    return row && ms ? { row, ms } : null;
  };

  // rámutatás / fókusz egy mérföldkőre
  let hovered: string | null = null;
  const hover = (e: Event): void => {
    const state = states.get(root);
    const hit = lookup(e.target as HTMLElement);
    const key = hit ? `${hit.row.id}:${hit.row.milestones?.indexOf(hit.ms)}` : null;
    if (key === hovered) return;
    hovered = key;
    if (hit) state?.params.onMilestoneHover?.(hit.ms, hit.row);
  };
  root.addEventListener("mouseover", hover);
  root.addEventListener("focusin", hover);
  root.addEventListener("mouseleave", () => {
    hovered = null;
  });

  // egérrel húzható görgetés
  let dragMoved = false;
  root.addEventListener("mousedown", (e) => {
    const state = states.get(root);
    const target = e.target as HTMLElement;
    const scroller = target.closest<HTMLElement>(".gantt-scroll");
    if (!state?.params.dragScroll || e.button !== 0 || !scroller || target.closest("button, a, .gantt-label, .gantt-bar")) return;
    const startX = e.clientX;
    const startLeft = scroller.scrollLeft;
    dragMoved = false;
    e.preventDefault();
    const move = (ev: MouseEvent): void => {
      const dx = ev.clientX - startX;
      if (!dragMoved && Math.abs(dx) < 3) return;
      dragMoved = true;
      root.classList.add("is-grabbing");
      scroller.scrollLeft = startLeft - dx;
    };
    const up = (): void => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
      root.classList.remove("is-grabbing");
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
  });
  root.addEventListener(
    "click",
    (e) => {
      if (dragMoved) {
        e.stopPropagation();
        dragMoved = false;
      }
    },
    true,
  );

  root.addEventListener("click", (e) => {
    const state = states.get(root);
    if (!state) return;
    const target = e.target as HTMLElement;

    const msEl = target.closest<HTMLElement>(".gantt-mark, .gantt-card");
    if (msEl && root.contains(msEl)) {
      const row = state.rows.find((r) => r.id === msEl.dataset.row);
      const ms = row?.milestones?.[Number(msEl.dataset.ms)];
      if (row && ms) state.params.onMilestoneClick?.(ms, row);
      return;
    }

    const hit = target.closest<HTMLElement>(".gantt-label, .gantt-bar");
    if (!hit || !root.contains(hit)) return;
    const id = hit.closest<HTMLElement>("[data-id]")?.dataset.id ?? hit.dataset.row;
    const row = state.rows.find((r) => r.id === id);
    if (!row) return;
    if (state.params.selectable !== false) select(root, state.selected === row.id ? null : row.id, true);
    state.params.onRowClick?.(row);
  });

  root.addEventListener("keydown", (e) => {
    const state = states.get(root);
    const target = e.target as HTMLElement;
    if (!state) return;
    const label = target.closest<HTMLElement>(".gantt-label");
    if (label && state.params.draggableRows && e.altKey && (e.key === "ArrowUp" || e.key === "ArrowDown")) {
      e.preventDefault();
      const id = label.closest<HTMLElement>("[data-id]")?.dataset.id;
      if (!id) return;
      const sameGroup = state.rows.filter((r) => r.group === state.rows.find((x) => x.id === id)?.group);
      const i = sameGroup.findIndex((r) => r.id === id);
      const neighbour = sameGroup[i + (e.key === "ArrowUp" ? -1 : 1)];
      if (neighbour) {
        moveRow(root, id, neighbour.id, e.key === "ArrowDown");
        root.querySelector<HTMLElement>(`.gantt-row[data-id="${CSS.escape(id)}"] .gantt-label`)?.focus();
      }
      return;
    }
    if ((e.key === "Enter" || e.key === " ") && target.matches(".gantt-label, .gantt-bar")) {
      e.preventDefault();
      target.click();
    }
  });

  // húzásos átrendezés (csoporton belül)
  root.addEventListener("dragstart", (e) => {
    const state = states.get(root);
    const label = (e.target as HTMLElement).closest<HTMLElement>(".gantt-label");
    if (!state || !state.params.draggableRows || !label) return;
    state.dragged = label.closest<HTMLElement>("[data-id]")?.dataset.id ?? null;
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/plain", state.dragged ?? "");
    }
    label.closest(".gantt-row")?.classList.add("is-dragging");
  });
  const clearOver = (): void =>
    root.querySelectorAll(".is-drag-over-before, .is-drag-over-after").forEach((x) => x.classList.remove("is-drag-over-before", "is-drag-over-after"));
  root.addEventListener("dragend", () => {
    const state = states.get(root);
    if (state) state.dragged = null;
    clearOver();
    root.querySelectorAll(".is-dragging").forEach((x) => x.classList.remove("is-dragging"));
  });
  root.addEventListener("dragover", (e) => {
    const state = states.get(root);
    if (!state || !state.dragged) return;
    const rowEl = (e.target as HTMLElement).closest<HTMLElement>(".gantt-row");
    const target = rowEl && state.rows.find((r) => r.id === rowEl.dataset.id);
    const dragged = state.rows.find((r) => r.id === state.dragged);
    if (!rowEl || !target || !dragged || target.id === dragged.id || target.group !== dragged.group) return;
    e.preventDefault();
    clearOver();
    const rect = rowEl.getBoundingClientRect();
    const after = e.clientY > rect.top + rect.height / 2;
    rowEl.classList.add(after ? "is-drag-over-after" : "is-drag-over-before");
  });
  root.addEventListener("drop", (e) => {
    const state = states.get(root);
    if (!state || !state.dragged) return;
    const rowEl = (e.target as HTMLElement).closest<HTMLElement>(".gantt-row");
    if (!rowEl || !rowEl.dataset.id) return;
    e.preventDefault();
    const after = rowEl.classList.contains("is-drag-over-after");
    const dragged = state.dragged;
    state.dragged = null;
    moveRow(root, dragged, rowEl.dataset.id, after);
  });
}

/**
 * Gantt-diagram: sorok (idősávok) bal oldali feliratokkal, hónap / negyedév időtengellyel,
 * mérföldkövekkel (pötty, gyémánt vagy kártya), mai nap vonallal, csoportokkal, kijelöléssel és
 * húzással átrendezhető sorokkal. Nyelvváltáskor a feliratok, hónapnevek és időszakok frissülnek,
 * a kijelölés, a sorrend és a görgetés megmarad.
 */
export function createGantt(params: GanttParams): GanttElement {
  const root = el("div", `gantt${params.class ? ` ${params.class}` : ""}`) as unknown as GanttElement;
  root.id = params.id;
  root.setAttribute("role", "group");
  if (params.ariaLabel !== undefined) root.setAttribute("aria-label", resolveText(params.ariaLabel));
  root.style.setProperty("--gantt-row-h", `${params.rowHeight ?? 60}px`);

  const state: GanttState = {
    params,
    rows: [...params.rows],
    selected: params.selectedId ?? null,
    colors: new Map(),
    dragged: null,
    selectedMs: params.selectedMilestoneId ?? null,
  };
  assignColors(state, state.rows);
  states.set(root, state);

  root.setRows = (rows) => {
    state.rows = [...rows];
    assignColors(state, state.rows);
    if (state.selected && !state.rows.some((r) => r.id === state.selected)) state.selected = null;
    render(root);
  };
  root.getRows = () => [...state.rows];
  root.select = (id) => select(root, id, false);
  root.selectMilestone = (id) => selectMilestone(root, id);
  root.getSelected = () => state.selected;
  root.getOrder = () => state.rows.map((r) => r.id);
  root.scrollToToday = () => scrollToToday(root, "today");

  wire(root);
  render(root);

  const parent = typeof params.parent === "string" ? document.getElementById(params.parent) : params.parent;
  parent?.appendChild(root);
  scrollToToday(root, params.initialScroll ?? "today");

  watchLocale(root, (e) => {
    if (e instanceof HTMLElement && states.has(e)) render(e as GanttElement);
  });

  if (params.ariaLabel !== undefined && typeof params.ariaLabel !== "string") {
    watchLocale(root, (e) => e.setAttribute("aria-label", resolveText(params.ariaLabel)));
  }

  return root;
}
