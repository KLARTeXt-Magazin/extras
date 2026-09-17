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

import { useEffect, useRef, useState } from "react";

import {
  Lock,
  Pause,
  Play,
  RotateCcw,
  RotateCw,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { ListeningMode } from "@/components/listening-mode";


// =======================================================
// DATENSTRUKTUR FÜR EINE AUDIO-KACHEL
// Zweck:
// • legt fest, welche Informationen eine AudioCard
//   bekommen kann.
//
// Neue Inhalte werden normalerweise NICHT hier ergänzt,
// sondern in `tracks` der jeweiligen Route.
//
// Hier wird nur festgelegt, welche Felder möglich sind.
// =======================================================

export type AudioTrack = {
  // Interne ID – wichtig für Carousel und #Hash-Links
  id: string;

  // Kleine Zeile über dem Titel, z. B. Datum / Kategorie
  eyebrow: string;

  // Haupttitel der Audio
  title: string;

  // Begleitendes Zitat unterhalb des Carousels (optional)
  quote?: string;

  // Optionaler Erklärungstext
  note?: string;

  // Coverbild der Audio
  cover: string;

  // Beschreibung des Bildes für Accessibility
  coverAlt: string;

  // Audio-Datei
  src: string;

  // Optional: feste Dauer als Fallback
  duration?: string;

  // Musik-/Quellenhinweis
  credit?: string;

  // Optionales Zusatz-PDF
  downloadUrl?: string;

  // Beschriftung des PDF-Buttons
  downloadLabel?: string;

  // Optionaler Freischaltzeitpunkt
  unlockAt?: string;

  // Text für gesperrte Audio
  unlockLabel?: string;
};


// =======================================================
// ZEITFORMAT
// Zweck:
// • Sekunden → Minuten:Sekunden
//
// Wird vom Player und vom Fortschrittsbalken verwendet.
// =======================================================

export function formatTime(seconds: number) {
  if (
    !Number.isFinite(seconds) ||
    seconds < 0
  ) {
    return "0:00";
  }

  const minutes =
    Math.floor(seconds / 60);

  return `${minutes}:${String(
    Math.floor(seconds % 60),
  ).padStart(2, "0")}`;
}


// =======================================================
// AUDIOCARD
// Zweck:
// • einzelne vollständige Audiokachel
//
// Props:
// • track   = Inhalt der Kachel
// • isActive = Kachel darf aktiv abgespielt werden
// • onPlay = meldet der Seite, welche Audio aktiv ist
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
  // • direkte Referenz auf das HTML-Audio-Element
  // • notwendig für Play, Pause und Springen
  // -----------------------------------------------------

  const audioRef =
    useRef<HTMLAudioElement | null>(
      null,
    );


  // -----------------------------------------------------
  // PLAYER-ZUSTAND
  // • lokale Zustände dieser einen Audiokachel
  // -----------------------------------------------------

  const [isPlaying, setIsPlaying] =
    useState(false);

  const [currentTime, setCurrentTime] =
    useState(0);

  const [duration, setDuration] =
    useState(0);

  const [listeningOpen, setListeningOpen] =
    useState(false);


  // -----------------------------------------------------
  // FREISCHALTUNG
  // • Audio ohne unlockAt ist sofort verfügbar
  // • Audio mit unlockAt wird erst zum angegebenen
  //   Zeitpunkt freigeschaltet
  // -----------------------------------------------------

  const [unlocked, setUnlocked] =
    useState(!track.unlockAt);


  // =====================================================
  // FREISCHALTZEIT PRÜFEN
  // Zweck:
  // • prüft, ob ein geplantes Audio bereits verfügbar ist
  //
  // Später ändern:
  // • normalerweise nichts
  // =====================================================

  useEffect(() => {
    if (!track.unlockAt) return;

    setUnlocked(
      Date.now() >=
        new Date(
          track.unlockAt,
        ).getTime(),
    );
  }, [track.unlockAt]);


  // =====================================================
  // AUDIO-EVENTS
  // Zweck:
  // • hält React-Zustand und Audio-Element synchron
  // • erkennt Wiedergabe, Dauer und Ende
  //
  // Nicht unnötig ändern:
  // • wichtig für den Player
  // =====================================================

  useEffect(() => {
    const audio =
      audioRef.current;

    if (!audio) return;


    // Aktuelle Wiedergabeposition
    const updateTime = () =>
      setCurrentTime(
        audio.currentTime,
      );


    // Gesamtdauer der Audio
    const updateDuration = () =>
      setDuration(
        Number.isFinite(
          audio.duration,
        )
          ? audio.duration
          : 0,
      );


    // Audio wurde pausiert oder beendet
    const stop = () => {
      setIsPlaying(false);
      onPlay(null);
    };


    audio.addEventListener(
      "timeupdate",
      updateTime,
    );

    audio.addEventListener(
      "loadedmetadata",
      updateDuration,
    );

    audio.addEventListener(
      "durationchange",
      updateDuration,
    );

    audio.addEventListener(
      "ended",
      stop,
    );

    audio.addEventListener(
      "pause",
      stop,
    );


    return () => {
      audio.removeEventListener(
        "timeupdate",
        updateTime,
      );

      audio.removeEventListener(
        "loadedmetadata",
        updateDuration,
      );

      audio.removeEventListener(
        "durationchange",
        updateDuration,
      );

      audio.removeEventListener(
        "ended",
        stop,
      );

      audio.removeEventListener(
        "pause",
        stop,
      );
    };
  }, [onPlay, unlocked]);


  // =====================================================
  // NUR EINE AUDIO GLEICHZEITIG
  // Zweck:
  // • pausiert diese Audio, wenn sie nicht mehr aktiv ist
  //
  // Wichtig für das Carousel:
  // • beim Wechseln wird die vorherige Audio gestoppt
  // =====================================================

  useEffect(() => {
    if (
      !isActive &&
      audioRef.current &&
      !audioRef.current.paused
    ) {
      audioRef.current.pause();
    }
  }, [isActive]);


  // =====================================================
  // PLAY / PAUSE
  // Zweck:
  // • startet oder pausiert die aktuelle Audio
  // • meldet aktive Audio an die übergeordnete Seite
  // =====================================================

  const togglePlay = async () => {
    const audio =
      audioRef.current;

    if (!audio) return;


    if (audio.paused) {

      // Diese Kachel als aktive Audio melden
      onPlay(track.id);
      setListeningOpen(true);

      try {
        await audio.play();

        setIsPlaying(true);
      } catch {
        setIsPlaying(false);
        onPlay(null);
      }

    } else {

      audio.pause();

      setIsPlaying(false);
      onPlay(null);
    }
  };


  // =====================================================
  // AUDIO SPRINGEN
  // Zweck:
  // • 15 Sekunden zurück / vor
  // =====================================================

  const skip = (
    seconds: number,
  ) => {
    const audio =
      audioRef.current;

    if (!audio) return;

    audio.currentTime =
      Math.max(
        0,
        Math.min(
          audio.duration || 0,
          audio.currentTime +
            seconds,
        ),
      );
  };


  // =====================================================
  // AUSGABE DER AUDIO-KACHEL
  // =====================================================

  return (
    <>
      <article
        className={`audio-player-card relative overflow-hidden rounded-[1.35rem] border p-3 ${
          isActive
            ? "is-active"
            : "is-dimmed"
        }`}
        aria-label={track.title}
      >


      {/* =================================================
          FEINE LICHTKANTE
          • dezenter Lichtreflex am oberen Kartenrand
          • rein dekorativ
         ================================================= */}

      {/* =================================================
          AUDIO-ELEMENT
          • wird bei gesperrten Audios bewusst nicht geladen
          • src kommt aus track.src
         ================================================= */}

      {unlocked ? (
        <audio
          ref={audioRef}
          src={track.src}
          preload="metadata"
        />
      ) : null}


      {/* =================================================
          COVER-BEREICH
          Zweck:
          • Audio-Bild
          • Kategorie / Datum
          • optionaler Sperrzustand
         ================================================= */}

      <div className="relative z-10 aspect-[4/3] overflow-hidden rounded-[0.95rem]">

        <img
          src={track.cover}
          alt={track.coverAlt}
          width={1024}
          height={1024}
          loading="lazy"
          className={`h-full w-full object-cover transition-all duration-700 ${
            unlocked
              ? ""
              : "scale-105 blur-lg saturate-50"
          }`}
        />


        {/* Kategorie / Datum */}
        <span className="audio-cover-badge absolute left-4 top-4 rounded-full border px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.08em] shadow-sm backdrop-blur-md">
          {track.eyebrow}
        </span>


        {/* =================================================
            GESPERRTER ZUSTAND
            • Cover bleibt sichtbar
            • Audio selbst wird nicht geladen
            • unlockLabel erklärt den Zeitpunkt
           ================================================= */}

        {!unlocked ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/15 px-6 text-center backdrop-blur-[5px]">

            <span className="audio-lock flex size-12 items-center justify-center rounded-full border shadow-lg backdrop-blur-xl">
              <Lock
                className="size-5"
                strokeWidth={1.5}
              />
            </span>

            <p className="max-w-[15rem] text-sm font-medium leading-6 text-listening drop-shadow-md">
              {track.unlockLabel}
            </p>

          </div>
        ) : null}

      </div>


      {/* =================================================
          AUDIO-INHALT
          Zweck:
          • Titel
          • Player
          • Fortschritt
          • Steuerung
         ================================================= */}

      <div className="relative z-10 px-3 pb-4 pt-5">

        {/* Audio-Titel */}
        <h3 className="font-display text-2xl font-medium leading-tight">
          {track.title}
        </h3>


        {/* =================================================
            FREIGESCHALTETER PLAYER
           ================================================= */}

        {unlocked ? (
          <>

            {/* -------------------------------------------------
                FORTSCHRITTSBALKEN
                • aktuelle Position
                • Gesamtdauer
               ------------------------------------------------- */}

            <div className="mt-6">

              <label
                className="sr-only"
                htmlFor={`progress-${track.id}`}
              >
                Wiedergabeposition in
                „{track.title}“
              </label>


              <input
                id={`progress-${track.id}`}
                type="range"
                min={0}
                max={duration || 1}
                step={0.1}
                value={currentTime}
                aria-valuetext={`${formatTime(
                  currentTime,
                )} von ${
                  duration
                    ? formatTime(
                        duration,
                      )
                    : track.duration ??
                      "unbekannt"
                } Minuten`}
                onChange={(event) => {
                  const audio =
                    audioRef.current;

                  if (!audio) return;

                  const next =
                    Number(
                      event.target
                        .value,
                    );

                  audio.currentTime =
                    next;

                  setCurrentTime(
                    next,
                  );
                }}
                className="player-range w-full"
                style={
                  {
                    "--player-progress": `${
                      duration
                        ? (currentTime /
                            duration) *
                          100
                        : 0
                    }%`,
                  } as React.CSSProperties
                }
              />


              {/* Zeitangaben */}
              <div className="mt-1.5 flex justify-between text-sm font-medium tabular-nums text-foreground/75">

                <span>
                  {formatTime(
                    currentTime,
                  )}
                </span>

                <span>
                  {duration
                    ? formatTime(
                        duration,
                      )
                    : track.duration ??
                      "—"}
                </span>

              </div>

            </div>


            {/* =================================================
                PLAYER-STEUERUNG
                • -15 Sekunden
                • Play / Pause
                • +15 Sekunden
               ================================================= */}

            <div className="mt-4 flex items-center justify-center gap-8">

              {/* 15 Sekunden zurück */}
              <Button
                variant="ghost"
                size="icon"
                className="size-11 rounded-full text-muted-foreground transition-all hover:bg-secondary"
                onClick={() =>
                  skip(-15)
                }
                aria-label={`15 Sekunden zurückspringen in „${track.title}“`}
              >
                <RotateCcw
                  className="size-5"
                  strokeWidth={1.4}
                />
              </Button>


              {/* Play / Pause */}
              <Button
                className="size-[4.6rem] rounded-full bg-primary text-primary-foreground shadow-play transition-transform hover:bg-primary/90 active:scale-95"
                onClick={
                  togglePlay
                }
                aria-pressed={
                  isPlaying
                }
                aria-label={
                  isPlaying
                    ? `„${track.title}“ pausieren`
                    : `„${track.title}“ abspielen`
                }
              >
                {isPlaying ? (
                  <Pause className="size-7 fill-current" />
                ) : (
                  <Play className="ml-1 size-7 fill-current" />
                )}
              </Button>


              {/* 15 Sekunden vor */}
              <Button
                variant="ghost"
                size="icon"
                className="size-11 rounded-full text-muted-foreground transition-all hover:bg-secondary"
                onClick={() =>
                  skip(15)
                }
                aria-label={`15 Sekunden vorspringen in „${track.title}“`}
              >
                <RotateCw
                  className="size-5"
                  strokeWidth={1.4}
                />
              </Button>

            </div>


            {/* Wiedergabestatus */}
            <p
              className="mt-4 text-center text-xs text-muted-foreground"
              aria-live="polite"
            >
              {isPlaying
                ? "Läuft gerade"
                : "Pausiert"}
            </p>

          </>

        ) : (

          /* =================================================
             GESPERRTER PLAYER
             • kein Player
             • nur Hinweis auf Freischaltung
             ================================================= */

          <p className="mt-5 text-sm leading-6 text-muted-foreground">
            Noch nicht verfügbar.{" "}
            {track.unlockLabel}
          </p>
        )}

      </div>
    </article>

      <ListeningMode
        open={listeningOpen}
        onOpenChange={setListeningOpen}
        title={track.title}
        eyebrow={track.eyebrow}
        cover={track.cover}
        isPlaying={isPlaying}
        currentTime={currentTime}
        duration={duration}
        {...(track.duration ? { durationLabel: track.duration } : {})}
        onTogglePlay={togglePlay}
        onSkip={skip}
        onSeek={(seconds) => {
          const audio = audioRef.current;
          if (!audio) return;
          audio.currentTime = seconds;
          setCurrentTime(seconds);
        }}
      />
    </>
  );
}
