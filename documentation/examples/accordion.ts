import { initDocPage, renderSections, example } from "../page-components/index";
import { tr } from "../page-components/i18n";
import { createAccordion } from "../../src/index";

const done = initDocPage();

const sections = [
  example(
    {
      title: tr("Accordion \u2014 t\xf6bb nyitva (multiple: true)"),
      component: createAccordion,
      description:
        tr("\xd6sszecsukhat\xf3 szekci\xf3k. A <code>multiple: true</code> opci\xf3val egyszerre t\xf6bb szekci\xf3 is nyitva lehet."),
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
      title: tr("Accordion \u2014 csak egy nyitva (multiple: false)"),
      description:
        tr("Amikor a <code>multiple</code> false (alap\xe9rtelmezett), egy \xfaj szekci\xf3 kinyit\xe1sa automatikusan bez\xe1rja a t\xf6bbit."),
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
];

renderSections(sections);
done();
