import * as lib from "../index";
import { SPEC_PARAMS } from "./meta.generated";

/**
 * A deklaratív leíró komponens-nyilvántartása: név → gyártó + a leíró számára fontos tulajdonságok.
 * A paraméterlisták a `meta.generated.ts`-ből jönnek (a `scripts/gen-props.mjs` generálja a típusokból).
 */
export interface Def {
  name: string;
  /** Komponens létrehozása; a `p` már kiértékelt paraméterek (parent és id megadva). */
  create: (p: Record<string, any>) => HTMLElement;
  /** Érvényes paraméterek (a típusokból + a leíró saját, virtuális paraméterei). */
  params: Set<string>;
  /** Kötelező paraméterek (a `parent` és `id` nélkül). */
  required: string[];
  /** Visszahívás-típusú paraméterek (ide köthető `@handler` és beépített művelet). */
  fns: Set<string>;
  /** A skalár rövidítés célja: `Button: Mentés` → `text: Mentés`. */
  text?: string;
  /** A lista rövidítés célja: `Tabs: [...]` → `tabs: [...]`. Alapból `children`. */
  array?: string;
  /** Élő tárolók: paraméter → CSS szelektor a kész komponensen belül (`""`: maga a gyökér). A gyerekek ide épülnek. */
  slots?: Record<string, string>;
  /** Statikus elemlista-paraméterek: a gyerekek elemekként kerülnek a paraméterbe (nem reaktív régiók). */
  elements?: string[];
  /** Elemlistát tartalmazó objektumok tömbje: paraméter → az elemek mezője (pl. Accordion.items[].content). */
  items?: Record<string, string>;
  /** Frissítő metódusok: paraméter → a komponens metódusa (állapotváltozáskor újraépítés helyett). */
  updaters?: Record<string, string>;
  /** Beviteli kötés típusa a `bind:` kulcshoz. */
  bind?: "value" | "checked" | "radio";
  /** Az elem nem a megadott szülőbe kerül (pl. modál), ezért nem kell beszúrni. */
  portal?: boolean;
}

type Override = Partial<Omit<Def, "name" | "params" | "fns">> & { extra?: string[]; extraFns?: string[] };

const SLOT = "spec-slot";
const slotNode = { tag: "div", attrs: { class: SLOT }, style: { display: "contents" } };

const VALUE_INPUTS = [
  "TextInput", "EmailInput", "PasswordInput", "UrlInput", "TelInput", "SearchInput", "NumberInput", "DateInput",
  "DatetimeInput", "TimeInput", "MonthInput", "WeekInput", "ColorInput", "RangeInput", "Textarea", "Select", "HiddenInput",
];

const OVERRIDES: Record<string, Override> = {
  Title: { text: "text", extra: ["level"], create: (p) => lib.createTitle(p as never, Number(p.level ?? 1)) },
  UnorderedList: { array: "items", extra: ["items"], create: (p) => lib.createUnorderedList((p.items ?? []).map(String), p as never) },
  OrderedList: { array: "items", extra: ["items"], create: (p) => lib.createOrderedList((p.items ?? []).map(String), p as never) },
  Table: { array: "data", extra: ["data"], create: (p) => lib.createTable(p.data ?? [], p as never) },
  Card: { text: "title", array: "body", slots: { body: ".card-body", footer: ".card-footer" } },
  Container: { slots: { children: "" } },
  Grid: { slots: { children: "" } },
  Accordion: { array: "items", items: { items: "content" } },
  Tabs: { array: "tabs", items: { tabs: "content" } },
  Drawer: { elements: ["children"] },
  Gantt: { updaters: { rows: "setRows" } },
  Modal: {
    text: "title",
    array: "body",
    extra: ["title", "body", "ok", "cancel", "close"],
    extraFns: ["ok", "cancel", "close"],
    slots: { body: `.modal-body > .${SLOT}` },
    portal: true,
    create: (p) =>
      lib.createModal(
        { modalTitle: p.title ?? p.modalTitle ?? "", body: slotNode },
        { okAction: p.ok, cancelAction: p.cancel, closeAction: p.close },
        p as never,
      ),
  },
  Checkbox: { bind: "checked" },
  Radio: { bind: "radio" },
};
VALUE_INPUTS.forEach((n) => (OVERRIDES[n] = { ...OVERRIDES[n], bind: "value" }));

/** Olyan kötelező paraméterek, amelyeket az adapter más forrásból pótol. */
const OPTIONAL_VIA_ADAPTER = new Set(["Table.data"]);

const SCALAR_TARGETS = ["text", "title", "message", "label", "labelText"];
const cache = new Map<string, Def | null>();

/** A komponens leírója; `undefined`, ha nincs ilyen komponens. */
export function getDef(name: string): Def | undefined {
  if (cache.has(name)) return cache.get(name) ?? undefined;
  const meta = SPEC_PARAMS[name];
  const fn = (lib as unknown as Record<string, unknown>)[`create${name}`] as ((p: unknown) => HTMLElement) | undefined;
  if (!meta || typeof fn !== "function") {
    cache.set(name, null);
    return undefined;
  }
  const o = OVERRIDES[name] ?? {};
  const params = new Set([...meta.all, ...(o.extra ?? [])]);
  params.delete("parent");
  const def: Def = {
    name,
    create: o.create ?? ((p) => fn(p)),
    params,
    fns: new Set([...meta.fns, ...(o.extraFns ?? [])]),
    required: meta.required.filter((r) => r !== "parent" && r !== "id" && !OPTIONAL_VIA_ADAPTER.has(`${name}.${r}`)),
    text: o.text ?? SCALAR_TARGETS.find((t) => params.has(t)),
    array: o.array,
    slots: o.slots,
    elements: o.elements,
    items: o.items,
    updaters: o.updaters,
    bind: o.bind,
    portal: o.portal,
  };
  cache.set(name, def);
  return def;
}

/** Az ismert komponensnevek (hibaüzenethez, javaslathoz). */
export function componentNames(): string[] {
  return Object.keys(SPEC_PARAMS);
}

/** Az `id`-t és osztályt nem a leíró adja, hanem a szelektor-kulcs (`Card#id.a.b`). */
export const SELECTOR_PARAMS = new Set(["id", "class"]);
