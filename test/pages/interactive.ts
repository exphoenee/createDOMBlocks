import { createAccordion, createTooltip } from "../../src/index";

createAccordion({ parent: "#app-acc", id: "accordion1", items: [
  { id: "acc1", title: "Els\u00F3 szekcio", content: { tag: "p", text: "Els\u00F3 szekcio tartalma." }, open: true },
  { id: "acc2", title: "Masodik szekcio", content: { tag: "p", text: "Masodik szekcio tartalma." } },
  { id: "acc3", title: "Harmadik szekcio", content: { tag: "p", text: "Harmadik szekcio tartalma." } },
]});

createTooltip({ parent: "#tooltip-top", text: "Felso tooltip!", position: "top" });
createTooltip({ parent: "#tooltip-bottom", text: "Also tooltip", position: "bottom" });
