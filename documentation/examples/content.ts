import { initDocPage, renderSections, example } from "../page-components/index";
import { createCard, createGrid, createContainer, createParagraph, createTitle, createBlockquote, createCodeBlock, createImage, createLink, createDivider } from "../../src/index";

const done = initDocPage();

const sections = [
  example(
    { title: "createCard", description: "Kártya komponens címmel, testtel és lábléccel." },
    (parent) => createCard({ parent, id: "c1", title: "Kártya cím", body: { tag: "p", text: "Tartalom" }, footer: { tag: "div", text: "Lábléc" } }),
  ),
  example(
    { title: "createGrid", description: "Rács elrendezés oszlopokkal." },
    (parent) => { createGrid({ parent, id: "c2", columns: 3, gap: "1rem" }); },
  ),
  example(
    { title: "createParagraph", description: "Sima bekezdés szöveg." },
    (parent) => createParagraph({ parent, id: "cont-p1", text: "Ez egy bekezdés szöveg." }),
  ),
  example(
    { title: "createTitle", description: "Címsor h1-h6 szintekkel." },
    (parent) => { for (let i = 1; i <= 3; i++) createTitle({ parent, id: `cont-title${i}`, text: `Címsor ${i}` }, i); },
  ),
  example(
    { title: "createBlockquote", description: "Idézet szerzővel." },
    (parent) => createBlockquote({ parent, id: "cont-bq1", text: "A kódolás a jövő nyelve.", author: "Bozzay Viktor" }),
  ),
  example(
    { title: "createCodeBlock", description: "Kódblokk nyelv megadásával és syntax highlighting-gel." },
    (parent) => createCodeBlock({ parent, id: "cont-cb1", language: "typescript", code: 'const x: number = 42;\nconsole.log(x);' }),
  ),
  example(
    { title: "createImage", description: "Kép captionnal." },
    (parent) => createImage({ parent, id: "cont-img1", src: "https://picsum.photos/400/200", alt: "Példa kép", caption: "Példa caption" }),
  ),
  example(
    { title: "createLink", description: "Stilizált hivatkozás." },
    (parent) => createLink({ parent, id: "cont-link1", text: "Példa link", href: "https://example.com", target: "_blank" }),
  ),
  example(
    { title: "createDivider", description: "Vízszintes vonal elválasztáshoz." },
    (parent) => createDivider({ parent, id: "cont-div1" }),
  ),
];

renderSections(sections);
done();
