// =======================================================
// GEBÄRDENVIDEO (DGS) AN DER AUDIOKACHEL
// So kommt ein Video dazu – sonst nichts ändern:
// • Datei nach src/videos/ legen, Name = id des Tracks:
//     nikolaus.mp4, heiligabend.mp4, moment.mp4, pmr.mp4,
//     zeit-fuer-dich.mp4
// • optional daneben: gleicher Name als .vtt (Untertitel)
//   und als .jpg (Standbild vor dem Abspielen)
// • ohne Video erscheint kein Button
// =======================================================

import { useState } from "react";
import { Hand, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";

const files = import.meta.glob("../videos/*.{mp4,vtt,jpg}", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

function fileFor(id: string, ext: string) {
  return files[`../videos/${id}.${ext}`];
}

export function SignVideoButton({ id, title }: { id: string; title: string }) {
  const [open, setOpen] = useState(false);
  const src = fileFor(id, "mp4");
  if (!src) return null;

  const captions = fileFor(id, "vtt");

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        className="sign-video-button mt-2 min-h-11 w-full rounded-full px-5"
        onClick={() => setOpen(true)}
        aria-label={`„${title}“ in Gebärdensprache ansehen`}
      >
        <Hand className="size-4" aria-hidden="true" />
        In Gebärdensprache
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-[min(92vw,430px)] gap-3 rounded-2xl p-4">
          <div className="flex items-start justify-between gap-3">
            <DialogTitle className="font-display text-lg font-semibold leading-tight">
              „{title}“ in Deutscher Gebärdensprache
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              className="size-11 shrink-0 rounded-full border"
              onClick={() => setOpen(false)}
              aria-label="Gebärdenvideo schließen"
            >
              <X className="size-5" strokeWidth={2.5} aria-hidden="true" />
            </Button>
          </div>
          <DialogDescription className="sr-only">
            Video mit Steuerung zum Abspielen und Pausieren
          </DialogDescription>
          <video
            className="max-h-[70dvh] w-full rounded-xl bg-black object-contain"
            src={src}
            poster={fileFor(id, "jpg")}
            controls
            playsInline
            preload="none"
          >
            {captions ? (
              <track kind="captions" src={captions} srcLang="de" label="Deutsch" default />
            ) : null}
          </video>
        </DialogContent>
      </Dialog>
    </>
  );
}
