import { createDOMElem } from "domelemjs";
import type { TableParams } from "./types";

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

  let headers: (string | number)[];
  let rows: (string | number)[][];

  if (p.dataIsArray) {
    const arrData = data as (string | number)[][];
    p.hasHeader = true;
    headers = p.hasHeader
      ? (arrData.shift() as (string | number)[])
      : arrData[0].map((_: string | number, index: number) => `Column #${index}`);
    rows = arrData;
  } else {
    const objData = data as Record<string, string | number>[];
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

  const footerRow: (string | number)[] = footers.map((val, idx) => {
    if (val === 0 && headers[idx] !== cellNames.total) return headers[idx];
    return val;
  });

  const tableChildren = [];
  if (p.showHeader) {
    tableChildren.push(createDOMElem({
      tag: "thead",
      children: [createDOMElem({
        tag: "tr",
        attrs: { class: "header-row" },
        children: headers.map((col, index) => createDOMElem({
          tag: "th",
          text: String(col),
          attrs: { class: `table-col-${index}` },
        })),
      })],
    }));
  }

  tableChildren.push(createDOMElem({
    tag: "tbody",
    children: rows.map((row, rowInd) => createDOMElem({
      tag: "tr",
      attrs: { class: `table-row-${rowInd}` },
      children: row.map((col, colIdx) => createDOMElem({
        tag: p.addRowNumbers && colIdx === 0 ? "th" : "td",
        text: String(col),
        attrs: { class: `table-col-${colIdx}` },
      })),
    })),
  }));

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

  return createDOMElem({
    parent: params.parent,
    tag: "table",
    attrs: rootAttrs,
    children: tableChildren,
  });
}
