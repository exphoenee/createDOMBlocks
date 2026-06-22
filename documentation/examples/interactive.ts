import { initDocPage, renderSections, example } from "../page-components/index";
import { createAccordion, createTooltip } from "../../src/index";
import { createDOMElem } from "domelemjs";

const done = initDocPage();

const sections = [
  example(
    {
      title: "createAccordion \u2014 t\xf6bb nyitva (multiple: true)",
      component: createAccordion,
      description:
        "\xd6sszecsukhat\xf3 szekci\xf3k. A <code>multiple: true</code> opci\xf3val egyszerre t\xf6bb szekci\xf3 is nyitva lehet.",
    },
    (parent) =>
      createAccordion({
        parent,
        id: "accMultiple",
        multiple: true,
        items: [
          { id: "am1", title: "Els\u0151 szekci\xf3", content: { tag: "p", text: "Ez az els\u0151 szekci\xf3 tartalma. T\xf6bb is nyitva lehet egyszerre." }, open: true },
          { id: "am2", title: "M\xe1sodik szekci\xf3", content: { tag: "p", text: "Ez a m\xe1sodik szekci\xf3 tartalma." } },
          { id: "am3", title: "Harmadik szekci\xf3", content: { tag: "p", text: "Ez a harmadik szekci\xf3 tartalma." } },
        ],
      }),
  ),
  example(
    {
      title: "createAccordion \u2014 csak egy nyitva (multiple: false)",
      description:
        "Amikor a <code>multiple</code> false (alap\xe9rtelmezett), egy \xfaj szekci\xf3 kinyit\xe1sa automatikusan bez\xe1rja a t\xf6bbit.",
    },
    (parent) =>
      createAccordion({
        parent,
        id: "accSingle",
        items: [
          { id: "as1", title: "Els\u0151 szekci\xf3", content: { tag: "p", text: "Csak egy szekci\xf3 lehet nyitva egyszerre." }, open: true },
          { id: "as2", title: "M\xe1sodik szekci\xf3", content: { tag: "p", text: "Ha r\xe1kattintasz, az els\u0151 bez\xe1r\xf3dik." } },
          { id: "as3", title: "Harmadik szekci\xf3", content: { tag: "p", text: "\xc9s ford\xedtva is \xedgy műk\xf6dik." } },
        ],
      }),
  ),
  example(
    { title: "createTooltip", description: "Bubor\xe9k tooltip k\xfcl\xf6nb\xf6z\u0151 poz\xedci\xf3kkal. Vidd az egeret az elemek f\xf6l\xe9!", component: createTooltip },
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
