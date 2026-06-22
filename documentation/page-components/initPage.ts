import { createDOMElem } from "domelemjs";
import type { CreateDOMElemOptions } from "domelemjs";
import { createDrawer, openDrawer, createMenu } from "../../src/index";
import { createHeader } from "./createHeader";
import { createFooter } from "./createFooter";
import { getDrawerMenuItems } from "./menuItems";
import { highlightCode } from "../../src/components/highlighter";
import { createPageLoading } from "./createPageLoading";
import type { DocSection } from "./example";
import { propsTable } from "./propsTable";

function createCodeBlockHTML(code: string, lang?: string): CreateDOMElemOptions {
  const highlighted = highlightCode(code, lang);
  return {
    tag: "div",
    attrs: { class: "code-block" },
    children: [
      ...(lang
        ? [{ tag: "div", text: lang.toUpperCase(), attrs: { class: "code-language" } }]
        : []),
      {
        tag: "pre",
        attrs: { class: "code-pre" },
        children: [
          { tag: "code", content: highlighted, attrs: { class: `code-content language-${lang || ""}` } },
        ],
      },
    ],
  };
}

export function initDocPage(): () => void {
  const done = createPageLoading();
  const items = getDrawerMenuItems();
  createDrawer({
    id: "sidebar-drawer",
    title: "createDOMBlocks",
    children: [createMenu({ id: "sidebar-drawer", items })],
    defaultState: "open",
    hasOverlay: false,
    mode: "push",
  });
  createHeader({ onMenuClick: () => openDrawer() });
  createFooter();
  return done;
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

    const sectionEl = createDOMElem({
      tag: "section",
      attrs: { class: "doc-section" },
      children: [
        createDOMElem({ tag: "h2", text: section.title, attrs: { class: "doc-section-title" } }),
        createDOMElem({ tag: "p", text: section.description, attrs: { class: "doc-section-desc" } }),
        createCodeBlockHTML(section.code, section.codeLang),
        createDOMElem({ tag: "div", text: "Eredm\u00E9ny:", attrs: { class: "doc-result-label" } }),
        createDOMElem({ tag: "div", attrs: { class: "doc-result", id: resultId } }),
      ],
    });
    main.appendChild(sectionEl);

    // Ha a szekciónak van component mezője és még nem rendereltük a tábláját,
    // beszúrjuk közvetlenül a szekció után
    if (section.component && !renderedComponents.has(section.component)) {
      renderedComponents.add(section.component);
      const tableEl = propsTable(section.component);
      main.appendChild(tableEl);
    }

    const resultContainer = document.getElementById(resultId) as HTMLElement | null;
    if (resultContainer) {
      section.render(resultContainer);
    }
  }
}
