import { initDocPage, renderSections, example } from "../page-components/index";
import { createAvatar } from "../../src/index";
import { createDOMElem } from "domelemjs";

const done = initDocPage();

const sections = [
  example(
    { title: "createAvatar (n\xe9vvel)", description: "Avatar monogrammal k\xfcl\xf6nb\xf6z\u0151 m\xe9retben." },
    (parent) => {
      createAvatar({ parent, id: "ava-a1", name: "Viktor Bozzay", size: "lg" }); createDOMElem({ tag: "span", parent, text: " " });
      createAvatar({ parent, id: "ava-a2", name: "VB", size: "md" }); createDOMElem({ tag: "span", parent, text: " " });
      createAvatar({ parent, id: "ava-a3", name: "V", size: "sm" });
    },
  ),
  example(
    { title: "createAvatar (k\xe9ppel)", description: "Avatar k\xe9pf\xe1jlb\xf3l." },
    (parent) => {
      createAvatar({ parent, id: "ava-a4", src: "https://i.pravatar.cc/100?img=1", size: "lg" }); createDOMElem({ tag: "span", parent, text: " " });
      createAvatar({ parent, id: "ava-a5", src: "https://i.pravatar.cc/100?img=2", size: "md" }); createDOMElem({ tag: "span", parent, text: " " });
      createAvatar({ parent, id: "ava-a6", src: "https://i.pravatar.cc/100?img=3", size: "sm" });
    },
  ),
  example(
    { title: "createAvatar (n\xe9gyzet)", description: "Avatar n\xe9gyzet alakzattal." },
    (parent) => {
      createAvatar({ parent, id: "ava-a7", name: "AB", size: "lg", shape: "square" }); createDOMElem({ tag: "span", parent, text: " " });
      createAvatar({ parent, id: "ava-a8", name: "CD", size: "md", shape: "square" }); createDOMElem({ tag: "span", parent, text: " " });
      createAvatar({ parent, id: "ava-a9", name: "EF", size: "sm", shape: "square" });
    },
  ),
];

renderSections(sections);
done();
