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

import { ArrowRight, ChevronDown, Lock, Pause, Play } from "lucide-react";
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

import { PdfDownloadLink } from "@/components/pdf-download-link";
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
  const [highlightId, setHighlightId] = useState<string | null>(null);

  useEffect(() => {
    let timer = 0;
    const highlight = () => {
      const id = window.location.hash.replace("#", "");
      if (!id || !tracks.some((track) => track.id === id)) return;
      const shelf = shelfRef.current;
      const card = shelf?.querySelector<HTMLElement>(`[data-track="${id}"]`);
      if (!shelf || !card) return;
      shelf.closest("section")?.scrollIntoView({ block: "start" });
      // nur das Regal seitlich verschieben, nicht die Seite
      shelf.scrollLeft = card.offsetLeft - shelf.offsetLeft - 20;
      setHighlightId(id);
      window.clearTimeout(timer);
      timer = window.setTimeout(() => setHighlightId(null), 3000);
    };
    requestAnimationFrame(highlight);
    window.addEventListener("hashchange", highlight);
    return () => {
      window.removeEventListener("hashchange", highlight);
      window.clearTimeout(timer);
    };
  }, [tracks]);

  return (
    <div ref={shelfRef} className="audio-shelf" role="list" aria-labelledby={labelledBy}>
      {tracks.map((track) => (
        <ShelfCard key={track.id} track={track} highlight={highlightId === track.id} />
      ))}
    </div>
  );
}

function ShelfCard({ track, highlight }: { track: AudioTrack; highlight: boolean }) {
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
      }`}
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
