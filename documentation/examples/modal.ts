import { initDocPage, renderSections, example } from "../page-components/index";
import { createModal, openModal, createButton } from "../../src/index";

const done = initDocPage();

const sections = [
  example(
    { title: "createModal", description: "Modál dialógus ablak, ami portálként a body végére kerül." },
    (parent) => {
      const modal = createModal(
        { modalTitle: "Példa Modal", body: { tag: "p", text: "Ez egy modal tartalma." } },
        { okAction: () => console.log("OK"), cancelAction: () => console.log("Megse") },
        { id: "docModal" }
      );
      createButton({ parent, id: "modal-open-btn", text: "Modal megnyitása", click: () => openModal("docModal") });
    },
  ),
];

renderSections(sections);
done();
