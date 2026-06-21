import { initDocPage } from "../page-components/index";
import { createCard, createCodeBlock } from "../../src/index";
import { createDOMElem } from "domelemjs";

const done = initDocPage();

const app = document.getElementById("app")!;

createCard({
  parent: app,
  title: "Telepítés",
  body: {
    tag: "div",
    children: [
      createCodeBlock({ language: "bash", code: "npm install createdomblocks" }),
      createDOMElem({ tag: "p", text: "Vagy CDN-nel:", style: { marginTop: "1rem", marginBottom: "0.5rem", fontWeight: "600" } }),
      createCodeBlock({ language: "html", code: '<link rel="stylesheet" href="https://unpkg.com/createdomblocks/dist/style.css" />\n<script src="https://unpkg.com/createdomblocks/dist/index.js"></script>' }),
    ],
  },
});

createCard({
  parent: app,
  title: "Gyors használat",
  body: {
    tag: "div",
    children: [
      createCodeBlock({
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
      }),
    ],
  },
});

createCard({
  parent: app,
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

createCard({
  parent: app,
  title: "Komponensek",
  body: {
    tag: "div",
    children: [
      createDOMElem({ tag: "p", text: "Összesen 50+ komponens áll rendelkezésre: form inputok, gombok, select, radio, táblázatok, listák, navigáció, modal, alert, toast, badge, spinner, progress bar, accordion, tooltip, avatar és egyedi picker komponensek.", style: { marginBottom: "1rem" } }),
      createDOMElem({
        tag: "div",
        style: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.5rem" },
        children: [
          { tag: "a", text: "Form Inputok (18)", attrs: { class: "badge", href: "forms.html" } },
          { tag: "a", text: "Gombok (4)", attrs: { class: "badge", href: "buttons.html" } },
          { tag: "a", text: "Select / Radio (4)", attrs: { class: "badge", href: "selection.html" } },
          { tag: "a", text: "Táblázatok (2)", attrs: { class: "badge", href: "tables.html" } },
          { tag: "a", text: "Listák (2)", attrs: { class: "badge", href: "lists.html" } },
          { tag: "a", text: "Navigáció (3)", attrs: { class: "badge", href: "navigation.html" } },
          { tag: "a", text: "Tartalom (11)", attrs: { class: "badge", href: "content.html" } },
          { tag: "a", text: "Visszajelzés (5)", attrs: { class: "badge", href: "feedback.html" } },
          { tag: "a", text: "Interaktív (2)", attrs: { class: "badge", href: "interactive.html" } },
          { tag: "a", text: "Modal (1)", attrs: { class: "badge", href: "modal.html" } },
          { tag: "a", text: "Avatar (3)", attrs: { class: "badge", href: "avatars.html" } },
          { tag: "a", text: "Egyedi Inputok (6)", attrs: { class: "badge", href: "customInputs.html" } },
        ],
      }),
    ],
  },
});

done();

