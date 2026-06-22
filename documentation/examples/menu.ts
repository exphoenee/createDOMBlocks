import { initDocPage, renderSections, example } from "../page-components/index";
import { createMenu, createCard } from "../../src/index";
import { createDOMElem } from "domelemjs";

const done = initDocPage();

const sections = [
  example(
    { title: "createMenu (egyszerű)", description: "Egyszerű menü linkekkel, drawer-ben használható navigációs listaként.", component: createMenu },
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
    { title: "createMenu (almenüvel)", description: "Menü csoportosított almenükkel, ahol a csoportcímek nem linkek, hanem szöveges fejlécek." },
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

];

renderSections(sections);
done();
