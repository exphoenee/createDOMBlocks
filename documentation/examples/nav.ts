import { initDocPage, renderSections, example } from "../page-components/index";
import { createNav } from "../../src/index";

const done = initDocPage();

const sections = [
  example(
    { title: "createNav", description: "Navigációs sáv menüpontokkal és almenüvel.", component: createNav },
    (parent) => createNav({ parent, id: "n1", items: [
      { text: "Főoldal", href: "#", active: true },
      { text: "Rólunk", href: "#" },
      { text: "Szolgáltatások", href: "#", children: [{ text: "Webfejlesztés", href: "#" }] },
      { text: "Kapcsolat", href: "#" },
    ]}),
  ),
];

renderSections(sections);
done();
