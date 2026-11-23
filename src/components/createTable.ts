import { createDOMElem } from "domelemjs";
import type { TableParams, TableLabels } from "../types";

type Cell = string | number;

const DEFAULT_LABELS: Required<Omit<TableLabels, "info">> & Pick<TableLabels, "info"> = {
  filter: "Szűrés…",
  filterAria: "Táblázat szűrése",
  prev: "Előző",
  next: "Következő",
  page: "Oldal",
  rowsPerPage: "Sor / oldal",
  noResults: "Nincs találat",
  sortAsc: "növekvő",
  sortDesc: "csökkenő",
  info: undefined,
};

/** Számokat számként, szöveget természetes sorrendben (magyar ábécé szerint) hasonlít össze */
function compareCells(a: Cell, b: Cell): number {
  const na = typeof a === "number" ? a : Number(a);
  const nb = typeof b === "number" ? b : Number(b);
  if (a !== "" && b !== "" && !Number.isNaN(na) && !Number.isNaN(nb)) return na - nb;
  return String(a).localeCompare(String(b), "hu", { numeric: true, sensitivity: "base" });
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
  data: Record<string, string | number>[] | (string | number)[][],
  params: TableParams
): HTMLElement {
  const p = {
    ...params,
    showHeader: params.showHeader ?? true,
    showFooter: params.showFooter ?? true,
    dataIsArray: Array.isArray(data[0]),
  };

  const cellNames = p.cellNames ?? { sum: "Sum", total: "Total", rowNr: "Row #" };
  const L = { ...DEFAULT_LABELS, ...params.labels };

  let headers: Cell[];
  let rows: Cell[][];

  if (p.dataIsArray) {
    const arrData = data as Cell[][];
    p.hasHeader = true;
    headers = p.hasHeader
      ? (arrData.shift() as Cell[])
      : arrData[0].map((_: Cell, index: number) => `Column #${index}`);
    rows = arrData;
  } else {
    const objData = data as Record<string, Cell>[];
    headers = Object.keys(objData[0]);
    rows = objData.map((row) => Object.values(row));
  }

  const footers: number[] = Array(headers.length).fill(0);

  if (p.hasFooter && p.showFooter) {
    rows.forEach((row) =>
      row.forEach((cell, cellIdx) => {
        footers[cellIdx] = footers[cellIdx] + parseFloat(String(cell));
      })
    );
  }

  if (p.sumRowValues) {
    if (p.hasHeader || !p.dataIsArray) headers.push(cellNames.sum as string);
    const total = footers.reduce((acc, cell) => acc + (Number.isNaN(cell) ? 0 : cell), 0);
    footers.push(total);
    rows.forEach((row) => row.push(row.reduce<number>((acc, cell) => acc + Number(cell), 0)));
  }

  if (p.addRowNumbers) {
    if (p.hasHeader) headers.unshift(cellNames.rowNr as string);
    footers.unshift(0);
    rows.forEach((row, rowIdx) => row.unshift(rowIdx + 1));
  }

  const footerRow: Cell[] = footers.map((val, idx) => {
    if (val === 0 && headers[idx] !== cellNames.total) return headers[idx];
    return val;
  });

  // ---- nézet: szűrés + rendezés + lapozás ----
  const sortable = p.sortable ?? false;
  const filterable = p.filterable ?? false;
  const paged = !!p.pageSize && p.pageSize > 0;
  const sizeOptions = paged ? Array.from(new Set([...(p.pageSizeOptions ?? []), p.pageSize!])).sort((a, b) => a - b) : [];
  const view = {
    sortCol: -1,
    sortDir: "none" as "none" | "asc" | "desc",
    query: "",
    page: 1,
    pageSize: p.pageSize ?? 0,
  };

  const visibleRows = (): Cell[][] => {
    let list = rows;
    const q = view.query.trim().toLowerCase();
    if (q) list = list.filter((row) => row.some((cell) => String(cell).toLowerCase().includes(q)));
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
          text: String(col),
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
            ...(sortable ? {} : { text: String(col) }),
          });
          if (sortable) {
            const btn = createDOMElem({
              tag: "button",
              text: String(col),
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
          text: String(col),
          attrs: { class: `table-col-${index}` },
        })),
      })],
    }));
  }

  const rootAttrs: Record<string, string> = { class: `table${params.class ? ` ${params.class}` : ""}` };
  if (params.id) rootAttrs.id = params.id;

  // Egyik extra funkció sincs bekapcsolva: marad az egyszerű <table>
  if (!sortable && !filterable && !paged) {
    return createDOMElem({ parent: params.parent, tag: "table", attrs: rootAttrs, children: tableChildren });
  }

  const table = createDOMElem({ tag: "table", attrs: rootAttrs, children: tableChildren });

  // ---- vezérlők ----
  const info = createDOMElem({ tag: "span", append: false, attrs: { class: "table-info", "aria-live": "polite" } });
  const pager = createDOMElem({ tag: "nav", append: false, attrs: { class: "table-pager", "aria-label": L.page } });
  const toolbar = createDOMElem({ tag: "div", append: false, attrs: { class: "table-toolbar" } });

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
          render();
        },
      },
    });
  }

  if (paged && sizeOptions.length > 1) {
    const label = createDOMElem({ tag: "label", parent: toolbar, attrs: { class: "table-size" }, children: [{ tag: "span", text: L.rowsPerPage }] });
    const select = document.createElement("select");
    select.className = "table-size-select";
    sizeOptions.forEach((n) => {
      const o = document.createElement("option");
      o.value = String(n);
      o.textContent = String(n);
      if (n === view.pageSize) o.selected = true;
      select.appendChild(o);
    });
    select.addEventListener("change", () => {
      view.pageSize = Number(select.value);
      view.page = 1;
      render();
    });
    label.appendChild(select);
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
    render();
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
        ...(opts.disabled ? { disabled: "" } : {}),
      },
      handleEvent: {
        event: "click",
        cb: () => {
          view.page = page;
          render();
        },
      },
    });
  }

  function render(): void {
    const list = visibleRows();
    const total = list.length;
    const pages = paged ? Math.max(1, Math.ceil(total / view.pageSize)) : 1;
    view.page = Math.min(Math.max(view.page, 1), pages);
    const start = paged ? (view.page - 1) * view.pageSize : 0;
    const slice = paged ? list.slice(start, start + view.pageSize) : list;

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
      if (btn) btn.setAttribute("title", active ? (view.sortDir === "asc" ? L.sortAsc : L.sortDesc) : "");
    });

    // info + lapozó
    const from = total === 0 ? 0 : start + 1;
    const to = start + slice.length;
    info.textContent = L.info ? L.info({ from, to, total, all: rows.length }) : paged ? `${from}–${to} / ${total}` : `${total} / ${rows.length}`;

    pager.textContent = "";
    if (paged) {
      pager.hidden = pages <= 1;
      pager.appendChild(pageButton(`‹ ${L.prev}`, view.page - 1, { disabled: view.page === 1, aria: L.prev }));
      pageList(view.page, pages).forEach((n) => {
        if (n === "…") {
          pager.appendChild(createDOMElem({ tag: "span", append: false, text: "…", attrs: { class: "table-page-gap", "aria-hidden": "true" } }));
        } else {
          pager.appendChild(pageButton(String(n), n, { current: n === view.page, aria: `${L.page} ${n}` }));
        }
      });
      pager.appendChild(pageButton(`${L.next} ›`, view.page + 1, { disabled: view.page === pages, aria: L.next }));
    }
  }

  render();
  return container;
}
