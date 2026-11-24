import { createLocalizedElem as createDOMElem } from "../../src/index";
import { initI18n, tr } from "./i18n";
import { createDrawer, openDrawer, createMenu, createCodeBlock, buildUI } from "../../src/index";
import { createHeader } from "./createHeader";
import { createFooter } from "./createFooter";
import { getDrawerMenuItems } from "./menuItems";
import { createPageLoading } from "./createPageLoading";
import type { DocSection } from "./example";
import { propsTable } from "./propsTable";
import { yamlExample } from "./yamlExamples";
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

  // A komponens oldalának végén: ugyanaz a komponens a YAML leíróval (opcionális réteg)
  for (const component of renderedComponents) {
    appendYamlSection(main, component.name.replace(/^create/, ""));
  }
}

/** "YAML leíró" szakasz: a minta kódja és az ugyanabból élőben felépített eredmény. */
function appendYamlSection(main: HTMLElement, componentName: string): void {
  const source = yamlExample(componentName);
  if (!source) return;
  const id = `yaml-${componentName.toLowerCase()}`;

  const sectionEl = createDOMElem({
    tag: "section",
    attrs: { class: "doc-section", id },
    children: [
      createDOMElem({ tag: "h2", text: tr("YAML leíró"), attrs: { class: "doc-section-title" } }),
      createDOMElem({
        tag: "p",
        text: tr("Ugyanez a komponens a YAML leíróval (buildUI / mountYaml). A YAML leíró opcionális, a createX hívások változatlanul használhatók."),
        attrs: { class: "doc-section-desc" },
      }),
    ],
  });
  main.appendChild(sectionEl);
  createCodeBlock({ parent: sectionEl, id: `${id}-code`, language: "yaml", code: source });
  sectionEl.appendChild(createDOMElem({ tag: "div", text: tr("Eredmény:"), attrs: { class: "doc-result-label" } }));
  const result = createDOMElem({ tag: "div", attrs: { class: "doc-result", id: `${id}-result` } });
  sectionEl.appendChild(result);
  try {
    buildUI(source, { parent: result });
  } catch (e) {
    createDOMElem({ tag: "pre", parent: result, text: (e as Error).message, style: { color: "var(--error)", whiteSpace: "pre-wrap", margin: "0" } });
  }
}
