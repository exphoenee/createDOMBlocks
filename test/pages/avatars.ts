import { createAvatar } from "../../src/index";
import { createDOMElem } from "domelemjs";

const p1 = document.getElementById("app-avatars-name")!;
createAvatar({ parent: p1, name: "Bozzay Viktor", size: "lg" }); createDOMElem({ tag: "span", parent: p1, text: " " });
createAvatar({ parent: p1, name: "BV", size: "md" }); createDOMElem({ tag: "span", parent: p1, text: " " });
createAvatar({ parent: p1, name: "B", size: "sm" });

const p2 = document.getElementById("app-avatars-img")!;
createAvatar({ parent: p2, src: "https://i.pravatar.cc/100?img=1", size: "lg" }); createDOMElem({ tag: "span", parent: p2, text: " " });
createAvatar({ parent: p2, src: "https://i.pravatar.cc/100?img=2", size: "md" }); createDOMElem({ tag: "span", parent: p2, text: " " });
createAvatar({ parent: p2, src: "https://i.pravatar.cc/100?img=3", size: "sm" });

const p3 = document.getElementById("app-avatars-square")!;
createAvatar({ parent: p3, name: "AB", size: "lg", shape: "square" }); createDOMElem({ tag: "span", parent: p3, text: " " });
createAvatar({ parent: p3, name: "CD", size: "md", shape: "square" }); createDOMElem({ tag: "span", parent: p3, text: " " });
createAvatar({ parent: p3, name: "EF", size: "sm", shape: "square" });
