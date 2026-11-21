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

import {
  ArrowDown,
  ArrowRight,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Download,
  Lock,
  Pause,
  Play,
} from "lucide-react";
import { flushSync } from "react-dom";
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent,
  type ReactNode,
} from "react";

import { AudioAccess } from "@/components/audio-access";
import { PdfDownloadLink } from "@/components/pdf-download-link";
import { Button } from "@/components/ui/button";
import { SignIcon, SignVideoButton, useSignVideo } from "@/components/sign-video";
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
export function IssueSheet({ children, flat = false }: { children: ReactNode; flat?: boolean }) {
  return <div className={`content-sheet ${flat ? "content-sheet--flat" : ""}`}>{children}</div>;
}

export function SectionHead({
  id,
  title,
  count,
  action,
}: {
  id: string;
  title: string;
  count?: string;
  action?: ReactNode;
}) {
  return (
    <div className="section-head">
      <h2 id={id} className="section-head__title">
        {title}
      </h2>
      <span className="section-head__side">
        {count ? <span className="section-head__count">{count}</span> : null}
        {action}
      </span>
    </div>
  );
}

// -------------------------------------------------------
// HÖREN: horizontales Regal
// • Hash wie /lichtblicke#heiligabend scrollt zur Karte
//   und hebt sie hervor (QR-Codes im Heft)
// -------------------------------------------------------
export function AudioShelf({ tracks, count }: { tracks: AudioTrack[]; count: string }) {
  const labelledBy = "hoeren-titel";
  const shelfRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [highlightId, setHighlightId] = useState<string | null>(null);
  // „in Hören hineingescrollt“: oben auf der Seite kleine Kacheln, dann groß
  const [autoOpen, setAutoOpen] = useState(false);
  // selbst auf- oder zugeklappt? Dann gilt das statt des Scrollens.
  const [manualOpen, setManualOpen] = useState<boolean | null>(null);
  const isOpen = manualOpen ?? autoOpen;

  // Wechsel klein ⇄ groß als fließender Übergang (View Transitions),
  // ohne Unterstützung oder bei „Bewegung reduzieren“ einfach direkt
  const smoothly = (update: () => void) => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const doc = document as Document & {
      startViewTransition?: (callback: () => void) => unknown;
    };
    if (reduced || !doc.startViewTransition) {
      update();
      return;
    }
    doc.startViewTransition(() => flushSync(update));
  };

  useEffect(() => {
    const shelf = shelfRef.current;
    if (!shelf) return;
    let frame = 0;
    const check = () => {
      frame = 0;
      // erst wenn man weiter in „Hören“ hineinscrollt: große Karten.
      // Zwei Schwellen, damit nichts flackert, wenn man genau dort stehen bleibt.
      const top = shelf.getBoundingClientRect().top;
      setAutoOpen((open) =>
        open ? top < window.innerHeight * 0.6 : top < window.innerHeight * 0.32,
      );
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
      <SectionHead
        id={labelledBy}
        title="Hören"
        count={count}
        action={
          <button
            type="button"
            className="section-toggle"
            onClick={() => smoothly(() => setManualOpen(!isOpen))}
            aria-expanded={isOpen}
          >
            {isOpen ? "Kleiner" : "Groß ansehen"}
            <ChevronDown aria-hidden="true" />
          </button>
        }
      />

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
            big={isOpen}
            onSelect={() => goTo(index)}
          />
        ))}
      </div>

      {/* Pfeile und Punkte, nur bei den großen Karten */}
      {isOpen && tracks.length > 1 && active ? (
        <div
          className="carousel-nav flex items-center justify-center gap-3 px-5"
          style={
            {
              "--audio-accent": active.accent,
              "--audio-accent-ink": active.ink,
            } as CSSProperties
          }
        >
          <button
            type="button"
            className="carousel-arrow"
            onClick={() => goTo(Math.max(0, activeIndex - 1))}
            disabled={activeIndex === 0}
            aria-label="Vorheriges Audio"
          >
            <ChevronLeft className="size-5" strokeWidth={2.25} aria-hidden="true" />
          </button>
          <div className="flex" role="group" aria-label="Audios wechseln">
            {tracks.map((track, index) => (
              <button
                key={track.id}
                type="button"
                aria-current={index === activeIndex}
                aria-label={`Audio ${index + 1} von ${tracks.length}: ${track.title}`}
                onClick={() => goTo(index)}
                className="carousel-dot-button"
              >
                <span
                  aria-hidden="true"
                  className={`carousel-dot ${index === activeIndex ? "w-7" : "w-2"}`}
                />
              </button>
            ))}
          </div>
          <button
            type="button"
            className="carousel-arrow"
            onClick={() => goTo(Math.min(tracks.length - 1, activeIndex + 1))}
            disabled={activeIndex === tracks.length - 1}
            aria-label="Nächstes Audio"
          >
            <ChevronRight className="size-5" strokeWidth={2.25} aria-hidden="true" />
          </button>
        </div>
      ) : null}

      {active ? (
        <Companion
          track={active}
          compact={!isOpen}
          onExpand={() => smoothly(() => setManualOpen(true))}
        />
      ) : null}
    </>
  );
}

// Begleitimpuls zur gewählten Audio, in ihrer Farbe
// compact: zugeklappt nur Überschrift und Zitat, Rest erst im großen Modus
function Companion({
  track,
  compact = false,
  onExpand,
}: {
  track: AudioTrack;
  compact?: boolean;
  onExpand?: () => void;
}) {
  return (
    <section
      className={`companion-band px-5 pt-3 ${compact ? "is-compact" : ""}`}
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

        {compact ? (
          <button type="button" className="companion-more mt-3" onClick={onExpand}>
            Ganzen Impuls ansehen
            <ArrowDown className="size-4" aria-hidden="true" />
          </button>
        ) : null}

        {!compact && track.note ? (
          <p className="mt-5 text-sm leading-7 text-muted-foreground">{track.note}</p>
        ) : null}

        {!compact && track.downloadUrl ? (
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

        {!compact && track.moreHref ? (
          <a href={track.moreHref} className="companion-more mt-6">
            {track.moreLabel ?? "Mehr dazu"}
            <ArrowDown className="size-4" aria-hidden="true" />
          </a>
        ) : null}

        {!compact ? <AudioAccess track={track} /> : null}

        {!compact && track.credit ? (
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
  big,
  onSelect,
}: {
  track: AudioTrack;
  active: boolean;
  highlight: boolean;
  big: boolean;
  onSelect: () => void;
}) {
  const unlocked = useUnlocked(track.unlockAt);
  const player = usePlayer();
  const signVideo = useSignVideo(track.id);
  const isCurrent = player.track?.id === track.id;
  const isPlaying = isCurrent && player.isPlaying;

  const selectFirst = (event: MouseEvent) => {
    // Tipp auf eine Nachbarkarte holt sie erst nach vorn
    if (active) return;
    event.preventDefault();
    event.stopPropagation();
    onSelect();
  };

  // große Karte (wie das frühere Karussell): Bild, großer Titel, Knöpfe
  if (big) {
    return (
      <article
        id={track.id}
        data-track={track.id}
        role="listitem"
        className={`shelf-big ${active ? "is-active" : ""} ${highlight ? "is-highlight" : ""}`}
        onClickCapture={selectFirst}
        style={
          {
            "--audio-accent": track.accent,
            "--audio-accent-ink": track.ink,
            viewTransitionName: `shelf-${track.id}`,
          } as CSSProperties
        }
      >
        <div className="audio-player-card relative overflow-hidden rounded-[1.35rem] border p-3">
          <div className="audio-cover-layout relative z-10 aspect-[4/3] overflow-hidden rounded-[0.95rem]">
            {unlocked ? (
              <img
                src={track.cover}
                alt={track.coverAlt}
                width={1024}
                height={1024}
                loading="lazy"
                className="audio-cover-image h-full w-full object-cover"
              />
            ) : null}
            <span className="audio-cover-badge absolute left-4 top-4 rounded-full border px-3 py-1.5 text-[11px] font-semibold">
              {track.eyebrow}
            </span>
            {!unlocked ? (
              <div className="audio-locked-cover absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center">
                <span className="audio-lock flex size-12 items-center justify-center rounded-full">
                  <Lock className="size-5" strokeWidth={1.5} />
                </span>
                <p className="max-w-[15rem] text-sm font-semibold leading-6">{track.unlockLabel}</p>
              </div>
            ) : null}
          </div>

          <div className="relative z-10 px-3 pb-4 pt-5">
            <h3
              className={
                track.coverWord
                  ? "audio-art-title"
                  : "font-display text-2xl font-medium leading-tight"
              }
            >
              {track.coverWord ?? track.title}
            </h3>
            {track.coverWord ? <p className="audio-track-title">{track.title}</p> : null}

            {unlocked ? (
              <div className="mt-6">
                <Button
                  className="min-h-12 w-full rounded-full px-5"
                  onClick={() => (isCurrent ? player.expand() : player.open(track))}
                  aria-label={
                    isPlaying ? `Player für „${track.title}“ öffnen` : `„${track.title}“ anhören`
                  }
                >
                  <Play className="size-4 fill-current" aria-hidden="true" />
                  {isPlaying ? "Hörmodus öffnen" : "Anhören"}
                </Button>
                {signVideo ? (
                  <SignVideoButton title={track.title} onOpen={() => player.open(track, "dgs")} />
                ) : null}
                {isPlaying ? (
                  <p className="mt-3 text-center text-xs font-medium text-muted-foreground">
                    Läuft gerade
                  </p>
                ) : null}
              </div>
            ) : (
              <p className="mt-5 text-sm leading-6 text-muted-foreground">
                Noch nicht verfügbar. {track.unlockLabel}
              </p>
            )}
          </div>
        </div>
      </article>
    );
  }

  return (
    <article
      id={track.id}
      data-track={track.id}
      role="listitem"
      className={`shelf-card ${unlocked ? "" : "is-locked"} ${isCurrent ? "is-current" : ""} ${
        highlight ? "is-highlight" : ""
      } ${active ? "is-active" : ""}`}
      onClickCapture={selectFirst}
      style={
        {
          "--card-ink": track.ink,
          "--card-accent": track.accent,
          viewTransitionName: `shelf-${track.id}`,
        } as CSSProperties
      }
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

// -------------------------------------------------------
// VORSCHAU, DIE AUFKLAPPT („Ganzen Beitrag lesen“)
// • zeigt den Anfang, läuft unten weich aus
// • Sprungmarke (hashId) öffnet direkt
// -------------------------------------------------------
export function Expandable({ hashId, children }: { hashId?: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const innerRef = useRef<HTMLDivElement | null>(null);
  const [fullHeight, setFullHeight] = useState<number | null>(null);

  useEffect(() => {
    if (!hashId) return;
    const fromHash = () => {
      if (window.location.hash === `#${hashId}`) setOpen(true);
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, [hashId]);

  useEffect(() => {
    const inner = innerRef.current;
    if (!inner) return;
    const measure = () => setFullHeight(inner.scrollHeight);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(inner);
    return () => observer.disconnect();
  }, []);

  return (
    <div className={`expandable ${open ? "is-open" : ""}`}>
      <div
        className="expandable__clip"
        style={open && fullHeight ? { maxHeight: `${fullHeight}px` } : undefined}
        inert={!open}
      >
        <div ref={innerRef}>{children}</div>
      </div>
      <button
        type="button"
        className="expandable__toggle"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        {open ? "Weniger anzeigen" : "Ganzen Beitrag lesen"}
        <ChevronDown aria-hidden="true" />
      </button>
    </div>
  );
}
