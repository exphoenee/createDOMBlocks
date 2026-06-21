import { createCard, createGrid, createContainer, createParagraph, createTitle, createBlockquote, createCodeBlock, createImage, createLink, createDivider } from "../../src/index";

createCard({ parent: "#app-card", id: "card1", title: "Kartya cim",
  body: { tag: "p", text: "Ez egy kartya test tartalma." },
  footer: { tag: "div", children: [
    { tag: "button", text: "M\u00E9gse", attrs: { class: "btn" } },
    { tag: "button", text: "Ment\u00E9s", attrs: { class: "btn" } },
  ]},
});

createGrid({ parent: "#app-grid", id: "grid1", columns: 3, gap: "1rem" });
createCard({ parent: "#grid1", title: "1", body: { tag: "p", text: "Tartalom 1" } });
createCard({ parent: "#grid1", title: "2", body: { tag: "p", text: "Tartalom 2" } });
createCard({ parent: "#grid1", title: "3", body: { tag: "p", text: "Tartalom 3" } });

createContainer({ parent: "#app-container", id: "container1", children: [
  { tag: "p", text: "Ez egy containeren beluli szoveg." },
  { tag: "button", text: "Gomb", attrs: { class: "btn" } },
]});

createParagraph({ parent: "#app-para", text: "Ez egy bekezdes szoveg." });

createTitle({ parent: "#app-title", text: "Cimsor 1" }, 1);
createTitle({ parent: "#app-title", text: "Cimsor 2" }, 2);
createTitle({ parent: "#app-title", text: "Cimsor 3" }, 3);
createTitle({ parent: "#app-title", text: "Cimsor 4" }, 4);
createTitle({ parent: "#app-title", text: "Cimsor 5" }, 5);
createTitle({ parent: "#app-title", text: "Cimsor 6" }, 6);

createBlockquote({ parent: "#app-bq", text: "A kodolas a jovo nyelve.", author: "Bozzay Viktor" });

createCodeBlock({ parent: "#app-code", language: "typescript", code: `const x: number = 42;\nconsole.log(x);` });

createImage({ parent: "#app-img", src: "https://picsum.photos/400/200", alt: "Pelda kep", caption: "Ez egy pelda kep captionnal" });

createLink({ parent: "#app-link", text: "Pelda link", href: "https://example.com", target: "_blank" });

createDivider({ parent: "#app-divider" });
