import { initDocPage, renderSections } from "../page-components/index";
import { createModal, createButton } from "../../src/index";
import type { DocSection } from "../page-components/index";

const done = initDocPage();

const sections: DocSection[] = [
  {
    title: "createModal",
    description: "Modál dialógus ablak, ami portálként a body végére kerül.",
    code: `const modal = createModal(\n  { modalTitle: "Példa Modal", body: { tag: "p", text: "Tartalom" } },\n  { okAction: () => console.log("OK") },\n  { id: "demoModal" }\n);\n\ncreateButton({\n  parent: "#app",\n  text: "Modal megnyitása",\n  click: () => modal.__openModal(),\n});`,
    codeLang: "typescript",
    render: (c) => {
      const modal = createModal(
        { modalTitle: "Példa Modal", body: { tag: "p", text: "Ez egy modal tartalma." } },
        { okAction: () => console.log("OK"), cancelAction: () => console.log("Megse") },
        { id: "docModal" }
      );
      createButton({ parent: c, text: "Modal megnyitása", click: () => (modal as any).__openModal() });
    },
  },
];

renderSections(sections);
