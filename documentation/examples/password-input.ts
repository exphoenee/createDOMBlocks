import { initDocPage, renderSections, example } from "../page-components/index";
import { tr } from "../page-components/i18n";
import { createPasswordInput } from "../../src/index";

const done = initDocPage();

const sections = [
  example(
    { title: tr("Password input"), description: tr("Jelszó input szem gombbal: a gomb a mező jobb oldalán váltogatja a jelszó megjelenítését (szem / áthúzott szem ikon)."), component: createPasswordInput },
    (parent) => createPasswordInput({ parent, id: "t6", labelText: "Jelszó:", placeholder: "****" }),
  ),
  example(
    { title: tr("Password input – szem gomb nélkül"), description: tr("A `showToggle: false` kikapcsolja a jelszó megjelenítő gombot; a `showLabel` / `hideLabel` a gomb feliratait adja.") },
    (parent) => createPasswordInput({ parent, id: "t6b", labelText: "PIN:", showToggle: false }),
  ),
];

renderSections(sections);
done();
