import { initDocPage, renderSections, example } from "../page-components/index";
import { createMusicPlayer } from "../../src/index";

const done = initDocPage();

const sections = [
  example(
    { title: "Music player", description: "Zenelejátszó lejátszási listával: lejátszás / szünet, előző / következő, léptethető időcsík, hangerő és ismétlés (ki / lista / szám).", component: createMusicPlayer },
    (parent) => createMusicPlayer({
      parent,
      id: "music-playlist",
      tracks: [
        { src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", title: "SoundHelix Song 1", artist: "T. Schürger", cover: "https://picsum.photos/id/1025/200/200" },
        { src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3", title: "SoundHelix Song 2", artist: "T. Schürger", cover: "https://picsum.photos/id/1011/200/200" },
        { src: "https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3", title: "T-Rex roar", artist: "MDN" },
      ],
      loop: "all",
      volume: 0.8,
    }),
  ),
  example(
    { title: "Music player – egy szám", description: "Egyetlen számnál nincs lejátszási lista és előző / következő gomb.", component: createMusicPlayer },
    (parent) => createMusicPlayer({
      parent,
      id: "music-single",
      tracks: [{ src: "https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3", title: "T-Rex roar", artist: "MDN" }],
      showVolume: false,
    }),
  ),
  example(
    { title: "Music player – visszahívások és hiba", description: "Az `onPlay`, `onPause`, `onTrackChange` és `onStateChange` követi az eseményeket; ha a szám nem játszható le, a lejátszó hibaállapotba kerül.", component: createMusicPlayer },
    (parent) => {
      const log = document.createElement("p");
      log.textContent = "Állapot: paused";
      const player = createMusicPlayer({
        parent,
        id: "music-events",
        tracks: [
          { src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", title: "Működő szám", artist: "SoundHelix" },
          { src: "https://invalid.example/nincs.mp3", title: "Hibás szám", artist: "—" },
        ],
        onStateChange: (s) => { log.textContent = `Állapot: ${s}`; },
        onTrackChange: (t, i) => console.log("szám:", i, t.title),
      });
      parent.appendChild(log);
      return player;
    },
  ),
];

renderSections(sections);
done();
