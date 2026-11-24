import * as lib from "../index";
import { SPEC_PARAMS } from "./meta.generated";
import overrides from "./overrides.json";

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

interface Static {
  text?: string;
  array?: string;
  extra?: string[];
  extraFns?: string[];
  optional?: string[];
  slots?: Record<string, string>;
  elements?: string[];
  items?: Record<string, string>;
  updaters?: Record<string, string>;
  bind?: "value" | "checked" | "radio";
  portal?: boolean;
}

/** A leíró szerkezeti szabályai (adat: a JSON Schema generálás is ezt használja). */
const STATIC = overrides as Record<string, Static>;

const SLOT = "spec-slot";
const slotNode = { tag: "div", attrs: { class: SLOT }, style: { display: "contents" } };

/** Szabálytalan szignatúrájú komponensek illesztői. */
const ADAPTERS: Record<string, (p: Record<string, any>) => HTMLElement> = {
  Title: (p) => lib.createTitle(p as never, Number(p.level ?? 1)),
  UnorderedList: (p) => lib.createUnorderedList((p.items ?? []).map(String), p as never),
  OrderedList: (p) => lib.createOrderedList((p.items ?? []).map(String), p as never),
  Table: (p) => lib.createTable(p.data ?? [], p as never),
  Modal: (p) =>
    lib.createModal(
      { modalTitle: p.title ?? p.modalTitle ?? "", body: slotNode },
      { okAction: p.ok, cancelAction: p.cancel, closeAction: p.close },
      p as never,
    ),
};

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
  const o = STATIC[name] ?? {};
  const params = new Set([...meta.all, ...(o.extra ?? [])]);
  params.delete("parent");
  const def: Def = {
    name,
    create: ADAPTERS[name] ?? ((p) => fn(p)),
    params,
    fns: new Set([...meta.fns, ...(o.extraFns ?? [])]),
    required: meta.required.filter((r) => r !== "parent" && r !== "id" && !(o.optional ?? []).includes(r)),
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
