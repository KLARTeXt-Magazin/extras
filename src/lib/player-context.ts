import { createContext, useContext } from "react";

import type { AudioTrack } from "@/lib/tracks";
import type { ListeningView } from "@/components/listening-mode";

export type PlayerState = {
  track: AudioTrack | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  play: (track: AudioTrack) => void;
  open: (track: AudioTrack, view?: ListeningView) => void;
  toggle: () => void;
  expand: () => void;
};

export const PlayerContext = createContext<PlayerState | null>(null);

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (!context) throw new Error("usePlayer nur innerhalb von PlayerProvider");
  return context;
}
