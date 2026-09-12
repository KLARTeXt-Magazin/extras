import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  Download,
  Menu,
  Pause,
  Play,
  RotateCcw,
  RotateCw,
} from "lucide-react";

import coverImage from "../assets/zeit-fuer-dich-cover.jpg";
import coverImageNeu from "@/assets/pic_Z_M.jpg";
import { LiquidGlass } from "@/components/liquid-glass";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export const Route = createFileRoute("/")({
head: () => ({
  meta: [
    { title: "KLARTeXt. Extras zu Ausgabe 01: Warum Ehrlichkeit Mut braucht" },
    {
      name: "description",
      content: "Eine Achtsamkeitsübung der ersten Ausgabe von KLARTeXt.: Zeit für Dich",
    },
    { property: "og:title", content: "KLARTeXt. – Warum Ehrlichkeit Mut braucht" },
    {
      property: "og:description",
      content: "Die Audio-Übung „Zeit für dich“ zur ersten KLARTeXt.-Ausgabe.",
    },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ],
}),
  component: Index,
});

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const minutes = Math.floor(seconds / 60);
  return `${minutes}:${String(Math.floor(seconds % 60)).padStart(2, "0")}`;
}

const issues: {
  eyebrow: string;
  title: string;
  subtitle: string;
  to?: "/" | "/lichtblicke";
}[] = [
  {
    eyebrow: "Ausgabe 02 · 12/26",
    title: "Lichtblicke",
    subtitle: "Momente zum Innehalten · 4 Audios",
    to: "/lichtblicke",
  },
  {
    eyebrow: "Ausgabe 01 · 08/26",
    title: "Warum Ehrlichkeit Mut braucht",
    subtitle: "Zwischen Anpassung, Angst und Wahrheit",
    to: "/",
  },
  {
    eyebrow: "Ausgabe 03 · 2027",
    title: "Demnächst",
    subtitle: "Neue Themen in Vorbereitung",
  },
];

function Index() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const update = () => setHasScrolled(window.scrollY > 24);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(Number.isFinite(audio.duration) ? audio.duration : 0);
    const stop = () => setIsPlaying(false);
    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("durationchange", updateDuration);
    audio.addEventListener("ended", stop);
    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("durationchange", updateDuration);
      audio.removeEventListener("ended", stop);
    };
  }, []);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      try {
        await audio.play();
        setIsPlaying(true);
      } catch {
        setIsPlaying(false);
      }
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  };

  const skip = (seconds: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Math.max(0, Math.min(audio.duration || 0, audio.currentTime + seconds));
  };

  return (
    <main className="min-h-screen overflow-hidden bg-background font-body text-foreground">
      <audio ref={audioRef} src="/audio/2026-q3_extra01.m4a" preload="metadata" />

      <section
        className={`hero-presentation mx-auto flex min-h-[100svh] w-full max-w-[430px] flex-col px-5 pb-7 pt-24 sm:px-7 ${
          hasScrolled || isPlaying ? "is-compact" : ""
        }`}
      >
        <header
          className={`floating-site-header fixed inset-x-0 top-0 z-50 mx-auto grid h-16 w-full max-w-[430px] grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 sm:px-7 ${
            hasScrolled ? "is-scrolled" : ""
          }`}
        >
          <div className="min-w-0">
            <a
              href="https://www.magazin-klartext.de/"
              target="_blank"
              rel="noreferrer"
              className="block w-fit"
              aria-label="Zum KLARTeXt. Magazin"
            >
              <img src="/logo.png" alt="KLARTeXt." className="h-10 w-auto" />
            </a>
          </div>

          <Sheet>
  <SheetTrigger asChild>
    <Button
      variant="ghost"
      size="icon"
      className="liquid-glass-button size-10 shrink-0 rounded-full"
      aria-label="Ausgaben öffnen"
    >
      <Menu className="size-[18px]" strokeWidth={1.5} />
    </Button>
  </SheetTrigger>

  <SheetContent
    side="right"
    className="issue-sheet w-[92%] border-0 bg-transparent p-3 shadow-none sm:max-w-sm"
  >
    <LiquidGlass
      className="issue-panel h-full w-full overflow-y-auto rounded-[2rem]"
      intensity="strong"
    >
      <div className="px-7 py-10">
        <SheetHeader className="mt-8 text-left">
          <p className="text-[10px] font-medium uppercase tracking-[0.1em] text-foreground/65">
            KLARTeXt. Extras
          </p>

          <SheetTitle className="font-display text-3xl font-semibold text-foreground">
            Alle Ausgaben
          </SheetTitle>

          <SheetDescription className="font-body text-foreground/65">
            Extras zu den Ausgaben.
          </SheetDescription>
        </SheetHeader>

        <nav className="mt-10" aria-label="Ausgaben">
          {issues.map((issue, index) => {
            const content = (
              <>
                <span className="text-[9px] font-semibold uppercase tracking-[0.12em] text-foreground/60">
                  {issue.eyebrow}
                </span>

                <span className="mt-2 block font-display text-[2rem] font-semibold leading-[1.02] tracking-[-0.025em] text-foreground">
                  {issue.title}
                </span>

                <span className="mt-2 block max-w-[17rem] text-sm leading-6 text-foreground/65">
                  {issue.subtitle}
                </span>
              </>
            );

            return issue.to ? (
              <SheetClose asChild key={issue.title}>
                <Link
                  to={issue.to}
                  className={`issue-entry ${
                    index === 1 ? "issue-entry-current" : ""
                  }`}
                >
                  {content}
                </Link>
              </SheetClose>
            ) : (
              <div
                key={issue.title}
                className="issue-entry opacity-40"
              >
                {content}
              </div>
            );
          })}
        </nav>

        <a
          href="https://www.magazin-klartext.de/"
          target="_blank"
          rel="noreferrer"
          className="mt-8 inline-block text-xs font-medium text-foreground underline underline-offset-4"
        >
          Zum Magazin
        </a>
      </div>
    </LiquidGlass>
  </SheetContent>
</Sheet>
        </header>

        <div className="mt-4">
          <p className="text-[10px] font-medium uppercase text-muted-foreground">Ausgabe 01 · 08/26</p>
          <h1 className="hero-title mt-3 max-w-[340px] font-display text-[clamp(2.7rem,13vw,4rem)] font-semibold leading-[0.93] tracking-[-0.02em]">
            Warum Ehrlichkeit Mut braucht
          </h1>
        </div>
        
        <section className="audio-player-card is-active relative mt-7 overflow-hidden rounded-[2rem] border p-3 backdrop-blur-2xl" aria-label="Audio-Player">
          <div className="relative aspect-square overflow-hidden rounded-[1.45rem]">
            <img src={coverImageNeu} alt="Ruhiger Stein auf dunklem Holz im warmen Morgenlicht" width={1024} height={1024} className="h-full w-full object-cover" />
            <span className="absolute left-4 top-4 rounded-full border border-light/35 bg-surface/45 px-3 py-1.5 text-[9px] font-medium uppercase text-foreground backdrop-blur-xl">
              Auszeit
            </span>
          </div>

          <div className="px-3 pb-3 pt-5">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4">
              <div className="min-w-0">
                <h2 className="truncate font-display text-2xl font-medium">Zeit für Dich</h2>
                <p className="mt-1 truncate text-xs text-muted-foreground">„Du musst nicht immer stark sein."</p>
              </div>
            </div>

            <div className="mt-6">
              <label className="sr-only" htmlFor="audio-progress">Wiedergabeposition</label>
              <input
                id="audio-progress"
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
                style={{ "--player-progress": `${duration ? (currentTime / duration) * 100 : 0}%` } as React.CSSProperties}
              />
              <div className="mt-2.5 flex justify-between text-[10px] tabular-nums text-muted-foreground">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-center gap-8">
              <Button variant="ghost" size="icon" className="size-11 rounded-full text-muted-foreground hover:bg-secondary" onClick={() => skip(-15)} aria-label="15 Sekunden zurück">
                <RotateCcw className="size-5" strokeWidth={1.4} />
              </Button>
              <Button className="size-[4.6rem] rounded-full bg-primary text-primary-foreground shadow-play hover:bg-primary/90 active:scale-95" onClick={togglePlay} aria-label={isPlaying ? "Pause" : "Abspielen"}>
                {isPlaying ? <Pause className="size-7 fill-current" /> : <Play className="ml-1 size-7 fill-current" />}
              </Button>
              <Button variant="ghost" size="icon" className="size-11 rounded-full text-muted-foreground hover:bg-secondary" onClick={() => skip(15)} aria-label="15 Sekunden vor">
                <RotateCw className="size-5" strokeWidth={1.4} />
              </Button>
            </div>
          </div>
        </section>

        <p className="mt-auto pt-8 text-center text-[9px] uppercase text-muted-foreground">Scroll für mehr</p>
      </section>

      <section className="border-t border-border bg-secondary/45 px-6 py-24">
        <div className="mx-auto max-w-[430px]">
          <p className="text-[10px] font-medium uppercase text-muted-foreground">Ein Moment für dich</p>
          <h2 className="mt-5 font-display text-4xl font-medium leading-tight">„Wie geht es mir eigentlich gerade wirklich, nicht, wie es sein sollte?“</h2>
          <p className="mt-7 max-w-sm text-sm leading-7 text-muted-foreground">
            Das Audio-Extra der ersten Ausgabe ist eine kurze Pause, wenn gerade viel im Kopf los ist. Ein paar Minuten, in denen es einmal nicht darum geht, etwas zu schaffen oder zu lösen, sondern wahrzunehmen, wie es dir gerade geht.
          </p>
          <Button asChild variant="outline" className="mt-9 h-12 rounded-full border-border bg-surface px-5 shadow-none">
            <a href={"/pdf/2026-q3_Auszeit01.pdf"} target="_blank" rel="noreferrer">
              <Download className="size-4" /> Impuls zum Downloaden
            </a>
          </Button>
        </div>
      </section>

      <footer className="bg-primary px-6 py-12 text-primary-foreground">
        <div className="mx-auto flex max-w-[430px] items-end justify-between gap-6">
          <div>
            <p className="font-display text-lg font-semibold">KLARTeXt.</p>
            <p className="mt-1 text-[10px] uppercase opacity-60">Echt. Mutig. Klar.</p>
          </div>
          <div className="flex gap-4 text-[10px] opacity-70">
            <a href="https://www.magazin-klartext.de/impressum/" target="_blank" rel="noreferrer">Impressum</a>
            <a href="https://www.magazin-klartext.de/datenschutzerklaerung/" target="_blank" rel="noreferrer">Datenschutz</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
