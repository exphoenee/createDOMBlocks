import { initDocPage } from "../page-components/index";
import { createCard, createCodeBlock, resolveText } from "../../src/index";
import { createDOMElem } from "domelemjs";
import { getDrawerMenuItems } from "../page-components/menuItems";

const done = initDocPage();

const app = document.getElementById("app") as HTMLElement;

const bodyOf = (id: string) => document.querySelector(`#${id} .card-body`) as HTMLElement;

createCard({ parent: app, id: "index-install", title: "Telepítés", body: { tag: "div", attrs: { class: "card-content" } } });
{
  const body = bodyOf("index-install");
  createCodeBlock({ parent: body, id: "index-install-npm", language: "bash", code: "npm install createdomblocks" });
  createDOMElem({ tag: "p", text: "Vagy CDN-nel:", parent: body, style: { marginTop: "1rem", marginBottom: "0.5rem", fontWeight: "600" } });
  createCodeBlock({ parent: body, id: "index-install-cdn", language: "html", code: `<link rel="stylesheet" href="https://unpkg.com/createdomblocks/dist/style.css" />
<script src="https://unpkg.com/createdomblocks/dist/index.js"></script>` });
}

createCard({ parent: app, id: "index-quickstart", title: "Gyors használat", body: { tag: "div", attrs: { class: "card-content" } } });
createCodeBlock({
  parent: bodyOf("index-quickstart"),
  id: "index-quickstart-code",
  language: "typescript",
  code: `import { createTextInput, createButton } from "createdomblocks";
import "createdomblocks/style.css";

const parent = document.getElementById("app");

createTextInput({
  parent,
  id: "nev",
  labelText: "Név:",
  placeholder: "Adja meg a nevet",
});

createButton({
  parent,
  id: "submitBtn",
  text: "Küldés",
  click: () => console.log("Kattintás!"),
});`,
});

createCard({
  parent: app,
  id: "index-info",
  title: "Alapadatok",
  body: {
    tag: "table",
    attrs: { class: "table" },
    children: [
      { tag: "tbody", children: [
        { tag: "tr", children: [{ tag: "th", text: "Név" }, { tag: "td", text: "createdomblocks" }] },
        { tag: "tr", children: [{ tag: "th", text: "Verzió" }, { tag: "td", text: "2.1.0" }] },
        { tag: "tr", children: [{ tag: "th", text: "Licenc" }, { tag: "td", text: "MIT" }] },
        { tag: "tr", children: [{ tag: "th", text: "Szerző" }, { tag: "td", text: "Viktor Bozzay" }] },
        { tag: "tr", children: [{ tag: "th", text: "Függőség" }, { tag: "td", text: "DOMelemJS v2.0.1" }] },
      ]},
    ],
  },
});

const menuGroups = getDrawerMenuItems().filter((g) => g.children);
const total = menuGroups.reduce((n, g) => n + (g.children?.length ?? 0), 0);

createCard({
  parent: app,
  id: "index-components",
  title: "Komponensek",
  body: {
    tag: "div",
    children: [
      createDOMElem({ tag: "p", text: `Összesen ${total} komponens, mindegyikhez külön oldal példákkal és paraméter-táblázattal.`, style: { marginBottom: "1rem" } }),
      ...menuGroups.flatMap((group) => [
        createDOMElem({ tag: "h3", text: `${resolveText(group.label)} (${group.children?.length})`, style: { margin: "1rem 0 0.5rem" } }),
        createDOMElem({
          tag: "div",
          style: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(10rem, 1fr))", gap: "0.5rem" },
          children: (group.children ?? []).map((c) => ({ tag: "a", text: resolveText(c.label), attrs: { class: "badge", href: c.href ?? "#" } })),
        }),
      ]),
    ],
  },
});

done();

