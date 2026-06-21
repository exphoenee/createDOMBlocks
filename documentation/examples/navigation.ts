import { initDocPage, renderSections } from "../page-components/index";
import { createNav, createBreadcrumb, createTabs } from "../../src/index";
import type { DocSection } from "../page-components/index";

const done = initDocPage();

const sections: DocSection[] = [
  {
    title: "createNav",
    description: "Navigációs sáv menüpontokkal és almenüvel.",
    code: `createNav({\n  parent: "#app",\n  id: "nav1",\n  items: [\n    { text: "Főoldal", href: "#", active: true },\n    { text: "Rólunk", href: "#about" },\n    { text: "Szolgáltatások", href: "#", children: [\n      { text: "Webfejlesztés", href: "#" },\n    ]},\n    { text: "Kapcsolat", href: "#contact" },\n  ],\n});`,
    codeLang: "typescript",
    render: (c) => createNav({ parent: c, id: "n1", items: [
      { text: "Főoldal", href: "#", active: true },
      { text: "Rólunk", href: "#" },
      { text: "Szolgáltatások", href: "#", children: [{ text: "Webfejlesztés", href: "#" }] },
      { text: "Kapcsolat", href: "#" },
    ]}),
  },
  {
    title: "createBreadcrumb",
    description: "Morzsa menü a navigációs út vonatkozásában.",
    code: `createBreadcrumb({\n  parent: "#app",\n  id: "bc1",\n  items: [\n    { text: "Főoldal", href: "#" },\n    { text: "Termék", href: "#" },\n    { text: "Laptop" },\n  ],\n});`,
    codeLang: "typescript",
    render: (c) => createBreadcrumb({ parent: c, id: "n2", items: [
      { text: "Főoldal", href: "#" },
      { text: "Termék", href: "#" },
      { text: "Laptop" },
    ]}),
  },
  {
    title: "createTabs",
    description: "Lapozható tabok külön tartalommal.",
    code: `createTabs({\n  parent: "#app",\n  id: "tabs1",\n  tabs: [\n    { id: "tab1", label: "Beállítások",\n      content: { tag: "p", text: "Tartalom 1" } },\n    { id: "tab2", label: "Profil",\n      content: { tag: "p", text: "Tartalom 2" } },\n  ],\n});`,
    codeLang: "typescript",
    render: (c) => createTabs({ parent: c, id: "n3", tabs: [
      { id: "t1", label: "Beállítások", content: { tag: "p", text: "Beállítások tartalma" } },
      { id: "t2", label: "Profil", content: { tag: "p", text: "Profil tartalma" } },
      { id: "t3", label: "Értesítések", content: { tag: "p", text: "Értesítések tartalma" } },
    ]}),
  },
];

renderSections(sections);
done();
