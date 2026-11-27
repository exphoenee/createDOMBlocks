import type { DrawerMenuItem } from "../../src/types";
import { tr } from "./i18n";
// A komponens-jegyzék a forráskód JSDoc-címkéiből generálódik (scripts/gen-docs.mjs, @category / @menu / @order)
import manifest from "../generated/components.json";

interface ManifestEntry {
  name: string;
  slug: string;
  title: string;
  category: string;
  order: number;
  summary: string;
}

/** A kategóriák sorrendje és felirata a menüben (az azonosítók a komponensek `@category` címkéi). */
const CATEGORIES: Array<{ id: string; label: () => DrawerMenuItem["label"] }> = [
  { id: "forms", label: () => "Forms" },
  { id: "buttons", label: () => tr("Gombok") },
  { id: "content", label: () => tr("Tartalom") },
  { id: "navigation", label: () => tr("Navigáció") },
  { id: "feedback", label: () => tr("Visszajelzés") },
  { id: "interactive", label: () => tr("Interaktív") },
  { id: "overlays", label: () => tr("Átfedő elemek") },
];

const components = manifest as ManifestEntry[];

export function getDrawerMenuItems(): DrawerMenuItem[] {
  const unknown = components.filter((c) => !CATEGORIES.some((cat) => cat.id === c.category));
  if (unknown.length) {
    throw new Error(`Ismeretlen @category a komponenseknél: ${unknown.map((c) => `${c.name} (${c.category})`).join(", ")}`);
  }
  return [
    { label: tr("Kezdőlap"), href: "index.html" },
    { label: tr("Témázás"), href: "theming.html" },
    { label: tr("Nyelvesítés"), href: "i18n.html" },
    { label: tr("YAML leíró"), href: "yaml.html" },
    { label: tr("API referencia"), href: "api.html" },
    ...CATEGORIES.map((cat) => ({
      label: cat.label(),
      children: components
        .filter((c) => c.category === cat.id)
        .sort((a, b) => a.order - b.order)
        .map((c) => ({ label: c.title, href: `${c.slug}.html` })),
    })),
  ];
}
