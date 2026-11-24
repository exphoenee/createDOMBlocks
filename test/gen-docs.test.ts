import { describe, it, expect } from "vitest";
import { existsSync } from "fs";
// @ts-expect-error a szkript sima JavaScript modul
import { readComponentManifest } from "../scripts/gen-docs.mjs";
import { SPEC_PARAMS } from "../src/spec/meta.generated";

interface Entry { name: string; slug: string; title: string; category: string; order: number; summary: string }
const manifest: Entry[] = readComponentManifest(process.cwd());

describe("a dokumentáció váza a forráskód JSDoc-jából", () => {
  it("minden jegyzék-elemhez van példafájl és létező komponens", () => {
    for (const c of manifest) {
      expect(existsSync(`documentation/examples/${c.slug}.ts`), `${c.slug}: nincs példafájl`).toBe(true);
      expect(SPEC_PARAMS[c.name], `${c.name}: nincs a komponens-metaadatok között`).toBeDefined();
    }
  });

  it("az oldalnevek egyediek, a kategóriák ismertek, a sorrend a kategórián belül egyedi", () => {
    const categories = ["forms", "buttons", "content", "navigation", "feedback", "interactive", "overlays"];
    expect(new Set(manifest.map((c) => c.slug)).size).toBe(manifest.length);
    for (const c of manifest) expect(categories, c.name).toContain(c.category);
    for (const cat of categories) {
      const orders = manifest.filter((c) => c.category === cat).map((c) => c.order);
      expect(new Set(orders).size, `${cat}: ismétlődő @order`).toBe(orders.length);
    }
  });

  it("minden címkézett komponensnek van összefoglalója és címe", () => {
    for (const c of manifest) {
      expect(c.summary.length, c.name).toBeGreaterThan(5);
      expect(c.title.length, c.name).toBeGreaterThan(0);
    }
  });
});

describe("az API-referencia a JSDoc-ból", () => {
  it("minden @group-os export összefoglalóval és aláírással szerepel", async () => {
    // @ts-expect-error a szkript sima JavaScript modul
    const { writeApi } = await import("../scripts/gen-api.mjs");
    const api: Array<{ group: string; name: string; signatures: string[]; summary: string }> = writeApi(process.cwd());
    const groups = new Set(["i18n", "yaml", "overlays", "utils"]);
    expect(api.length).toBeGreaterThan(25);
    for (const e of api) {
      expect(groups.has(e.group), `${e.name}: ismeretlen csoport ${e.group}`).toBe(true);
      expect(e.summary.length, `${e.name}: nincs leírás (JSDoc)`).toBeGreaterThan(5);
      expect(e.signatures.length, `${e.name}: nincs aláírás`).toBeGreaterThan(0);
    }
    for (const must of ["setLocale", "tr", "buildUI", "mountYaml", "stringifyYaml", "Store", "openModal"]) {
      expect(api.some((e) => e.name === must), must).toBe(true);
    }
  });
});
