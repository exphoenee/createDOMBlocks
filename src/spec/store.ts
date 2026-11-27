/**
 * Kicsi, útvonal-alapú állapottár a deklaratív leíróhoz.
 *
 * Az útvonal pontokkal és indexekkel írható (`a.b`, `a[0].c` ≡ `a.0.c`). Egy `set` azokat az
 * előfizetőket értesíti, amelyek útvonala az írt útvonallal egyezik, annak előtagja vagy kiterjesztése
 * (`results` írásakor a `results.0.name`-re feliratkozó is megkapja). A tömbök és objektumok
 * **változtathatatlanként** kezelendők: egy elem cseréje új értéket állít be (`set('list.1', x)`), a
 * tár a köztes tárolókat másolja, így a változás azonosság alapján felismerhető.
 */

const FORBIDDEN = new Set(["__proto__", "constructor", "prototype"]);

export function normalizePath(path: string): string {
  return path.replace(/\[(\w+)\]/g, ".$1").replace(/^\./, "");
}

const split = (path: string): string[] => (path === "" ? [] : normalizePath(path).split("."));

function checkKeys(keys: string[]): void {
  for (const k of keys) if (FORBIDDEN.has(k)) throw new Error(`Tiltott állapot-kulcs: ${k}`);
}

type Listener = (path: string) => void;
interface Sub { paths: string[]; cb: Listener }

/**
 * Útvonal-alapú állapottár a deklaratív leíróhoz (a `buildUI` által visszaadott `ui.state` is ez). Az útvonal pontokkal és indexekkel írható (`a.b`, `a[0].c`).
 *
 * @group yaml
 */
export class Store {
  private data: Record<string, unknown>;
  private subs = new Set<Sub>();
  private batchDepth = 0;
  private pending = new Set<string>();
  private guard: ((path: string) => void) | null = null;

  constructor(initial: Record<string, unknown> = {}) {
    this.data = JSON.parse(JSON.stringify(initial ?? {}));
  }

  /** Teljes állapot (másolat nélkül; ne módosítsd). */
  get snapshot(): Record<string, unknown> {
    return this.data;
  }

  /** Érték kiolvasása útvonal alapján (`a.b`, `a[0].c`); nem létező útvonalnál `undefined`. */
  get(path: string): unknown {
    let cur: unknown = this.data;
    for (const k of split(path)) {
      if (cur === null || cur === undefined) return undefined;
      cur = (cur as Record<string, unknown>)[k];
    }
    return cur;
  }

  /** Érték beállítása; a köztes objektumokat / tömböket másolja (változtathatatlan frissítés). */
  set(path: string, value: unknown): void {
    const keys = split(path);
    if (keys.length === 0) throw new Error("Az állapot gyökere nem írható felül");
    checkKeys(keys);
    this.guard?.(normalizePath(path));
    if (Object.is(this.get(path), value) && (value === null || typeof value !== "object")) return;
    const update = (node: unknown, i: number): unknown => {
      const k = keys[i];
      const base = node !== null && typeof node === "object" ? node : /^\d+$/.test(k) ? [] : {};
      const copy: unknown = Array.isArray(base) ? [...base] : { ...(base as Record<string, unknown>) };
      (copy as Record<string, unknown>)[k] = i === keys.length - 1 ? value : update((base as Record<string, unknown>)[k], i + 1);
      return copy;
    };
    this.data = update(this.data, 0) as Record<string, unknown>;
    this.notify(normalizePath(path));
  }

  /** Írás-ellenőrző: minden `set` előtt meghívódik az útvonallal, és hibát dobhat (pl. a származtatott kulcsok védelme). */
  setGuard(guard: ((path: string) => void) | null): void {
    this.guard = guard;
  }

  /** Egy kulcs eltávolítása értesítés nélkül (belső takarításhoz: már senki nem figyeli). */
  unset(path: string): void {
    const keys = split(path);
    if (keys.length === 0) return;
    checkKeys(keys);
    const remove = (node: unknown, i: number): unknown => {
      if (node === null || typeof node !== "object") return node;
      const copy: Record<string, unknown> = Array.isArray(node) ? ([...node] as unknown as Record<string, unknown>) : { ...(node as Record<string, unknown>) };
      if (i === keys.length - 1) delete copy[keys[i]];
      else copy[keys[i]] = remove(copy[keys[i]], i + 1);
      return copy;
    };
    this.data = remove(this.data, 0) as Record<string, unknown>;
  }

  /** Logikai érték megfordítása. */
  toggle(path: string): void {
    this.set(path, !this.get(path));
  }

  /** Szám növelése (alapból 1-gyel; a nem szám érték 0-nak számít). */
  inc(path: string, by = 1): void {
    this.set(path, (Number(this.get(path)) || 0) + by);
  }

  /** Elem hozzáfűzése egy listához (új listát állít be; ha nincs lista, egyelemű lesz). */
  push(path: string, value: unknown): void {
    const cur = this.get(path);
    this.set(path, Array.isArray(cur) ? [...cur, value] : [value]);
  }

  /** Több írás egyetlen értesítéssel. */
  batch(fn: () => void): void {
    this.batchDepth++;
    try {
      fn();
    } finally {
      if (--this.batchDepth === 0) this.flush();
    }
  }

  /** Feliratkozás útvonalakra; a visszaadott függvény leiratkozik. */
  subscribe(paths: string[], cb: Listener): () => void {
    const sub: Sub = { paths: paths.map(normalizePath), cb };
    this.subs.add(sub);
    return () => {
      this.subs.delete(sub);
    };
  }

  private notify(path: string): void {
    this.pending.add(path);
    if (this.batchDepth === 0) this.flush();
  }

  private flush(): void {
    const changed = [...this.pending];
    this.pending.clear();
    // az értesítés közben leiratkozók ne kapjanak már értesítést
    for (const sub of [...this.subs]) {
      if (!this.subs.has(sub)) continue;
      const hit = changed.find((c) => sub.paths.some((w) => overlaps(w, c)));
      if (hit !== undefined) sub.cb(hit);
    }
  }
}

/** Két útvonal érinti-e egymást (egyezés, előtag vagy kiterjesztés). */
export function overlaps(watched: string, changed: string): boolean {
  return watched === changed || watched.startsWith(changed + ".") || changed.startsWith(watched + ".");
}
