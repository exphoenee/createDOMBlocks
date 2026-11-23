import { initDocPage, renderSections, example } from "../page-components/index";
import { createDOMElem } from "domelemjs";
import { createTabs } from "../../src/index";

const done = initDocPage();

const sections = [
  example(
    { title: "createTabs", description: "Lapozható tabok külön tartalommal.", component: createTabs },
    (parent) => createTabs({ parent, id: "n3", tabs: [
      { id: "t1", label: "Beállítások", content: { tag: "p", text: "Beállítások tartalma" } },
      { id: "t2", label: "Profil", content: { tag: "p", text: "Profil tartalma" } },
      { id: "t3", label: "Értesítések", content: { tag: "p", text: "Értesítések tartalma" } },
    ]}),
  ),
  example(
    { title: "createTabs – billentyűzet, aktív tab, onChange", description: "WAI-ARIA tabs: nyilak (körbeér), Home / End, a fókusz aktivál. `activeTab`-bal megadható a kezdő tab, `onChange` az új tab azonosítóját kapja.", component: createTabs },
    (parent) => {
      const status = createDOMElem({ tag: "p", text: "Aktív tab: t2", style: { marginTop: "0.5rem" } });
      const tabs = createTabs({ parent, id: "n4", ariaLabel: "Fiók beállításai", activeTab: "t2", onChange: (id) => { status.textContent = `Aktív tab: ${id}`; }, tabs: [
        { id: "t1", label: "Általános", content: { tag: "p", text: "Általános beállítások" } },
        { id: "t2", label: "Biztonság", content: [{ tag: "p", text: "Jelszó és kétlépcsős belépés" }, { tag: "p", text: "Próbáld a ← → Home End billentyűket" }] },
        { id: "t3", label: "Számlázás", content: { tag: "p", text: "Számlázási adatok" } },
      ]});
      parent.appendChild(status);
      return tabs;
    },
  ),
];

renderSections(sections);
done();
