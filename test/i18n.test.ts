import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  createTextInput,
  createButtonInput,
  createPasswordInput,
  createTable,
  createModal,
  createAlert,
  createTabs,
  createSpinner,
  createCustomSelect,
  createCarousel,
  createMusicPlayer,
  createCustomDatePicker,
  createCodeBlock,
  setLocale,
  getLocale,
  registerMessages,
  loadMessages,
  onLocaleChange,
  setFallbackLocale,
  t,
  tr,
  resolveText,
} from "../src/index";

beforeEach(() => {
  document.body.innerHTML = '<div id="root"></div>';
  HTMLMediaElement.prototype.load = vi.fn();
  HTMLMediaElement.prototype.pause = vi.fn();
  HTMLMediaElement.prototype.play = vi.fn(() => Promise.resolve());
  registerMessages("de", {
    greeting: "Hallo {name}!",
    save: "Speichern",
    items_one: "{count} Element",
    items_other: "{count} Elemente",
  });
  registerMessages("hu", { greeting: "Szia {name}!", save: "Mentés", items_one: "{count} elem", items_other: "{count} elem" });
  registerMessages("en", { greeting: "Hello {name}!", save: "Save", items_one: "{count} item", items_other: "{count} items" });
});

afterEach(() => {
  setLocale("hu");
  setFallbackLocale("hu");
});

describe("i18n mag", () => {
  it("t(): fordít, behelyettesít, hiányzó kulcsnál a fallback / kulcs", () => {
    expect(t("save")).toBe("Mentés");
    expect(t("greeting", { name: "Anna" })).toBe("Szia Anna!");
    setLocale("en");
    expect(t("greeting", { name: "Anna" })).toBe("Hello Anna!");
    expect(t("nincs.ilyen")).toBe("nincs.ilyen");
    expect(t("nincs.ilyen", undefined, "Alapszöveg {x}")).toBe("Alapszöveg {x}");
  });

  it("többes szám a count alapján (Intl.PluralRules)", () => {
    setLocale("en");
    expect(t("items", { count: 1 })).toBe("1 item");
    expect(t("items", { count: 5 })).toBe("5 items");
  });

  it("a hiányzó kulcsot a visszaeső nyelv pótolja", () => {
    registerMessages("fr", { save: "Enregistrer" });
    setLocale("fr");
    expect(t("save")).toBe("Enregistrer");
    expect(t("greeting", { name: "X" })).toBe("Szia X!"); // fr-ben nincs: a hu pótolja
    setFallbackLocale("en");
    expect(t("greeting", { name: "X" })).toBe("Hello X!");
  });

  it("a tr() és a függvény az aktuális nyelven oldódik fel", () => {
    expect(resolveText(tr("save"))).toBe("Mentés");
    expect(resolveText(() => t("save"))).toBe("Mentés");
    setLocale("de");
    expect(resolveText(tr("save"))).toBe("Speichern");
    expect(resolveText(() => t("save"))).toBe("Speichern");
    expect(resolveText(undefined)).toBe("");
  });

  it("setLocale: <html lang>, onLocaleChange, azonos nyelvnél nincs esemény", () => {
    const cb = vi.fn();
    const off = onLocaleChange(cb);
    setLocale("en");
    expect(document.documentElement.lang).toBe("en");
    expect(getLocale()).toBe("en");
    expect(cb).toHaveBeenCalledWith("en");
    setLocale("en");
    expect(cb).toHaveBeenCalledTimes(1);
    off();
    setLocale("de");
    expect(cb).toHaveBeenCalledTimes(1);
  });

  it("loadMessages függvényből és URL-ről is regisztrál", async () => {
    await loadMessages("it", async () => ({ save: "Salva" }));
    setLocale("it");
    expect(t("save")).toBe("Salva");
    const fetchMock = vi.fn(async () => ({ ok: true, json: async () => ({ save: "Guardar" }) }) as unknown as Response);
    vi.stubGlobal("fetch", fetchMock);
    await loadMessages("es", "/locales/es.json");
    setLocale("es");
    expect(t("save")).toBe("Guardar");
    expect(fetchMock).toHaveBeenCalledWith("/locales/es.json", undefined);
    vi.stubGlobal("fetch", async () => ({ ok: false, status: 404 }) as unknown as Response);
    await expect(loadMessages("xx", "/nincs.json")).rejects.toThrow(/404/);
    vi.unstubAllGlobals();
  });
});

describe("komponensek szövegei nyelvváltáskor", () => {
  it("a gomb felirata (tr) és a függvény is frissül, az elem ugyanaz marad", () => {
    const a = createButtonInput({ parent: "root", id: "b1", text: tr("save") }) as HTMLInputElement;
    const b = createButtonInput({ parent: "root", id: "b2", text: () => t("greeting", { name: "Béla" }) }) as HTMLInputElement;
    expect([a.value, b.value]).toEqual(["Mentés", "Szia Béla!"]);
    setLocale("en");
    expect([a.value, b.value]).toEqual(["Save", "Hello Béla!"]);
    expect(document.getElementById("b1")).toBe(a);
  });

  it("a címke és a placeholder frissül, a begépelt érték megmarad", () => {
    const c = createTextInput({ parent: "root", id: "ti", labelText: tr("save"), placeholder: tr("greeting", { name: "?" }) });
    const input = c.querySelector("input") as HTMLInputElement;
    input.value = "begépelt szöveg";
    setLocale("en");
    expect(c.querySelector("label")?.textContent).toBe("Save");
    expect(input.getAttribute("placeholder")).toBe("Hello ?!");
    expect(input.value).toBe("begépelt szöveg");
    expect(c.querySelector("input")).toBe(input);
  });

  it("sima string nem változik nyelvváltáskor", () => {
    const a = createButtonInput({ parent: "root", id: "b1", text: "Fix felirat" }) as HTMLInputElement;
    setLocale("en");
    expect(a.value).toBe("Fix felirat");
  });

  it("a beágyazott gyerekek (alert címe, üzenete) és a tabok felirata frissül, az aktív tab megmarad", () => {
    const alert = createAlert({ parent: "root", id: "al", type: "info", title: tr("save"), message: () => t("greeting", { name: "A" }), dismissible: true });
    expect(alert.querySelector(".alert-title")?.textContent).toBe("Mentés");
    const tabs = createTabs({
      parent: "root", id: "tb", ariaLabel: tr("save"),
      tabs: [{ id: "a", label: tr("save"), content: { tag: "p", text: "A" } }, { id: "b", label: () => t("save"), content: { tag: "p", text: "B" } }],
      activeTab: "b",
    });
    setLocale("de");
    expect(alert.querySelector(".alert-title")?.textContent).toBe("Speichern");
    expect(alert.querySelector(".alert-message")?.textContent).toBe("Hallo A!");
    expect([...tabs.querySelectorAll(".tab-button")].map((b) => b.textContent)).toEqual(["Speichern", "Speichern"]);
    expect(tabs.querySelector(".tab-button.active")?.id).toBe("tb-tab-b");
    expect(tabs.querySelector(".tab-buttons")?.getAttribute("aria-label")).toBe("Speichern");
  });

  it("a beépített feliratok (hu → en) átváltanak: jelszó gomb, spinner, kódblokk, riasztás bezárás", () => {
    const pw = createPasswordInput({ parent: "root", id: "pw" });
    const toggle = pw.querySelector(".password-toggle") as HTMLButtonElement;
    expect(toggle.getAttribute("aria-label")).toBe("Jelszó megjelenítése");
    toggle.click(); // látható
    setLocale("en");
    expect(toggle.getAttribute("aria-label")).toBe("Hide password"); // az állapot megmarad (látható), a felirat angol
    expect((pw.querySelector("input") as HTMLInputElement).type).toBe("text");
    const spinner = createSpinner({ parent: "root", id: "sp" });
    expect(spinner.getAttribute("aria-label")).toBe("Loading…");
    const cb = createCodeBlock({ parent: "root", id: "cb", code: "x", language: "ts" });
    expect(cb.querySelector(".code-copy-btn")?.textContent).toBe("Copy");
    setLocale("hu");
    expect(spinner.getAttribute("aria-label")).toBe("Betöltés…");
    expect(cb.querySelector(".code-copy-btn")?.textContent).toBe("Másolás");
    expect(toggle.getAttribute("aria-label")).toBe("Jelszó elrejtése");
  });

  it("a modál gombjai átváltanak, a labels paraméterrel felülírhatók", () => {
    const m = createModal({ modalTitle: tr("save"), body: { tag: "p", text: "x" } }, {}, { id: "m1" });
    const m2 = createModal({ modalTitle: "x", body: { tag: "p", text: "x" } }, {}, { id: "m2", labels: { ok: tr("save"), cancel: "Nope" } });
    expect(m.querySelector(".modal-cancel-btn")?.textContent).toBe("Mégse");
    setLocale("en");
    expect(m.querySelector(".modal-cancel-btn")?.textContent).toBe("Cancel");
    expect(m.querySelector(".modal-title")?.textContent).toBe("Save");
    expect(m2.querySelector(".modal-ok-btn")?.textContent).toBe("Save");
    expect(m2.querySelector(".modal-cancel-btn")?.textContent).toBe("Nope");
  });

  it("a táblázat feliratai, cellái és a lapozó átváltanak; az oldal, szűrő és rendezés megmarad", () => {
    const rows = Array.from({ length: 25 }, (_, i) => ({ Id: i + 1, Név: i % 2 ? tr("save") : "x" }));
    const t1 = createTable(rows, { parent: "root", id: "t", hasHeader: true, filterable: true, sortable: true, pageSize: 10 });
    (t1.querySelector(".table-filter") as HTMLInputElement).value = "";
    const pageBtn = [...t1.querySelectorAll(".table-page-btn")].find((b) => b.textContent === "2") as HTMLButtonElement;
    pageBtn.click();
    expect(t1.querySelector(".table-info")?.textContent).toBe("11–20 / 25");
    expect(t1.querySelector(".table-filter")?.getAttribute("placeholder")).toBe("Szűrés…");
    expect([...t1.querySelectorAll(".table-page-btn")][0].textContent).toBe("‹ Előző");
    setLocale("en");
    expect(t1.querySelector(".table-filter")?.getAttribute("placeholder")).toBe("Filter…");
    expect([...t1.querySelectorAll(".table-page-btn")][0].textContent).toBe("‹ Previous");
    expect(t1.querySelector(".table-info")?.textContent).toBe("11–20 / 25"); // az oldal megmaradt
    expect(t1.querySelector(".table-page-btn.is-current")?.textContent).toBe("2");
    expect(t1.querySelector(".table-row-1 td:nth-child(2)")?.textContent).toBe("Save"); // a cella tr()-je is frissült
    // nincs találat felirat
    const input = t1.querySelector(".table-filter") as HTMLInputElement;
    input.value = "zzz";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    expect(t1.querySelector(".table-empty")?.textContent).toBe("No results");
    setLocale("hu");
    expect(t1.querySelector(".table-empty")?.textContent).toBe("Nincs találat");
  });

  it("az egyedi select trigger felirata a kiválasztott opció szerint frissül", () => {
    const sel = createCustomSelect({
      parent: "root", id: "cs", placeholder: tr("greeting", { name: "" }),
      options: [{ text: tr("save"), value: 1 }, { text: "fix", value: 2 }],
    });
    const trigger = sel.querySelector(".custom-select-trigger") as HTMLElement;
    expect(trigger.textContent).toBe("Szia !");
    (sel.querySelector('.custom-select-option[data-value="1"]') as HTMLElement).click();
    expect(trigger.textContent).toBe("Mentés");
    setLocale("de");
    expect(trigger.textContent).toBe("Speichern");
    expect(sel.querySelector('.custom-select-option[data-value="1"]')?.textContent).toBe("Speichern");
  });

  it("a carousel feliratai és pöttyei, a zenelejátszó aria-i és állapota átváltanak", () => {
    const c = createCarousel({ parent: "root", id: "car", slides: [{ title: tr("save") }, { title: "b" }] });
    expect(c.querySelector(".carousel-prev")?.getAttribute("aria-label")).toBe("Előző");
    expect(c.querySelector(".carousel-dot")?.getAttribute("aria-label")).toBe("1. dia");
    expect(c.querySelector(".carousel-slide-title")?.textContent).toBe("Mentés");
    setLocale("en");
    expect(c.querySelector(".carousel-prev")?.getAttribute("aria-label")).toBe("Previous");
    expect(c.querySelector(".carousel-dot")?.getAttribute("aria-label")).toBe("Slide 1");
    expect(c.querySelector(".carousel-slide-title")?.textContent).toBe("Save");

    const mp = createMusicPlayer({ parent: "root", id: "mp", tracks: [{ src: "a.mp3", title: tr("save") }, { src: "b.mp3" }] });
    expect(mp.getAttribute("aria-label")).toBe("Music player");
    expect(mp.querySelector(".music-play")?.getAttribute("aria-label")).toBe("Play");
    expect(mp.querySelector(".music-playlist-btn:nth-child(1) .music-playlist-title")?.textContent).toBe("Save");
    expect(mp.querySelectorAll(".music-playlist-title")[1].textContent).toBe("Track 2");
    (mp.querySelector("audio") as HTMLAudioElement).dispatchEvent(new Event("error"));
    expect(mp.querySelector(".music-status")?.textContent).toBe("This track cannot be played");
    setLocale("hu");
    expect(mp.getAttribute("aria-label")).toBe("Zenelejátszó");
    expect(mp.querySelectorAll(".music-playlist-title")[1].textContent).toBe("Szám 2");
    expect(mp.querySelector(".music-status")?.textContent).toBe("A szám nem játszható le");
    expect(mp.dataset.state).toBe("error"); // az állapot megmaradt
  });

  it("a naptár hónap- és napnevei az aktuális nyelven jelennek meg", () => {
    const dp = createCustomDatePicker({ parent: "root", id: "dp", value: "2024-03-15" });
    (dp.querySelector("input") as HTMLElement).click();
    const title = () => dp.querySelector(".calendar-title")?.textContent;
    const days = () => [...dp.querySelectorAll(".calendar-day-name")].map((d) => d.textContent);
    expect(title()).toBe("Március 2024");
    expect(days()[0]).toBe("H");
    setLocale("en");
    (dp.querySelector("input") as HTMLElement).click(); // zárás
    (dp.querySelector("input") as HTMLElement).click(); // újranyitás: újraszámolt nevek
    expect(title()).toBe("March 2024");
    expect(days()[0]).toBe("Mon");
    expect(dp.querySelector("input")?.getAttribute("placeholder")).toBe("Select a date…");
  });

  it("a DOM-ból kimaradt elem nem okoz hibát, és idővel felszabadul", () => {
    const orphan = createButtonInput({ parent: "root", id: "o", text: tr("save") }) as HTMLInputElement;
    orphan.remove();
    setLocale("en");
    expect(orphan.value).toBe("Save"); // még frissül (visszakerülhet)
    setLocale("de");
    setLocale("hu");
    setLocale("en"); // 3 kör után elfelejtve: nem dob hibát
    expect(() => setLocale("de")).not.toThrow();
  });
});
