import { describe, it, expect, beforeEach, vi } from "vitest";
import { createVideo, createMusicPlayer } from "../src/index";

beforeEach(() => {
  document.body.innerHTML = '<div id="root"></div>';
  // a jsdom nem valósítja meg a média API-t
  HTMLMediaElement.prototype.load = vi.fn();
  HTMLMediaElement.prototype.pause = vi.fn();
  HTMLMediaElement.prototype.play = vi.fn(() => Promise.resolve());
});

const fire = (el: Element, type: string) => el.dispatchEvent(new Event(type));

describe("createVideo", () => {
  it("betöltés alatt loading, metaadatok után loaded", () => {
    const onLoad = vi.fn();
    const fig = createVideo({ parent: "root", id: "v", src: "a.mp4", onLoad });
    const video = fig.querySelector("video") as HTMLVideoElement;
    expect(fig.dataset.state).toBe("loading");
    expect(video.getAttribute("src")).toBe("a.mp4");
    expect(fig.querySelector(".spinner")).not.toBeNull();
    fire(video, "loadedmetadata");
    expect(fig.dataset.state).toBe("loaded");
    expect(onLoad).toHaveBeenCalledWith(video);
  });

  it("hibánál error állapot, hibaüzenet és Újra gomb; az újrapróbálás újratölt", () => {
    const onError = vi.fn();
    const fig = createVideo({ parent: "root", id: "v", src: "x.mp4", onError });
    const video = fig.querySelector("video") as HTMLVideoElement;
    fire(video, "error");
    expect(fig.dataset.state).toBe("error");
    expect(fig.querySelector(".image-error")?.textContent).toContain("A videó nem tölthető be");
    expect(onError).toHaveBeenCalledTimes(1);
    (fig.querySelector(".image-retry") as HTMLButtonElement).click();
    expect(fig.dataset.state).toBe("loading");
    fire(fig.querySelector("video") as HTMLVideoElement, "loadeddata");
    expect(fig.dataset.state).toBe("loaded");
  });

  it("megadott méretnél a keret akkora, mint a videó", () => {
    const fig = createVideo({ parent: "root", id: "v", src: "a.mp4", width: 480, height: 270 });
    const frame = fig.querySelector(".image-frame") as HTMLElement;
    expect(fig.classList.contains("has-size")).toBe(true);
    expect(frame.style.width).toBe("480px");
    expect(frame.style.aspectRatio.replace(/\s/g, "")).toBe("480/270");
  });

  it("több forrásnál <source> elemek, típus a kiterjesztésből; csak az utolsó hiba végleges", () => {
    const fig = createVideo({ parent: "root", id: "v", src: [{ src: "a.webm" }, { src: "a.mp4" }] });
    const video = fig.querySelector("video") as HTMLVideoElement;
    const sources = video.querySelectorAll("source");
    expect(sources).toHaveLength(2);
    expect(sources[0].getAttribute("type")).toBe("video/webm");
    expect(sources[1].getAttribute("type")).toBe("video/mp4");
    sources[0].dispatchEvent(new Event("error"));
    expect(fig.dataset.state).toBe("loading");
    sources[1].dispatchEvent(new Event("error"));
    expect(fig.dataset.state).toBe("error");
  });

  it("retries: automatikusan újrapróbál a hibaállapot előtt", () => {
    const fig = createVideo({ parent: "root", id: "v", src: "x.mp4", retries: 1 });
    const video = fig.querySelector("video") as HTMLVideoElement;
    fire(video, "error");
    expect(fig.dataset.state).toBe("loading");
    fire(video, "error");
    expect(fig.dataset.state).toBe("error");
  });
});

describe("createMusicPlayer", () => {
  const tracks = [
    { src: "1.mp3", title: "Egy", artist: "A" },
    { src: "2.mp3", title: "Kettő", artist: "B" },
    { src: "3.mp3", title: "Három" },
  ];

  it("kirajzolja a címet, a lejátszási listát, és az első szám aktív", () => {
    const p = createMusicPlayer({ parent: "root", id: "mp", tracks });
    expect(p.querySelector(".music-title")?.textContent).toBe("Egy");
    expect(p.querySelectorAll(".music-playlist-btn")).toHaveLength(3);
    expect(p.querySelector(".music-playlist-btn.is-active")?.textContent).toContain("Egy");
    expect((p.querySelector("audio") as HTMLAudioElement).getAttribute("src")).toBe("1.mp3");
  });

  it("a lejátszás gomb indít, az audio események állítják az állapotot és az ikont", () => {
    const onPlay = vi.fn();
    const p = createMusicPlayer({ parent: "root", id: "mp", tracks, onPlay });
    const audio = p.querySelector("audio") as HTMLAudioElement;
    const playBtn = p.querySelector(".music-play") as HTMLButtonElement;
    const before = playBtn.innerHTML;
    playBtn.click();
    expect(HTMLMediaElement.prototype.play).toHaveBeenCalled();
    fire(audio, "play");
    expect(p.dataset.state).toBe("playing");
    expect(playBtn.innerHTML).not.toBe(before);
    expect(onPlay).toHaveBeenCalledWith(tracks[0], 0);
  });

  it("következő / előző számot vált és hívja az onTrackChange-et", () => {
    const onTrackChange = vi.fn();
    const p = createMusicPlayer({ parent: "root", id: "mp", tracks, onTrackChange });
    (p.querySelector(".music-next") as HTMLButtonElement).click();
    expect(p.querySelector(".music-title")?.textContent).toBe("Kettő");
    expect(onTrackChange).toHaveBeenCalledWith(tracks[1], 1);
    (p.querySelector(".music-prev") as HTMLButtonElement).click();
    expect(p.querySelector(".music-title")?.textContent).toBe("Egy");
  });

  it("a lista végén az előre gomb le van tiltva, loop: all esetén körbeér", () => {
    const p = createMusicPlayer({ parent: "root", id: "mp", tracks, startIndex: 2 });
    expect((p.querySelector(".music-next") as HTMLButtonElement).disabled).toBe(true);
    const q = createMusicPlayer({ parent: "root", id: "mp2", tracks, startIndex: 2, loop: "all" });
    const next = q.querySelector(".music-next") as HTMLButtonElement;
    expect(next.disabled).toBe(false);
    next.click();
    expect(q.querySelector(".music-title")?.textContent).toBe("Egy");
  });

  it("a lista elemére kattintva az adott szám töltődik és indul", () => {
    const p = createMusicPlayer({ parent: "root", id: "mp", tracks });
    (p.querySelectorAll(".music-playlist-btn")[2] as HTMLButtonElement).click();
    expect(p.querySelector(".music-title")?.textContent).toBe("Három");
    expect(HTMLMediaElement.prototype.play).toHaveBeenCalled();
  });

  it("az ended esemény a következő számra lép, az utolsó után onEnded", () => {
    const onEnded = vi.fn();
    const p = createMusicPlayer({ parent: "root", id: "mp", tracks, startIndex: 1, onEnded });
    const audio = p.querySelector("audio") as HTMLAudioElement;
    fire(audio, "ended");
    expect(p.querySelector(".music-title")?.textContent).toBe("Három");
    fire(audio, "ended");
    expect(onEnded).toHaveBeenCalledTimes(1);
    expect(p.dataset.state).toBe("paused");
  });

  it("hibás szám esetén error állapot és hibaüzenet", () => {
    const p = createMusicPlayer({ parent: "root", id: "mp", tracks });
    fire(p.querySelector("audio") as HTMLAudioElement, "error");
    expect(p.dataset.state).toBe("error");
    expect(p.querySelector(".music-status")?.textContent).toBe("A szám nem játszható le");
  });

  it("egy számnál nincs lista és előző / következő gomb", () => {
    const p = createMusicPlayer({ parent: "root", id: "mp", tracks: [tracks[0]] });
    expect(p.querySelector(".music-playlist")).toBeNull();
    expect(p.querySelector(".music-prev")).toBeNull();
    expect(p.querySelector(".music-next")).toBeNull();
  });

  it("az ismétlés gomb none → all → one → none körben vált", () => {
    const p = createMusicPlayer({ parent: "root", id: "mp", tracks });
    const loopBtn = p.querySelector(".music-loop") as HTMLButtonElement;
    const audio = p.querySelector("audio") as HTMLAudioElement;
    loopBtn.click();
    expect(loopBtn.getAttribute("aria-label")).toContain("lista");
    loopBtn.click();
    expect(loopBtn.getAttribute("aria-label")).toContain("szám");
    expect(audio.loop).toBe(true);
    loopBtn.click();
    expect(audio.loop).toBe(false);
  });
});
