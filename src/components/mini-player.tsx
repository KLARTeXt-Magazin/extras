// =======================================================
// MINI-PLAYER
// • schwebende Glas-Kapsel unten (einziges Glas-Element
//   für Inhalte), erscheint nach dem ersten Abspielen
// • bleibt auf allen Seiten, Tipp öffnet den Vollbild-Player
// • Zustand kommt aus src/lib/player.tsx
// =======================================================

import { Pause, Play } from "lucide-react";
import type { CSSProperties } from "react";

import { usePlayer } from "@/lib/player-context";

export function MiniPlayer() {
  const { track, isPlaying, currentTime, duration, toggle, expand } = usePlayer();
  if (!track) return null;

  const progress = duration ? Math.min(100, (currentTime / duration) * 100) : 0;

  return (
    <div className="mini-player" role="region" aria-label="Mini-Player">
      <button
        type="button"
        className="mini-player__open"
        onClick={expand}
        aria-label={`Player öffnen: „${track.title}“`}
      >
        <img src={track.cover} alt="" width={96} height={96} className="mini-player__cover" />
        <span className="mini-player__text">
          <span className="mini-player__eyebrow">{track.eyebrow}</span>
          <span className="mini-player__title">{track.title}</span>
        </span>
      </button>

      <button
        type="button"
        className="mini-player__play"
        onClick={toggle}
        aria-pressed={isPlaying}
        aria-label={isPlaying ? `„${track.title}“ pausieren` : `„${track.title}“ abspielen`}
      >
        {isPlaying ? (
          <Pause className="size-5 fill-current" aria-hidden="true" />
        ) : (
          <Play className="ml-0.5 size-5 fill-current" aria-hidden="true" />
        )}
      </button>

      <span
        className="mini-player__progress"
        aria-hidden="true"
        style={{ "--mini-progress": `${progress}%` } as CSSProperties}
      />
    </div>
  );
}
