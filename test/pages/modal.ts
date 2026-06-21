import { createModal, createButton } from "../../src/index";

const modal = createModal(
  { modalTitle: "Pelda Modal", body: { tag: "p", text: "Ez egy modal tartalma." } },
  { okAction: () => console.log("OK"), cancelAction: () => console.log("Megse"), closeAction: () => console.log("Bezarva") },
  { id: "demoModal" }
);

createButton({ parent: "#app-modal", text: "Modal megnyitasa",
  click: () => (modal as any).__openModal() });
