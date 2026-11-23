import { createLocalizedElem as createDOMElem } from "../../src/index";
import { initI18n, tr } from "./i18n";
import { createDrawer, openDrawer, createMenu, createCodeBlock } from "../../src/index";
import { createHeader } from "./createHeader";
import { createFooter } from "./createFooter";
import { getDrawerMenuItems } from "./menuItems";
import { createPageLoading } from "./createPageLoading";
import type { DocSection } from "./example";
import { propsTable } from "./propsTable";
import { initTheme } from "./theme";

export function initDocPage(): () => void {
  initTheme();
  const i18nReady = initI18n();
  const done = createPageLoading();
  const items = getDrawerMenuItems();
  createDrawer({
    id: "sidebar-drawer",
    title: "createDOMBlocks",
    children: [createMenu({ id: "sidebar-drawer", items, collapsible: true })],
    defaultState: "open",
    hasOverlay: false,
    mode: "push",
  });
  createHeader({ onMenuClick: () => openDrawer() });
  createFooter();
  // a betöltő overlay addig marad, amíg az (angol) katalógus be nem töltődött
  return () => void i18nReady.finally(done);
}

export function addFooter(): HTMLElement {
  return createFooter();
}

export function renderSections(sections: DocSection[]): void {
  const main = document.querySelector(".page-content") as HTMLElement;
  if (!main) return;

  // Dedup: mely komponensekhez már beszúrtunk táblázatot
  const renderedComponents = new Set<Function>();

  for (const section of sections) {
    const resultId = `result-${Math.random().toString(36).slice(2, 8)}`;

    // Szekció fejléc (cím + leírás)
    const sectionEl = createDOMElem({
      tag: "section",
      attrs: { class: "doc-section" },
      children: [
        createDOMElem({ tag: "h2", text: section.title, attrs: { class: "doc-section-title" } }),
        createDOMElem({ tag: "p", text: section.description, attrs: { class: "doc-section-desc" } }),
      ],
    });
    main.appendChild(sectionEl);

    // Kódblokk a library createCodeBlock komponensével
    createCodeBlock({
      parent: sectionEl,
      id: `code-${resultId}`,
      language: section.codeLang,
      code: section.code,
    });

    // Eredmény címke
    const resultLabel = createDOMElem({
      tag: "div",
      text: tr("Eredmény:"),
      attrs: { class: "doc-result-label" },
    });
    sectionEl.appendChild(resultLabel);

    // Eredmény konténer
    const resultContainer = createDOMElem({
      tag: "div",
      attrs: { class: "doc-result", id: resultId },
    });
    sectionEl.appendChild(resultContainer);

    // Ha a szekciónak van component mezője és még nem rendereltük a tábláját,
    // beszúrjuk közvetlenül a szekció után
    if (section.component && !renderedComponents.has(section.component)) {
      renderedComponents.add(section.component);
      const tableEl = propsTable(section.component);
      main.appendChild(tableEl);
    }

    section.render(resultContainer);
  }
}
