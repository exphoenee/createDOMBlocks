/**
 * propsTable — TypeScript típusból generált paraméter-táblázat megjelenítő.
 *
 * Használat:
 *   import { propsTable } from "../page-components/propsTable";
 *   app.appendChild(propsTable(createCarousel));
 *
 * A `documentation/generated/props.json` fájlból olvassa ki a típusinformációkat,
 * amit a `scripts/gen-props.mjs` generál build időben.
 */

import { createDOMElem } from "domelemjs";
import type { CreateDOMElemOptions } from "domelemjs";
import propsData from "../generated/props.json";

interface PropEntry {
  name: string;
  type: string;
  required: boolean;
  default: string | null;
  description: string;
}

interface TypeData {
  props?: PropEntry[];
  refs?: string[];
}

interface PropsData {
  [key: string]:
    | { paramsType: string }
    | TypeData;
}

function isTypeData(d: unknown): d is TypeData {
  return typeof d === "object" && d !== null && "props" in d;
}

function getTypeData(typeName: string): TypeData | null {
  const data = propsData as unknown as PropsData;
  const entry = data[typeName];
  if (entry && isTypeData(entry)) {
    return entry;
  }
  return null;
}

function getParamsType(funcName: string): string | null {
  const data = propsData as unknown as PropsData;
  const entry = data[funcName];
  if (entry && typeof entry === "object" && "paramsType" in entry) {
    return (entry as { paramsType: string }).paramsType;
  }
  return null;
}

/**
 * Segéd: típusnév rövidítése és típushoz badge szín
 */
function simplifyType(typeStr: string): string {
  return typeStr.replace(/ \| undefined/g, "");
}

function getTypeBadgeClass(typeStr: string): string {
  const t = typeStr.replace(/ \| undefined/g, "").trim();
  if (t === "string" || t.startsWith('"') || t.startsWith("'")) return "type-string";
  if (t === "boolean") return "type-boolean";
  if (t === "number") return "type-number";
  if (t.includes("=>") || t.startsWith("(")) return "type-fn";
  if (t.includes("[]")) return "type-array";
  if (t.includes("|")) return "type-union";
  if (t === "HTMLElement" || t === "HTMLElement | string" || t.startsWith("HTMLElement")) return "type-element";
  return "type-other";
}

/**
 * Összegyűjti a típusneveket a fő típusból kiindulva a refs mentén (dedup).
 */
function collectTypeNames(typeName: string): string[] {
  const result: string[] = [];
  const visited = new Set<string>();

  function walk(name: string): void {
    if (visited.has(name) || name === "string" || name === "number" || name === "boolean") return;
    visited.add(name);
    const data = getTypeData(name);
    if (data) {
      result.push(name);
      if (data.refs) {
        for (const ref of data.refs) {
          if (ref !== name) walk(ref);
        }
      }
    }
  }

  walk(typeName);
  return result;
}

function renderTypeBadge(typeStr: string): CreateDOMElemOptions {
  const simplified = simplifyType(typeStr);
  const badgeClass = getTypeBadgeClass(typeStr);
  return {
    tag: "code",
    attrs: { class: `type-badge ${badgeClass}` },
    text: simplified,
  };
}

function renderTypeCard(typeName: string): CreateDOMElemOptions {
  const data = getTypeData(typeName);
  if (!data || !data.props || data.props.length === 0) {
    // Nincs adat ehhez a típushoz — üres kártya helyett rövid infó
    return {
      tag: "div",
      attrs: { class: "card", style: "margin-bottom: 1rem;" },
      children: [
        {
          tag: "div",
          attrs: { class: "card-header" },
          children: [{ tag: "h3", text: `Paraméterek — ${typeName}` }],
        },
        {
          tag: "div",
          attrs: { class: "card-body" },
          children: [
            { tag: "p", text: "Nincsenek paraméterek ehhez a típushoz.", attrs: { class: "text-muted" } },
          ],
        },
      ],
    };
  }

  const rows = data.props.map((prop) => {
    const cells: CreateDOMElemOptions[] = [
      // Paraméter név
      {
        tag: "td",
        attrs: { class: "props-name" },
        children: [prop.required
          ? { tag: "span", text: prop.name, attrs: { class: "prop-required" } }
          : { tag: "span", text: prop.name, attrs: { class: "prop-optional" } },
        ],
      },
      // Típus badge
      {
        tag: "td",
        attrs: { class: "props-type" },
        children: [renderTypeBadge(prop.type)],
      },
      // Kötelező
      { tag: "td", attrs: { class: "props-required" }, text: prop.required ? "Igen" : "Nem" },
      // Alapérték
      {
        tag: "td",
        attrs: { class: "props-default" },
        text: prop.default != null ? prop.default : "—",
      },
      // Leírás
      { tag: "td", attrs: { class: "props-desc" }, text: prop.description || "" },
    ];

    return { tag: "tr", children: cells };
  });

  return {
    tag: "div",
    attrs: { class: "card props-card", style: "margin-bottom: 1rem;" },
    children: [
      {
        tag: "div",
        attrs: { class: "card-header" },
        children: [
          { tag: "h3", text: `Paraméterek — ${typeName}` },
        ],
      },
      {
        tag: "div",
        attrs: { class: "card-body" },
        children: [
          {
            tag: "table",
            attrs: { class: "table props-table" },
            children: [
              {
                tag: "thead",
                children: [
                  {
                    tag: "tr",
                    children: [
                      { tag: "th", text: "Paraméter" },
                      { tag: "th", text: "Típus" },
                      { tag: "th", text: "Kötelező" },
                      { tag: "th", text: "Alapérték" },
                      { tag: "th", text: "Leírás" },
                    ],
                  },
                ],
              },
              { tag: "tbody", children: rows },
            ],
          },
        ],
      },
    ],
  };
}

/**
 * Komponens-függvény alapján legenerálja a paraméter-táblázat(oka)t.
 * A függvény neve, vagy direkt típusnév adható át.
 *
 * @param component A komponens-függvény (pl. createCarousel) vagy típusnév stringként.
 * @returns A táblázat(oka)t tartalmazó HTMLElement.
 */
export function propsTable(component: Function | string): HTMLElement {
  const key = typeof component === "string" ? component : component.name;
  const typeName = getParamsType(key) ?? key;

  // Ha a típus nem létezik a props.json-ban, adjunk értelmes üzenetet
  if (!getTypeData(typeName) && typeName === key) {
    // Nincs ilyen típus a props.json-ban — lehet, hogy a függvényt nem találta a gen-props
    return createDOMElem({
      tag: "div",
      attrs: { class: "card props-card", style: "margin-bottom: 1rem;" },
      children: [
        {
          tag: "div",
          attrs: { class: "card-header" },
          children: [{ tag: "h3", text: `Paraméterek — ${typeName}` }],
        },
        {
          tag: "div",
          attrs: { class: "card-body" },
          children: [
            { tag: "p", text: "A paraméter-információk nem elérhetők. Futtasd a `node scripts/gen-props.mjs` szkriptet az adatok generálásához.", attrs: { class: "text-muted" } },
          ],
        },
      ],
    });
  }

  const typeNames = collectTypeNames(typeName);
  if (typeNames.length === 0) {
    return createDOMElem({
      tag: "p",
      text: "Nincsenek paraméterek.",
      attrs: { class: "text-muted", style: "margin-bottom: 1rem;" },
    });
  }

  const cards: CreateDOMElemOptions[] = typeNames.map((tn) => renderTypeCard(tn));

  return createDOMElem({
    tag: "div",
    children: cards,
  });
}
