import { describe, it, expect, beforeEach, vi } from "vitest";
import { createThemeToggle, themeBootstrapScript, setLocale, buildUI } from "../src/index";

beforeEach(() => {
  document.body.innerHTML = '<div id="root"></div>';
  document.documentElement.removeAttribute("data-theme");
  document.documentElement.style.colorScheme = "";
  localStorage.clear();
  setLocale("hu");
});

const html = () => document.documentElement;

describe("ThemeToggle (C5)", () => {
  it("kezdő téma: a mentett, a beállított attribútum, majd az első; a következő téma ikonját mutatja", () => {
    let tt = createThemeToggle({ parent: "root", id: "t1" });
    expect(tt.getTheme()).toBe("light");
    expect(html().getAttribute("data-theme")).toBe("light");
    expect(tt.querySelector(".theme-toggle-icon")!.textContent).toBe("🌙");
    tt.remove();

    html().setAttribute("data-theme", "dark");
    tt = createThemeToggle({ parent: "root", id: "t2" });
    expect(tt.getTheme()).toBe("dark");
    tt.remove();

    localStorage.setItem("cdb-theme", "light");
    tt = createThemeToggle({ parent: "root", id: "t3" });
    expect(tt.getTheme()).toBe("light");
  });

  it("kattintás: körbe vált, ment, colorScheme, onChange; aria-label nyelvesítve", () => {
    const onChange = vi.fn();
    const tt = createThemeToggle({ parent: "root", id: "t", onChange });
    tt.click();
    expect(tt.getTheme()).toBe("dark");
    expect(html().getAttribute("data-theme")).toBe("dark");
    expect(html().style.colorScheme).toBe("dark");
    expect(localStorage.getItem("cdb-theme")).toBe("dark");
    expect(onChange).toHaveBeenCalledWith("dark");
    expect(tt.getAttribute("aria-label")).toBe("Téma: Sötét. Váltás erre: Világos");
    setLocale("en");
    expect(tt.getAttribute("aria-label")).toBe("Theme: Dark. Switch to: Light");
  });

  it("saját témák, saját kulcs, mentés nélkül; setTheme nem ment", () => {
    const tt = createThemeToggle({
      parent: "root",
      id: "t",
      themes: ["light", "dark", "nightvision"],
      storageKey: null,
      labels: { nightvision: "Éjjellátó" },
      icons: { nightvision: "🟢" },
      showLabel: true,
    });
    tt.click();
    tt.click();
    expect(tt.getTheme()).toBe("nightvision");
    expect(localStorage.length).toBe(0);
    expect(tt.querySelector(".theme-toggle-label")!.textContent).toBe("Világos"); // a következő: light
    tt.setTheme("dark");
    expect(html().getAttribute("data-theme")).toBe("dark");
    tt.setTheme("ismeretlen");
    expect(tt.getTheme()).toBe("dark");
  });

  it("themeBootstrapScript: a mentett vagy az első témát írja az attribútumba", () => {
    localStorage.setItem("p-theme", "dark");
    new Function(themeBootstrapScript({ storageKey: "p-theme" }))();
    expect(html().getAttribute("data-theme")).toBe("dark");
    localStorage.setItem("p-theme", "gonosz");
    new Function(themeBootstrapScript({ storageKey: "p-theme", themes: ["light", "dark"] }))();
    expect(html().getAttribute("data-theme")).toBe("light");
  });

  it("YAML: a theme paraméter frissítője setTheme", () => {
    const ui = buildUI(`
state: { mode: light }
ui:
  - ThemeToggle#tt: { theme: "\${mode}", storageKey: yaml-theme }
`, { parent: "root" });
    const tt = document.getElementById("tt")!;
    ui.state.set("mode", "dark");
    expect(document.getElementById("tt")).toBe(tt);
    expect(html().getAttribute("data-theme")).toBe("dark");
  });
});
