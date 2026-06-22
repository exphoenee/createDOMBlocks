import { initDocPage, renderSections, example } from "../page-components/index";
import { createNav, createBreadcrumb, createTabs } from "../../src/index";

const done = initDocPage();

const sections = [
  example(
    { title: "createNav", description: "Navigációs sáv menüpontokkal és almenüvel." },
    (parent) => createNav({ parent, id: "n1", items: [
      { text: "Főoldal", href: "#", active: true },
      { text: "Rólunk", href: "#" },
      { text: "Szolgáltatások", href: "#", children: [{ text: "Webfejlesztés", href: "#" }] },
      { text: "Kapcsolat", href: "#" },
    ]}),
  ),
  example(
    { title: "createBreadcrumb", description: "Morzsa menü a navigációs út vonatkozásában." },
    (parent) => createBreadcrumb({ parent, id: "n2", items: [
      { text: "Főoldal", href: "#" },
      { text: "Termék", href: "#" },
      { text: "Laptop" },
    ]}),
  ),
  example(
    { title: "createTabs", description: "Lapozható tabok külön tartalommal." },
    (parent) => createTabs({ parent, id: "n3", tabs: [
      { id: "t1", label: "Beállítások", content: { tag: "p", text: "Beállítások tartalma" } },
      { id: "t2", label: "Profil", content: { tag: "p", text: "Profil tartalma" } },
      { id: "t3", label: "Értesítések", content: { tag: "p", text: "Értesítések tartalma" } },
    ]}),
  ),
];

renderSections(sections);
done();
