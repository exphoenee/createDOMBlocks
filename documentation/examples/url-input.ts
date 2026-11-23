import { initDocPage, renderSections, example } from "../page-components/index";
import { createUrlInput } from "../../src/index";

const done = initDocPage();

const sections = [
  example(
    { title: "Url input", description: "URL input.", component: createUrlInput },
    (parent) => createUrlInput({ parent, id: "t3", labelText: "URL:", value: "https://example.com" }),
  ),
];

renderSections(sections);
done();
