import { initDocPage, renderSections, example } from "../page-components/index";
import { createForm } from "../../src/index";

const done = initDocPage();

const sections = [
  example(
    { title: "createForm", description: "Általáns form tömbbe szedett input konfigurációkkal.", component: createForm },
    (parent) => createForm({
      parent, id: "demoForm", action: "/api/submit", method: "POST",
      inputs: [
        { type: "text", id: "name", labelText: "Név:" },
        { type: "email", id: "email", labelText: "Email:" },
        { type: "submit", id: "submit", value: "Küldés" },
      ],
      onSubmit: () => console.log("Submitted!"),
    }),
  ),
];

renderSections(sections);
done();
