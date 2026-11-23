import { describe, it, expect, beforeEach } from "vitest";
import { createTable } from "../src/index";

beforeEach(() => {
  document.body.innerHTML = '<div id="root"></div>';
});

const data = () => [
  { Név: "Csaba", Kor: 18, Város: "Szeged" },
  { Név: "Anna", Kor: 25, Város: "Budapest" },
  { Név: "Éva", Kor: 41, Város: "Pécs" },
  { Név: "Béla", Kor: 32, Város: "Debrecen" },
];
const names = (root: HTMLElement) => [...root.querySelectorAll("tbody tr:not(.table-empty)")].map((tr) => tr.children[0].textContent);
const click = (el: Element | null) => (el as HTMLElement).click();
const type = (input: HTMLInputElement, v: string) => {
  input.value = v;
  input.dispatchEvent(new Event("input", { bubbles: true }));
};

describe("createTable – alap", () => {
  it("extra funkció nélkül közvetlenül <table>-t ad vissza (visszafelé kompatibilis)", () => {
    const t = createTable(data(), { parent: "root", id: "t", hasHeader: true });
    expect(t.tagName).toBe("TABLE");
    expect(t.querySelector(".table-sort-btn")).toBeNull();
    expect(t.querySelectorAll("tbody tr")).toHaveLength(4);
  });
});

describe("createTable – rendezés", () => {
  it("a fejlécre kattintva növekvő → csökkenő → eredeti sorrend", () => {
    const t = createTable(data(), { parent: "root", id: "t", hasHeader: true, sortable: true });
    expect(t.tagName).toBe("DIV");
    const btn = () => t.querySelectorAll(".table-sort-btn")[0];
    click(btn());
    expect(names(t)).toEqual(["Anna", "Béla", "Csaba", "Éva"]);
    expect(t.querySelector("th")?.getAttribute("aria-sort")).toBe("ascending");
    click(btn());
    expect(names(t)).toEqual(["Éva", "Csaba", "Béla", "Anna"]);
    expect(t.querySelector("th")?.getAttribute("aria-sort")).toBe("descending");
    click(btn());
    expect(names(t)).toEqual(["Csaba", "Anna", "Éva", "Béla"]);
    expect(t.querySelector("th")?.getAttribute("aria-sort")).toBe("none");
  });

  it("a számokat számként rendezi (nem szövegként)", () => {
    const t = createTable([{ N: 10 }, { N: 9 }, { N: 100 }], { parent: "root", id: "t", hasHeader: true, sortable: true });
    click(t.querySelector(".table-sort-btn"));
    expect(names(t)).toEqual(["9", "10", "100"]);
  });
});

describe("createTable – szűrés", () => {
  it("bármely cellában keres, kis- és nagybetűre érzéketlenül, találat nélkül üzenet", () => {
    const t = createTable(data(), { parent: "root", id: "t", hasHeader: true, filterable: true });
    const input = t.querySelector(".table-filter") as HTMLInputElement;
    type(input, "BUDA");
    expect(names(t)).toEqual(["Anna"]);
    type(input, "nincs ilyen");
    expect(t.querySelector(".table-empty")?.textContent).toBe("Nincs találat");
    type(input, "");
    expect(names(t)).toHaveLength(4);
  });
});

describe("createTable – lapozás", () => {
  const many = () => Array.from({ length: 23 }, (_, i) => ({ Id: i + 1, Név: `N${i + 1}` }));

  it("oldalanként pageSize sort mutat, a lapozó lépked, az info frissül", () => {
    const t = createTable(many(), { parent: "root", id: "t", hasHeader: true, pageSize: 10 });
    expect(names(t)).toHaveLength(10);
    expect(t.querySelector(".table-info")?.textContent).toBe("1–10 / 23");
    const pageBtns = () => [...t.querySelectorAll(".table-page-btn")] as HTMLButtonElement[];
    expect(pageBtns()[0].disabled).toBe(true); // előző
    click(pageBtns().find((b) => b.textContent === "3") ?? null);
    expect(names(t)).toHaveLength(3);
    expect(t.querySelector(".table-info")?.textContent).toBe("21–23 / 23");
    expect(t.querySelector(".table-page-btn.is-current")?.textContent).toBe("3");
    const all = pageBtns();
    expect(all[all.length - 1].disabled).toBe(true); // következő
  });

  it("szűrés után az 1. oldalra ugrik és csak a találatokat lapozza", () => {
    const t = createTable(many(), { parent: "root", id: "t", hasHeader: true, pageSize: 5, filterable: true });
    click([...t.querySelectorAll(".table-page-btn")].find((b) => b.textContent === "2") ?? null);
    type(t.querySelector(".table-filter") as HTMLInputElement, "N2");
    // N2, N20, N21, N22, N23 = 5 találat -> egy oldal, a lapozó rejtett
    expect(names(t)).toEqual(["2", "20", "21", "22", "23"]);
    expect((t.querySelector(".table-pager") as HTMLElement).hidden).toBe(true);
    expect(t.querySelector(".table-info")?.textContent).toBe("1–5 / 5");
  });

  it("a pageSizeOptions legördülője átállítja az oldalméretet", () => {
    const t = createTable(many(), { parent: "root", id: "t", hasHeader: true, pageSize: 10, pageSizeOptions: [5, 25] });
    const select = t.querySelector(".table-size-select") as HTMLSelectElement;
    expect([...select.options].map((o) => o.value)).toEqual(["5", "10", "25"]);
    select.value = "25";
    select.dispatchEvent(new Event("change"));
    expect(names(t)).toHaveLength(23);
    expect(t.querySelector(".table-info")?.textContent).toBe("1–23 / 23");
  });

  it("a rendezés a teljes adatra hat, nem csak az aktuális oldalra", () => {
    const t = createTable(many(), { parent: "root", id: "t", hasHeader: true, sortable: true, pageSize: 5 });
    click(t.querySelectorAll(".table-sort-btn")[0]);
    click(t.querySelectorAll(".table-sort-btn")[0]); // csökkenő
    expect(names(t)).toEqual(["23", "22", "21", "20", "19"]);
  });
});
