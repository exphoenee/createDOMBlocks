import { initDocPage, renderSections, example } from "../page-components/index";
import { createButton, createToast } from "../../src/index";

const done = initDocPage();

const sections = [
  example(
    { title: "createToast", description: "Ideiglenes értesítés.", component: createToast },
    (parent) => {
      createButton({ parent, id: "fb-toast-btn", text: "Toast megjelenítése",
        click: () => createToast({ parent: document.body, id: "fb-toast", message: "Értesítés!", type: "success", duration: 3000, width: "300px" }) });
    },
  ),
];

renderSections(sections);
done();
