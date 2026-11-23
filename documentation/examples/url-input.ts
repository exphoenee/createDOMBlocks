import { initDocPage, renderSections, example } from "../page-components/index";
import { tr } from "../page-components/i18n";
import { createUrlInput } from "../../src/index";

const done = initDocPage();

const sections = [
  example(
    { title: tr("Url input"), description: tr("URL input."), component: createUrlInput },
    (parent) => createUrlInput({ parent, id: "t3", labelText: "URL:", value: "https://example.com" }),
  ),
];

renderSections(sections);
done();
