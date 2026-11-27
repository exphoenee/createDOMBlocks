import { initDocPage, renderSections, example } from "../page-components/index";
import { tr } from "../page-components/i18n";
import { createThemeToggle, createCodeBlock, themeBootstrapScript } from "../../src/index";

const done = initDocPage();

const sections = [
  example(
    { title: tr("Alap témaváltó"), description: tr("Világos és sötét között vált, a következő téma ikonját mutatja. (A példák nem mentenek, de az egész oldal témáját váltják.)"), component: createThemeToggle },
    (parent) => createThemeToggle({ parent, id: "demo-theme-1", storageKey: null }),
  ),
  example(
    { title: tr("Felirattal és saját témával"), description: tr("Három téma körben, látható felirattal és saját ikonnal.") },
    (parent) =>
      createThemeToggle({
        parent,
        id: "demo-theme-2",
        storageKey: null,
        showLabel: true,
        themes: ["light", "dark", "contrast"],
        labels: { contrast: "Kontrasztos" },
        icons: { contrast: "◐" },
      }),
  ),
  example(
    { title: tr("Villogás elleni előbetöltő"), description: tr("A themeBootstrapScript() kimenete a dokumentum fejébe (head) kerül: a téma már a kirajzolás előtt beáll, a gomb ugyanebből indul.") },
    (parent) =>
      createCodeBlock({
        parent,
        id: "demo-theme-3",
        language: "html",
        code: `<head>\n  <script>${themeBootstrapScript({ storageKey: "my-theme" })}</script>\n</head>`,
      }),
  ),
];

renderSections(sections);
done();
