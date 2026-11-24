import { createDOMElem } from "../dom";
import { registerTranslations, tr } from "../i18n";
import type { MessagesTree } from "../i18n";
import { openModal, closeModal } from "../components/createModal";
import { openDrawer, closeDrawer } from "../components/createDrawer";
import { parseYaml } from "./parseYaml";
import { compileTemplate, evalTemplate, parseExpr, evalExpr, ExprError } from "./expr";
import type { ExprEnv, Template } from "./expr";
import { Store } from "./store";
import { SpecError, didYouMean } from "./errors";
import { getDef, componentNames } from "./registry";
import type { Def } from "./registry";

/* ===== Nyilvános típusok ===== */

export interface HandlerContext {
  state: Store;
  ui: UI;
  /** Az esemény (ha a visszahívás első argumentuma esemény) */
  event?: Event;
  /** Az esemény célelemének legközelebbi `currentTarget`-je */
  el?: Element | null;
  /** A visszahívás összes argumentuma */
  args: unknown[];
}

export type Handler = (ctx: HandlerContext, ...args: any[]) => unknown;

export interface BuildOptions {
  /** Hová épüljön (elem vagy azonosító); ha nincs megadva, új `div` készül. */
  parent?: HTMLElement | string;
  /** `@név` hivatkozások: a leíróban megadott eseménykezelők */
  handlers?: Record<string, Handler>;
  /** Kész adatok, a leíróban `$név` vagy `${név}` néven érhetők el (nem reaktívak) */
  data?: Record<string, unknown>;
  /** Kezdő állapot (a leíró `state:` részét felülírja) */
  state?: Record<string, unknown>;
}

export interface UI {
  /** A gyökérelem, amibe a leíró épült */
  root: HTMLElement;
  /** Az állapottár (`ui.state.set('kulcs', érték)` frissíti a kötéseket) */
  state: Store;
  /** Egy elem a leíróbeli `#id` alapján */
  get(id: string): HTMLElement | undefined;
  /** Leiratkozik minden kötésről, eltávolítja a felépített elemeket */
  destroy(): void;
}

/* ===== Belső típusok ===== */

type Vars = Record<string, unknown>;

interface Ctx {
  store: Store;
  data: Record<string, unknown>;
  handlers: Record<string, Handler>;
  defs: Record<string, DefineSpec>;
  byId: Map<string, HTMLElement>;
  counters: Record<string, number>;
  scratch: HTMLElement;
  ui: UI;
}

interface DefineSpec {
  params: string[];
  body: unknown[];
}

class Owner {
  private fns: Array<() => void> = [];
  add(fn: () => void): void {
    this.fns.push(fn);
  }
  dispose(): void {
    for (const f of this.fns.splice(0)) f();
  }
}

/** Egy felépített csomópont a DOM-ban: az elejét és végét jelző csomópont (elemnél ugyanaz). */
interface Mounted {
  first: Node;
  last: Node;
  dispose(): void;
}

const EVENTS = new Set([
  "click", "dblclick", "input", "change", "submit", "keydown", "keyup", "keypress", "focus", "blur", "mouseover", "mouseout",
  "mouseenter", "mouseleave", "mousedown", "mouseup", "pointerdown", "pointerup", "scroll", "wheel", "contextmenu", "dragstart",
  "dragend", "dragover", "drop", "touchstart", "touchend",
]);
const RAW_RESERVED = new Set(["text", "html", "t", "args", "children", "style", "class", "attrs", "bind"]);
const ACTIONS = new Set(["set", "toggle", "inc", "push", "open", "close"]);
/** Új hatókör: null-prototípusú, hogy az `Object.prototype` nevei (toString, ...) ne oldódjanak fel. */
function child(scope: Vars, vars: Vars): Vars {
  return Object.assign(Object.create(null), scope, vars);
}

const DATA_REF = /^\$([A-Za-z_]\w*(?:\.\w+|\[\w+\])*)$/;

const templateCache = new Map<string, Template | null>();
function template(s: string, path: string): Template | null {
  if (templateCache.has(s)) return templateCache.get(s)!;
  let t: Template | null;
  try {
    t = compileTemplate(s);
  } catch (e) {
    throw new SpecError((e as Error).message, path);
  }
  templateCache.set(s, t);
  return t;
}

/* ===== Kulcs-szelektor: Típus(szint)#id.osztály.osztály ===== */

interface Selector {
  type: string;
  level?: number;
  id?: string;
  classes: string[];
}

/** A `${...}` csoportokat egyben tartó darabolás a `#` és `.` jeleknél. */
function parseSelector(key: string, path: string): Selector {
  const m = /^([A-Za-z][A-Za-z0-9-]*)(?:\((\d+)\))?/.exec(key);
  if (!m) throw new SpecError(`érvénytelen csomópont-név: "${key}"`, path);
  const sel: Selector = { type: m[1], classes: [] };
  if (m[2] !== undefined) sel.level = Number(m[2]);
  let i = m[0].length;
  while (i < key.length) {
    const kind = key[i];
    if (kind !== "#" && kind !== ".") throw new SpecError(`érvénytelen csomópont-név: "${key}" ("#id" vagy ".osztály" következhet)`, path);
    let j = i + 1;
    let depth = 0;
    for (; j < key.length; j++) {
      if (key[j] === "$" && key[j + 1] === "{") { depth++; j++; continue; }
      if (depth > 0) {
        if (key[j] === "{") depth++;
        else if (key[j] === "}") depth--;
        continue;
      }
      if (key[j] === "#" || key[j] === ".") break;
    }
    const part = key.slice(i + 1, j);
    if (!part) throw new SpecError(`üres ${kind === "#" ? "azonosító" : "osztály"} a névben: "${key}"`, path);
    if (kind === "#") sel.id = part;
    else sel.classes.push(part);
    i = j;
  }
  return sel;
}

/* ===== Kifejezés-környezet és értékek ===== */

function makeEnv(scope: Vars, ctx: Ctx, deps: Set<string> | null, dataFirst = false): ExprEnv {
  const stateKeys = ctx.store.snapshot;
  return {
    resolve(name) {
      if (dataFirst && name in ctx.data) return { value: ctx.data[name] };
      if (name in scope) return { value: scope[name] };
      if (name in stateKeys) return { value: stateKeys[name], statePath: name };
      if (name in ctx.data) return { value: ctx.data[name] };
      // még nem létező állapot-kulcs: később beállítható, ezért követjük
      return { value: undefined, statePath: name };
    },
    read: deps ? (p) => void deps.add(p) : undefined,
  };
}

function evalValue(v: unknown, scope: Vars, ctx: Ctx, deps: Set<string> | null, path: string): unknown {
  if (typeof v === "string") {
    const dm = DATA_REF.exec(v);
    if (dm) {
      try {
        return evalExpr(parseExpr(dm[1]), makeEnv(scope, ctx, deps, true));
      } catch (e) {
        throw new SpecError((e as Error).message, path);
      }
    }
    const tpl = template(v, path);
    if (!tpl) return v;
    try {
      return evalTemplate(tpl, makeEnv(scope, ctx, deps));
    } catch (e) {
      if (e instanceof ExprError) throw new SpecError(e.message, path);
      throw e;
    }
  }
  if (Array.isArray(v)) return v.map((x, i) => evalValue(x, scope, ctx, deps, `${path}[${i}]`));
  if (v && typeof v === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, x] of Object.entries(v)) out[k] = evalValue(x, scope, ctx, deps, `${path}.${k}`);
    return out;
  }
  return v;
}

/** Szöveg-érték kiértékelése szöveggé (undefined / null → üres). */
const asText = (v: unknown): string => (v === null || v === undefined ? "" : String(v));

/* ===== Visszahívások és beépített műveletek ===== */

function checkHandler(name: string, ctx: Ctx, path: string): Handler {
  const h = ctx.handlers[name];
  if (typeof h !== "function") {
    throw new SpecError(`ismeretlen eseménykezelő: "@${name}"${didYouMean(name, Object.keys(ctx.handlers))} (a buildUI handlers beállításában kell megadni)`, path);
  }
  return h;
}

function runAction(action: Record<string, unknown>, scope: Vars, ctx: Ctx, path: string): void {
  const keys = Object.keys(action);
  if (keys.length !== 1 || !ACTIONS.has(keys[0])) {
    throw new SpecError(`ismeretlen művelet: ${JSON.stringify(action)} (engedélyezett: ${[...ACTIONS].join(", ")}, vagy "@kezelő")`, path);
  }
  const [op] = keys;
  const arg = action[op];
  const store = ctx.store;
  /** Az útvonalak sablonok is lehetnek: `toggle: "active.${c.id}"` (az each változói elérhetők). */
  const at = (p: unknown): string => asText(evalValue(String(p), scope, ctx, null, path));
  switch (op) {
    case "set":
      store.batch(() => {
        for (const [k, v] of Object.entries(arg as Record<string, unknown>)) store.set(at(k), evalValue(v, scope, ctx, null, `${path}.set.${k}`));
      });
      return;
    case "toggle":
      store.batch(() => (Array.isArray(arg) ? arg : [arg]).forEach((p) => store.toggle(at(p))));
      return;
    case "inc":
      if (arg && typeof arg === "object") {
        store.batch(() => Object.entries(arg as Record<string, unknown>).forEach(([k, by]) => store.inc(at(k), Number(evalValue(by, scope, ctx, null, path)))));
      } else store.inc(at(arg));
      return;
    case "push":
      store.batch(() => {
        for (const [k, v] of Object.entries(arg as Record<string, unknown>)) store.push(at(k), evalValue(v, scope, ctx, null, `${path}.push.${k}`));
      });
      return;
    case "open":
    case "close": {
      const id = String(evalValue(arg, scope, ctx, null, path));
      const isModal = !!document.getElementById(`${id}-portal`);
      if (op === "open") (isModal ? openModal : openDrawer)(id);
      else (isModal ? closeModal : closeDrawer)(id);
      return;
    }
  }
}

/** `@kezelő`, művelet-objektum vagy ezek listája → függvény (a hibákat már építéskor jelzi). */
function toCallback(spec: unknown, scope: Vars, ctx: Ctx, path: string): (...args: unknown[]) => void {
  const items = Array.isArray(spec) ? spec : [spec];
  const steps = items.map((item, i): ((args: unknown[]) => void) => {
    const p = Array.isArray(spec) ? `${path}[${i}]` : path;
    if (typeof item === "string" && item.startsWith("@")) {
      const name = item.slice(1);
      const handler = checkHandler(name, ctx, p);
      return (args) => {
        const event = args[0] instanceof Event ? args[0] : undefined;
        handler({ state: ctx.store, ui: ctx.ui, event, el: (event?.currentTarget as Element | null) ?? null, args }, ...args);
      };
    }
    if (item && typeof item === "object" && !Array.isArray(item)) {
      const keys = Object.keys(item);
      if (keys.length !== 1 || !ACTIONS.has(keys[0])) {
        throw new SpecError(`ismeretlen művelet: ${JSON.stringify(item)}${didYouMean(keys[0] ?? "", ACTIONS)} (engedélyezett: ${[...ACTIONS].join(", ")}, vagy "@kezelő")`, p);
      }
      return () => runAction(item as Record<string, unknown>, scope, ctx, p);
    }
    throw new SpecError(`visszahívásnak "@kezelő" vagy művelet kell, nem ez: ${JSON.stringify(item)}`, p);
  });
  return (...args) => steps.forEach((s) => s(args));
}

/* ===== Beviteli kötés ===== */

function setupBind(root: HTMLElement, kind: "value" | "checked" | "radio", statePath: string, ctx: Ctx, owner: Owner, path: string): void {
  const store = ctx.store;
  if (kind === "radio") {
    const radios = Array.from(root.querySelectorAll<HTMLInputElement>('input[type="radio"]'));
    if (!radios.length) throw new SpecError("a bind: nem talál rádiógombot", path);
    const sync = (): void => radios.forEach((r) => (r.checked = r.value === asText(store.get(statePath))));
    sync();
    radios.forEach((r) => r.addEventListener("change", () => r.checked && store.set(statePath, r.value)));
    owner.add(store.subscribe([statePath], sync));
    return;
  }
  const input = root.matches("input,select,textarea") ? (root as HTMLInputElement) : root.querySelector<HTMLInputElement>("input,select,textarea");
  if (!input) throw new SpecError("a bind: nem talál beviteli elemet a komponensben", path);
  if (kind === "checked") {
    const sync = (): void => void (input.checked = !!store.get(statePath));
    sync();
    input.addEventListener("change", () => store.set(statePath, input.checked));
    owner.add(store.subscribe([statePath], sync));
    return;
  }
  const numeric = input.type === "number" || input.type === "range";
  const sync = (): void => {
    const v = asText(store.get(statePath));
    if (input.value !== v) input.value = v;
  };
  sync();
  const write = (): void => store.set(statePath, numeric && input.value !== "" ? Number(input.value) : input.value);
  input.addEventListener("input", write);
  input.addEventListener("change", write);
  owner.add(store.subscribe([statePath], sync));
}

/* ===== DOM-segédek ===== */

function nodesBetween(first: Node, last: Node): Node[] {
  const out: Node[] = [];
  for (let n: Node | null = first; n; n = n.nextSibling) {
    out.push(n);
    if (n === last) break;
  }
  return out;
}

function removeRange(first: Node, last: Node): void {
  nodesBetween(first, last).forEach((n) => n.parentNode?.removeChild(n));
}

function insertAll(nodes: Node[], parent: Node, ref: Node | null): void {
  nodes.forEach((n) => parent.insertBefore(n, ref));
}

function autoId(ctx: Ctx, type: string): string {
  const base = type.toLowerCase();
  ctx.counters[base] = (ctx.counters[base] ?? 0) + 1;
  let id = `${base}-${ctx.counters[base]}`;
  while (ctx.byId.has(id) || document.getElementById(id)) {
    ctx.counters[base]++;
    id = `${base}-${ctx.counters[base]}`;
  }
  return id;
}

function register(ctx: Ctx, id: string, el: HTMLElement, path: string, explicit: boolean): void {
  if (explicit && ctx.byId.has(id)) throw new SpecError(`ismétlődő azonosító: "${id}"`, path);
  ctx.byId.set(id, el);
}

/** Feliratkozás az állapot-függőségekre; a kimenet leiratkozása az `owner`-hez kerül. */
function watch(deps: Set<string>, ctx: Ctx, owner: Owner, fn: () => void, isStatic: boolean): void {
  if (isStatic || deps.size === 0) return;
  owner.add(ctx.store.subscribe([...deps], fn));
}

/* ===== Csomópontok ===== */

interface RenderEnv {
  ctx: Ctx;
  scope: Vars;
  owner: Owner;
  /** statikus mód: nincs feliratkozás (elemlista-paraméterekhez) */
  isStatic: boolean;
}

function renderNodes(list: unknown, env: RenderEnv, parent: Node, ref: Node | null, path: string): Mounted[] {
  if (list === null || list === undefined) return [];
  if (!Array.isArray(list)) throw new SpecError("lista kellene (a csomópontok listája, `- ...` elemekkel)", path);
  return list.map((node, i) => renderNode(node, env, parent, ref, `${path}[${i}]`));
}

function renderNode(node: unknown, env: RenderEnv, parent: Node, ref: Node | null, path: string): Mounted {
  if (typeof node === "string" || typeof node === "number" || typeof node === "boolean") return renderText(String(node), env, parent, ref, path);
  if (!node || typeof node !== "object" || Array.isArray(node)) {
    throw new SpecError(`csomópontnak szöveg vagy egykulcsos térkép kell, nem ez: ${JSON.stringify(node)}`, path);
  }
  const obj = node as Record<string, unknown>;
  if ("each" in obj) return renderEach(obj, env, parent, ref, path);
  if ("if" in obj) return renderIf(obj, env, parent, ref, path);
  const keys = Object.keys(obj);
  if (keys.length !== 1) {
    throw new SpecError(`egy csomópont egy kulcsot tartalmazhat (a komponens neve), ez több: ${keys.join(", ")} – a behúzást ellenőrizd`, path);
  }
  const key = keys[0];
  const sel = parseSelector(key, `${path}.${key}`);
  const here = `${path}.${key}`;
  const body = obj[key];
  const isComponent = /^[A-Z]/.test(sel.type);
  if (!isComponent) return renderRaw(sel, body, env, parent, ref, here);
  if (env.ctx.defs[sel.type]) return renderDefine(sel, body, env, parent, ref, here);
  const def = getDef(sel.type);
  if (!def) {
    const known = [...componentNames(), ...Object.keys(env.ctx.defs)];
    throw new SpecError(`ismeretlen komponens: ${sel.type}${didYouMean(sel.type, known)}`, here);
  }
  return renderComponent(def, sel, body, env, parent, ref, here);
}

function renderText(text: string, env: RenderEnv, parent: Node, ref: Node | null, path: string): Mounted {
  const { ctx, scope } = env;
  const tpl = template(text, path);
  const node = document.createTextNode("");
  const deps = new Set<string>();
  const compute = (d: Set<string> | null): string => asText(evalValue(text, scope, ctx, d, path));
  node.data = tpl ? compute(deps) : text;
  parent.insertBefore(node, ref);
  if (tpl) watch(deps, ctx, env.owner, () => void (node.data = compute(null)), env.isStatic);
  return { first: node, last: node, dispose: () => node.parentNode?.removeChild(node) };
}

/* ----- feltétel ----- */

function renderIf(obj: Record<string, unknown>, env: RenderEnv, parent: Node, ref: Node | null, path: string): Mounted {
  for (const k of Object.keys(obj)) {
    if (!["if", "then", "else"].includes(k)) throw new SpecError(`ismeretlen kulcs az if csomópontban: "${k}"${didYouMean(k, ["then", "else"])}`, `${path}.if`);
  }
  if (!("then" in obj)) throw new SpecError('az if csomópontban hiányzik a "then" lista', `${path}.if`);
  const { ctx, scope } = env;
  const start = document.createComment("if");
  const end = document.createComment("/if");
  parent.insertBefore(start, ref);
  parent.insertBefore(end, ref);
  let inner = new Owner();
  let current: Mounted[] = [];
  const deps = new Set<string>();

  const clear = (): void => {
    inner.dispose();
    inner = new Owner();
    current.forEach((m) => m.dispose());
    current = [];
  };
  const draw = (d: Set<string> | null): void => {
    clear();
    const ok = !!evalValue(obj.if, scope, ctx, d, `${path}.if`);
    const branch = ok ? obj.then : obj.else;
    if (branch !== undefined) current = renderNodes(branch, { ...env, owner: inner }, parent, end, `${path}.${ok ? "then" : "else"}`);
  };
  draw(deps);
  watch(deps, ctx, env.owner, () => draw(null), env.isStatic);
  return {
    first: start,
    last: end,
    dispose: () => {
      clear();
      removeRange(start, end);
    },
  };
}

/* ----- ismétlés ----- */

interface EachItem {
  key: unknown;
  value: unknown;
  owner: Owner;
  mounted: Mounted[];
  first: Node;
  last: Node;
}

function renderEach(obj: Record<string, unknown>, env: RenderEnv, parent: Node, ref: Node | null, path: string): Mounted {
  for (const k of Object.keys(obj)) {
    if (!["each", "do"].includes(k)) throw new SpecError(`ismeretlen kulcs az each csomópontban: "${k}"${didYouMean(k, ["do"])}`, `${path}.each`);
  }
  const spec = obj.each as Record<string, unknown>;
  if (!spec || typeof spec !== "object" || !("in" in spec) || typeof spec.as !== "string") {
    throw new SpecError('az each értéke { in: ..., as: név, key: ... } kell legyen', `${path}.each`);
  }
  if (!("do" in obj)) throw new SpecError('az each csomópontban hiányzik a "do" lista', `${path}.each`);
  const { ctx, scope } = env;
  const as = spec.as as string;
  const start = document.createComment("each");
  const end = document.createComment("/each");
  parent.insertBefore(start, ref);
  parent.insertBefore(end, ref);
  let items = new Map<unknown, EachItem>();
  const deps = new Set<string>();

  const keyOf = (value: unknown, index: number): unknown => {
    if (spec.key === undefined) return index;
    const k = evalValue(typeof spec.key === "string" && !spec.key.includes("${") ? `\${${spec.key}}` : spec.key, child(scope, { [as]: value, index }), ctx, null, `${path}.each.key`);
    return k;
  };

  const draw = (d: Set<string> | null): void => {
    const raw = evalValue(spec.in, scope, ctx, d, `${path}.each.in`);
    const list = Array.isArray(raw) ? raw : [];
    const next = new Map<unknown, EachItem>();
    const order: EachItem[] = [];
    list.forEach((value, index) => {
      const key = keyOf(value, index);
      if (next.has(key)) throw new SpecError(`ismétlődő kulcs az each-ben: ${JSON.stringify(key)}`, `${path}.each`);
      const old = items.get(key);
      let item: EachItem;
      if (old && Object.is(old.value, value)) {
        item = old;
        items.delete(key);
      } else {
        item = { key, value, owner: new Owner(), mounted: [], first: end, last: end };
        item.mounted = []; // a tényleges felépítés a rendezés közben, a helyes pozícióban történik
      }
      next.set(key, item);
      order.push(item);
    });
    // a már nem szereplő elemek eltávolítása
    for (const stale of items.values()) {
      stale.owner.dispose();
      stale.mounted.forEach((m) => m.dispose());
    }
    // rendezés / felépítés
    let cursor: Node = start.nextSibling ?? end;
    order.forEach((item, index) => {
      if (item.mounted.length === 0) {
        const itemScope = child(scope, { [as]: item.value, index });
        const before = cursor;
        item.mounted = renderNodes(obj.do, { ...env, scope: itemScope, owner: item.owner }, parent, before, `${path}.do`);
        if (item.mounted.length) {
          item.first = item.mounted[0].first;
          item.last = item.mounted[item.mounted.length - 1].last;
        } else {
          item.first = item.last = document.createComment("item");
          parent.insertBefore(item.first, before);
          item.mounted = [{ first: item.first, last: item.last, dispose: () => item.first.parentNode?.removeChild(item.first) }];
        }
      } else if (item.first !== cursor) {
        insertAll(nodesBetween(item.first, item.last), parent, cursor);
      } else {
        cursor = item.last.nextSibling ?? end;
        return;
      }
      cursor = item.last.nextSibling ?? end;
    });
    items = next;
  };
  draw(deps);
  watch(deps, ctx, env.owner, () => draw(null), env.isStatic);
  return {
    first: start,
    last: end,
    dispose: () => {
      items.forEach((it) => {
        it.owner.dispose();
        it.mounted.forEach((m) => m.dispose());
      });
      removeRange(start, end);
    },
  };
}

/* ----- saját részletek (define) ----- */

function renderDefine(sel: Selector, body: unknown, env: RenderEnv, parent: Node, ref: Node | null, path: string): Mounted {
  const { ctx, scope } = env;
  const def = ctx.defs[sel.type];
  const given: Record<string, unknown> =
    body === null || body === undefined ? {} : typeof body === "object" && !Array.isArray(body) ? (body as Record<string, unknown>) : { [def.params[0] ?? "value"]: body };
  for (const k of Object.keys(given)) {
    if (!def.params.includes(k)) throw new SpecError(`ismeretlen paraméter a(z) ${sel.type} részletben: "${k}"${didYouMean(k, def.params)}`, path);
  }
  const start = document.createComment(sel.type);
  const end = document.createComment(`/${sel.type}`);
  parent.insertBefore(start, ref);
  parent.insertBefore(end, ref);
  let inner = new Owner();
  let current: Mounted[] = [];
  const deps = new Set<string>();
  const clear = (): void => {
    inner.dispose();
    inner = new Owner();
    current.forEach((m) => m.dispose());
    current = [];
  };
  const draw = (d: Set<string> | null): void => {
    clear();
    const vars: Vars = Object.create(null);
    for (const p of def.params) vars[p] = evalValue(given[p], scope, ctx, d, `${path}.${p}`);
    current = renderNodes(def.body, { ctx, scope: vars, owner: inner, isStatic: env.isStatic }, parent, end, `${sel.type}.body`);
  };
  draw(deps);
  watch(deps, ctx, env.owner, () => draw(null), env.isStatic);
  return {
    first: start,
    last: end,
    dispose: () => {
      clear();
      removeRange(start, end);
    },
  };
}

/* ----- nyers HTML elem ----- */

function applyStyle(el: HTMLElement, value: unknown): void {
  if (typeof value === "string") {
    el.style.cssText = value;
    return;
  }
  el.removeAttribute("style");
  if (value && typeof value === "object") {
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      if (k.startsWith("--") || k.includes("-")) el.style.setProperty(k, asText(v));
      else (el.style as unknown as Record<string, string>)[k] = asText(v);
    }
  }
}

function setAttr(el: HTMLElement, name: string, value: unknown): void {
  if (value === false || value === null || value === undefined) el.removeAttribute(name);
  else el.setAttribute(name, value === true ? "" : String(value));
}

function renderRaw(sel: Selector, body: unknown, env: RenderEnv, parent: Node, ref: Node | null, path: string): Mounted {
  const { ctx, scope } = env;
  let params: Record<string, unknown>;
  if (body === null || body === undefined) params = {};
  else if (Array.isArray(body)) params = { children: body };
  else if (typeof body === "object") params = { ...(body as Record<string, unknown>) };
  else params = { text: body };

  const el = document.createElement(sel.type);
  const owner = env.owner;
  const dynamic: Array<{ deps: Set<string>; apply: () => void }> = [];

  /** Egy tulajdonság kiértékelése és alkalmazása; ha állapotfüggő, a változásra helyben frissít. */
  const bindProp = (value: unknown, where: string, apply: (v: unknown) => void): void => {
    const deps = new Set<string>();
    apply(evalValue(value, scope, ctx, deps, where));
    if (deps.size) dynamic.push({ deps, apply: () => apply(evalValue(value, scope, ctx, null, where)) });
  };

  // azonosító és osztályok
  let id: string | undefined;
  if (sel.id !== undefined) bindProp(sel.id, `${path}#id`, (v) => (v === undefined ? el.removeAttribute("id") : (el.id = asText(v))));
  const classValues: unknown[] = [...sel.classes];
  if (params.class !== undefined) classValues.push(params.class);
  if (classValues.length) {
    const deps = new Set<string>();
    const compute = (d: Set<string> | null): string => classValues.map((c, i) => asText(evalValue(c, scope, ctx, d, `${path}.class[${i}]`))).filter(Boolean).join(" ");
    el.className = compute(deps);
    if (deps.size) dynamic.push({ deps, apply: () => void (el.className = compute(null)) });
  }

  // szöveg: t (nyelvesített) / text / html
  if (params.t !== undefined) {
    const args = params.args !== undefined ? (evalValue(params.args, scope, ctx, null, `${path}.args`) as Record<string, string | number>) : undefined;
    el.append(createDOMElem({ tag: "span", attrs: { class: "spec-t", style: "display:contents" }, text: tr(asText(params.t), args) }));
  } else if (params.text !== undefined) {
    const textNode = document.createTextNode("");
    el.appendChild(textNode);
    bindProp(params.text, `${path}.text`, (v) => void (textNode.data = asText(v)));
  } else if (params.html !== undefined) {
    bindProp(params.html, `${path}.html`, (v) => void (el.innerHTML = asText(v)));
  }

  if (params.style !== undefined) bindProp(params.style, `${path}.style`, (v) => applyStyle(el, v));
  if (params.attrs !== undefined) {
    if (typeof params.attrs !== "object" || params.attrs === null) throw new SpecError("az attrs térkép kell legyen", `${path}.attrs`);
    for (const [k, v] of Object.entries(params.attrs as Record<string, unknown>)) bindProp(v, `${path}.attrs.${k}`, (x) => setAttr(el, k, x));
  }

  // események és egyéb attribútumok
  for (const [k, v] of Object.entries(params)) {
    if (RAW_RESERVED.has(k)) continue;
    if (EVENTS.has(k)) {
      const cb = toCallback(v, scope, ctx, `${path}.${k}`);
      el.addEventListener(k, (e) => cb(e));
    } else {
      bindProp(v, `${path}.${k}`, (x) => setAttr(el, k, x));
    }
  }

  parent.insertBefore(el, ref);
  if (sel.id !== undefined || el.id) {
    id = el.id;
    if (id) register(ctx, id, el, path, true);
  }
  if (params.children !== undefined) renderNodes(params.children, env, el, null, `${path}.children`);
  if (params.bind !== undefined) {
    const kind = el instanceof HTMLInputElement && (el.type === "checkbox") ? "checked" : "value";
    setupBind(el, kind, String(params.bind), ctx, owner, `${path}.bind`);
  }

  // állapotfüggő tulajdonságok: helyben frissítés
  for (const d of dynamic) watch(d.deps, ctx, owner, d.apply, env.isStatic);
  return {
    first: el,
    last: el,
    dispose: () => {
      if (id) ctx.byId.delete(id);
      el.parentNode?.removeChild(el);
    },
  };
}

/* ----- komponens ----- */

interface Built {
  el: HTMLElement;
  params: Record<string, unknown>;
  deps: Set<string>;
  owner: Owner;
  portal: boolean;
}

function renderComponent(def: Def, sel: Selector, body: unknown, env: RenderEnv, parent: Node, ref: Node | null, path: string): Mounted {
  const { ctx, scope } = env;

  // 1. a törzs normalizálása paraméter-térképpé
  let raw: Record<string, unknown>;
  if (body === null || body === undefined) raw = {};
  else if (Array.isArray(body)) {
    raw = { [def.array ?? "children"]: body };
  } else if (typeof body === "object") raw = { ...(body as Record<string, unknown>) };
  else {
    if (!def.text) throw new SpecError(`a(z) ${def.name} komponensnek nincs fő szöveg-paramétere, térképet adj meg`, path);
    raw = { [def.text]: body };
  }
  if (sel.level !== undefined) {
    if (!def.params.has("level")) throw new SpecError(`a(z) ${def.name} nem fogad szintet ("${def.name}(${sel.level})")`, path);
    raw.level = sel.level;
  }

  // 2. ellenőrzés: ismert paraméterek
  const special = new Set(["t", "args", "bind"]);
  for (const k of Object.keys(raw)) {
    if (!def.params.has(k) && !special.has(k)) {
      throw new SpecError(`ismeretlen paraméter: "${k}"${didYouMean(k, [...def.params, ...special])}`, `${path}.${k}`);
    }
    if (k === "parent") throw new SpecError('a "parent" paraméter a beágyazásból adódik, nem adható meg', `${path}.parent`);
  }
  if (raw.t !== undefined && !def.text) throw new SpecError(`a "t" kulcshoz a(z) ${def.name} komponensnek fő szöveg-paraméter kell`, `${path}.t`);

  for (const k of def.required) {
    if (raw[k] === undefined && !(k === def.text && raw.t !== undefined)) {
      throw new SpecError(`hiányzó kötelező paraméter: "${k}"`, path);
    }
  }

  // visszahívások építéskor ellenőrzöttek (hibás @név azonnal kiderül)
  const callbacks: Record<string, (...a: unknown[]) => void> = {};
  for (const k of Object.keys(raw)) {
    if (def.fns.has(k)) callbacks[k] = toCallback(raw[k], scope, ctx, `${path}.${k}`);
  }

  const slotParams = Object.keys(def.slots ?? {}).filter((k) => raw[k] !== undefined);
  const staticOwner = (): RenderEnv => ({ ctx, scope, owner: new Owner(), isStatic: true });

  /** A paraméterek kiértékelése (a függőségek gyűjtésével); a gyerek-paraméterek nem értékek. */
  const evaluate = (deps: Set<string> | null): Record<string, unknown> => {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(raw)) {
      if (special.has(k) || def.fns.has(k) || slotParams.includes(k) || def.elements?.includes(k) || def.items?.[k]) continue;
      out[k] = evalValue(v, scope, ctx, deps, `${path}.${k}`);
    }
    return out;
  };

  /** Statikus gyerek-elemek: elemlista-paraméterek és tartalmas elemek. */
  const staticChildren = (): Record<string, unknown> => {
    const out: Record<string, unknown> = {};
    const toElements = (nodes: unknown, where: string): HTMLElement[] => {
      const holder = document.createElement("div");
      renderNodes(nodes, staticOwner(), holder, null, where);
      return Array.from(holder.children) as HTMLElement[];
    };
    for (const k of def.elements ?? []) if (raw[k] !== undefined) out[k] = toElements(raw[k], `${path}.${k}`);
    for (const [k, field] of Object.entries(def.items ?? {})) {
      if (raw[k] === undefined) continue;
      if (!Array.isArray(raw[k])) throw new SpecError("lista kellene", `${path}.${k}`);
      out[k] = (raw[k] as Record<string, unknown>[]).map((item, i) => {
        const copy = evalValue({ ...item, [field]: undefined }, scope, ctx, null, `${path}.${k}[${i}]`) as Record<string, unknown>;
        delete copy[field];
        if (item[field] !== undefined) copy[field] = toElements(item[field], `${path}.${k}[${i}].${field}`);
        return copy;
      });
    }
    return out;
  };

  const construct = (values: Record<string, unknown>, deps: Set<string>, reuseId?: string): Built => {
    const owner = new Owner();
    const params: Record<string, unknown> = { ...values, ...staticChildren() };
    // id és osztály
    let id: string | undefined;
    const explicit = sel.id !== undefined;
    if (explicit) id = asText(evalValue(sel.id, scope, ctx, deps, `${path}#id`));
    else if (typeof params.id === "string") id = params.id;
    const finalId = reuseId ?? (id || autoId(ctx, def.name));
    const classes = [...sel.classes.map((c, i) => asText(evalValue(c, scope, ctx, deps, `${path}.class[${i}]`))), asText(params.class)].filter(Boolean);
    params.id = finalId;
    if (classes.length) params.class = classes.join(" ");
    // nyelvesített szöveg
    if (raw.t !== undefined) {
      const args = raw.args !== undefined ? (evalValue(raw.args, scope, ctx, deps, `${path}.args`) as Record<string, string | number>) : undefined;
      params[def.text!] = tr(asText(raw.t), args);
    }
    Object.assign(params, callbacks);
    for (const k of slotParams) params[k] = []; // a komponens létrehozza a tárolót
    params.parent = ctx.scratch;

    let el: HTMLElement;
    try {
      el = def.create(params);
    } catch (e) {
      if (e instanceof SpecError) throw e;
      throw new SpecError(`a(z) ${def.name} létrehozása nem sikerült: ${(e as Error).message}`, path);
    }
    const portal = !!def.portal || el.parentNode !== ctx.scratch;
    if (!portal) el.remove();

    // élő gyerekek a tárolókba
    for (const k of slotParams) {
      const selector = def.slots![k];
      const container = selector === "" ? el : el.querySelector(selector);
      if (!container) throw new SpecError(`a(z) ${def.name} komponensben nincs "${selector}" tároló a(z) ${k} számára`, `${path}.${k}`);
      renderNodes(raw[k], { ctx, scope, owner, isStatic: env.isStatic }, container, null, `${path}.${k}`);
    }
    if (raw.bind !== undefined) {
      if (!def.bind) throw new SpecError(`a(z) ${def.name} komponensen nem használható a bind`, `${path}.bind`);
      setupBind(el, def.bind, String(raw.bind), ctx, owner, `${path}.bind`);
    }
    register(ctx, finalId, el, path, explicit || typeof raw.id === "string");
    return { el, params: values, deps, owner, portal };
  };

  const deps0 = new Set<string>();
  let built = construct(evaluate(deps0), deps0);
  if (!built.portal) parent.insertBefore(built.el, ref);

  const id = built.el.id;
  let unsub: (() => void) | null = null;
  const subscribe = (deps: Set<string>): void => {
    unsub?.();
    unsub = null;
    if (env.isStatic || deps.size === 0) return;
    unsub = ctx.store.subscribe([...deps], refresh);
  };

  const same = (a: unknown, b: unknown): boolean => {
    if (Object.is(a, b)) return true;
    try {
      return JSON.stringify(a) === JSON.stringify(b);
    } catch {
      return false;
    }
  };

  function refresh(): void {
    const deps = new Set<string>();
    const values = evaluate(deps);
    const prev = built.params;
    const changed = Object.keys({ ...prev, ...values }).filter((k) => !same(prev[k], values[k]));
    if (changed.length === 0) {
      built.deps = deps;
      subscribe(deps);
      return;
    }
    const live = def.updaters ?? {};
    const el = built.el as unknown as Record<string, unknown>;
    if (changed.every((k) => live[k] && typeof el[live[k]] === "function")) {
      for (const k of changed) (el[live[k]] as (v: unknown) => void)(values[k]);
      built.params = values;
      built.deps = deps;
      subscribe(deps);
      return;
    }
    // egyébként újraépítés ugyanazzal az azonosítóval; a fókusz visszaáll
    const active = document.activeElement;
    const hadFocus = active && built.el.contains(active) ? (active as HTMLElement).id : "";
    built.owner.dispose();
    const old = built.el;
    ctx.byId.delete(old.id);
    const next = construct(values, deps, old.id);
    if (old.parentNode && !next.portal) old.parentNode.replaceChild(next.el, old);
    else if (old.parentNode) old.parentNode.removeChild(old);
    built = next;
    if (hadFocus) document.getElementById(hadFocus)?.focus();
    subscribe(deps);
  }
  subscribe(deps0);

  return {
    get first() {
      return built.el;
    },
    get last() {
      return built.el;
    },
    dispose: () => {
      unsub?.();
      built.owner.dispose();
      ctx.byId.delete(built.el.id);
      built.el.parentNode?.removeChild(built.el);
    },
  } as Mounted;
}

/* ===== Téma ===== */

function applyTheme(theme: Record<string, unknown>, ownerList: Array<() => void>): void {
  const cssVars = (obj: Record<string, unknown>): string =>
    Object.entries(obj)
      .filter(([, v]) => typeof v !== "object" || v === null)
      .map(([k, v]) => `--${k.replace(/^--/, "").replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`)}:${String(v)};`)
      .join("");
  const dark = theme.dark && typeof theme.dark === "object" ? (theme.dark as Record<string, unknown>) : null;
  const css = `:root{${cssVars(theme)}}${dark ? `:root[data-theme="dark"]{${cssVars(dark)}}` : ""}`;
  const style = document.createElement("style");
  style.setAttribute("data-spec-theme", "");
  style.textContent = css;
  document.head.appendChild(style);
  ownerList.push(() => style.remove());
}

/* ===== Belépési pont ===== */

/**
 * Oldal felépítése deklaratív leírásból (YAML szöveg vagy objektum).
 *
 * A leírás kulcsai: `ui` (a csomópontok listája), `state` (kezdőállapot), `messages` (nyelvi szövegek),
 * `theme` (CSS-változók), `define` (saját, paraméterezhető részletek).
 */
export function buildUI(spec: unknown, options: BuildOptions = {}): UI {
  const doc = typeof spec === "string" ? parseYaml(spec) : spec;
  const root = (Array.isArray(doc) ? { ui: doc } : (doc ?? {})) as Record<string, unknown>;
  if (typeof root !== "object") throw new SpecError("a leírás térkép (ui:, state:, ...) vagy a csomópontok listája kell legyen");
  for (const k of Object.keys(root)) {
    if (!["ui", "state", "messages", "theme", "define", "data"].includes(k)) {
      throw new SpecError(`ismeretlen felső szintű kulcs: "${k}"${didYouMean(k, ["ui", "state", "messages", "theme", "define"])}`);
    }
  }

  let host: HTMLElement | null;
  if (options.parent === undefined) host = document.createElement("div");
  else host = typeof options.parent === "string" ? document.getElementById(options.parent) ?? document.querySelector<HTMLElement>(options.parent) : options.parent;
  if (!host) throw new SpecError(`a megadott szülő nem található: ${String(options.parent)}`);

  const defs: Record<string, DefineSpec> = {};
  for (const [name, d] of Object.entries((root.define ?? {}) as Record<string, Record<string, unknown>>)) {
    if (!/^[A-Z]/.test(name)) throw new SpecError(`a saját részlet neve nagybetűvel kezdődjön: "${name}"`, `define.${name}`);
    if (getDef(name)) throw new SpecError(`a(z) "${name}" név egy könyvtári komponensé`, `define.${name}`);
    if (!Array.isArray(d?.body)) throw new SpecError('hiányzik a "body" lista', `define.${name}`);
    defs[name] = { params: ((d.params as string[]) ?? []).map(String), body: d.body as unknown[] };
  }

  const cleanups: Array<() => void> = [];
  if (root.messages) registerTranslations(root.messages as Record<string, MessagesTree>);
  if (root.theme && typeof root.theme === "object") applyTheme(root.theme as Record<string, unknown>, cleanups);

  const store = new Store({ ...((root.state as Record<string, unknown>) ?? {}), ...(options.state ?? {}) });
  const ctx = {
    store,
    data: { ...((root.data as Record<string, unknown>) ?? {}), ...(options.data ?? {}) },
    handlers: options.handlers ?? {},
    defs,
    byId: new Map<string, HTMLElement>(),
    counters: {} as Record<string, number>,
    scratch: document.createElement("div"),
  } as unknown as Ctx;
  const rootOwner = new Owner();
  const ui: UI = {
    root: host,
    state: store,
    get: (id) => ctx.byId.get(id),
    destroy: () => {
      rootOwner.dispose();
      mounted.forEach((m) => m.dispose());
      mounted = [];
      cleanups.splice(0).forEach((f) => f());
      ctx.byId.clear();
    },
  };
  ctx.ui = ui;

  let mounted: Mounted[] = [];
  const scope: Vars = Object.create(null);
  mounted = renderNodes(root.ui ?? [], { ctx, scope, owner: rootOwner, isStatic: false }, host, null, "ui");
  return ui;
}
