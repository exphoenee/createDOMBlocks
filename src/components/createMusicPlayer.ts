import type { MusicPlayerParams, MusicPlayerState } from "../types";
import { builtin, resolveText, tr, watchLocale } from "../i18n";
import type { TextValue } from "../i18n";

const svg = (path: string): string =>
  `<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true">${path}</svg>`;

const ICONS = {
  play: svg('<path d="M8 5v14l11-7z"/>'),
  pause: svg('<path d="M6 5h4v14H6zM14 5h4v14h-4z"/>'),
  prev: svg('<path d="M6 6h2v12H6zM9.5 12 18 18V6z"/>'),
  next: svg('<path d="M16 6h2v12h-2zM6 18l8.5-6L6 6z"/>'),
  volume: svg('<path d="M3 9v6h4l5 5V4L7 9zM16.5 12A4.5 4.5 0 0 0 14 8v8a4.5 4.5 0 0 0 2.5-4z"/>'),
  muted: svg('<path d="M3 9v6h4l5 5V4L7 9zM16 9.4 17.4 8 19.5 10.1 21.6 8 23 9.4 20.9 11.5 23 13.6 21.6 15 19.5 12.9 17.4 15 16 13.6 18.1 11.5z"/>'),
  repeat: svg('<path d="M7 7h10v3l4-4-4-4v3H5v6h2zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2z"/>'),
  repeatOne: svg('<path d="M7 7h10v3l4-4-4-4v3H5v6h2zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2zm-4-2V9h-1l-2 1v1h1.5v4z"/>'),
  note: svg('<path d="M12 3v10.55A4 4 0 1 0 14 17V7h4V3z"/>'),
};

function fmt(sec: number): string {
  if (!isFinite(sec) || sec < 0) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className?: string,
  attrs: Record<string, string> = {},
): HTMLElementTagNameMap[K] {
  const e = document.createElement(tag);
  if (className) e.className = className;
  for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
  return e;
}

/**
 * Egyedi zenelejátszó: lejátszás / szünet, előző / következő, léptethető időcsík,
 * hangerő, ismétlés és lejátszási lista. A gyökérelem `data-state` attribútuma
 * (paused / playing / loading / error) stílushoz használható.
 */
export function createMusicPlayer(params: MusicPlayerParams): HTMLElement {
  // Feliratok: a paraméterből, különben a beépített (nyelvváltáskor frissülő) katalógusból
  const L = {
    play: builtin("music.play", "Lejátszás") as TextValue,
    pause: builtin("music.pause", "Szünet") as TextValue,
    prev: builtin("music.prev", "Előző szám") as TextValue,
    next: builtin("music.next", "Következő szám") as TextValue,
    seek: builtin("music.seek", "Pozíció") as TextValue,
    volume: builtin("music.volume", "Hangerő") as TextValue,
    mute: builtin("music.mute", "Némítás") as TextValue,
    unmute: builtin("music.unmute", "Némítás feloldása") as TextValue,
    playlist: builtin("music.playlist", "Lejátszási lista") as TextValue,
    error: builtin("music.error", "A szám nem játszható le") as TextValue,
    ...params.labels,
  };
  const LOOP = {
    none: builtin("music.loopOff", "Ismétlés: ki") as TextValue,
    all: builtin("music.loopAll", "Ismétlés: lista") as TextValue,
    one: builtin("music.loopOne", "Ismétlés: szám") as TextValue,
  };
  const tracks = params.tracks;
  const multi = tracks.length > 1;
  let index = Math.min(Math.max(params.startIndex ?? 0, 0), Math.max(tracks.length - 1, 0));
  let loop = params.loop ?? "none";
  let state: MusicPlayerState = "paused";
  let seeking = false;

  const audio = el("audio", "music-audio", { preload: "metadata" });
  audio.volume = Math.min(Math.max(params.volume ?? 1, 0), 1);

  const root = el("div", `music-player${params.class ? ` ${params.class}` : ""}`, {
    role: "group",
    "data-state": "paused",
  });
  if (params.id) root.id = params.id;

  // --- fejléc: borító + cím ---
  const cover = el("div", "music-cover");
  const coverImg = el("img", "music-cover-img", { alt: "", decoding: "async" });
  const coverFallback = el("span", "music-cover-fallback");
  coverFallback.innerHTML = ICONS.note;
  cover.append(coverImg, coverFallback);

  const title = el("div", "music-title");
  const artist = el("div", "music-artist");
  const status = el("div", "music-status", { role: "status", "aria-live": "polite" });
  const meta = el("div", "music-meta");
  meta.append(title, artist, status);
  const head = el("div", "music-head");
  head.append(cover, meta);

  // --- időcsík ---
  const seek = el("input", "music-seek", { type: "range", min: "0", max: "1000", step: "1", value: "0" });
  const cur = el("span", "music-time music-current");
  cur.textContent = "0:00";
  const dur = el("span", "music-time music-duration");
  dur.textContent = "0:00";
  const progress = el("div", "music-progress");
  progress.append(cur, seek, dur);

  // --- vezérlők ---
  // az aria-label-eket a refreshLabels() állítja (állapot- és nyelvfüggők)
  const btn = (cls: string, _label: TextValue, icon: string): HTMLButtonElement => {
    const b = el("button", `music-btn ${cls}`, { type: "button" });
    b.innerHTML = icon;
    return b;
  };
  const prevBtn = btn("music-prev", L.prev, ICONS.prev);
  const playBtn = btn("music-play", L.play, ICONS.play);
  const nextBtn = btn("music-next", L.next, ICONS.next);
  const loopBtn = btn("music-loop", LOOP.none, ICONS.repeat);
  const muteBtn = btn("music-mute", L.mute, ICONS.volume);
  const vol = el("input", "music-volume", { type: "range", min: "0", max: "1", step: "0.01" });
  vol.value = String(audio.volume);

  const transport = el("div", "music-transport");
  if (multi) transport.append(prevBtn);
  transport.append(playBtn);
  if (multi) transport.append(nextBtn);

  const volumeBox = el("div", "music-volume-box");
  volumeBox.append(muteBtn, vol);

  const controls = el("div", "music-controls");
  controls.append(loopBtn, transport, params.showVolume === false ? el("span") : volumeBox);

  root.append(audio, head, progress, controls);

  // --- lejátszási lista ---
  let playlistEl: HTMLUListElement | null = null;
  const items: HTMLButtonElement[] = [];
  const itemTitles: HTMLElement[] = [];
  if (multi && params.showPlaylist !== false) {
    playlistEl = el("ul", "music-playlist");
    tracks.forEach((t, i) => {
      const li = el("li", "music-playlist-item");
      const b = el("button", "music-playlist-btn", { type: "button" });
      const n = el("span", "music-playlist-index");
      n.textContent = String(i + 1);
      const tt = el("span", "music-playlist-title");
      itemTitles.push(tt);
      const ar = el("span", "music-playlist-artist");
      ar.textContent = resolveText(t.artist);
      b.append(n, tt, ar);
      b.addEventListener("click", () => {
        setTrack(i);
        void play();
      });
      li.appendChild(b);
      playlistEl!.appendChild(li);
      items.push(b);
    });
    root.appendChild(playlistEl);
  }

  /** Minden nyelv- és állapotfüggő felirat (aria-label, hibaüzenet, számcímek) újraszámolása */
  function refreshLabels(): void {
    const playing = state === "playing" || state === "loading";
    root.setAttribute("aria-label", resolveText(builtin("music.group", "Zenelejátszó")));
    seek.setAttribute("aria-label", resolveText(L.seek));
    vol.setAttribute("aria-label", resolveText(L.volume));
    prevBtn.setAttribute("aria-label", resolveText(L.prev));
    nextBtn.setAttribute("aria-label", resolveText(L.next));
    playBtn.setAttribute("aria-label", resolveText(playing ? L.pause : L.play));
    muteBtn.setAttribute("aria-label", resolveText(audio.muted ? L.unmute : L.mute));
    loopBtn.setAttribute("aria-label", resolveText(LOOP[loop]));
    playlistEl?.setAttribute("aria-label", resolveText(L.playlist));
    status.textContent = state === "error" ? resolveText(L.error) : "";
    itemTitles.forEach((node, i) => {
      node.textContent = resolveText(tracks[i].title) || resolveText(tr("cdb.music.track", { n: i + 1 }, "Szám {n}"));
    });
  }

  // --- állapot ---
  const setState = (s: MusicPlayerState): void => {
    if (s === state) return;
    state = s;
    root.dataset.state = s;
    root.setAttribute("aria-busy", String(s === "loading"));
    const playing = s === "playing" || s === "loading";
    playBtn.innerHTML = playing ? ICONS.pause : ICONS.play;
    playBtn.setAttribute("aria-pressed", String(playing));
    refreshLabels();
    params.onStateChange?.(s);
  };

  function renderTrack(): void {
    const t = tracks[index];
    title.textContent = resolveText(t?.title) || resolveText(builtin("music.unknownTrack", "Ismeretlen szám"));
    artist.textContent = resolveText(t?.artist);
    if (t?.cover) {
      coverImg.src = t.cover;
      cover.classList.add("has-cover");
    } else {
      coverImg.removeAttribute("src");
      cover.classList.remove("has-cover");
    }
    items.forEach((b, i) => {
      const on = i === index;
      b.classList.toggle("is-active", on);
      if (on) b.setAttribute("aria-current", "true");
      else b.removeAttribute("aria-current");
    });
    if (!multi) return;
    prevBtn.disabled = loop !== "all" && index === 0;
    nextBtn.disabled = loop !== "all" && index === tracks.length - 1;
  }

  function setTrack(i: number, silent = false): void {
    if (!tracks.length) return;
    index = (i + tracks.length) % tracks.length;
    const t = tracks[index];
    audio.src = t.src;

    seek.value = "0";
    cur.textContent = "0:00";
    dur.textContent = "0:00";
    setState("paused");
    renderTrack();
    audio.load();
    if (!silent) params.onTrackChange?.(t, index);
  }

  async function play(): Promise<void> {
    try {
      setState("loading");
      await audio.play();
    } catch (e) {
      // a play() megszakítása (pl. gyors számváltás) nem hiba
      if (e instanceof DOMException && e.name === "AbortError") return;
      setState(e instanceof DOMException && e.name === "NotAllowedError" ? "paused" : "error");
    }
  }

  function goNext(auto = false): void {
    if (index < tracks.length - 1) {
      setTrack(index + 1);
      void play();
    } else if (loop === "all") {
      setTrack(0);
      void play();
    } else if (auto) {
      setState("paused");
      params.onEnded?.();
    }
  }

  // --- események ---
  playBtn.addEventListener("click", () => {
    if (audio.paused) void play();
    else audio.pause();
  });
  prevBtn.addEventListener("click", () => {
    if (audio.currentTime > 3 || (index === 0 && loop !== "all")) {
      audio.currentTime = 0;
      return;
    }
    const wasPlaying = !audio.paused;
    setTrack(index - 1);
    if (wasPlaying) void play();
  });
  nextBtn.addEventListener("click", () => {
    const wasPlaying = !audio.paused;
    if (index < tracks.length - 1) setTrack(index + 1);
    else if (loop === "all") setTrack(0);
    else return;
    if (wasPlaying) void play();
  });
  loopBtn.addEventListener("click", () => {
    loop = loop === "none" ? "all" : loop === "all" ? "one" : "none";
    loopBtn.innerHTML = loop === "one" ? ICONS.repeatOne : ICONS.repeat;
    loopBtn.classList.toggle("is-active", loop !== "none");
    refreshLabels();
    audio.loop = loop === "one";
    renderTrack();
  });
  muteBtn.addEventListener("click", () => {
    audio.muted = !audio.muted;
  });
  vol.addEventListener("input", () => {
    audio.volume = Number(vol.value);
    audio.muted = false;
  });

  seek.addEventListener("input", () => {
    seeking = true;
    if (audio.duration) cur.textContent = fmt((Number(seek.value) / 1000) * audio.duration);
  });
  seek.addEventListener("change", () => {
    if (audio.duration) audio.currentTime = (Number(seek.value) / 1000) * audio.duration;
    seeking = false;
  });

  audio.addEventListener("play", () => {
    setState("playing");
    params.onPlay?.(tracks[index], index);
  });
  audio.addEventListener("pause", () => {
    if (state !== "error" && !audio.ended) {
      setState("paused");
      params.onPause?.(tracks[index], index);
    }
  });
  audio.addEventListener("waiting", () => {
    if (!audio.paused) setState("loading");
  });
  audio.addEventListener("playing", () => setState("playing"));
  audio.addEventListener("loadedmetadata", () => {
    dur.textContent = fmt(audio.duration);
  });
  audio.addEventListener("durationchange", () => {
    dur.textContent = fmt(audio.duration);
  });
  audio.addEventListener("timeupdate", () => {
    if (seeking || !audio.duration) return;
    seek.value = String(Math.round((audio.currentTime / audio.duration) * 1000));
    cur.textContent = fmt(audio.currentTime);
  });
  audio.addEventListener("volumechange", () => {
    muteBtn.innerHTML = audio.muted || audio.volume === 0 ? ICONS.muted : ICONS.volume;
    refreshLabels();
    if (!audio.muted) vol.value = String(audio.volume);
  });
  audio.addEventListener("ended", () => {
    if (loop === "one") return; // a natív loop kezeli
    goNext(true);
  });
  audio.addEventListener("error", () => {
    setState("error");
  });

  audio.loop = loop === "one";
  loopBtn.classList.toggle("is-active", loop !== "none");
  loopBtn.innerHTML = loop === "one" ? ICONS.repeatOne : ICONS.repeat;

  if (params.parent) {
    const parent = typeof params.parent === "string" ? document.getElementById(params.parent) : params.parent;
    parent?.appendChild(root);
  }

  refreshLabels();
  // nyelvváltáskor a feliratok és a számcímek frissülnek, a lejátszás állapota (pozíció, hangerő, lista) megmarad
  watchLocale(root, () => {
    refreshLabels();
    renderTrack();
  });

  if (tracks.length) {
    setTrack(index, true);
    if (params.autoplay) void play();
  } else {
    renderTrack();
    playBtn.disabled = true;
  }

  return root;
}


