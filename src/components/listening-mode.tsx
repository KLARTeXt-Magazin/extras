import { useId, type CSSProperties, type Ref } from "react";
import { Pause, Play, X } from "lucide-react";

import { SignIcon, type SignVideo } from "@/components/sign-video";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { formatTime } from "@/lib/utils";

// ±15-Sekunden-Symbol: Kreispfeil mit „15“ in der Mitte
function SkipIcon({ forward = false }: { forward?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className="!size-7" aria-hidden="true" focusable="false">
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        transform={forward ? "translate(24 0) scale(-1 1)" : undefined}
      >
        <path d="M5.2 8.2A8 8 0 1 0 12 4h-1.6" />
        <path d="M12.4 1.8 10.2 4l2.2 2.2" />
      </g>
      <text
        x="12"
        y="15.6"
        textAnchor="middle"
        fontSize="7.4"
        fontWeight="700"
        fill="currentColor"
        fontFamily="inherit"
      >
        15
      </text>
    </svg>
  );
}

export type ListeningView = "audio" | "text" | "dgs";

type ListeningModeProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  eyebrow: string;
  cover: string;
  coverAlt?: string;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  onTogglePlay: () => void;
  onSkip: (seconds: number) => void;
  onSeek: (seconds: number) => void;
  // Gebärdenvideo: gleiche Steuerung, Umschalter oben
  signVideo?: SignVideo | null;
  // Text zum Mitlesen (Absätze), als eigene Ansicht im Umschalter
  transcript?: string[] | undefined;
  mode?: ListeningView;
  onModeChange?: (mode: ListeningView) => void;
  videoRef?: Ref<HTMLVideoElement>;
  // Farben der jeweiligen Audio (hell/dunkel), sonst Standardfarben
  accent?: string;
  accentInk?: string;
};

export function ListeningMode({
  open,
  onOpenChange,
  title,
  eyebrow,
  cover,
  coverAlt = "",
  isPlaying,
  currentTime,
  duration,
  onTogglePlay,
  onSkip,
  onSeek,
  signVideo,
  transcript,
  mode = "audio",
  onModeChange,
  videoRef,
  accent,
  accentInk,
}: ListeningModeProps) {
  const showVideo = Boolean(signVideo) && mode === "dgs";
  const showText = Boolean(transcript?.length) && mode === "text";
  const compact = showVideo || showText;
  const progressId = useId();
  const progress = duration ? (currentTime / duration) * 100 : 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={`listening-mode ${compact ? "listening-mode--video" : ""} fixed inset-0 left-0 top-0 z-[150] h-[100dvh] max-h-none w-full max-w-none translate-x-0 translate-y-0 gap-0 overflow-hidden border-0 p-0 shadow-none sm:rounded-none`}
        style={
          {
            ...(accent ? { "--listening-soft": accent } : {}),
            ...(accentInk ? { "--listening-deep": accentInk } : {}),
          } as CSSProperties
        }
      >
        <div className="relative z-10 mx-auto flex h-[100dvh] min-h-0 w-full max-w-[430px] flex-col px-6 pb-[max(2rem,env(safe-area-inset-bottom))] pt-[max(1.25rem,env(safe-area-inset-top))]">
          <div className="flex items-center justify-between gap-3">
            {signVideo || transcript?.length ? (
              <div className="listening-switch" role="group" aria-label="Ansicht wählen">
                <button
                  type="button"
                  aria-pressed={mode === "audio"}
                  onClick={() => onModeChange?.("audio")}
                >
                  Audio
                </button>
                {transcript?.length ? (
                  <button
                    type="button"
                    aria-pressed={mode === "text"}
                    onClick={() => onModeChange?.("text")}
                    aria-label="Text zum Mitlesen"
                  >
                    Text
                  </button>
                ) : null}
                {signVideo ? (
                  <button
                    type="button"
                    aria-pressed={mode === "dgs"}
                    onClick={() => onModeChange?.("dgs")}
                    aria-label="In Deutscher Gebärdensprache"
                  >
                    <SignIcon className="size-4" />
                    Gebärden
                  </button>
                ) : null}
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

          {/* Audio-Ansicht: Bild als großes Quadrat */}
          {!compact ? (
            <div className="listening-cover">
              <img src={cover} alt={coverAlt} width={1024} height={1024} />
            </div>
          ) : null}

          {showVideo && signVideo ? (
            <div className="listening-video">
              <div className="listening-video__frame">
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
            </div>
          ) : null}

          {showText && transcript ? (
            <div className="listening-text" tabIndex={0} aria-label={`Text zu „${title}“`}>
              {transcript.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          ) : null}

          <div className={compact ? "mt-4" : "mt-6"}>
            <p className="text-xs font-semibold tracking-[0.02em] text-listening-muted">
              {eyebrow}
            </p>

            <DialogTitle
              className={`mt-3 max-w-sm font-display font-semibold leading-[0.98] text-listening ${
                compact ? "text-2xl" : "text-[2rem]"
              }`}
            >
              {title}
            </DialogTitle>

            <DialogDescription className="sr-only">
              Großflächige Höransicht für „{title}“
            </DialogDescription>

            <div className={compact ? "mt-5" : "mt-6"}>
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
                <SkipIcon />
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
                <SkipIcon forward />
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
