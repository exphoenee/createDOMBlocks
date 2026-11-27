import { describe, it, expect, beforeEach, vi } from "vitest";
import { createLocaleSwitcher, setLocale, getLocale, tr, createParagraph, registerMessages, buildUI } from "../src/index";

const locales = [
  { code: "hu", label: "Magyar" },
  { code: "en", label: "English" },
  { code: "de", label: "Deutsch", short: "DE" },
];

beforeEach(() => {
  document.body.innerHTML = '<div id="root"></div>';
  registerMessages("hu", { greet: "Szia" });
  registerMessages("en", { greet: "Hello" });
  registerMessages("de", { greet: "Hallo" });
  setLocale("hu");
});

const option = (root: HTMLElement, code: string) => root.querySelector<HTMLButtonElement>(`[data-locale="${code}"]`)!;

describe("LocaleSwitcher (C4)", () => {
  it("gombsor: az aktuális nyelv jelölve, kattintásra setLocale + onChange, a szövegek frissülnek", () => {
    const onChange = vi.fn();
    const ls = createLocaleSwitcher({ parent: "root", id: "lang", locales, mode: "buttons", onChange });
    const p = createParagraph({ parent: "root", id: "p", text: tr("greet") });
    expect(ls.classList.contains("is-buttons")).toBe(true);
    expect(option(ls, "hu").getAttribute("aria-pressed")).toBe("true");
    expect(option(ls, "de").querySelector(".locale-switcher-code")!.textContent).toBe("DE");
    expect(option(ls, "en").getAttribute("aria-label")).toBe("English");
    option(ls, "en").click();
    expect(getLocale()).toBe("en");
    expect(onChange).toHaveBeenCalledWith("en");
    expect(p.textContent).toBe("Hello");
    expect(option(ls, "en").getAttribute("aria-pressed")).toBe("true");
  });

  it("ha a nyelvet máshol váltják, a kijelölés követi (onChange nélkül)", () => {
    const onChange = vi.fn();
    const ls = createLocaleSwitcher({ parent: "root", id: "lang", locales, mode: "buttons", onChange });
    setLocale("de");
    expect(ls.getValue()).toBe("de");
    expect(onChange).not.toHaveBeenCalled();
  });

  it("legördülő: nyit / zár, Esc a gombra viszi a fókuszt, kívülre kattintás zár, a gomb címkéje nyelvesített", () => {
    const ls = createLocaleSwitcher({ parent: "root", id: "lang", locales, mode: "dropdown" });
    const trigger = ls.querySelector<HTMLButtonElement>(".locale-switcher-trigger")!;
    expect(ls.classList.contains("is-dropdown")).toBe(true);
    expect(trigger.getAttribute("aria-label")).toBe("Nyelv: Magyar");
    trigger.click();
    expect(ls.classList.contains("is-open")).toBe(true);
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
    expect(document.activeElement).toBe(option(ls, "hu"));
    ls.querySelector(".locale-switcher-list")!.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }));
    expect(document.activeElement).toBe(option(ls, "en"));
    ls.querySelector(".locale-switcher-list")!.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    expect(ls.classList.contains("is-open")).toBe(false);
    expect(document.activeElement).toBe(trigger);
    trigger.click();
    document.body.click();
    expect(ls.classList.contains("is-open")).toBe(false);
    trigger.click();
    option(ls, "en").click();
    expect(getLocale()).toBe("en");
    expect(ls.classList.contains("is-open")).toBe(false);
    expect(trigger.getAttribute("aria-label")).toBe("Language: English");
  });

  it("updateLibrary: false: csak onChange, a könyvtár nyelve marad; setValue nem hív semmit", () => {
    const onChange = vi.fn();
    const ls = createLocaleSwitcher({ parent: "root", id: "lang", locales, mode: "buttons", updateLibrary: false, onChange });
    option(ls, "de").click();
    expect(getLocale()).toBe("hu");
    expect(onChange).toHaveBeenCalledWith("de");
    ls.setValue("en");
    expect(ls.getValue()).toBe("en");
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it("auto mód: matchMedia nélkül gombsor", () => {
    const ls = createLocaleSwitcher({ parent: "root", id: "lang", locales });
    expect(ls.classList.contains("is-buttons")).toBe(true);
  });

  it("YAML: a locales listából épül, és a nyelvváltás a t: szövegeket frissíti", () => {
    buildUI(`
ui:
  - LocaleSwitcher#ls:
      mode: buttons
      locales:
        - { code: hu, label: Magyar }
        - { code: en, label: English }
  - p#g: { t: greet }
`, { parent: "root" });
    option(document.getElementById("ls")!, "en").click();
    expect(document.getElementById("g")!.textContent).toBe("Hello");
  });
});
