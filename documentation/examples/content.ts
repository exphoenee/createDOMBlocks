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
    code: `createParagraph({\n  parent: "#app",\n  id: "para1",\n  text: "Ez egy bekezdés szöveg.",\n});`,
    codeLang: "typescript",
    render: (c) => createParagraph({ parent: c, id: "cont-p1", text: "Ez egy bekezdés szöveg." }),
  },
  {
    title: "createTitle",
    description: "Címsor h1-h6 szintekkel.",
    code: `for (let i = 1; i <= 3; i++) {\n  createTitle({ parent: "#app", id: \`title\${i}\`, text: \`Címsor \${i}\` }, i);\n}`,
    codeLang: "typescript",
    render: (c) => { for (let i = 1; i <= 3; i++) createTitle({ parent: c, id: `cont-title${i}`, text: `Címsor ${i}` }, i); },
  },
  {
    title: "createBlockquote",
    description: "Idézet szerzővel.",
    code: `createBlockquote({\n  parent: "#app",\n  id: "quote1",\n  text: "A kódolás a jövő nyelve.",\n  author: "Bozzay Viktor",\n});`,
    codeLang: "typescript",
    render: (c) => createBlockquote({ parent: c, id: "cont-bq1", text: "A kódolás a jövő nyelve.", author: "Bozzay Viktor" }),
  },
  {
    title: "createCodeBlock",
    description: "Kódblokk nyelv megadásával és syntax highlighting-gel.",
    code: `createCodeBlock({\n  parent: "#app",\n  id: "code1",\n  language: "typescript",\n  code: 'const x: number = 42;\\nconsole.log(x);',\n});`,
    codeLang: "typescript",
    render: (c) => createCodeBlock({ parent: c, id: "cont-cb1", language: "typescript", code: 'const x: number = 42;\nconsole.log(x);' }),
  },
  {
    title: "createImage",
    description: "Kép captionnal.",
    code: `createImage({\n  parent: "#app",\n  id: "img1",\n  src: "https://picsum.photos/400/200",\n  alt: "Példa kép",\n  caption: "Példa caption",\n});`,
    codeLang: "typescript",
    render: (c) => createImage({ parent: c, id: "cont-img1", src: "https://picsum.photos/400/200", alt: "Példa kép", caption: "Példa caption" }),
  },
  {
    title: "createLink",
    description: "Stilizált hivatkozás.",
    code: `createLink({\n  parent: "#app",\n  id: "link1",\n  text: "Példa link",\n  href: "https://example.com",\n  target: "_blank",\n});`,
    codeLang: "typescript",
    render: (c) => createLink({ parent: c, id: "cont-link1", text: "Példa link", href: "https://example.com", target: "_blank" }),
  },
  {
    title: "createDivider",
    description: "Vízszintes vonal elválasztáshoz.",
    code: `createDivider({ parent: "#app", id: "divider1" });`,
    codeLang: "typescript",
    render: (c) => createDivider({ parent: c, id: "cont-div1" }),
  },
];

renderSections(sections);
done();
