import { initDocPage, renderSections, example } from "../page-components/index";
import { tr } from "../page-components/i18n";
import { createBreadcrumb } from "../../src/index";

const done = initDocPage();

const sections = [
  example(
    { title: tr("Breadcrumb"), description: tr("Morzsa menü a navigációs út vonatkozásában."), component: createBreadcrumb },
    (parent) => createBreadcrumb({ parent, id: "n2", items: [
      { text: "Főoldal", href: "#" },
      { text: "Termék", href: "#" },
      { text: "Laptop" },
    ]}),
  ),
];

renderSections(sections);
done();
