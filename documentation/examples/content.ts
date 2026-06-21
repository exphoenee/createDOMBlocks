import { initDocPage, renderSections } from "../page-components/index";
import { createCard, createGrid, createContainer, createParagraph, createTitle, createBlockquote, createCodeBlock, createImage, createLink, createDivider } from "../../src/index";
import type { DocSection } from "../page-components/index";

const done = initDocPage();

const sections: DocSection[] = [
  {
    title: "createCard",
    description: "Kártya komponens címmel, testtel és lábléccel.",
    code: `createCard({\n  parent: "#app",\n  id: "card1",\n  title: "Kártya cím",\n  body: { tag: "p", text: "Tartalom" },\n  footer: { tag: "div", text: "Lábléc" },\n});`,
    codeLang: "typescript",
    render: (c) => createCard({ parent: c, id: "c1", title: "Kártya cím", body: { tag: "p", text: "Tartalom" }, footer: { tag: "div", text: "Lábléc" } }),
  },
  {
    title: "createGrid",
    description: "Rács elrendezés oszlopokkal.",
    code: `createGrid({ parent: "#app", id: "grid1", columns: 3, gap: "1rem" });`,
    codeLang: "typescript",
    render: (c) => { createGrid({ parent: c, id: "c2", columns: 3, gap: "1rem" }); },
  },
  {
    title: "createParagraph",
    description: "Sima bekezdés szöveg.",
    code: `createParagraph({\n  parent: "#app",\n  text: "Ez egy bekezdés szöveg.",\n});`,
    codeLang: "typescript",
    render: (c) => createParagraph({ parent: c, text: "Ez egy bekezdés szöveg." }),
  },
  {
    title: "createTitle",
    description: "Címsor h1-h6 szintekkel.",
    code: `createTitle({ parent: "#app", text: "Címsor 2" }, 2);`,
    codeLang: "typescript",
    render: (c) => { for (let i = 1; i <= 3; i++) createTitle({ parent: c, text: `Címsor ${i}` }, i); },
  },
  {
    title: "createBlockquote",
    description: "Idézet szerzővel.",
    code: `createBlockquote({\n  parent: "#app",\n  text: "A kódolás a jövő nyelve.",\n  author: "Bozzay Viktor",\n});`,
    codeLang: "typescript",
    render: (c) => createBlockquote({ parent: c, text: "A kódolás a jövő nyelve.", author: "Bozzay Viktor" }),
  },
  {
    title: "createCodeBlock",
    description: "Kódblokk nyelv megadásával és syntax highlighting-gel.",
    code: `createCodeBlock({\n  parent: "#app",\n  language: "typescript",\n  code: 'const x: number = 42;\\nconsole.log(x);',\n});`,
    codeLang: "typescript",
    render: (c) => createCodeBlock({ parent: c, language: "typescript", code: 'const x: number = 42;\nconsole.log(x);' }),
  },
  {
    title: "createImage",
    description: "Kép captionnal.",
    code: `createImage({\n  parent: "#app",\n  src: "https://picsum.photos/400/200",\n  alt: "Példa kép",\n  caption: "Caption",\n});`,
    codeLang: "typescript",
    render: (c) => createImage({ parent: c, src: "https://picsum.photos/400/200", alt: "Példa kép", caption: "Példa caption" }),
  },
  {
    title: "createLink",
    description: "Stilizált hivatkozás.",
    code: `createLink({\n  parent: "#app",\n  text: "Példa link",\n  href: "https://example.com",\n  target: "_blank",\n});`,
    codeLang: "typescript",
    render: (c) => createLink({ parent: c, text: "Példa link", href: "https://example.com", target: "_blank" }),
  },
  {
    title: "createDivider",
    description: "Vízszintes vonal elválasztáshoz.",
    code: `createDivider({ parent: "#app" });`,
    codeLang: "typescript",
    render: (c) => createDivider({ parent: c }),
  },
];

renderSections(sections);
