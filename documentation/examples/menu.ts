import { initDocPage, renderSections, example } from "../page-components/index";
import { createMenu, createCard } from "../../src/index";
import { createDOMElem } from "domelemjs";

const done = initDocPage();

const sections = [
  example(
    { title: "createMenu (egyszerű)", description: "Egyszerű menü linkekkel, drawer-ben használható navigációs listaként." },
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
  example(
    { title: "createMenu drawer-ben", description: "A createMenu tipikusan egy createDrawer children-eként használatos, hogy oldalsó navigációs menüt építsünk." },
    (parent) => {
      createCard({
        parent,
        id: "menu-card-3",
        title: "Paraméterek",
        body: {
          tag: "table",
          attrs: { class: "table" },
          children: [
            { tag: "thead", children: [{ tag: "tr", children: [
              { tag: "th", text: "Paraméter" },
              { tag: "th", text: "Típus" },
              { tag: "th", text: "Leírás" },
            ]}]},
            { tag: "tbody", children: [
              { tag: "tr", children: [
                { tag: "td", text: "id" },
                { tag: "td", text: "string" },
                { tag: "td", text: "Menü azonosítója (kötelező)" },
              ]},
              { tag: "tr", children: [
                { tag: "td", text: "items" },
                { tag: "td", text: "MenuItem[]" },
                { tag: "td", text: "Menüpontok tömbje (kötelező)" },
              ]},
            ]},
          ],
        },
      });
      createDOMElem({ tag: "p", text: "MenuItem objektum:", style: { fontWeight: "600", marginTop: "1rem" } });
      createCard({
        parent,
        id: "menu-card-4",
        body: {
          tag: "table",
          attrs: { class: "table" },
          children: [
            { tag: "thead", children: [{ tag: "tr", children: [
              { tag: "th", text: "Mező" },
              { tag: "th", text: "Típus" },
              { tag: "th", text: "Leírás" },
            ]}]},
            { tag: "tbody", children: [
              { tag: "tr", children: [
                { tag: "td", text: "label" },
                { tag: "td", text: "string" },
                { tag: "td", text: "Megjelenő szöveg" },
              ]},
              { tag: "tr", children: [
                { tag: "td", text: "href" },
                { tag: "td", text: "string (opcionális)" },
                { tag: "td", text: "Link cél URL. Ha nincs megadva, szöveges fejléc lesz" },
              ]},
              { tag: "tr", children: [
                { tag: "td", text: "children" },
                { tag: "td", text: "MenuItem[] (opcionális)" },
                { tag: "td", text: "Almenü pontok" },
              ]},
            ]},
          ],
        },
      });
    },
  ),
];

renderSections(sections);
done();
