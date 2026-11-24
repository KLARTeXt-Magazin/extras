// =======================================================
// KOMPONENTE: AUDIOCARD
// Zweck:
// • wiederverwendbare Audiokachel
// • Player-Steuerung
// • Cover + Titel
// • Fortschrittsbalken
// • optional gesperrte Audios
//
// Wichtig:
// • Diese Datei steuert das Aussehen UND die Funktion
//   aller Audio-Kacheln.
// • Die konkreten Inhalte kommen aus `tracks` in
//   den jeweiligen Seiten.
// =======================================================

import { useCallback, useEffect, useRef, useState } from "react";

import { Lock, Play } from "lucide-react";

import { SignVideoButton } from "@/components/sign-video";
import { useSignVideo } from "@/lib/sign-video";
import { Button } from "@/components/ui/button";
import { ListeningMode, type ListeningView } from "@/components/listening-mode";
import { transcripts } from "@/lib/transcripts";
import { usePreview } from "@/lib/preview";

// =======================================================
// DATENSTRUKTUR FÜR EINE AUDIO-KACHEL
// =======================================================

export type AudioTrack = {
  id: string;
  eyebrow: string;
  title: string;
  quote?: string;
  note?: string;
  cover: string;
  coverAlt: string;
  coverWord?: string;
  src: string;
  credit?: string;
  downloadUrl?: string;
  downloadLabel?: string;
  /** optionaler Verweis auf einen ausführlichen Beitrag weiter unten (Sprungmarke) */
  moreHref?: string;
  moreLabel?: string;
  unlockAt?: string;
  unlockLabel?: string;
};

// =======================================================
// AUDIOCARD
// =======================================================

export function AudioCard({
  track,
  isActive,
  onPlay,
}: {
  track: AudioTrack;
  isActive: boolean;
  onPlay: (id: string | null) => void;
}) {
  // -----------------------------------------------------
  // AUDIO-ELEMENT
  // -----------------------------------------------------

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const cardRef = useRef<HTMLElement | null>(null);

  // Farben der Audio (aus der Farbwelt des Karussells) für den Hörmodus
  const [tone, setTone] = useState<{ accent?: string; ink?: string }>({});

  // Gebärdenvideo (falls vorhanden): läuft im Hörmodus statt der Audio.
  // mode = welches Medium gerade gesteuert wird.
  const signVideo = useSignVideo(track.id);
  const [mode, setMode] = useState<ListeningView>("audio");
  const [videoEl, setVideoEl] = useState<HTMLVideoElement | null>(null);
  const pendingSwitch = useRef<{ time: number; play: boolean } | null>(null);

  const media = useCallback(
    (): HTMLMediaElement | null => (mode === "dgs" ? videoEl : audioRef.current),
    [mode, videoEl],
  );

  // -----------------------------------------------------
  // PLAYER-ZUSTAND
  // -----------------------------------------------------

  const [isPlaying, setIsPlaying] = useState(false);

  const [currentTime, setCurrentTime] = useState(0);

  const [duration, setDuration] = useState(0);

  const [listeningOpen, setListeningOpen] = useState(false);

  // -----------------------------------------------------
  // FREISCHALTUNG
  // -----------------------------------------------------

  const [unlocked, setUnlocked] = useState(!track.unlockAt);
  const preview = usePreview();

  // =====================================================
  // FREISCHALTZEIT PRÜFEN
  // Mit ?vorschau sind gesperrte Audios schon vorher hörbar.
  // =====================================================

  useEffect(() => {
    if (!track.unlockAt) return;

    setUnlocked(preview || Date.now() >= new Date(track.unlockAt).getTime());
  }, [track.unlockAt, preview]);

  // =====================================================
  // AUDIO-EVENTS
  //
  // WICHTIG:
  // `pause` setzt nur den lokalen Wiedergabestatus zurück.
  // Es wird NICHT mehr automatisch `onPlay(null)` aufgerufen.
  //
  // Nur `ended` meldet der übergeordneten Seite,
  // dass wirklich kein Track mehr aktiv ist.
  // =====================================================

  useEffect(() => {
    const audio = media();

    if (!audio) return;

    setCurrentTime(audio.currentTime);
    setDuration(Number.isFinite(audio.duration) ? audio.duration : 0);
    setIsPlaying(!audio.paused);

    // Aktuelle Wiedergabeposition
    const updateTime = () => setCurrentTime(audio.currentTime);

    // Gesamtdauer der Audio
    const updateDuration = () => setDuration(Number.isFinite(audio.duration) ? audio.duration : 0);

    // Audio startet tatsächlich
    const handlePlay = () => {
      setIsPlaying(true);
    };

    // Audio wird pausiert
    const handlePause = () => {
      setIsPlaying(false);
    };

    // Audio ist vollständig zu Ende
    const handleEnded = () => {
      setIsPlaying(false);
      onPlay(null);
    };

    audio.addEventListener("timeupdate", updateTime);

    audio.addEventListener("loadedmetadata", updateDuration);

    audio.addEventListener("durationchange", updateDuration);

    audio.addEventListener("play", handlePlay);

    audio.addEventListener("pause", handlePause);

    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);

      audio.removeEventListener("loadedmetadata", updateDuration);

      audio.removeEventListener("durationchange", updateDuration);

      audio.removeEventListener("play", handlePlay);

      audio.removeEventListener("pause", handlePause);

      audio.removeEventListener("ended", handleEnded);
    };
  }, [onPlay, unlocked, media]);

  // =====================================================
  // UMSCHALTEN AUDIO ⇄ GEBÄRDENSPRACHE
  // Stelle und Abspielzustand werden mitgenommen.
  // =====================================================

  const switchMode = (next: ListeningView, forcePlay = false) => {
    const from = media();

    // Audio ⇄ Text: gleiche Audio, nur andere Ansicht – nichts anhalten
    if (next !== "dgs" && mode !== "dgs") {
      setMode(next);
      if (forcePlay && from?.paused) {
        onPlay(track.id);
        from.play().catch(() => setIsPlaying(false));
      }
      return;
    }

    pendingSwitch.current = {
      time: from?.currentTime ?? 0,
      play: forcePlay || Boolean(from && !from.paused),
    };
    if (next === mode) {
      pendingSwitch.current = null;
      if (forcePlay && from?.paused) {
        onPlay(track.id);
        from.play().catch(() => setIsPlaying(false));
      }
      return;
    }
    from?.pause();
    setMode(next);
  };

  useEffect(() => {
    const pending = pendingSwitch.current;
    const el = media();
    if (!pending || !el) return;
    pendingSwitch.current = null;

    const apply = () => {
      const end = Number.isFinite(el.duration) ? el.duration : pending.time;
      el.currentTime = Math.min(pending.time, Math.max(0, end - 0.5));
      if (pending.play) {
        onPlay(track.id);
        el.play().catch(() => setIsPlaying(false));
      }
    };

    if (el.readyState >= 1) apply();
    else el.addEventListener("loadedmetadata", apply, { once: true });
  }, [media, onPlay, track.id]);

  // =====================================================
  // NUR EINE AUDIO GLEICHZEITIG
  //
  // Wenn eine andere Karte aktiv wird, wird diese Audio
  // pausiert.
  // =====================================================

  useEffect(() => {
    if (isActive) return;
    audioRef.current?.pause();
    videoEl?.pause();
  }, [isActive, videoEl]);

  // =====================================================
  // PLAY / PAUSE
  // =====================================================

  const togglePlay = async () => {
    const audio = media();

    if (!audio) return;

    // ---------------------------------------------------
    // PLAY
    // ---------------------------------------------------

    if (audio.paused) {
      // Diese Karte als aktive Audio melden
      onPlay(track.id);

      setListeningOpen(true);

      try {
        await audio.play();
      } catch {
        setIsPlaying(false);
        onPlay(null);
      }

      // ---------------------------------------------------
      // PAUSE
      // ---------------------------------------------------
    } else {
      audio.pause();

      // Der pause-Event setzt isPlaying zurück.
      // Hier NICHT noch einmal onPlay(null) aufrufen.
    }
  };

  // Farbwelt beim Öffnen des Hörmodus übernehmen
  useEffect(() => {
    if (!listeningOpen || !cardRef.current) return;
    const style = getComputedStyle(cardRef.current);
    const accent = style.getPropertyValue("--audio-accent").trim();
    const ink = style.getPropertyValue("--audio-accent-ink").trim();
    setTone({ ...(accent ? { accent } : {}), ...(ink ? { ink } : {}) });
  }, [listeningOpen]);

  // =====================================================
  // SPERRBILDSCHIRM / DYNAMIC ISLAND (Media Session)
  // Titel, Bild und Steuerung fürs System, solange diese
  // Karte abspielt – auch wenn der Hörmodus geschlossen ist.
  // =====================================================

  useEffect(() => {
    if (!isPlaying || typeof navigator === "undefined" || !("mediaSession" in navigator)) return;
    const session = navigator.mediaSession;
    const cover = new URL(track.cover, window.location.href).href;

    session.metadata = new MediaMetadata({
      title: track.title,
      artist: "KLARTeXt.",
      album: track.eyebrow,
      artwork: [{ src: cover, sizes: "1024x768", type: "image/jpeg" }],
    });

    const el = () => media();
    const handlers: [MediaSessionAction, MediaSessionActionHandler][] = [
      ["play", () => void el()?.play()],
      ["pause", () => el()?.pause()],
      [
        "seekbackward",
        (d) => {
          const m = el();
          if (m) m.currentTime = Math.max(0, m.currentTime - (d.seekOffset ?? 15));
        },
      ],
      [
        "seekforward",
        (d) => {
          const m = el();
          if (m) m.currentTime = Math.min(m.duration || 0, m.currentTime + (d.seekOffset ?? 15));
        },
      ],
      [
        "seekto",
        (d) => {
          const m = el();
          if (m && d.seekTime != null) m.currentTime = d.seekTime;
        },
      ],
    ];
    for (const [action, handler] of handlers) {
      try {
        session.setActionHandler(action, handler);
      } catch {
        // Aktion wird von diesem Browser nicht unterstützt
      }
    }
    session.playbackState = "playing";

    return () => {
      session.playbackState = "paused";
    };
  }, [isPlaying, media, track.cover, track.eyebrow, track.title]);

  useEffect(() => {
    if (!isPlaying || !duration || !("mediaSession" in navigator)) return;
    try {
      navigator.mediaSession.setPositionState({
        duration,
        position: Math.min(currentTime, duration),
        playbackRate: 1,
      });
    } catch {
      // ältere Browser kennen setPositionState nicht
    }
  }, [isPlaying, currentTime, duration]);

  // =====================================================
  // HÖRMODUS ÖFFNEN
  // =====================================================

  const openListeningMode = async () => {
    if (mode === "dgs") {
      switchMode("audio", true);
      setListeningOpen(true);
      return;
    }

    const audio = audioRef.current;

    if (!audio) return;

    if (audio.paused) {
      await togglePlay();
      return;
    }

    setListeningOpen(true);
  };

  // =====================================================
  // AUDIO SPRINGEN
  // =====================================================

  const openSignVideo = () => {
    setListeningOpen(true);
    switchMode("dgs", true);
  };

  const closeListeningMode = (open: boolean) => {
    setListeningOpen(open);
    if (open) return;
    if (mode === "text") {
      setMode("audio");
      return;
    }
    if (mode !== "dgs") return;
    // Video beim Schließen anhalten und zur Audio zurückkehren
    videoEl?.pause();
    setIsPlaying(false);
    setMode("audio");
  };

  const skip = (seconds: number) => {
    const audio = media();

    if (!audio) return;

    audio.currentTime = Math.max(0, Math.min(audio.duration || 0, audio.currentTime + seconds));
  };

  // =====================================================
  // AUSGABE DER AUDIO-KACHEL
  // =====================================================

  return (
    <>
      <article
        ref={cardRef}
        className="audio-player-card relative overflow-hidden rounded-[1.35rem] border p-3"
        aria-label={track.title}
      >
        {/* =================================================
            AUDIO-ELEMENT
           ================================================= */}

        {unlocked ? <audio ref={audioRef} src={track.src} preload="metadata" /> : null}

        {/* =================================================
            COVER-BEREICH
           ================================================= */}

        <div className="audio-cover-layout relative z-10 aspect-[4/3] overflow-hidden rounded-[0.95rem]">
          {unlocked ? (
            <img
              src={track.cover}
              alt={track.coverAlt}
              width={1024}
              height={1024}
              loading="lazy"
              className="audio-cover-image h-full w-full object-cover"
            />
          ) : null}

          {/* Kategorie / Datum */}

          <span className="audio-cover-badge absolute left-4 top-4 rounded-full border px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.08em]">
            {track.eyebrow}
          </span>

          {/* =================================================
              GESPERRTER ZUSTAND
             ================================================= */}

          {!unlocked ? (
            <div className="audio-locked-cover absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center">
              <span className="audio-lock flex size-12 items-center justify-center rounded-full">
                <Lock className="size-5" strokeWidth={1.5} />
              </span>

              <p className="max-w-[15rem] text-sm font-semibold leading-6">{track.unlockLabel}</p>
            </div>
          ) : null}
        </div>

        {/* =================================================
            AUDIO-INHALT
           ================================================= */}

        <div className="relative z-10 px-3 pb-4 pt-5">
          {/* Audio-Titel */}

          <h2
            className={
              track.coverWord
                ? "audio-art-title"
                : "font-display text-2xl font-medium leading-tight"
            }
          >
            {track.coverWord ?? track.title}
          </h2>

          {track.coverWord ? <p className="audio-track-title">{track.title}</p> : null}

          {unlocked ? (
            <div className="mt-6">
              <Button
                className="min-h-12 w-full rounded-full px-5"
                onClick={openListeningMode}
                aria-label={
                  isPlaying ? `Hörmodus für „${track.title}“ öffnen` : `„${track.title}“ anhören`
                }
              >
                <Play className="size-4 fill-current" aria-hidden="true" />

                {isPlaying ? "Hörmodus öffnen" : "Anhören"}
              </Button>

              {signVideo ? <SignVideoButton title={track.title} onOpen={openSignVideo} /> : null}

              {isPlaying ? (
                <p
                  className="mt-3 text-center text-xs font-medium text-muted-foreground"
                  aria-live="polite"
                >
                  Läuft gerade
                </p>
              ) : null}
            </div>
          ) : (
            /* =================================================
               GESPERRTER PLAYER
               ================================================= */

            <p className="mt-5 text-sm leading-6 text-muted-foreground">
              Noch nicht verfügbar. {track.unlockLabel}
            </p>
          )}
        </div>
      </article>

      {/* ===================================================
          GROSSER HÖRMODUS
         =================================================== */}

      <ListeningMode
        open={listeningOpen}
        onOpenChange={closeListeningMode}
        title={track.title}
        eyebrow={track.eyebrow}
        cover={track.cover}
        isPlaying={isPlaying}
        currentTime={currentTime}
        duration={duration}
        onTogglePlay={togglePlay}
        onSkip={skip}
        signVideo={signVideo}
        transcript={transcripts[track.id]}
        mode={mode}
        onModeChange={(next) => switchMode(next)}
        videoRef={setVideoEl}
        {...(tone.accent ? { accent: tone.accent } : {})}
        {...(tone.ink ? { accentInk: tone.ink } : {})}
        onSeek={(seconds) => {
          const audio = media();

          if (!audio) return;

          audio.currentTime = seconds;

          setCurrentTime(seconds);
        }}
      />
    </>
  );
}
