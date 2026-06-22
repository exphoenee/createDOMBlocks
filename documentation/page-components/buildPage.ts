import { createDOMElem } from "domelemjs";
import type { CreateDOMElemOptions } from "domelemjs";
import { createDrawer, openDrawer, createMenu } from "../../src/index";
import { createHeader } from "./createHeader";
import { createFooter } from "./createFooter";
import { getDrawerMenuItems } from "./menuItems";

export interface PageSection {
  title: string;
  description: string;
  code: string;
  render: (parent: HTMLElement | string) => void;
}

export function buildPage(config: {
  title: string;
  sections: PageSection[];
  containerId?: string;
}): void {
  const containerId = config.containerId || "app";

  const items = getDrawerMenuItems();
  createDrawer({
    id: "sidebar-drawer",
    title: "createDOMBlocks",
    children: [createMenu({ id: "sidebar-drawer", items })],
  });
  createHeader({ onMenuClick: () => openDrawer() });

  const main = createDOMElem({
    tag: "main",
    attrs: { class: "page-main", id: containerId },
  });

  for (const section of config.sections) {
    const sectionEl = createDOMElem({
      tag: "section",
      attrs: { class: "doc-section" },
      children: [
        createDOMElem({ tag: "h2", text: section.title, attrs: { class: "doc-section-title" } }),
        createDOMElem({ tag: "p", text: section.description, attrs: { class: "doc-section-desc" } }),
        createDOMElem({
          tag: "pre",
          attrs: { class: "doc-code-block" },
          children: [
            createDOMElem({ tag: "code", text: section.code, attrs: { class: "doc-code" } }),
          ],
        }),
        createDOMElem({ tag: "div", attrs: { class: "doc-section-label" }, text: "Eredmény:" }),
        createDOMElem({ tag: "div", attrs: { class: "doc-section-result", id: `${containerId}-${config.sections.indexOf(section)}` } }),
      ],
    });
    main.appendChild(sectionEl);
  }

  document.body.appendChild(main);

  for (let i = 0; i < config.sections.length; i++) {
    config.sections[i].render(`${containerId}-${i}`);
  }

  const footer = createFooter();
  document.body.appendChild(footer);
}
