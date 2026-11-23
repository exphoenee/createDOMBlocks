import { initDocPage, renderSections, example } from "../page-components/index";
import { createVideo } from "../../src/index";

const done = initDocPage();

const sections = [
  example(
    { title: "Video", description: "Videó lejátszó vezérlőkkel és felirattal. A forrás mp4, webm vagy más böngésző által támogatott formátum lehet; betöltés alatt spinner látszik.", component: createVideo },
    (parent) => createVideo({
      parent,
      id: "video-basic",
      src: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
      width: 480,
      height: 270,
      caption: "Példa videó (mp4)",
    }),
  ),
  example(
    { title: "Video – több forrás", description: "A `src` tömbje több formátumot ad meg (webm, mp4); a böngésző az első lejátszhatót használja. A `type` elhagyható, ilyenkor a kiterjesztésből következtetjük." },
    (parent) => createVideo({
      parent,
      id: "video-sources",
      src: [
        { src: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm", type: "video/webm" },
        { src: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4" },
      ],
      width: 480,
      height: 270,
      loop: true,
      muted: true,
    }),
  ),
  example(
    { title: "Video – hiba", description: "Ha a videó nem tölthető be, a hibaüzenet és az Újra gomb pontosan akkora keretben jelenik meg, mint a videó." },
    (parent) => createVideo({
      parent,
      id: "video-error",
      src: "https://invalid.example/nincs.mp4",
      width: 480,
      height: 270,
      timeout: 8000,
    }),
  ),
  example(
    { title: "Video – lazy és előnézeti kép", description: "A `lazy` csak a látótérbe kerüléskor indítja a betöltést, a `poster` az első képkockáig mutat egy képet, a `preload: \"none\"` nem tölt semmit lejátszásig." },
    (parent) => createVideo({
      parent,
      id: "video-lazy",
      src: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
      poster: "https://picsum.photos/id/10/480/270",
      width: 480,
      height: 270,
      lazy: true,
      preload: "none",
      onLoad: () => console.log("videó kész"),
    }),
  ),
];

renderSections(sections);
done();
