// =======================================================
// AUFBAU EINER AUSGABEN-SEITE (drei Ebenen)
// 1. IssueHead  – Heft-Cover, Verlauf in die Ausgabenfarbe, Titel
// 2. IssueSheet (.content-sheet) – Sandblatt mit runden Ecken oben, darauf:
//    • AudioShelf – „Hören“: Regal mit quadratischen Karten
//    • ReadRow / ReadLink – „Lesen“: Liste mit Zeilen
// 3. Mini-Player – schwebt darüber (src/lib/player.tsx)
// Farben: Ausgabe → issues.ts (color/accent),
//         Audio → Track (ink/accent)
// =======================================================

import { ArrowDown, ArrowRight, ChevronDown, Download, Lock, Pause, Play } from "lucide-react";
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

import { AudioAccess } from "@/components/audio-access";
import { PdfDownloadLink } from "@/components/pdf-download-link";
import { Button } from "@/components/ui/button";
import { SignIcon, useSignVideo } from "@/components/sign-video";
import type { Issue } from "@/lib/issues";
import { usePlayer } from "@/lib/player";
import { useUnlocked, type AudioTrack } from "@/lib/tracks";

// -------------------------------------------------------
// 1. KOPF
// -------------------------------------------------------
export function IssueHead({
  issue,
  title = issue.title,
  intro,
}: {
  issue: Issue;
  title?: string;
  intro?: ReactNode;
}) {
  return (
    <header
      className="issue-head"
      style={
        {
          "--issue-color": issue.color ?? "var(--wine)",
          "--issue-accent": issue.accent ?? "var(--secondary)",
          "--cover-focus": issue.coverFocus ?? "50% 35%",
        } as CSSProperties
      }
    >
      {issue.cover ? (
        <img
          src={issue.cover}
          alt={`Cover von ${issue.eyebrow}`}
          width={619}
          height={875}
          className="issue-head__image"
        />
      ) : null}
      <div className="issue-head__text">
        <p className="issue-head__eyebrow">{issue.eyebrow}</p>
        <h1 className="issue-head__title">{title}</h1>
        {intro ? <p className="issue-head__intro">{intro}</p> : null}
      </div>
    </header>
  );
}

// -------------------------------------------------------
// 2. SANDBLATT + ABSCHNITTSKOPF
// -------------------------------------------------------
export function IssueSheet({ children }: { children: ReactNode }) {
  return <div className="content-sheet">{children}</div>;
}

export function SectionHead({ id, title, count }: { id: string; title: string; count?: string }) {
  return (
    <div className="section-head">
      <h2 id={id} className="section-head__title">
        {title}
      </h2>
      {count ? <span className="section-head__count">{count}</span> : null}
    </div>
  );
}

// -------------------------------------------------------
// HÖREN: horizontales Regal
// • Hash wie /lichtblicke#heiligabend scrollt zur Karte
//   und hebt sie hervor (QR-Codes im Heft)
// -------------------------------------------------------
export function AudioShelf({ tracks, labelledBy }: { tracks: AudioTrack[]; labelledBy: string }) {
  const shelfRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [highlightId, setHighlightId] = useState<string | null>(null);
  // „in Hören hineingescrollt“: oben auf der Seite kleine Kacheln, dann groß
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const shelf = shelfRef.current;
    if (!shelf) return;
    let frame = 0;
    const check = () => {
      frame = 0;
      setIsOpen(shelf.getBoundingClientRect().top < window.innerHeight * 0.5);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(check);
    };
    check();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  // gewählt ist die Karte am Einrastpunkt (links) – schon während des Wischens
  useEffect(() => {
    const shelf = shelfRef.current;
    if (!shelf) return;
    let frame = 0;
    const select = () => {
      frame = 0;
      const snap =
        shelf.getBoundingClientRect().left +
        (parseFloat(getComputedStyle(shelf).scrollPaddingInlineStart) || 0);
      let nearest = 0;
      let distance = Number.POSITIVE_INFINITY;
      shelf.querySelectorAll<HTMLElement>("[data-track]").forEach((card, index) => {
        const d = Math.abs(card.getBoundingClientRect().left - snap);
        if (d < distance) {
          distance = d;
          nearest = index;
        }
      });
      setActiveIndex(nearest);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(select);
    };
    shelf.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      shelf.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  const goTo = (index: number) => {
    const shelf = shelfRef.current;
    const card = shelf?.querySelectorAll<HTMLElement>("[data-track]")[index];
    if (!shelf || !card) return;
    setActiveIndex(index);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    shelf.scrollTo({
      left:
        card.offsetLeft -
        shelf.offsetLeft -
        (parseFloat(getComputedStyle(shelf).scrollPaddingInlineStart) || 0),
      behavior: reduced ? "auto" : "smooth",
    });
  };

  // Hash wie /lichtblicke#heiligabend: Karte wählen und hervorheben (QR-Codes)
  useEffect(() => {
    let timer = 0;
    const fromHash = () => {
      const id = window.location.hash.replace("#", "");
      const index = tracks.findIndex((track) => track.id === id);
      if (index < 0) return;
      shelfRef.current?.closest("section")?.scrollIntoView({ block: "start" });
      requestAnimationFrame(() => goTo(index));
      setHighlightId(id);
      window.clearTimeout(timer);
      timer = window.setTimeout(() => setHighlightId(null), 3000);
    };
    requestAnimationFrame(fromHash);
    window.addEventListener("hashchange", fromHash);
    return () => {
      window.removeEventListener("hashchange", fromHash);
      window.clearTimeout(timer);
    };
  }, [tracks]);

  const active = tracks[activeIndex] ?? tracks[0];

  return (
    <>
      <div
        ref={shelfRef}
        className={`audio-shelf ${isOpen ? "is-open" : ""}`}
        role="list"
        aria-labelledby={labelledBy}
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === "ArrowRight") goTo(Math.min(tracks.length - 1, activeIndex + 1));
          if (event.key === "ArrowLeft") goTo(Math.max(0, activeIndex - 1));
        }}
      >
        {tracks.map((track, index) => (
          <ShelfCard
            key={track.id}
            track={track}
            active={index === activeIndex}
            highlight={highlightId === track.id}
            onSelect={() => goTo(index)}
          />
        ))}
      </div>

      {active ? <Companion track={active} /> : null}
    </>
  );
}

// Begleitimpuls zur gewählten Audio, in ihrer Farbe
function Companion({ track }: { track: AudioTrack }) {
  return (
    <section
      className="companion-band px-5 pt-3"
      style={{ "--audio-accent": track.accent, "--audio-accent-ink": track.ink } as CSSProperties}
      aria-label={`Begleitimpuls zu ${track.title}`}
      aria-live="polite"
    >
      <div key={track.id} className="companion-inner companion-swap mx-auto w-full max-w-[430px]">
        <p className="companion-kicker text-xs font-semibold">
          {track.kicker ?? `Begleitimpuls · ${track.coverWord ?? track.title}`}
        </p>

        {track.quote ? (
          <p className="companion-quote mt-4 font-display text-xl font-medium leading-8">
            {track.quote}
          </p>
        ) : null}

        {track.note ? (
          <p className="mt-5 text-sm leading-7 text-muted-foreground">{track.note}</p>
        ) : null}

        {track.downloadUrl ? (
          <Button
            asChild
            variant="outline"
            className="mt-7 h-11 rounded-full border-border bg-surface px-5 shadow-none"
          >
            <PdfDownloadLink href={track.downloadUrl}>
              <Download className="size-4" />
              {track.downloadLabel ?? "Impuls öffnen"}
            </PdfDownloadLink>
          </Button>
        ) : null}

        {track.moreHref ? (
          <a href={track.moreHref} className="companion-more mt-6">
            {track.moreLabel ?? "Mehr dazu"}
            <ArrowDown className="size-4" aria-hidden="true" />
          </a>
        ) : null}

        <AudioAccess track={track} />

        {track.credit ? (
          <p className="mt-7 text-[11px] leading-5 text-muted-foreground">{track.credit}</p>
        ) : null}
      </div>
    </section>
  );
}

function ShelfCard({
  track,
  active,
  highlight,
  onSelect,
}: {
  track: AudioTrack;
  active: boolean;
  highlight: boolean;
  onSelect: () => void;
}) {
  const unlocked = useUnlocked(track.unlockAt);
  const player = usePlayer();
  const signVideo = useSignVideo(track.id);
  const isCurrent = player.track?.id === track.id;
  const isPlaying = isCurrent && player.isPlaying;

  return (
    <article
      id={track.id}
      data-track={track.id}
      role="listitem"
      className={`shelf-card ${unlocked ? "" : "is-locked"} ${isCurrent ? "is-current" : ""} ${
        highlight ? "is-highlight" : ""
      } ${active ? "is-active" : ""}`}
      onClickCapture={(event) => {
        // Tipp auf eine kleine Nachbarkarte holt sie erst nach vorn
        if (active) return;
        event.preventDefault();
        event.stopPropagation();
        onSelect();
      }}
      style={{ "--card-ink": track.ink, "--card-accent": track.accent } as CSSProperties}
    >
      {unlocked ? (
        <button
          type="button"
          className="shelf-card__open"
          onClick={() => player.open(track)}
          aria-label={`Player öffnen: „${track.title}“`}
        />
      ) : null}

      <p className="shelf-card__eyebrow">{track.eyebrow}</p>

      <Waveform />

      <h3 className="shelf-card__title">{track.title}</h3>

      <div className="shelf-card__foot">
        <p className="shelf-card__meta">
          {unlocked ? (
            <>
              {isPlaying ? "Läuft gerade" : track.duration}
              {signVideo ? (
                <span className="shelf-card__dgs" title="Auch in Gebärdensprache">
                  <SignIcon className="size-3.5" />
                  DGS
                </span>
              ) : null}
            </>
          ) : (
            track.unlockLabel
          )}
        </p>

        {unlocked ? (
          <button
            type="button"
            className="shelf-card__play"
            onClick={() => (isCurrent ? player.toggle() : player.play(track))}
            aria-pressed={isPlaying}
            aria-label={isPlaying ? `„${track.title}“ pausieren` : `„${track.title}“ abspielen`}
          >
            {isPlaying ? (
              <Pause className="size-5 fill-current" aria-hidden="true" />
            ) : (
              <Play className="ml-0.5 size-5 fill-current" aria-hidden="true" />
            )}
          </button>
        ) : (
          <span className="shelf-card__lock" aria-hidden="true">
            <Lock className="size-5" strokeWidth={1.75} />
          </span>
        )}
      </div>
    </article>
  );
}

// ruhige, feste Wellenform als Schmuck (keine echte Analyse)
function Waveform() {
  const bars = [8, 14, 22, 12, 28, 18, 34, 20, 26, 12, 30, 16, 22, 10, 18, 26, 14, 8];
  return (
    <svg className="shelf-card__wave" viewBox="0 0 108 36" aria-hidden="true" focusable="false">
      {bars.map((height, index) => (
        <rect
          key={index}
          x={index * 6}
          y={(36 - height) / 2}
          width="3"
          height={height}
          rx="1.5"
          fill="currentColor"
        />
      ))}
    </svg>
  );
}

// -------------------------------------------------------
// LESEN: Zeilen (aufklappbar) und PDF-Zeilen
// -------------------------------------------------------
export function readingTime(...texts: (string | undefined)[]) {
  const words = texts.join(" ").split(/\s+/).filter(Boolean).length;
  return `Lesen · ${Math.max(1, Math.round(words / 180))} Min`;
}

export function ReadRow({
  id,
  color,
  kicker,
  title,
  teaser,
  meta,
  children,
}: {
  id?: string;
  color: string;
  kicker?: string;
  title: ReactNode;
  teaser?: string;
  meta: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDetailsElement | null>(null);

  // Sprungmarke (z. B. #pmr-beitrag) öffnet die Zeile
  useEffect(() => {
    if (!id) return;
    const openFromHash = () => {
      if (window.location.hash === `#${id}` && ref.current) {
        ref.current.open = true;
        ref.current.scrollIntoView({ block: "start" });
      }
    };
    openFromHash();
    window.addEventListener("hashchange", openFromHash);
    return () => window.removeEventListener("hashchange", openFromHash);
  }, [id]);

  return (
    <details
      ref={ref}
      id={id}
      className="read-row"
      style={{ "--row-color": color } as CSSProperties}
    >
      <summary className="read-row__summary">
        <span className="read-row__bar" aria-hidden="true" />
        <span className="read-row__main">
          {kicker ? <span className="read-row__kicker">{kicker}</span> : null}
          <span className="read-row__title">{title}</span>
          {teaser ? <span className="read-row__teaser">{teaser}</span> : null}
          <span className="read-row__meta">{meta}</span>
        </span>
        <ChevronDown className="read-row__arrow" aria-hidden="true" />
      </summary>
      <div className="read-row__body">{children}</div>
    </details>
  );
}

export function ReadLink({
  href,
  color,
  title,
  teaser,
  meta,
}: {
  href: string;
  color: string;
  title: string;
  teaser?: string;
  meta: string;
}) {
  return (
    <PdfDownloadLink
      href={href}
      className="read-row read-row__summary"
      style={{ "--row-color": color } as CSSProperties}
    >
      <span className="read-row__bar" aria-hidden="true" />
      <span className="read-row__main">
        <span className="read-row__title">{title}</span>
        {teaser ? <span className="read-row__teaser">{teaser}</span> : null}
        <span className="read-row__meta">{meta}</span>
      </span>
      <ArrowRight className="read-row__arrow" aria-hidden="true" />
    </PdfDownloadLink>
  );
}
