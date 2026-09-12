import { useEffect, useRef, useState } from "react";
import {
  Download,
  Lock,
  Pause,
  Play,
  RotateCcw,
  RotateCw,
} from "lucide-react";

import { LiquidGlass } from "@/components/liquid-glass";
import { Button } from "@/components/ui/button";

export type AudioTrack = {
  id: string;
  eyebrow: string;
  title: string;
  quote: string;
  cover: string;
  coverAlt: string;
  src: string;
  duration?: string;
  credit?: string;
  downloadUrl?: string;
  downloadLabel?: string;
  unlockAt?: string;
  unlockLabel?: string;
};

export function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";

  const minutes = Math.floor(seconds / 60);

  return `${minutes}:${String(Math.floor(seconds % 60)).padStart(2, "0")}`;
}

export function AudioCard({
  track,
  isActive,
  onPlay,
}: {
  track: AudioTrack;
  isActive: boolean;
  onPlay: (id: string | null) => void;
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [unlocked, setUnlocked] = useState(!track.unlockAt);

  useEffect(() => {
    if (!track.unlockAt) return;

    setUnlocked(Date.now() >= new Date(track.unlockAt).getTime());
  }, [track.unlockAt]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);

    const updateDuration = () => {
      setDuration(Number.isFinite(audio.duration) ? audio.duration : 0);
    };

    const stop = () => {
      setIsPlaying(false);
      onPlay(null);
    };

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("durationchange", updateDuration);
    audio.addEventListener("ended", stop);
    audio.addEventListener("pause", stop);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("durationchange", updateDuration);
      audio.removeEventListener("ended", stop);
      audio.removeEventListener("pause", stop);
    };
  }, [onPlay, unlocked]);

  useEffect(() => {
    if (!isActive && audioRef.current && !audioRef.current.paused) {
      audioRef.current.pause();
    }
  }, [isActive]);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      onPlay(track.id);

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

  const skip = (seconds: number) => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.currentTime = Math.max(
      0,
      Math.min(
        audio.duration || 0,
        audio.currentTime + seconds,
      ),
    );
  };

  return (
    <article
      className={`audio-player-card relative overflow-hidden rounded-[2rem] border p-3 ${
        isActive ? "is-active" : "is-dimmed"
      }`}
      aria-label={track.title}
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-20 h-px bg-gradient-to-r from-transparent via-white/90 to-transparent"
        aria-hidden="true"
      />

      <div
        className="audio-card-glow pointer-events-none absolute -right-16 -top-16 z-0 size-48 rounded-full bg-white/10 blur-3xl"
        aria-hidden="true"
      />

      {unlocked ? (
        <audio
          ref={audioRef}
          src={track.src}
          preload="metadata"
        />
      ) : null}

      <div className="relative z-10 aspect-square overflow-hidden rounded-[1.45rem]">
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

        <span className="absolute left-4 top-4 rounded-full border border-white/30 bg-black/10 px-3 py-1.5 text-[9px] font-medium uppercase tracking-[0.08em] text-white shadow-sm backdrop-blur-md">
          {track.eyebrow}
        </span>

        {!unlocked ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/15 px-6 text-center backdrop-blur-[5px]">
            <span className="flex size-12 items-center justify-center rounded-full border border-white/40 bg-white/15 text-white shadow-lg backdrop-blur-xl">
              <Lock
                className="size-5"
                strokeWidth={1.5}
              />
            </span>

            <p className="max-w-[15rem] text-sm font-medium leading-6 text-white drop-shadow-md">
              {track.unlockLabel}
            </p>
          </div>
        ) : null}
      </div>

      <div className="relative z-10 px-3 pb-3 pt-5">
        <h3 className="font-display text-2xl font-medium leading-tight">
          {track.title}
        </h3>

        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          {track.quote}
        </p>


        {unlocked ? (
          <>
            <div className="mt-6">
              <label
                className="sr-only"
                htmlFor={`progress-${track.id}`}
              >
                Wiedergabeposition
              </label>

              <input
                id={`progress-${track.id}`}
                type="range"
                min={0}
                max={duration || 1}
                step={0.1}
                value={currentTime}
                onChange={(event) => {
                  const audio = audioRef.current;
                  if (!audio) return;

                  const next = Number(event.target.value);

                  audio.currentTime = next;
                  setCurrentTime(next);
                }}
                className="player-range w-full"
                style={
                  {
                    "--player-progress": `${
                      duration
                        ? (currentTime / duration) * 100
                        : 0
                    }%`,
                  } as React.CSSProperties
                }
              />

              <div className="mt-3 flex justify-between text-xs font-medium tabular-nums text-muted-foreground">
                <span>{formatTime(currentTime)}</span>

                <span>
                  {duration
                    ? formatTime(duration)
                    : track.duration ?? "—"}
                </span>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-center gap-8">
              <Button
                variant="ghost"
                size="icon"
                className="size-11 rounded-full text-muted-foreground transition-all hover:bg-white/25"
                onClick={() => skip(-15)}
                aria-label="15 Sekunden zurück"
              >
                <RotateCcw
                  className="size-5"
                  strokeWidth={1.4}
                />
              </Button>

              <Button
                className="size-[4.6rem] rounded-full bg-primary text-primary-foreground shadow-play transition-transform hover:bg-primary/90 active:scale-95"
                onClick={togglePlay}
                aria-label={
                  isPlaying ? "Pause" : "Abspielen"
                }
              >
                {isPlaying ? (
                  <Pause className="size-7 fill-current" />
                ) : (
                  <Play className="ml-1 size-7 fill-current" />
                )}
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="size-11 rounded-full text-muted-foreground transition-all hover:bg-white/25"
                onClick={() => skip(15)}
                aria-label="15 Sekunden vor"
              >
                <RotateCw
                  className="size-5"
                  strokeWidth={1.4}
                />
              </Button>
            </div>
          </>
        }

        {unlocked && track.downloadUrl ? (
          <Button
            asChild
            variant="outline"
            className="mt-6 h-11 w-full rounded-full border-white/35 bg-white/15 shadow-none backdrop-blur-md transition-all hover:bg-white/25"
          >
            <a
              href={track.downloadUrl}
              target="_blank"
              rel="noreferrer"
            >
              <Download className="size-4" />
              {track.downloadLabel ?? "Impuls öffnen"}
            </a>
          </Button>
        ) : null}

        {track.credit ? (
          <p className="mt-5 text-[10px] leading-5 text-muted-foreground/70">
            {track.credit}
          </p>
        ) : null}
      </div>
    </article>
  );
}
