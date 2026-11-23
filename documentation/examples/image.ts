import { initDocPage, renderSections, example } from "../page-components/index";
import { createImage } from "../../src/index";

const done = initDocPage();

const sections = [
  example(
    { title: "createImage", description: "Kép captionnal.", component: createImage },
    (parent) => createImage({ parent, id: "cont-img1", src: "https://picsum.photos/400/200", alt: "Példa kép", caption: "Példa caption" }),
  ),
  example(
    { title: "createImage – betöltés és hiba", description: "A kép maga tölt: betöltés alatt spinner (cserélhető), hibánál újrapróbálás gombos fallback.", component: createImage },
    (parent) => {
      createImage({ parent, id: "cont-img2", src: "https://picsum.photos/id/237/400/200", alt: "Saját spinnerrel", width: 400, height: 200, spinner: () => ({ tag: "span", text: "⏳ Töltés…" }) });
      return createImage({ parent, id: "cont-img3", src: "https://invalid.example/nincs.png", alt: "Hibás kép", width: 400, height: 200, retries: 1 });
    },
  ),
  example(
    { title: "createImage – lazy és fetch", description: "`lazy`: a betöltés csak a látótérbe kerüléskor indul. `strategy: \"fetch\"`: fetch()-csel tölt (HTTP hibák, `timeout`), `onLoad` / `onError` visszahívásokkal.", component: createImage },
    (parent) => createImage({ parent, id: "cont-img4", src: "https://picsum.photos/id/10/400/200", alt: "Lazy kép", width: 400, height: 200, lazy: true, strategy: "fetch", timeout: 8000, onLoad: () => console.log("kép betöltve") }),
  ),
];

renderSections(sections);
done();
