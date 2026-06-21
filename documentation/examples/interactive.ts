import { initDocPage, renderSections } from "../page-components/index";
import { createAccordion, createTooltip } from "../../src/index";
import type { DocSection } from "../page-components/index";

initDocPage();

const sections: DocSection[] = [
  {
    title: "createAccordion",
    description: "Összecsukható szekciók címekkel és tartalommal.",
    code: `createAccordion({\n  parent: "#app",\n  id: "accordion1",\n  items: [\n    { id: "acc1", title: "Első", content: { tag: "p", text: "Tartalom 1" }, open: true },\n    { id: "acc2", title: "Második", content: { tag: "p", text: "Tartalom 2" } },\n    { id: "acc3", title: "Harmadik", content: { tag: "p", text: "Tartalom 3" } },\n  ],\n});`,
    codeLang: "typescript",
    render: (c) => createAccordion({ parent: c, id: "a1", items: [
      { id: "a1", title: "Első", content: { tag: "p", text: "Első szekció tartalma." }, open: true },
      { id: "a2", title: "Második", content: { tag: "p", text: "Második szekció tartalma." } },
      { id: "a3", title: "Harmadik", content: { tag: "p", text: "Harmadik szekció tartalma." } },
    ]}),
  },
  {
    title: "createTooltip",
    description: "Buborék sógó pozíciónalással.",
    code: `createTooltip({ parent: "#app", text: "Felső tooltip!", position: "top" });\ncreateTooltip({ parent: "#app", text: "Alsó tooltip", position: "bottom" });`,
    codeLang: "typescript",
    render: (c) => {
      createTooltip({ parent: c, text: "Felső tooltip!", position: "top" });
      createDOMElem({ tag: "span", parent: c, text: "    " });
      createTooltip({ parent: c, text: "Alsó tooltip", position: "bottom" });
    },
  },
];

import { createDOMElem } from "domelemjs";

renderSections(sections);
