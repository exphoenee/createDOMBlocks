import { initDocPage, renderSections, example } from "../page-components/index";
import { createPasswordInput } from "../../src/index";

const done = initDocPage();

const sections = [
  example(
    { title: "Password input", description: "Jelszó input szem gombbal: a gomb a mező jobb oldalán váltogatja a jelszó megjelenítését (szem / áthúzott szem ikon).", component: createPasswordInput },
    (parent) => createPasswordInput({ parent, id: "t6", labelText: "Jelszó:", placeholder: "****" }),
  ),
  example(
    { title: "Password input – szem gomb nélkül", description: "A `showToggle: false` kikapcsolja a jelszó megjelenítő gombot; a `showLabel` / `hideLabel` a gomb feliratait adja." },
    (parent) => createPasswordInput({ parent, id: "t6b", labelText: "PIN:", showToggle: false }),
  ),
];

renderSections(sections);
done();
