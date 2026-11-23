import { initDocPage, renderSections, example } from "../page-components/index";
import { tr } from "../page-components/i18n";
import { createBadge } from "../../src/index";
import { createDOMElem } from "domelemjs";

const done = initDocPage();

const sections = [
  example(
    { title: tr("Badge"), description: tr("Állapot jelző pici szöveggel."), component: createBadge },
    (parent) => {
      createBadge({ parent, id: "fb-b1", text: "Új", type: "info" }); createDOMElem({ tag: "span", parent, text: " " });
      createBadge({ parent, id: "fb-b2", text: "Siker", type: "success" }); createDOMElem({ tag: "span", parent, text: " " });
      createBadge({ parent, id: "fb-b3", text: "Hiba", type: "error" });
    },
  ),
];

renderSections(sections);
done();
