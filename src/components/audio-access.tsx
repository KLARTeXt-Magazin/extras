// =======================================================
// TEXT ZUM MITLESEN
// • aufklappbarer Wortlaut eines Audios (lib/transcripts.ts)
// • bleibt gesperrt, solange das Audio noch nicht
//   freigeschaltet ist (unlockAt)
// • Gebärdenvideos: siehe components/sign-video.tsx
// =======================================================

import { useEffect, useState } from "react";

import type { AudioTrack } from "@/components/audio-card";
import { transcripts } from "@/lib/transcripts";

function useUnlocked(unlockAt?: string) {
  const [unlocked, setUnlocked] = useState(!unlockAt);

  useEffect(() => {
    if (!unlockAt) return;
    setUnlocked(Date.now() >= new Date(unlockAt).getTime());
  }, [unlockAt]);

  return unlocked;
}

export function AudioAccess({ track }: { track: AudioTrack }) {
  const unlocked = useUnlocked(track.unlockAt);
  const paragraphs = transcripts[track.id];

  if (!paragraphs) return null;

  if (!unlocked) {
    return (
      <p className="mt-6 text-xs leading-6 text-muted-foreground">
        Text zum Mitlesen: ab dem Tag der Freischaltung.
      </p>
    );
  }

  return (
    <details className="transcript mt-7">
      <summary className="transcript__summary">Text zum Mitlesen</summary>
      <div className="transcript__body">
        {paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </details>
  );
}
