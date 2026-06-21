import { initDocPage, renderSections } from "../page-components/index";
import { createAvatar } from "../../src/index";
import { createDOMElem } from "domelemjs";
import type { DocSection } from "../page-components/index";

initDocPage();

const sections: DocSection[] = [
  {
    title: "createAvatar (névvel)",
    description: "Avatar monogrammal különböző meretben.",
    code: `createAvatar({ parent: "#app", name: "Viktor Bozzay", size: "lg" });\ncreateAvatar({ parent: "#app", name: "VB", size: "md" });\ncreateAvatar({ parent: "#app", name: "V", size: "sm" });`,
    codeLang: "typescript",
    render: (c) => {
      createAvatar({ parent: c, name: "Viktor Bozzay", size: "lg" }); createDOMElem({ tag: "span", parent: c, text: " " });
      createAvatar({ parent: c, name: "VB", size: "md" }); createDOMElem({ tag: "span", parent: c, text: " " });
      createAvatar({ parent: c, name: "V", size: "sm" });
    },
  },
  {
    title: "createAvatar (képpel)",
    description: "Avatar képfájlból.",
    code: `createAvatar({ parent: "#app", src: "https://i.pravatar.cc/100?img=1", size: "lg" });\ncreateAvatar({ parent: "#app", src: "https://i.pravatar.cc/100?img=2", size: "md" });`,
    codeLang: "typescript",
    render: (c) => {
      createAvatar({ parent: c, src: "https://i.pravatar.cc/100?img=1", size: "lg" }); createDOMElem({ tag: "span", parent: c, text: " " });
      createAvatar({ parent: c, src: "https://i.pravatar.cc/100?img=2", size: "md" }); createDOMElem({ tag: "span", parent: c, text: " " });
      createAvatar({ parent: c, src: "https://i.pravatar.cc/100?img=3", size: "sm" });
    },
  },
  {
    title: "createAvatar (négyzet)",
    description: "Avatar négyzet alakzattal.",
    code: `createAvatar({ parent: "#app", name: "AB", size: "lg", shape: "square" });\ncreateAvatar({ parent: "#app", name: "CD", size: "md", shape: "square" });`,
    codeLang: "typescript",
    render: (c) => {
      createAvatar({ parent: c, name: "AB", size: "lg", shape: "square" }); createDOMElem({ tag: "span", parent: c, text: " " });
      createAvatar({ parent: c, name: "CD", size: "md", shape: "square" }); createDOMElem({ tag: "span", parent: c, text: " " });
      createAvatar({ parent: c, name: "EF", size: "sm", shape: "square" });
    },
  },
];

renderSections(sections);
