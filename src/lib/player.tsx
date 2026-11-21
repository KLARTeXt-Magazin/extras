// =======================================================
// ZENTRALER PLAYER (für die ganze App)
// • ein einziges <audio>-Element, liegt in __root.tsx
// • läuft beim Seitenwechsel weiter
// • Mini-Player (components/mini-player.tsx) erscheint nach
//   dem ersten Abspielen und bleibt auf allen Seiten
// • Vollbild-Player = components/listening-mode.tsx
// • Ansichten im Vollbild: Audio · Text · DGS (Gebärdenvideo)
// • Sperrbildschirm / Dynamic Island über die Media Session
// =======================================================

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { ListeningMode, type ListeningView } from "@/components/listening-mode";
import { MiniPlayer } from "@/components/mini-player";
import { useSignVideo } from "@/components/sign-video";
import type { AudioTrack } from "@/lib/tracks";
import { transcripts } from "@/lib/transcripts";

type PlayerState = {
  track: AudioTrack | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  /** Track abspielen (gleicher Track: weiterspielen) */
  play: (track: AudioTrack) => void;
  /** Vollbild-Player öffnen, optional direkt in einer Ansicht */
  open: (track: AudioTrack, view?: ListeningView) => void;
  toggle: () => void;
  expand: () => void;
};

const PlayerContext = createContext<PlayerState | null>(null);

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (!context) throw new Error("usePlayer nur innerhalb von PlayerProvider");
  return context;
}

export function PlayerProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [track, setTrack] = useState<AudioTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [mode, setMode] = useState<ListeningView>("audio");
  const [videoEl, setVideoEl] = useState<HTMLVideoElement | null>(null);

  // nach einem Wechsel (Track oder Ansicht) hier fortsetzen
  const pending = useRef<{ time: number; play: boolean } | null>(null);

  const signVideo = useSignVideo(track?.id ?? "");

  const media = useCallback(
    (): HTMLMediaElement | null => (mode === "dgs" ? videoEl : audioRef.current),
    [mode, videoEl],
  );

  // ---------------------------------------------------
  // Zustand vom aktiven Medium (Audio oder Video) lesen
  // ---------------------------------------------------
  useEffect(() => {
    const el = media();
    if (!el) return;

    const sync = () => {
      setCurrentTime(el.currentTime);
      setDuration(Number.isFinite(el.duration) ? el.duration : 0);
    };
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    sync();
    setIsPlaying(!el.paused);
    el.addEventListener("timeupdate", sync);
    el.addEventListener("loadedmetadata", sync);
    el.addEventListener("durationchange", sync);
    el.addEventListener("play", onPlay);
    el.addEventListener("pause", onPause);
    el.addEventListener("ended", onPause);
    return () => {
      el.removeEventListener("timeupdate", sync);
      el.removeEventListener("loadedmetadata", sync);
      el.removeEventListener("durationchange", sync);
      el.removeEventListener("play", onPlay);
      el.removeEventListener("pause", onPause);
      el.removeEventListener("ended", onPause);
    };
  }, [media]);

  // ausstehenden Start/Stelle anwenden, sobald das Medium bereit ist
  useEffect(() => {
    const next = pending.current;
    const el = media();
    if (!next || !el) return;
    pending.current = null;

    const apply = () => {
      const end = Number.isFinite(el.duration) ? el.duration : next.time;
      el.currentTime = Math.min(next.time, Math.max(0, end - 0.5));
      if (next.play) el.play().catch(() => setIsPlaying(false));
    };
    if (el.readyState >= 1) apply();
    else el.addEventListener("loadedmetadata", apply, { once: true });
  }, [media, track]);

  // ---------------------------------------------------
  // Aktionen
  // ---------------------------------------------------
  const startTrack = useCallback(
    (next: AudioTrack, view: ListeningView = "audio") => {
      const sameTrack = track?.id === next.id;
      const from = media();
      const time = sameTrack ? (from?.currentTime ?? 0) : 0;
      if (from && (!sameTrack || view !== mode)) from.pause();

      if (sameTrack && view === mode) {
        from?.play().catch(() => setIsPlaying(false));
        return;
      }
      pending.current = { time, play: true };
      if (!sameTrack) {
        setTrack(next);
        setCurrentTime(0);
        setDuration(0);
      }
      setMode(view);
    },
    [media, mode, track?.id],
  );

  const play = useCallback((next: AudioTrack) => startTrack(next, "audio"), [startTrack]);

  const open = useCallback(
    (next: AudioTrack, view: ListeningView = "audio") => {
      setExpanded(true);
      startTrack(next, view);
    },
    [startTrack],
  );

  const toggle = useCallback(() => {
    const el = media();
    if (!el) return;
    if (el.paused) el.play().catch(() => setIsPlaying(false));
    else el.pause();
  }, [media]);

  // Ansicht im Vollbild wechseln (Audio ⇄ Text bleibt dieselbe Audio)
  const switchView = (next: ListeningView) => {
    if (next === mode) return;
    if (next !== "dgs" && mode !== "dgs") {
      setMode(next);
      return;
    }
    const from = media();
    pending.current = { time: from?.currentTime ?? 0, play: Boolean(from && !from.paused) };
    from?.pause();
    setMode(next);
  };

  const closeExpanded = (isOpen: boolean) => {
    setExpanded(isOpen);
    if (isOpen) return;
    if (mode === "dgs") {
      // Video anhalten, an derselben Stelle mit der Audio weitermachen
      const time = videoEl?.currentTime ?? 0;
      const wasPlaying = Boolean(videoEl && !videoEl.paused);
      videoEl?.pause();
      pending.current = { time, play: wasPlaying };
    }
    setMode("audio");
  };

  // ---------------------------------------------------
  // Sperrbildschirm / Dynamic Island
  // ---------------------------------------------------
  useEffect(() => {
    if (!track || typeof navigator === "undefined" || !("mediaSession" in navigator)) return;
    const session = navigator.mediaSession;
    session.metadata = new MediaMetadata({
      title: track.title,
      artist: "KLARTeXt.",
      album: track.eyebrow,
      artwork: [{ src: new URL(track.cover, window.location.href).href, type: "image/jpeg" }],
    });
    const handlers: [MediaSessionAction, MediaSessionActionHandler][] = [
      ["play", () => void media()?.play()],
      ["pause", () => media()?.pause()],
      [
        "seekbackward",
        (d) => {
          const m = media();
          if (m) m.currentTime = Math.max(0, m.currentTime - (d.seekOffset ?? 15));
        },
      ],
      [
        "seekforward",
        (d) => {
          const m = media();
          if (m) m.currentTime = Math.min(m.duration || 0, m.currentTime + (d.seekOffset ?? 15));
        },
      ],
      [
        "seekto",
        (d) => {
          const m = media();
          if (m && d.seekTime != null) m.currentTime = d.seekTime;
        },
      ],
    ];
    for (const [action, handler] of handlers) {
      try {
        session.setActionHandler(action, handler);
      } catch {
        // vom Browser nicht unterstützt
      }
    }
  }, [track, media]);

  useEffect(() => {
    if (typeof navigator === "undefined" || !("mediaSession" in navigator)) return;
    navigator.mediaSession.playbackState = isPlaying ? "playing" : "paused";
    if (!duration) return;
    try {
      navigator.mediaSession.setPositionState({
        duration,
        position: Math.min(currentTime, duration),
        playbackRate: 1,
      });
    } catch {
      // ältere Browser
    }
  }, [isPlaying, currentTime, duration]);

  const value = useMemo<PlayerState>(
    () => ({
      track,
      isPlaying,
      currentTime,
      duration,
      play,
      open,
      toggle,
      expand: () => setExpanded(true),
    }),
    [track, isPlaying, currentTime, duration, play, open, toggle],
  );

  return (
    <PlayerContext.Provider value={value}>
      {children}

      <audio ref={audioRef} src={track?.src} preload="metadata" className="hidden" />

      {track ? (
        <>
          <MiniPlayer />
          <ListeningMode
            open={expanded}
            onOpenChange={closeExpanded}
            title={track.title}
            eyebrow={track.eyebrow}
            cover={track.cover}
            coverAlt={track.coverAlt}
            isPlaying={isPlaying}
            currentTime={currentTime}
            duration={duration}
            onTogglePlay={toggle}
            onSkip={(seconds) => {
              const el = media();
              if (!el) return;
              el.currentTime = Math.min(
                Math.max(0, el.currentTime + seconds),
                Number.isFinite(el.duration) ? el.duration : el.currentTime + seconds,
              );
            }}
            onSeek={(seconds) => {
              const el = media();
              if (!el) return;
              el.currentTime = seconds;
              setCurrentTime(seconds);
            }}
            signVideo={signVideo}
            transcript={transcripts[track.id]}
            mode={mode}
            onModeChange={switchView}
            videoRef={setVideoEl}
            accent={track.accent}
            accentInk={track.ink}
          />
        </>
      ) : null}
    </PlayerContext.Provider>
  );
}
