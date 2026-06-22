import { initDocPage, renderSections } from "../page-components/index";
import { createDrawer, openDrawer, closeDrawer, createButton, createMenu, createCard } from "../../src/index";
import { createDOMElem } from "domelemjs";
import type { DocSection } from "../page-components/index";

const done = initDocPage();

const sections: DocSection[] = [
  {
    title: "createDrawer (overlay mód)",
    description: "Oldalsó panel ami felülúszik a tartalmon, overlay réteggel.",
    code: `createDrawer({
  id: "overlayDrawer",
  title: "Overlay Drawer",
  children: [
    createDOMElem({ tag: "p", text: "Ez egy overlay módú drawer." }),
    createDOMElem({ tag: "p", text: "Kattints a × gombra vagy a sötét overlay-re a bezáráshoz." }),
  ],
  hasOverlay: true,
  mode: "overlay",
});

createButton({
  parent: "#app",
  id: "overlayBtn",
  text: "Overlay Drawer megnyitása",
  click: () => openDrawer("overlayDrawer"),
});`,
    codeLang: "typescript",
    render: (c) => {
      createDrawer({
        id: "doc-overlay-drawer",
        title: "Overlay Drawer",
        children: [
          createDOMElem({ tag: "p", text: "Ez egy overlay módú drawer." }),
          createDOMElem({ tag: "p", text: "Kattints a × gombra vagy a sötét overlay-re a bezáráshoz." }),
        ],
        hasOverlay: true,
        mode: "overlay",
      });
      createButton({
        parent: c,
        id: "drawer-overlay-btn",
        text: "Overlay Drawer megnyitása",
        click: () => openDrawer("doc-overlay-drawer"),
      });
    },
  },
  {
    title: "createDrawer (push mód)",
    description: "Oldalsó panel ami kitolja a tartalmat, overlay nélkül.",
    code: `createDrawer({
  id: "pushDrawer",
  title: "Push Drawer",
  children: [
    createMenu({
      id: "pushDrawer",
      items: [
        { label: "Kezdőlap", href: "#" },
        { label: "Profil", href: "#" },
        { label: "Beállítások", href: "#" },
      ],
    }),
  ],
  mode: "push",
  hasOverlay: false,
});

createButton({
  parent: "#app",
  id: "pushBtn",
  text: "Push Drawer megnyitása",
  click: () => openDrawer("pushDrawer"),
});`,
    codeLang: "typescript",
    render: (c) => {
      createDrawer({
        id: "doc-push-drawer",
        title: "Push Drawer",
        children: [
          createMenu({
            id: "doc-push-drawer",
            items: [
              { label: "Kezdőlap", href: "#" },
              { label: "Profil", href: "#" },
              { label: "Beállítások", href: "#" },
            ],
          }),
        ],
        mode: "push",
        hasOverlay: false,
      });
      createButton({
        parent: c,
        id: "drawer-push-btn",
        text: "Push Drawer megnyitása",
        click: () => openDrawer("doc-push-drawer"),
      });
    },
  },
  {
    title: "createDrawer menüvel",
    description: "Drawer beépített menüvel, alapértelmezetten nyitva.",
    code: `createDrawer({
  id: "menuDrawer",
  title: "Navigáció",
  items: [
    { label: "Főoldal", href: "#" },
    {
      label: "Termékek",
      children: [
        { label: "Kategória 1", href: "#" },
        { label: "Kategória 2", href: "#" },
      ],
    },
    { label: "Kapcsolat", href: "#" },
  ],
  defaultState: "open",
  mode: "overlay",
  hasOverlay: true,
});`,
    codeLang: "typescript",
    render: (c) => {
      createDrawer({
        id: "doc-menu-drawer",
        title: "Navigáció",
        items: [
          { label: "Főoldal", href: "#" },
          {
            label: "Termékek",
            children: [
              { label: "Kategória 1", href: "#" },
              { label: "Kategória 2", href: "#" },
            ],
          },
          { label: "Kapcsolat", href: "#" },
        ],
        defaultState: "open",
        mode: "overlay",
        hasOverlay: true,
      });
    },
  },
  {
    title: "Nyitás és zárás programozottan",
    description: "Az openDrawer() és closeDrawer() függvényekkel irányíthatod a drawer-t.",
    code: `// Drawer megnyitása
openDrawer("myDrawer");

// Drawer bezárása
closeDrawer("myDrawer");`,
    codeLang: "typescript",
    render: (c) => {
      createCard({
        parent: c,
        id: "doc-drawer-api-card",
        title: "API",
        body: {
          tag: "table",
          attrs: { class: "table" },
          children: [
            { tag: "thead", children: [{ tag: "tr", children: [
              { tag: "th", text: "Függvény" },
              { tag: "th", text: "Leírás" },
            ]}]},
            { tag: "tbody", children: [
              { tag: "tr", children: [
                { tag: "td", text: "openDrawer(id?: string)" },
                { tag: "td", text: "Drawer megnyitása (alapértelmezett id: sidebar-drawer)" },
              ]},
              { tag: "tr", children: [
                { tag: "td", text: "closeDrawer(id?: string)" },
                { tag: "td", text: "Drawer bezárása (alapértelmezett id: sidebar-drawer)" },
              ]},
            ]},
          ],
        },
      });
    },
  },
];

renderSections(sections);
done();
