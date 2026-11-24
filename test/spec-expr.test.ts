import { describe, it, expect, vi } from "vitest";
import { parseExpr, evalExpr, compileTemplate, evalTemplate, hasTemplate, ExprError } from "../src/spec/expr";
import type { ExprEnv } from "../src/spec/expr";
import { Store } from "../src/spec/store";

const envOf = (state: Record<string, unknown>, reads: string[] = []): ExprEnv => ({
  resolve: (name) => (name in state ? { value: state[name], statePath: name } : undefined),
  read: (p) => reads.push(p),
});
const ev = (src: string, state: Record<string, unknown> = {}, reads: string[] = []) => evalExpr(parseExpr(src), envOf(state, reads));

describe("expr – értékek és operátorok", () => {
  it("literálok és aritmetika precedenciával", () => {
    expect(ev("1 + 2 * 3")).toBe(7);
    expect(ev("(1 + 2) * 3")).toBe(9);
    expect(ev("10 / 4")).toBe(2.5);
    expect(ev("7 % 4")).toBe(3);
    expect(ev("-2 + 5")).toBe(3);
    expect(ev("'a' + 'b'")).toBe("ab");
    expect(ev("'n=' + 3")).toBe("n=3");
    expect(ev("true")).toBe(true);
    expect(ev("null")).toBeNull();
  });

  it("összehasonlítás és logika", () => {
    expect(ev("1 < 2 && 2 <= 2")).toBe(true);
    expect(ev("a == 'x'", { a: "x" })).toBe(true);
    expect(ev("a != 'x'", { a: "y" })).toBe(true);
    expect(ev("!a", { a: 0 })).toBe(true);
    expect(ev("a || 'alap'", { a: "" })).toBe("alap");
    expect(ev("a ?? 'alap'", { a: 0 })).toBe(0);
    expect(ev("a ?? 'alap'", { a: null })).toBe("alap");
    expect(ev("n == null", {})).toBe(true);
  });

  it("ternáris, egymásba ágyazva is", () => {
    expect(ev("n > 1 ? 'több' : 'egy'", { n: 3 })).toBe("több");
    expect(ev("a ? 1 : b ? 2 : 3", { a: false, b: true })).toBe(2);
  });

  it("útvonalak: pont, index, számított kulcs", () => {
    const state = { a: { b: [{ c: "x" }, { c: "y" }] }, k: 1 };
    expect(ev("a.b[1].c", state)).toBe("y");
    expect(ev("a.b[k].c", state)).toBe("y");
    expect(ev("a.b.0.c", state)).toBe("x");
    expect(ev("a.nincs.c", state)).toBeUndefined();
  });

  it("függvények", () => {
    expect(ev("len(list)", { list: [1, 2, 3] })).toBe(3);
    expect(ev("len('abc')")).toBe(3);
    expect(ev("upper(s) + lower('ÁB')", { s: "ab" })).toBe("ABáb");
    expect(ev("join(list, '-')", { list: [1, 2] })).toBe("1-2");
    expect(ev("round(2.456, 1)")).toBe(2.5);
    expect(ev("max(1, 5, 3) - min(4, 2)")).toBe(3);
    expect(ev("plural(n, 'alma', 'alma')", { n: 1 })).toBe("alma");
    expect(ev("trim('  x ')")).toBe("x");
  });
});

describe("expr – biztonság és hibák", () => {
  it("tiltott mezők nem érhetők el", () => {
    expect(() => parseExpr("a.constructor")).toThrow(ExprError);
    expect(() => parseExpr("__proto__")).toThrow(ExprError);
    expect(ev("a['constructor']", { a: {} })).toBeUndefined();
    expect(ev("a['__proto__']", { a: {} })).toBeUndefined();
  });

  it("nincs tetszőleges függvényhívás, metódushívás és hozzárendelés", () => {
    expect(() => parseExpr("alert(1)")).toThrow(/ismeretlen függvény/);
    expect(() => parseExpr("a.toString()")).toThrow(ExprError);
    expect(() => parseExpr("a = 1")).toThrow(ExprError);
    expect(() => parseExpr("window.location")).not.toThrow(); // csak útvonal: a környezet nem oldja fel
    expect(ev("window.location", {})).toBeUndefined();
  });

  it("szintaktikai hibák", () => {
    expect(() => parseExpr("1 +")).toThrow(ExprError);
    expect(() => parseExpr("(1")).toThrow(/hiányzik/);
    expect(() => parseExpr("'nyitva")).toThrow(/idézőjel/);
    expect(() => parseExpr("a === b")).toThrow(/==/);
    expect(() => parseExpr("a @ b")).toThrow(/ismeretlen karakter/);
  });
});

describe("expr – függőségek és sablonok", () => {
  it("az olvasott állapot-útvonalakat jelenti", () => {
    const reads: string[] = [];
    ev("a.b[0].c + len(list) + x", { a: { b: [{ c: 1 }] }, list: [], x: 1 }, reads);
    expect(reads).toEqual(["a.b.0.c", "list", "x"]);
  });

  it("a nem állapotból jövő gyökér nem követett", () => {
    const reads: string[] = [];
    const env: ExprEnv = { resolve: (n) => (n === "c" ? { value: { name: "x" } } : undefined), read: (p) => reads.push(p) };
    expect(evalExpr(parseExpr("c.name"), env)).toBe("x");
    expect(reads).toEqual([]);
  });

  it("sablon: szöveg + kifejezés, az egész-kifejezés nyers értéket ad", () => {
    const env = envOf({ n: 3, list: [1, 2] });
    expect(evalTemplate(compileTemplate("Összesen ${n} db, ${n > 1 ? 'több' : 'egy'}")!, env)).toBe("Összesen 3 db, több");
    expect(evalTemplate(compileTemplate("${list}")!, env)).toEqual([1, 2]);
    expect(evalTemplate(compileTemplate("${n}")!, env)).toBe(3);
  });

  it("sablon: } és idézőjel a kifejezésben, $${ literál, nincs kifejezés", () => {
    const env = envOf({ a: 1 });
    expect(evalTemplate(compileTemplate("${a == 1 ? '}' : '{'}")!, env)).toBe("}");
    expect(compileTemplate("ár: $${nem}")).toBeNull();
    expect(compileTemplate("sima szöveg")).toBeNull();
    expect(hasTemplate("x ${a}")).toBe(true);
    expect(hasTemplate("x $${a}")).toBe(false);
    expect(() => compileTemplate("${nincs lezárva")).toThrow(ExprError);
  });

  it("undefined / null a szövegben üres", () => {
    expect(evalTemplate(compileTemplate("[${x}]")!, envOf({}))).toBe("[]");
  });
});

describe("Store", () => {
  it("get / set, beágyazott és index útvonalak", () => {
    const s = new Store({ a: { b: 1 }, list: [{ n: 1 }] });
    expect(s.get("a.b")).toBe(1);
    s.set("a.b", 2);
    s.set("list[0].n", 5);
    s.set("új.mély.kulcs", "x");
    expect(s.get("a.b")).toBe(2);
    expect(s.get("list.0.n")).toBe(5);
    expect(s.get("új.mély.kulcs")).toBe("x");
  });

  it("változtathatatlan frissítés: a köztes tárolók új azonosságot kapnak", () => {
    const s = new Store({ a: { b: { c: 1 } }, list: [{ n: 1 }, { n: 2 }] });
    const before = { a: s.get("a"), b: s.get("a.b"), list: s.get("list"), item1: s.get("list.1") };
    s.set("a.b.c", 2);
    s.set("list.0", { n: 9 });
    expect(s.get("a")).not.toBe(before.a);
    expect(s.get("list")).not.toBe(before.list);
    expect(s.get("list.1")).toBe(before.item1); // a nem érintett elem azonossága megmarad
    expect(before.b).toEqual({ c: 1 });
  });

  it("toggle / inc / push", () => {
    const s = new Store({ open: false, n: 1, items: [1] });
    s.toggle("open");
    s.inc("n");
    s.inc("n", 5);
    s.push("items", 2);
    s.push("újlista", "x");
    expect(s.snapshot).toMatchObject({ open: true, n: 7, items: [1, 2], újlista: ["x"] });
  });

  it("értesítés: egyezés, előtag és kiterjesztés; nem érintett útvonal nem kap", () => {
    const s = new Store({ a: { b: 1, c: 1 }, x: 1 });
    const onB = vi.fn(), onA = vi.fn(), onBdeep = vi.fn(), onX = vi.fn();
    s.subscribe(["a.b"], onB);
    s.subscribe(["a"], onA);
    s.subscribe(["a.b.deep"], onBdeep);
    s.subscribe(["x"], onX);
    s.set("a.b", 2);
    expect(onB).toHaveBeenCalledTimes(1);
    expect(onA).toHaveBeenCalledTimes(1);
    expect(onBdeep).toHaveBeenCalledTimes(1); // az író útvonal előtagja a figyeltnek
    expect(onX).not.toHaveBeenCalled();
    s.set("a.c", 2);
    expect(onB).toHaveBeenCalledTimes(1); // testvér útvonal
    expect(onA).toHaveBeenCalledTimes(2);
  });

  it("azonos primitív érték nem értesít, a leiratkozás működik", () => {
    const s = new Store({ n: 1 });
    const cb = vi.fn();
    const off = s.subscribe(["n"], cb);
    s.set("n", 1);
    expect(cb).not.toHaveBeenCalled();
    s.set("n", 2);
    off();
    s.set("n", 3);
    expect(cb).toHaveBeenCalledTimes(1);
  });

  it("batch: több írás egyetlen értesítés", () => {
    const s = new Store({ a: 1, b: 1 });
    const cb = vi.fn();
    s.subscribe(["a", "b"], cb);
    s.batch(() => {
      s.set("a", 2);
      s.set("b", 2);
    });
    expect(cb).toHaveBeenCalledTimes(1);
  });

  it("tiltott kulcsok", () => {
    const s = new Store();
    expect(() => s.set("__proto__.x", 1)).toThrow(/Tiltott/);
    expect(() => s.set("a.constructor", 1)).toThrow(/Tiltott/);
  });
});
