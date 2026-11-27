import { initDocPage, renderSections, example } from "../page-components/index";
import { tr } from "../page-components/i18n";
import { createForm } from "../../src/index";

const done = initDocPage();

const sections = [
  example(
    { title: tr("Form"), description: tr("Általáns form tömbbe szedett input konfigurációkkal."), component: createForm },
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
