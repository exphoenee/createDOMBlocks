import { initDocPage, renderSections } from "../page-components/index";
import { createAvatar } from "../../src/index";
import { createDOMElem } from "domelemjs";
import type { DocSection } from "../page-components/index";

const done = initDocPage();

const sections: DocSection[] = [
  {
    title: "createAvatar (n\xe9vvel)",
    description: "Avatar monogrammal k\xfcl\xf6nb\xf6z\u0151 m\xe9retben.",
    code: `createAvatar({ parent: "#app", id: "av1", name: "Viktor Bozzay", size: "lg" });\ncreateDOMElem({ tag: "span", parent: "#app", text: " " });\ncreateAvatar({ parent: "#app", id: "av2", name: "VB", size: "md" });\ncreateDOMElem({ tag: "span", parent: "#app", text: " " });\ncreateAvatar({ parent: "#app", id: "av3", name: "V", size: "sm" });`,
    codeLang: "typescript",
    render: (c) => {
      createAvatar({ parent: c, id: "ava-a1", name: "Viktor Bozzay", size: "lg" }); createDOMElem({ tag: "span", parent: c, text: " " });
      createAvatar({ parent: c, id: "ava-a2", name: "VB", size: "md" }); createDOMElem({ tag: "span", parent: c, text: " " });
      createAvatar({ parent: c, id: "ava-a3", name: "V", size: "sm" });
    },
  },
  {
    title: "createAvatar (k\xe9ppel)",
    description: "Avatar k\xe9pf\xe1jlb\xf3l.",
    code: `createAvatar({ parent: "#app", id: "av4", src: "https://i.pravatar.cc/100?img=1", size: "lg" });\ncreateDOMElem({ tag: "span", parent: "#app", text: " " });\ncreateAvatar({ parent: "#app", id: "av5", src: "https://i.pravatar.cc/100?img=2", size: "md" });\ncreateDOMElem({ tag: "span", parent: "#app", text: " " });\ncreateAvatar({ parent: "#app", id: "av6", src: "https://i.pravatar.cc/100?img=3", size: "sm" });`,
    codeLang: "typescript",
    render: (c) => {
      createAvatar({ parent: c, id: "ava-a4", src: "https://i.pravatar.cc/100?img=1", size: "lg" }); createDOMElem({ tag: "span", parent: c, text: " " });
      createAvatar({ parent: c, id: "ava-a5", src: "https://i.pravatar.cc/100?img=2", size: "md" }); createDOMElem({ tag: "span", parent: c, text: " " });
      createAvatar({ parent: c, id: "ava-a6", src: "https://i.pravatar.cc/100?img=3", size: "sm" });
    },
  },
  {
    title: "createAvatar (n\xe9gyzet)",
    description: "Avatar n\xe9gyzet alakzattal.",
    code: `createAvatar({ parent: "#app", id: "av7", name: "AB", size: "lg", shape: "square" });\ncreateDOMElem({ tag: "span", parent: "#app", text: " " });\ncreateAvatar({ parent: "#app", id: "av8", name: "CD", size: "md", shape: "square" });\ncreateDOMElem({ tag: "span", parent: "#app", text: " " });\ncreateAvatar({ parent: "#app", id: "av9", name: "EF", size: "sm", shape: "square" });`,
    codeLang: "typescript",
    render: (c) => {
      createAvatar({ parent: c, id: "ava-a7", name: "AB", size: "lg", shape: "square" }); createDOMElem({ tag: "span", parent: c, text: " " });
      createAvatar({ parent: c, id: "ava-a8", name: "CD", size: "md", shape: "square" }); createDOMElem({ tag: "span", parent: c, text: " " });
      createAvatar({ parent: c, id: "ava-a9", name: "EF", size: "sm", shape: "square" });
    },
  },
];

renderSections(sections);
done();
