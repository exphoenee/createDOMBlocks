import { initDocPage, renderSections, example } from "../page-components/index";
import { createTooltip } from "../../src/index";
import { createDOMElem } from "domelemjs";

const done = initDocPage();

const sections = [
  example(
    { title: "Tooltip", description: "Bubor\xe9k tooltip k\xfcl\xf6nb\xf6z\u0151 poz\xedci\xf3kkal. Vidd az egeret az elemek f\xf6l\xe9!", component: createTooltip },
    (parent) => {
      createDOMElem({
        tag: "p",
        text: "Vidd az egeret a gombok f\xf6l\xe9 a tooltip megjelen\xedt\xe9s\xe9hez:",
        style: { marginBottom: "1rem", color: "var(--text-light)", fontSize: "0.875rem" },
      });
      createTooltip({ parent, id: "int-tt1", text: "Ez egy tooltip!", position: "top" });
      createDOMElem({ tag: "br", parent });
      createTooltip({ parent, id: "int-tt2", text: "Als\xf3 tooltip", position: "bottom" });
      createDOMElem({ tag: "br", parent });
      createTooltip({ parent, id: "int-tt3", text: "Bal tooltip", position: "left" });
      createDOMElem({ tag: "br", parent });
      createTooltip({ parent, id: "int-tt4", text: "Jobb tooltip", position: "right" });
    },
  ),
];

renderSections(sections);
done();
