import { initDocPage, renderSections, example } from "../page-components/index";
import { tr } from "../page-components/i18n";
import { createSpinner } from "../../src/index";
import { createDOMElem } from "domelemjs";

const done = initDocPage();

const sections = [
  example(
    { title: tr("Spinner"), description: tr("Töltés indikátor meretre váltással."), component: createSpinner },
    (parent) => {
      createSpinner({ parent, id: "fb-s1", size: "sm" }); createDOMElem({ tag: "span", parent, text: "  " });
      createSpinner({ parent, id: "fb-s2", size: "md" }); createDOMElem({ tag: "span", parent, text: "  " });
      createSpinner({ parent, id: "fb-s3", size: "lg" });
    },
  ),
];

renderSections(sections);
done();
