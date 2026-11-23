import { createDOMElem } from "../dom";
import type { TableParams, TableLabels, TableElement, TableServerQuery } from "../types";
import { builtin, getLocale, resolveText, watchLocale } from "../i18n";
import type { TextValue } from "../i18n";

/** Egy cella: szám, szöveg, vagy nyelvfüggő szöveg (tr() / függvény), ami nyelvváltáskor frissül */
type Cell = string | number | TextValue;

const cellText = (c: Cell): string => (typeof c === "number" ? String(c) : resolveText(c));

const DEFAULT_LABELS: Required<Omit<TableLabels, "info">> & Pick<TableLabels, "info"> = {
  filter: builtin("table.filter", "Szűrés…"),
  filterAria: builtin("table.filterAria", "Táblázat szűrése"),
  prev: builtin("table.prev", "Előző"),
  next: builtin("table.next", "Következő"),
  page: builtin("table.page", "Oldal"),
  rowsPerPage: builtin("table.rowsPerPage", "Sor / oldal"),
  all: builtin("table.all", "Mind"),
  noResults: builtin("table.noResults", "Nincs találat"),
  sortAsc: builtin("table.sortAsc", "növekvő"),
  sortDesc: builtin("table.sortDesc", "csökkenő"),
  info: undefined,
};

/** Számokat számként, szöveget természetes sorrendben (magyar ábécé szerint) hasonlít össze */
function compareCells(a: Cell, b: Cell): number {
  const ta = cellText(a);
  const tb = cellText(b);
  const na = typeof a === "number" ? a : Number(ta);
  const nb = typeof b === "number" ? b : Number(tb);
  if (ta !== "" && tb !== "" && !Number.isNaN(na) && !Number.isNaN(nb)) return na - nb;
  return ta.localeCompare(tb, getLocale(), { numeric: true, sensitivity: "base" });
}

/** Oldalszámok kompakt listája: 1 … 4 5 6 … 20 */
function pageList(current: number, total: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const set = new Set([1, total, current - 1, current, current + 1]);
  if (current <= 3) [2, 3, 4].forEach((n) => set.add(n));
  if (current >= total - 2) [total - 3, total - 2, total - 1].forEach((n) => set.add(n));
  const sorted = [...set].filter((n) => n >= 1 && n <= total).sort((a, b) => a - b);
  const out: (number | "…")[] = [];
  sorted.forEach((n, i) => {
    if (i > 0 && n - sorted[i - 1] > 1) out.push("…");
    out.push(n);
  });
  return out;
}

export function createTable(
  data: Record<string, string | number | TextValue>[] | (string | number | TextValue)[][],
  params: TableParams & { serverSide: NonNullable<TableParams["serverSide"]> }
): TableElement;
export function createTable(
  data: Record<string, string | number | TextValue>[] | (string | number | TextValue)[][],
  params: TableParams
): HTMLElement;
export function createTable(
  data: Record<string, string | number | TextValue>[] | (string | number | TextValue)[][],
  params: TableParams
): HTMLElement | TableElement {
  const server = params.serverSide;
  const p = {
    ...params,
    showHeader: params.showHeader ?? true,
    // szerveroldali lapozásnál az összegek csak az aktuális oldalra szólnának, ezért nincs lábléc
    showFooter: server ? false : params.showFooter ?? true,
    dataIsArray: Array.isArray(data[0]),
  };

  const cellNames = {
    sum: builtin("table.sum", "Sum") as TextValue,
    total: builtin("table.total", "Total") as TextValue,
    rowNr: builtin("table.rowNr", "Row #") as TextValue,
    ...p.cellNames,
  };
  const L = { ...DEFAULT_LABELS, ...params.labels };

  let headers: Cell[];
  let rawRows: Cell[][];
  /** Az objektum-sorok kulcsai (setData-hoz); tömbös adatnál nincs */
  let objectKeys: string[] | null = null;

  if (p.dataIsArray) {
    const arrData = data as Cell[][];
    p.hasHeader = true;
    headers = p.hasHeader
      ? (arrData.shift() as Cell[])
      : arrData[0].map((_: Cell, index: number) => `Column #${index}`);
    rawRows = arrData;
  } else {
    const objData = data as Record<string, Cell>[];
    headers = Object.keys(objData[0] ?? {});
    objectKeys = [...(headers as string[])];
    rawRows = objData.map((row) => Object.values(row));
  }

  const footers: number[] = Array(headers.length).fill(0);

  if (p.hasFooter && p.showFooter) {
    rawRows.forEach((row) =>
      row.forEach((cell, cellIdx) => {
        footers[cellIdx] = footers[cellIdx] + parseFloat(cellText(cell));
      })
    );
  }

  if (p.sumRowValues) {
    if (p.hasHeader || !p.dataIsArray) headers.push(cellNames.sum);
    const total = footers.reduce((acc, cell) => acc + (Number.isNaN(cell) ? 0 : cell), 0);
    footers.push(total);
  }

  if (p.addRowNumbers) {
    if (p.hasHeader) headers.unshift(cellNames.rowNr);
    footers.unshift(0);
  }

  /** Számított oszlopok (összeg, sorszám) hozzáadása; az offset a szerveroldali oldalak miatt kell */
  const decorate = (raw: Cell[][], offset = 0): Cell[][] =>
    raw.map((row, i) => {
      const r = [...row];
      if (p.sumRowValues) r.push(row.reduce<number>((acc, cell) => acc + Number(cell), 0));
      if (p.addRowNumbers) r.unshift(offset + i + 1);
      return r;
    });

  const footerRow: Cell[] = footers.map((val, idx) => {
    if (val === 0 && headers[idx] !== cellNames.total) return headers[idx];
    return val;
  });

  // ---- nézet: szűrés + rendezés + lapozás ----
  const sortable = p.sortable ?? false;
  const filterable = p.filterable ?? false;
  // Oldalméret-választó: a megadott sorrendben, `"all"` = az összes sor egy oldalon
  const sizeOptions = Array.from(new Set((p.pageSizeOptions ?? []).filter((n) => n === "all" || (typeof n === "number" && n > 0))));
  const firstNumeric = sizeOptions.find((n): n is number => typeof n === "number");
  const initialSize: number | "all" =
    p.pageSize && p.pageSize > 0
      ? p.pageSize
      : sizeOptions.includes("all") && firstNumeric === undefined
        ? "all"
        : firstNumeric ?? 0;
  const paged = initialSize === "all" || initialSize > 0;

  const view = {
    sortCol: -1,
    sortDir: "none" as "none" | "asc" | "desc",
    query: "",
    page: Math.max(1, server?.page ?? 1),
    pageSize: initialSize as number | "all",
  };

  // A táblázat tényleges sorai: kliens módban az összes, szerver módban az aktuális oldal
  const initialOffset = server && typeof view.pageSize === "number" ? (view.page - 1) * view.pageSize : 0;
  let rows: Cell[][] = decorate(rawRows, initialOffset);
  let serverTotal = server ? server.total : 0;
  let loading = false;

  const visibleRows = (): Cell[][] => {
    if (server) return rows; // a szűrést / rendezést a szerver végezte
    let list = rows;
    const q = view.query.trim().toLowerCase();
    if (q) list = list.filter((row) => row.some((cell) => cellText(cell).toLowerCase().includes(q)));
    if (view.sortDir !== "none" && view.sortCol >= 0) {
      const dir = view.sortDir === "asc" ? 1 : -1;
      const c = view.sortCol;
      list = [...list].sort((a, b) => dir * compareCells(a[c], b[c]));
    }
    return list;
  };

  const buildRow = (row: Cell[], rowInd: number) =>
    createDOMElem({
      tag: "tr",
      append: false,
      attrs: { class: `table-row-${rowInd}` },
      children: row.map((col, colIdx) =>
        createDOMElem({
          tag: p.addRowNumbers && colIdx === 0 ? "th" : "td",
          text: typeof col === "number" ? String(col) : col,
          attrs: { class: `table-col-${colIdx}` },
        })
      ),
    });

  const tableChildren: ReturnType<typeof createDOMElem>[] = [];
  const sortButtons: HTMLElement[] = [];
  const headCells: HTMLElement[] = [];

  if (p.showHeader) {
    tableChildren.push(createDOMElem({
      tag: "thead",
      children: [createDOMElem({
        tag: "tr",
        attrs: { class: "header-row" },
        children: headers.map((col, index) => {
          const th = createDOMElem({
            tag: "th",
            attrs: { class: `table-col-${index}`, ...(sortable ? { "aria-sort": "none" } : {}) },
            ...(sortable ? {} : { text: typeof col === "number" ? String(col) : col }),
          });
          if (sortable) {
            const btn = createDOMElem({
              tag: "button",
              text: typeof col === "number" ? String(col) : col,
              parent: th,
              attrs: { type: "button", class: "table-sort-btn" },
              handleEvent: { event: "click", cb: () => toggleSort(index) },
            });
            sortButtons.push(btn);
          }
          headCells.push(th);
          return th;
        }),
      })],
    }));
  }

  const tbody = createDOMElem({ tag: "tbody", children: rows.map(buildRow) });
  tableChildren.push(tbody);

  if (p.showFooter) {
    tableChildren.push(createDOMElem({
      tag: "tfoot",
      children: [createDOMElem({
        tag: "tr",
        attrs: { class: "footer-row" },
        children: footerRow.map((col, index) => createDOMElem({
          tag: "th",
          text: typeof col === "number" ? String(col) : col,
          attrs: { class: `table-col-${index}` },
        })),
      })],
    }));
  }

  const rootAttrs: Record<string, string> = { class: `table${params.class ? ` ${params.class}` : ""}` };
  if (params.id) rootAttrs.id = params.id;

  // Egyik extra funkció sincs bekapcsolva: marad az egyszerű <table>
  if (!sortable && !filterable && !paged && !server) {
    return createDOMElem({ parent: params.parent, tag: "table", attrs: rootAttrs, children: tableChildren });
  }

  const table = createDOMElem({ tag: "table", attrs: rootAttrs, children: tableChildren });

  // ---- vezérlők ----
  const info = createDOMElem({ tag: "span", append: false, attrs: { class: "table-info", "aria-live": "polite" } });
  const pager = createDOMElem({ tag: "nav", append: false, attrs: { class: "table-pager", "aria-label": L.page } });
  const toolbar = createDOMElem({ tag: "div", append: false, attrs: { class: "table-toolbar" } });

  /** Változás után: kliens módban újrarajzol, szerver módban lekérdezést kér a hívótól */
  let filterTimer: ReturnType<typeof setTimeout> | undefined;
  const changed = (opts: { debounce?: boolean } = {}): void => {
    if (!server) return render();
    const wait = server.filterDebounce ?? 300;
    if (opts.debounce && wait > 0) {
      clearTimeout(filterTimer);
      filterTimer = setTimeout(requestServer, wait);
      render();
      return;
    }
    clearTimeout(filterTimer);
    requestServer();
  };

  if (filterable) {
    createDOMElem({
      tag: "input",
      parent: toolbar,
      attrs: { type: "search", class: "table-filter", placeholder: L.filter, "aria-label": L.filterAria },
      handleEvent: {
        event: "input",
        cb: (e: Event) => {
          view.query = (e.target as HTMLInputElement).value;
          view.page = 1;
          changed({ debounce: true });
        },
      },
    });
  }

  if (paged && sizeOptions.length > 0) {
    const label = createDOMElem({ tag: "label", parent: toolbar, attrs: { class: "table-size" }, children: [{ tag: "span", text: L.rowsPerPage }] });
    const select = createDOMElem({
      tag: "select",
      parent: label,
      attrs: { class: "table-size-select", "aria-label": L.rowsPerPage },
      handleEvent: {
        event: "change",
        cb: (e: Event) => {
          const v = (e.target as HTMLSelectElement).value;
          view.pageSize = v === "all" ? "all" : Number(v);
          view.page = 1;
          changed();
        },
      },
    }) as HTMLSelectElement;
    // ha a kezdő méret nincs a listában, megjelenik az elején, hogy a select helyes értéket mutasson
    const shown = sizeOptions.includes(view.pageSize) ? sizeOptions : [view.pageSize, ...sizeOptions];
    shown.forEach((n) => {
      createDOMElem({ tag: "option", parent: select, text: n === "all" ? L.all : String(n), attrs: { value: String(n) } });
    });
    select.value = String(view.pageSize);
  }

  const container = createDOMElem({
    parent: params.parent,
    tag: "div",
    attrs: { class: "table-container" },
    children: [
      ...(toolbar.childElementCount ? [toolbar] : []),
      createDOMElem({ tag: "div", attrs: { class: "table-scroll" }, children: [table] }),
      ...(paged || filterable ? [createDOMElem({ tag: "div", attrs: { class: "table-footer-bar" }, children: [info, ...(paged ? [pager] : [])] })] : []),
    ],
  });

  function toggleSort(col: number): void {
    if (view.sortCol !== col) {
      view.sortCol = col;
      view.sortDir = "asc";
    } else {
      view.sortDir = view.sortDir === "asc" ? "desc" : view.sortDir === "desc" ? "none" : "asc";
    }
    view.page = 1;
    changed();
  }

  function currentQuery(): TableServerQuery {
    const active = view.sortCol >= 0 && view.sortDir !== "none";
    return {
      page: view.page,
      pageSize: view.pageSize,
      filter: view.query.trim(),
      sort: active ? { column: cellText(headers[view.sortCol]), index: view.sortCol, direction: view.sortDir as "asc" | "desc" } : null,
    };
  }

  function setLoading(on: boolean): void {
    loading = on;
    container.classList.toggle("is-loading", on);
    container.setAttribute("aria-busy", String(on));
  }

  function requestServer(): void {
    if (!server) return;
    setLoading(true);
    render();
    server.onChange(currentQuery());
  }

  function pageButton(label: string, page: number, opts: { disabled?: boolean; current?: boolean; aria?: string } = {}): HTMLElement {
    return createDOMElem({
      tag: "button",
      append: false,
      text: label,
      attrs: {
        type: "button",
        class: `table-page-btn${opts.current ? " is-current" : ""}`,
        ...(opts.aria ? { "aria-label": opts.aria } : {}),
        ...(opts.current ? { "aria-current": "page" } : {}),
        ...(opts.disabled || loading ? { disabled: "" } : {}),
      },
      handleEvent: {
        event: "click",
        cb: () => {
          view.page = page;
          changed();
        },
      },
    });
  }

  function render(): void {
    const list = visibleRows();
    const total = server ? serverTotal : list.length;
    const size = view.pageSize === "all" ? Math.max(total, 1) : view.pageSize;
    const pages = paged ? Math.max(1, Math.ceil(total / size)) : 1;
    view.page = Math.min(Math.max(view.page, 1), pages);
    const start = paged ? (view.page - 1) * size : 0;
    // szerver módban a sorok már az aktuális oldal sorai
    const slice = paged && !server ? list.slice(start, start + size) : list;

    tbody.textContent = "";
    if (slice.length) {
      slice.forEach((row, i) => tbody.appendChild(buildRow(row, i)));
    } else {
      const cols = Math.max(headers.length, 1);
      tbody.appendChild(createDOMElem({
        tag: "tr",
        append: false,
        attrs: { class: "table-empty" },
        children: [{ tag: "td", text: L.noResults, attrs: { colspan: String(cols) } }],
      }));
    }

    // fejléc rendezési állapot
    headCells.forEach((th, i) => {
      const active = view.sortCol === i && view.sortDir !== "none";
      th.setAttribute("aria-sort", active ? (view.sortDir === "asc" ? "ascending" : "descending") : "none");
      th.classList.toggle("is-sorted", active);
      const btn = sortButtons[i];
      if (btn) btn.setAttribute("title", active ? resolveText(view.sortDir === "asc" ? L.sortAsc : L.sortDesc) : "");
    });

    // info + lapozó
    const from = total === 0 ? 0 : start + 1;
    const to = start + slice.length;
    const all = server ? serverTotal : rawRows.length;
    info.textContent = L.info
      ? L.info({ from, to, total, all })
      : paged
        ? `${from}–${to} / ${total}`
        : `${total} / ${all}`;

    pager.textContent = "";
    if (paged) {
      pager.hidden = pages <= 1;
      pager.appendChild(pageButton(`‹ ${resolveText(L.prev)}`, view.page - 1, { disabled: view.page === 1, aria: resolveText(L.prev) }));
      pageList(view.page, pages).forEach((n) => {
        if (n === "…") {
          pager.appendChild(createDOMElem({ tag: "span", append: false, text: "…", attrs: { class: "table-page-gap", "aria-hidden": "true" } }));
        } else {
          pager.appendChild(pageButton(String(n), n, { current: n === view.page, aria: `${resolveText(L.page)} ${n}` }));
        }
      });
      pager.appendChild(pageButton(`${resolveText(L.next)} ›`, view.page + 1, { disabled: view.page === pages, aria: resolveText(L.next) }));
    }
  }

  render();
  // nyelvváltáskor a cellák, feliratok és a (nyelvfüggő) rendezés is újraszámolódik; az állapot (oldal, szűrő) megmarad
  watchLocale(container, () => render());

  if (!server) return container;

  // ---- szerveroldali vezérlő ----
  const controller = container as TableElement;
  controller.setData = (newData, opts = {}) => {
    const incoming = newData as Record<string, Cell>[] | Cell[][];
    const raw: Cell[][] = incoming.map((row) =>
      Array.isArray(row) ? row : (objectKeys ?? Object.keys(row)).map((k) => (row as Record<string, Cell>)[k] ?? "")
    );
    if (opts.total !== undefined) serverTotal = opts.total;
    if (opts.page !== undefined) view.page = Math.max(1, opts.page);
    const size = view.pageSize === "all" ? 0 : view.pageSize;
    rows = decorate(raw, size ? (view.page - 1) * size : 0);
    setLoading(false);
    render();
  };
  controller.setLoading = (on = true) => {
    setLoading(on);
    render();
  };
  controller.getQuery = currentQuery;
  controller.reload = () => requestServer();
  return controller;
}
