import { initDocPage, renderSections, example } from "../page-components/index";
import { createMenu, createCard } from "../../src/index";

const done = initDocPage();

const sections = [
  example(
    { title: "Menu (egyszerű)", description: "Egyszerű menü linkekkel, drawer-ben használható navigációs listaként.", component: createMenu },
    (parent) => {
      const menu = createMenu({
        id: "menu-ex-1",
        items: [
          { label: "Kezdőlap", href: "#" },
          { label: "Profil", href: "#" },
          { label: "Beállítások", href: "#" },
          { label: "Kilépés", href: "#" },
        ],
      });
      createCard({
        parent,
        id: "menu-card-1",
        title: "Egyszerű menü",
        body: { tag: "div", children: [menu] },
      });
    },
  ),
  example(
    { title: "Menu (almenüvel)", description: "Menü csoportosított almenükkel, ahol a csoportcímek nem linkek, hanem szöveges fejlécek." },
    (parent) => {
      const menu = createMenu({
        id: "menu-ex-2",
        items: [
          { label: "Kezdőlap", href: "#" },
          {
            label: "Termékek",
            children: [
              { label: "Kategória 1", href: "#" },
              { label: "Kategória 2", href: "#" },
              { label: "Kategória 3", href: "#" },
            ],
          },
          {
            label: "Beállítások",
            children: [
              { label: "Profil", href: "#" },
              { label: "Biztonság", href: "#" },
            ],
          },
          { label: "Kapcsolat", href: "#" },
        ],
      });
      createCard({
        parent,
        id: "menu-card-2",
        title: "Menü almenükkel",
        body: { tag: "div", children: [menu] },
      });
    },
  ),
  example(
    { title: "Menu (összecsukható csoportok)", description: "A `collapsible: true` a gyermekes csoportokat összecsukhatóvá teszi (fejlécre kattintva nyílnak). A `open` mezővel a kezdőállapot állítható; alapból az aktuális oldalt tartalmazó csoport nyitott.", component: createMenu },
    (parent) => {
      const menu = createMenu({
        id: "menu-ex-collapsible",
        collapsible: true,
        items: [
          { label: "Kezdőlap", href: "#" },
          { label: "Forms", open: true, children: [{ label: "Text input", href: "#" }, { label: "Select", href: "#" }] },
          { label: "Gombok", children: [{ label: "Button", href: "#" }, { label: "Submit", href: "#" }] },
        ],
      });
      createCard({ parent, id: "menu-card-collapsible", title: "Összecsukható menü", body: { tag: "div", children: [menu] } });
    },
  ),
];

renderSections(sections);
done();
