import { initDocPage, renderSections, example } from "../page-components/index";
import { createBreadcrumb } from "../../src/index";

const done = initDocPage();

const sections = [
  example(
    { title: "createBreadcrumb", description: "Morzsa menü a navigációs út vonatkozásában.", component: createBreadcrumb },
    (parent) => createBreadcrumb({ parent, id: "n2", items: [
      { text: "Főoldal", href: "#" },
      { text: "Termék", href: "#" },
      { text: "Laptop" },
    ]}),
  ),
];

renderSections(sections);
done();
