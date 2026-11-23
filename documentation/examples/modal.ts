import { initDocPage, renderSections, example } from "../page-components/index";
import { createModal, openModal, createButton } from "../../src/index";

const done = initDocPage();

const sections = [
  example(
    { title: "Modal", description: "Modál dialógus ablak, ami portálként a body végére kerül.", component: createModal },
    (parent) => {
      const modal = createModal(
        { modalTitle: "Példa Modal", body: { tag: "p", text: "Ez egy modal tartalma." } },
        { okAction: () => console.log("OK"), cancelAction: () => console.log("Megse") },
        { id: "docModal" }
      );
      createButton({ parent, id: "modal-open-btn", text: "Modal megnyitása", click: () => openModal("docModal") });
    },
  ),
  example(
    { title: "Modal – szélesség", description: "A `width` prop (CSS érték vagy szám pixelben) állítja a modál szélességét; a `maxWidth` korlátozza (alapból 90vw).", component: createModal },
    (parent) => {
      createModal(
        { modalTitle: "Széles modal", body: { tag: "p", text: "Ez a modal 700px széles (keskeny képernyőn 90vw-re szűkül)." } },
        {},
        { id: "docModalWide", width: 700 }
      );
      createModal(
        { modalTitle: "Keskeny modal", body: { tag: "p", text: "Ez a modal 20rem széles." } },
        {},
        { id: "docModalNarrow", width: "20rem" }
      );
      createButton({ parent, id: "modal-wide-btn", text: "Széles modal", click: () => openModal("docModalWide") });
      createButton({ parent, id: "modal-narrow-btn", text: "Keskeny modal", click: () => openModal("docModalNarrow") });
    },
  ),
];

renderSections(sections);
done();
