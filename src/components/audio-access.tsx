// =======================================================
// BARRIEREFREIE ZUGÄNGE ZU EINEM AUDIO
// • „Text zum Mitlesen“: aufklappbarer Wortlaut (lib/transcripts.ts)
// • „In Gebärdensprache (DGS)“: erscheint nur, wenn beim Track
//   signVideo eingetragen ist
// • beides bleibt gesperrt, solange das Audio noch nicht
//   freigeschaltet ist (unlockAt)
// Später ändern:
// • Gebärdenvideo: Datei nach public/video/, Untertitel (.vtt)
//   daneben, dann beim Track signVideo ergänzen, z. B.
//   signVideo: { src: "/video/2026-q4_extra01-dgs.mp4",
//                captions: "/video/2026-q4_extra01-dgs.vtt",
//                poster: "/video/2026-q4_extra01-dgs.jpg" }
// =======================================================

import { useEffect, useState } from "react";
import { Hand, X } from "lucide-react";

import type { AudioTrack } from "@/components/audio-card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
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
  const [videoOpen, setVideoOpen] = useState(false);
  const paragraphs = transcripts[track.id];

  if (!paragraphs && !track.signVideo) return null;

  if (!unlocked) {
    return (
      <p className="mt-6 text-xs leading-6 text-muted-foreground">
        Text zum Mitlesen{track.signVideo ? " und Gebärdenvideo" : ""}: ab dem Tag der
        Freischaltung.
      </p>
    );
  }

  return (
    <div className="mt-7 grid gap-3">
      {track.signVideo ? (
        <>
          <Button
            type="button"
            variant="outline"
            className="h-11 w-fit rounded-full border-border bg-surface px-5 shadow-none"
            onClick={() => setVideoOpen(true)}
          >
            <Hand className="size-4" aria-hidden="true" />
            In Gebärdensprache (DGS)
          </Button>

          <Dialog open={videoOpen} onOpenChange={setVideoOpen}>
            <DialogContent className="sign-video-dialog w-[min(92vw,430px)] gap-3 rounded-2xl p-4">
              <div className="flex items-start justify-between gap-3">
                <DialogTitle className="font-display text-lg font-semibold leading-tight">
                  „{track.title}“ in Deutscher Gebärdensprache
                </DialogTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-11 shrink-0 rounded-full border"
                  onClick={() => setVideoOpen(false)}
                  aria-label="Gebärdenvideo schließen"
                >
                  <X className="size-5" strokeWidth={2.5} aria-hidden="true" />
                </Button>
              </div>
              <DialogDescription className="sr-only">
                Video mit Steuerung zum Abspielen und Pausieren
              </DialogDescription>
              <video
                className="aspect-[9/16] max-h-[70dvh] w-full rounded-xl bg-black object-contain"
                src={track.signVideo.src}
                poster={track.signVideo.poster}
                controls
                playsInline
                preload="none"
              >
                {track.signVideo.captions ? (
                  <track
                    kind="captions"
                    src={track.signVideo.captions}
                    srcLang="de"
                    label="Deutsch"
                    default
                  />
                ) : null}
              </video>
            </DialogContent>
          </Dialog>
        </>
      ) : null}

      {paragraphs ? (
        <details className="transcript">
          <summary className="transcript__summary">Text zum Mitlesen</summary>
          <div className="transcript__body">
            {paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </details>
      ) : null}
    </div>
  );
}
