import { initDocPage, renderSections, example } from "../page-components/index";
import { createLink } from "../../src/index";

const done = initDocPage();

const sections = [
  example(
    { title: "createLink", description: "Stilizált hivatkozás.", component: createLink },
    (parent) => createLink({ parent, id: "cont-link1", text: "Példa link", href: "https://example.com", target: "_blank" }),
  ),
];

renderSections(sections);
done();
