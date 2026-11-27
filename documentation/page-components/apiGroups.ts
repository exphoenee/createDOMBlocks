/**
 * Az API-referencia csoportjai és címük, a megjelenés sorrendjében.
 *
 * A csoport a forráskód `@group` JSDoc-címkéjéből jön (scripts/gen-api.mjs). Új csoport felvételekor ide kell
 * egy sor; a test/gen-docs.test.ts jelzi, ha egy `@group` értékhez nincs cím (így nem tűnik el export csendben).
 * A címek magyar szövegek, a docs i18n-je fordítja őket.
 */
export const API_GROUPS: ReadonlyArray<readonly [group: string, title: string]> = [
  ["i18n", "Nyelvesítés (i18n)"],
  ["yaml", "YAML leíró"],
  ["overlays", "Felugró ablakok"],
  ["theme", "Téma"],
  ["behaviors", "Viselkedések"],
  ["utils", "Segédek"],
];
