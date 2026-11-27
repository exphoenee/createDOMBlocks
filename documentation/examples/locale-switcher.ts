import { initDocPage, renderSections, example } from "../page-components/index";
import { tr } from "../page-components/i18n";
import { createLocaleSwitcher, createParagraph } from "../../src/index";

const done = initDocPage();

// A példák nem váltják át a dokumentáció nyelvét (updateLibrary: false); a saját oldaladon ezt el kell hagyni.
const locales = [
  { code: "hu", label: "Magyar" },
  { code: "en", label: "English" },
  { code: "de", label: "Deutsch" },
  { code: "fr", label: "Français" },
  { code: "it", label: "Italiano" },
  { code: "es", label: "Español" },
];

const sections = [
  example(
    {
      title: tr("Gombsor"),
      description: tr("A rövid kód látszik, a teljes név a tooltipben és a képernyőolvasónak. Váltáskor a könyvtár setLocale-je fut, utána az onChange."),
      component: createLocaleSwitcher,
    },
    (parent) => {
      const out = createParagraph({ parent, id: "demo-locale-out-1", text: "hu" });
      return createLocaleSwitcher({ parent, id: "demo-locale-1", locales, value: "hu", mode: "buttons", updateLibrary: false, onChange: (code) => (out.textContent = code) });
    },
  ),
  example(
    { title: tr("Legördülő"), description: tr("Nyilakkal léptethető, Esc-re és kívülre kattintásra bezárul.") },
    (parent) => {
      const out = createParagraph({ parent, id: "demo-locale-out-2", text: "hu" });
      return createLocaleSwitcher({ parent, id: "demo-locale-2", locales, value: "hu", mode: "dropdown", updateLibrary: false, onChange: (code) => (out.textContent = code) });
    },
  ),
  example(
    { title: tr("Automatikus alak"), description: tr("768 px alatt legördülő, fölötte gombsor; méretezd át az ablakot.") },
    (parent) => createLocaleSwitcher({ parent, id: "demo-locale-3", locales, value: "en", mode: "auto", updateLibrary: false }),
  ),
];

renderSections(sections);
done();
