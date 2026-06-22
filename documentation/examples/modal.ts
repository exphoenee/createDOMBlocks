import { initDocPage, renderSections } from "../page-components/index";
import { createModal, openModal, createButton } from "../../src/index";
import type { DocSection } from "../page-components/index";

const done = initDocPage();

const sections: DocSection[] = [
  {
    title: "createModal",
    description: "Modál dialógus ablak, ami portálként a body végére kerül.",
    code: `const modal = createModal(\n  { modalTitle: "Példa Modal", body: { tag: "p", text: "Tartalom" } },\n  { okAction: () => console.log("OK") },\n  { id: "demoModal" }\n);\n\ncreateButton({\n  parent: "#app",\n  id: "modalBtn",\n  text: "Modal megnyitása",\n  click: () => openModal("demoModal"),\n});`,
    codeLang: "typescript",
    render: (c) => {
      const modal = createModal(
        { modalTitle: "Példa Modal", body: { tag: "p", text: "Ez egy modal tartalma." } },
        { okAction: () => console.log("OK"), cancelAction: () => console.log("Megse") },
        { id: "docModal" }
      );
      createButton({ parent: c, id: "modal-open-btn", text: "Modal megnyitása", click: () => openModal("docModal") });
    },
  },
];

renderSections(sections);
done();
