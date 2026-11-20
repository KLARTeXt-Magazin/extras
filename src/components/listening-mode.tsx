import { useId, type CSSProperties, type Ref } from "react";
import { Pause, Play, RotateCcw, RotateCw, X } from "lucide-react";

import { SignIcon, type SignVideo } from "@/components/sign-video";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { formatTime } from "@/lib/utils";

type ListeningModeProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  eyebrow: string;
  cover: string;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  onTogglePlay: () => void;
  onSkip: (seconds: number) => void;
  onSeek: (seconds: number) => void;
  // Gebärdenvideo: gleiche Steuerung, Umschalter oben
  signVideo?: SignVideo | null;
  mode?: "audio" | "dgs";
  onModeChange?: (mode: "audio" | "dgs") => void;
  videoRef?: Ref<HTMLVideoElement>;
};

export function ListeningMode({
  open,
  onOpenChange,
  title,
  eyebrow,
  cover,
  isPlaying,
  currentTime,
  duration,
  onTogglePlay,
  onSkip,
  onSeek,
  signVideo,
  mode = "audio",
  onModeChange,
  videoRef,
}: ListeningModeProps) {
  const showVideo = Boolean(signVideo) && mode === "dgs";
  const progressId = useId();
  const progress = duration ? (currentTime / duration) * 100 : 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={`listening-mode ${showVideo ? "listening-mode--video" : ""} fixed inset-0 left-0 top-0 z-[150] h-[100dvh] max-h-none w-full max-w-none translate-x-0 translate-y-0 gap-0 overflow-hidden border-0 p-0 shadow-none sm:rounded-none`}
        style={{ "--listening-image": `url(${cover})` } as CSSProperties}
      >
        <div className="listening-mode__image" aria-hidden="true" />
        <div className="listening-mode__wash" aria-hidden="true" />

        <div className="relative z-10 mx-auto flex h-full w-full max-w-[430px] flex-col px-6 pb-[max(2rem,env(safe-area-inset-bottom))] pt-[max(1.25rem,env(safe-area-inset-top))]">
          <div className="flex items-center justify-between gap-3">
            {signVideo ? (
              <div className="listening-switch" role="group" aria-label="Ansicht wählen">
                <button
                  type="button"
                  aria-pressed={mode === "audio"}
                  onClick={() => onModeChange?.("audio")}
                >
                  Audio
                </button>
                <button
                  type="button"
                  aria-pressed={mode === "dgs"}
                  onClick={() => onModeChange?.("dgs")}
                >
                  <SignIcon className="size-4" />
                  Gebärdensprache
                </button>
              </div>
            ) : (
              <span />
            )}

            <Button
              variant="ghost"
              size="icon"
              className="listening-control listening-close size-12 rounded-full"
              onClick={() => onOpenChange(false)}
              aria-label="Höransicht schließen"
            >
              <X className="size-6" strokeWidth={2.5} aria-hidden="true" />
            </Button>
          </div>

          {showVideo && signVideo ? (
            <div className="listening-video">
              <video
                ref={videoRef}
                src={signVideo.src}
                poster={signVideo.poster}
                playsInline
                preload="metadata"
                onClick={onTogglePlay}
                aria-label={`„${title}“ in Deutscher Gebärdensprache`}
              >
                {signVideo.captions ? (
                  <track
                    kind="captions"
                    src={signVideo.captions}
                    srcLang="de"
                    label="Deutsch"
                    default
                  />
                ) : null}
              </video>
            </div>
          ) : null}

          <div className={showVideo ? "mt-4" : "mt-auto"}>
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-listening-muted">
              {eyebrow}
            </p>

            <DialogTitle
              className={`mt-3 max-w-sm font-display font-semibold leading-[0.98] text-listening ${
                showVideo ? "text-2xl" : "text-[2.6rem]"
              }`}
            >
              {title}
            </DialogTitle>

            <DialogDescription className="sr-only">
              Großflächige Höransicht für „{title}“
            </DialogDescription>

            <div className={showVideo ? "mt-5" : "mt-10"}>
              <label className="sr-only" htmlFor={progressId}>
                Wiedergabeposition in „{title}“
              </label>

              <input
                id={progressId}
                type="range"
                min={0}
                max={duration || 1}
                step={0.1}
                value={currentTime}
                onChange={(event) => onSeek(Number(event.target.value))}
                aria-valuetext={`${formatTime(currentTime)} von ${
                  duration ? formatTime(duration) : "unbekannt"
                } Minuten`}
                className="listening-range w-full"
                style={
                  {
                    "--player-progress": `${progress}%`,
                  } as CSSProperties
                }
              />

              <div className="mt-2 flex justify-between text-sm font-semibold tabular-nums text-listening-muted">
                <span>{formatTime(currentTime)}</span>
                <span>{duration ? formatTime(duration) : "—"}</span>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-center gap-8">
              <Button
                variant="ghost"
                size="icon"
                className="listening-control size-12 rounded-full"
                onClick={() => onSkip(-15)}
                aria-label={`15 Sekunden zurückspringen in „${title}“`}
              >
                <RotateCcw className="size-5" aria-hidden="true" />
              </Button>

              <Button
                className="listening-play size-20 rounded-full"
                onClick={onTogglePlay}
                aria-pressed={isPlaying}
                aria-label={isPlaying ? `„${title}“ pausieren` : `„${title}“ abspielen`}
              >
                {isPlaying ? (
                  <Pause className="size-8 fill-current" aria-hidden="true" />
                ) : (
                  <Play className="ml-1 size-8 fill-current" aria-hidden="true" />
                )}
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="listening-control size-12 rounded-full"
                onClick={() => onSkip(15)}
                aria-label={`15 Sekunden vorspringen in „${title}“`}
              >
                <RotateCw className="size-5" aria-hidden="true" />
              </Button>
            </div>

            <p
              className="mt-5 text-center text-xs font-medium text-listening-muted"
              aria-live="polite"
            >
              {isPlaying ? "Läuft gerade" : "Pausiert"}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
