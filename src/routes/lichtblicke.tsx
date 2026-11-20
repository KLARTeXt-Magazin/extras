// =======================================================
// ROUTE: AUSGABE 02 – LICHTBLICKE
// Zweck:
// • Audio-Archiv für Ausgabe 02
// • mehrere Audio-Kacheln als horizontales Carousel
// • zusätzliche Informationen unterhalb des Carousels
// • PMR-Übung als eigener Inhaltsbereich

// Später ändern:
// • Audio-Inhalte → tracks
// • Bilder → imports / cover
// • Veröffentlichungsdatum → issues / unlockAt
// • PMR-Text → PMR-Sektion weiter unten

// Nicht unnötig ändern:
// • Carousel-Logik
// • IntersectionObserver
// • Hash-Navigation
// • Active-State
// =======================================================

import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowDown, Download, Play } from "lucide-react";

import { AudioAccess } from "@/components/audio-access";

import coverMoment from "../assets/cover-pmr-collage-v3.jpg";
import coverNikolausNeu from "../assets/cover-nikolaus-collage-v3.jpg";
import coverGrussNeu from "../assets/cover-heiligabend-collage-v3.jpg";
import coverMomentNeu from "../assets/cover-moment-collage-v3.jpg";

import { AudioCard, type AudioTrack } from "@/components/audio-card";
import { PdfDownloadLink } from "@/components/pdf-download-link";

import { ComingSoon, PreviewBadge } from "@/components/coming-soon";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { Button } from "@/components/ui/button";
import { comingSoonMeta, getIssue } from "@/lib/issues";
import { useIssueVisible } from "@/lib/preview";
import { SITE_URL, canonicalLink, shareImageMeta } from "@/lib/share";

// Schalter „öffentlich“ steht in src/lib/issues.ts (isPublic)
const issue = getIssue("/lichtblicke");

// =======================================================
// SEITEN-METADATEN
// Zweck:
// • Browser
// • Suchmaschinen
// • Social-Media-Vorschau

// Später ändern:
// • Titel und Beschreibung bei einer neuen Ausgabe
// =======================================================

export const Route = createFileRoute("/lichtblicke")({
  head: () => ({
    meta:
      issue.isPublic === false
        ? comingSoonMeta(issue)
        : [
            {
              title: "KLARTeXt. Extras zu Ausgabe 02: Lichtblicke",
            },
            {
              name: "description",
              content:
                "Vier Audio-Impulse der zweiten KLARTeXt.-Ausgabe: Momente zum Innehalten und eine kurze Entspannungsübung.",
            },
            {
              property: "og:title",
              content: "KLARTeXt. – Lichtblicke",
            },
            {
              property: "og:description",
              content:
                "Vier Audio-Momente zum Innehalten und Entspannen. Das Extra zur zweiten KLARTeXt.-Ausgabe.",
            },
            { property: "og:type", content: "article" },
            { property: "og:url", content: `${SITE_URL}/lichtblicke` },
            ...shareImageMeta(
              "KLARTeXt. – Lichtblicke: Audio-Momente zum Innehalten und Entspannen",
            ),
          ],
    links: [canonicalLink("/lichtblicke")],
  }),
  component: LichtblickeRoute,
});

// Noch nicht öffentlich → Platzhalter, außer in der Vorschau
function LichtblickeRoute() {
  const visible = useIssueVisible(issue);

  if (!visible) return <ComingSoon issue={issue} current="/lichtblicke" />;

  return (
    <>
      {issue.isPublic === false ? <PreviewBadge /> : null}
      <Lichtblicke />
    </>
  );
}

// =======================================================
// FREISCHALTUNG
// Zweck:
// • momentan alle Audios direkt sichtbar

// Später ändern:
// • false → Datums-Freischaltung aktiv
// • true → alles sofort verfügbar
// =======================================================

const PREVIEW_UNLOCKED = false;

// =======================================================
// AUDIO-INHALTE
// Zweck:
// • zentrale Datenquelle für alle Audiokacheln

// Hier werden normalerweise Inhalte gepflegt.

// Pro Track:
// • id       = interne ID / Hash-Link
// • eyebrow  = kleine Kategorie / Datum
// • title    = Titel
// • quote    = Zitat unter dem Carousel
// • note     = Zusatztext
// • cover    = Bild
// • src      = Audio-Datei
// • downloadUrl = optionales PDF

// Neue Audio-Kachel:
// → einfach einen weiteren Track ergänzen.
// =======================================================

const tracks: AudioTrack[] = [
  {
    id: "nikolaus",
    eyebrow: "6. Dezember",
    title: "Einen Moment zum Nikolaus",
    quote: "„Vielleicht kannst du heute genau dieser Lichtblick für jemanden sein.“",
    note: "Ein kurzer Moment aus dem Adventskalender, zum Anhören am 6. Dezember.",
    cover: coverNikolausNeu,
    coverAlt:
      "Editoriales Stillleben aus petrolfarbenem Papier, eisblauem Transparentpapier, Silberfaden und roter Beere",
    coverWord: "LICHT BLICK.",
    src: "/audio/2026-q4_extra01.m4a",
    ...(PREVIEW_UNLOCKED
      ? {}
      : {
          unlockAt: "2026-12-06T00:00:00+01:00",
        }),
    unlockLabel: "Öffnet sich am 6. Dezember",
    credit: "Musik: Alexandr Kazantsev über Pixabay · Pixabay-Inhaltslizenz.",
  },

  {
    id: "heiligabend",
    eyebrow: "24. Dezember",
    title: "Ein Moment an Heiligabend",
    quote: "„Denn genau darin liegen oft unsere größten Lichtblicke.“",
    note: "Der zweite Lichtblick aus dem Adventskalender, zum Anhören an Heiligabend.",
    cover: coverGrussNeu,
    coverAlt:
      "Editoriales Stillleben aus weinrotem Samt, lavendelfarbenem Acryl und rosafarbener Kerze",
    coverWord: "HEUTE GENUG.",
    src: "/audio/2026-q4_extra02.m4a",
    ...(PREVIEW_UNLOCKED
      ? {}
      : {
          unlockAt: "2026-12-24T00:00:00+01:00",
        }),
    unlockLabel: "Öffnet sich am 24. Dezember",
    credit:
      "Musik: AudioCoffee (audiocoffee.net) / Denys Kyshchuk über Pixabay · Pixabay-Inhaltslizenz.",
  },

  {
    id: "moment",
    eyebrow: "Achtsamkeitsübung",
    title: "Ein kleiner Moment für dich",
    quote: "„Du darfst dich um andere kümmern, ohne dich selbst dabei zu vergessen.“",
    note: "Eine kurze Auszeit für dich, jederzeit abrufbar. Den Impuls kannst du dir auch ausdrucken.",
    cover: coverMomentNeu,
    coverAlt:
      "Abstrakte Collage aus auberginefarbenem Papier, Flieder, blauem Band und pinkfarbenem Blütenblatt",
    coverWord: "NUR FÜR DICH.",
    src: "/audio/2026-q4_extra03.m4a",
    downloadUrl: "/pdf/moment-fuer-dich-begleitimpuls.pdf",
    downloadLabel: "Impuls zum Downloaden",
    credit: "Musik: Elijah K über Pixabay · Pixabay-Inhaltslizenz.",
  },

  {
    id: "pmr",
    eyebrow: "Progressive Muskelentspannung",
    title: "Spannung trifft Entspannung",
    note: "Eine kurze Übung: Muskeln anspannen und wieder lösen. Hintergrund und Schritte findest du im Extra-Beitrag.",
    moreHref: "#pmr-beitrag",
    moreLabel: "Zum Extra-Beitrag",
    cover: coverMoment,
    coverAlt:
      "Materialstudie aus gerafftem mitternachtsblauem Stoff, lavendelfarbenem Band und mintfarbenem Stein",
    coverWord: "ANSPANNEN. LOSLASSEN.",
    src: "/audio/2026-q4_extra04.m4a",
    credit: "Musik: Mikhail Vereitinov über Pixabay · Pixabay-Inhaltslizenz.",
  },
];

// =======================================================
// HAUPTKOMPONENTE
// Zweck:
// • komplette Lichtblicke-Seite
// =======================================================

function Lichtblicke() {
  // -----------------------------------------------------
  // CAROUSEL-REFERENZEN
  // • scroller = horizontale Audio-Leiste
  // • slideRefs = einzelne Kacheln
  // -----------------------------------------------------

  const scrollerRef = useRef<HTMLDivElement | null>(null);

  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);

  // -----------------------------------------------------
  // ACTIVE STATE
  // • activeIndex = aktuell sichtbare Kachel
  // • activeId = aktuell abgespieltes Audio
  // -----------------------------------------------------

  const [activeIndex, setActiveIndex] = useState(0);

  const [activeId, setActiveId] = useState<string | null>(null);

  // -----------------------------------------------------
  // HEADER-SCROLL
  // • steuert den Glass-Effekt des Headers
  // -----------------------------------------------------

  const [hasScrolled, setHasScrolled] = useState(false);

  // =====================================================
  // SCROLL-ERKENNUNG
  // Zweck:
  // • erkennt Scrollen innerhalb der Seite
  // • berücksichtigt auch den horizontalen Audio-Scroller
  // =====================================================

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const updateScrollState = () => {
      setHasScrolled(scroller.scrollTop > 24 || window.scrollY > 24);
    };

    updateScrollState();
    window.addEventListener("scroll", updateScrollState, { passive: true });

    scroller.addEventListener("scroll", updateScrollState, { passive: true });

    return () => {
      window.removeEventListener("scroll", updateScrollState);

      scroller.removeEventListener("scroll", updateScrollState);
    };
  }, []);

  // =====================================================
  // CAROUSEL-AUSWAHL
  // Zweck:
  // • erkennt nach dem Wischen, welche Audiokachel sichtbar ist
  // • aktualisiert Punkte + Begleittext
  //
  // Nicht entfernen:
  // • Grundlage für das horizontale Carousel
  // =====================================================

  useEffect(() => {
    const scroller = scrollerRef.current;

    if (!scroller) return;

    // Aktiv ist die Karte, die am Einrastpunkt (linker Rand + Abstand) steht –
    // auf dem Handy die sichtbare, am Desktop die vorderste unter dem Titel.
    const selectNearestSlide = () => {
      const snapPoint =
        scroller.getBoundingClientRect().left +
        (parseFloat(getComputedStyle(scroller).scrollPaddingInlineStart) || 0);

      let nearestIndex = 0;
      let nearestDistance = Number.POSITIVE_INFINITY;

      slideRefs.current.forEach((slide, index) => {
        if (!slide) return;
        const rect = slide.getBoundingClientRect();
        const distance = Math.abs(rect.left - snapPoint);

        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearestIndex = index;
        }
      });

      setActiveIndex(nearestIndex);
    };

    // schon während des Wischens umschalten (einmal pro Bild)
    let frame = 0;
    const handleScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        selectNearestSlide();
      });
    };

    scroller.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      scroller.removeEventListener("scroll", handleScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  // =====================================================
  // HASH-NAVIGATION
  // Zweck:
  // • Links wie /lichtblicke#nikolaus öffnen direkt
  //   die passende Audiokachel
  //
  // Wichtig:
  // • id des Tracks muss mit dem Hash übereinstimmen.
  // =====================================================

  useEffect(() => {
    const hash = window.location.hash.replace("#", "");

    if (!hash) return;

    const index = tracks.findIndex((track) => track.id === hash);

    if (index < 0) return;

    setActiveIndex(index);

    const scrollToSlide = () => {
      const card = slideRefs.current[index];

      card?.scrollIntoView({
        behavior: "auto",
        block: "nearest",
        inline: "start",
      });
    };

    requestAnimationFrame(scrollToSlide);
  }, []);

  // =====================================================
  // CAROUSEL-NAVIGATION
  // Zweck:
  // • springt zu einer bestimmten Audiokachel
  //
  // Wird verwendet von:
  // • Punkten
  // • Pfeiltasten
  // =====================================================

  const goTo = (index: number) => {
    setActiveIndex(index);

    const card = slideRefs.current[index];

    card?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "start",
    });
  };

  // aus dem PMR-Beitrag zur passenden Audiokachel springen
  const listenToPmr = () => {
    const index = tracks.findIndex((track) => track.id === "pmr");
    if (index < 0) return;
    setActiveIndex(index);
    slideRefs.current[index]?.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "start",
    });
  };

  // -----------------------------------------------------
  // HERO-KOMPAKT
  // • Hero wird kompakter, sobald gescrollt / abgespielt wird
  // -----------------------------------------------------

  const presentationCompact = hasScrolled || activeId !== null;

  return (
    <>
      {/* =================================================
          ACCESSIBILITY
         ================================================= */}

      <a className="skip-link" href="#inhalt">
        Zum Inhalt springen
      </a>

      <main id="inhalt" className="min-h-screen bg-background font-body text-foreground">
        <SiteHeader hasScrolled={hasScrolled} current="/lichtblicke" />

        {/* =================================================
            HERO
            Zweck:
            • Ausgabe 02 vorstellen
            • kurze Erklärung
            • Carousel-Position anzeigen

            Später ändern:
            • Titel
            • Beschreibung
           ================================================= */}

        <div className="editorial-stage">
          <section
            className={`hero-presentation mx-auto w-full max-w-[430px] px-5 pb-6 sm:px-7 ${
              presentationCompact ? "is-compact" : ""
            }`}
          >
            <div className="mt-4">
              <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
                Ausgabe 02 · 12/26
              </p>

              <h1 className="hero-title mt-3 max-w-[340px]">Lichtblicke.</h1>

              <p className="hero-sub mt-4 max-w-[19rem] text-sm leading-7 text-muted-foreground">
                Zwei Lichtblicke aus dem Adventskalender zum Anhören. Dazu eine Auszeit und eine
                Übung zur progressiven Muskelentspannung.
              </p>
            </div>
          </section>

          {/* =================================================
            AUDIO-CAROUSEL
            Zweck:
            • horizontales Wischen
            • zeigt AudioCard-Komponenten
            • aktive Kachel wird über activeId gesteuert

             Später ändern:
             • Layout → hier
             • Kachel-Inhalt → tracks
             • Karten-Design → audio-card.tsx

             Wichtig:
             Die eigentliche Audiokachel liegt NICHT hier,
             sondern in components/audio-card.tsx.
            ================================================= */}

          <section
            className={`audio-band audio-tone-${activeIndex + 1} pb-4 pt-4`}
            aria-label="Audio-Karussell"
          >
            <div className="audio-carousel-shell mx-auto w-full max-w-[860px]">
              <div
                ref={scrollerRef}
                role="group"
                aria-label="Audios: seitlich wischen oder mit den Pfeiltasten wechseln"
                tabIndex={0}
                className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-5 pb-4 [scrollbar-width:none] sm:px-7 [&::-webkit-scrollbar]:hidden"
                style={{
                  scrollPaddingInline: "var(--carousel-inset, 1.25rem)",
                }}
                onKeyDown={(event) => {
                  if (event.key === "ArrowRight") {
                    event.preventDefault();

                    goTo(Math.min(tracks.length - 1, activeIndex + 1));
                  }

                  if (event.key === "ArrowLeft") {
                    event.preventDefault();

                    goTo(Math.max(0, activeIndex - 1));
                  }
                }}
              >
                {tracks.map((track, index) => (
                  <div
                    key={track.id}
                    ref={(node) => {
                      slideRefs.current[index] = node;
                    }}
                    className={`carousel-slide w-[calc(100%-2.5rem)] max-w-[380px] shrink-0 snap-start ${
                      index === activeIndex ? "is-current" : ""
                    }`}
                    onClickCapture={(event) => {
                      // Klick auf eine blasse Nachbarkarte holt sie erst nach vorn
                      if (index === activeIndex) return;
                      event.preventDefault();
                      event.stopPropagation();
                      goTo(index);
                    }}
                  >
                    <AudioCard
                      track={track}
                      isActive={activeId === null || activeId === track.id}
                      onPlay={setActiveId}
                    />
                  </div>
                ))}
              </div>

              <div className="mt-2 flex items-center justify-between gap-4 px-5 sm:px-7">
                <p
                  className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground"
                  aria-live="polite"
                >
                  Audio {activeIndex + 1} von {tracks.length}
                </p>
                <div className="flex" role="group" aria-label="Audios wechseln">
                  {tracks.map((track, index) => (
                    <Button
                      key={track.id}
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-current={index === activeIndex}
                      aria-label={`Audio ${index + 1} von ${tracks.length}: ${track.title}`}
                      onClick={() => goTo(index)}
                      className="tap-target size-11 rounded-full"
                    >
                      <span
                        aria-hidden="true"
                        className={`carousel-dot ${index === activeIndex ? "w-6" : "w-1.5"}`}
                      />
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* =================================================
            AUDIO-BEGLEITINFOS
            Zweck:
            • zeigt Zusatzinformationen zur aktuell
              ausgewählten Audio
            • Zitat
            • Beschreibung
            • optionaler Download
            • Musik-Credit

             Die Anzeige wechselt automatisch mit
             activeIndex.
            ================================================= */}

        <section
          className={`companion-band companion-tone-${activeIndex + 1} px-5 pb-12 pt-1 sm:px-7`}
          aria-label={`Begleitimpuls zu ${tracks[activeIndex]?.title ?? "diesem Audio"}`}
          aria-live="polite"
        >
          <div className="companion-inner mx-auto w-full max-w-[430px]">
            {tracks.map((track, index) => {
              const isCurrent = index === activeIndex;

              return (
                <div
                  key={track.id}
                  aria-hidden={!isCurrent}
                  inert={!isCurrent}
                  className={`transition-all duration-500 ${
                    isCurrent
                      ? "opacity-100 translate-y-0"
                      : "pointer-events-none absolute h-0 -translate-y-1 overflow-hidden opacity-0"
                  }`}
                >
                  <p className="companion-kicker text-[10px] font-medium uppercase tracking-[0.12em]">
                    Begleitimpuls · {track.coverWord ?? track.title}
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
                    <p className="mt-7 text-[10px] leading-5 text-muted-foreground">
                      {track.credit}
                    </p>
                  ) : null}
                </div>
              );
            })}
          </div>
        </section>

        {/* =================================================
            Additional Extras
            Zweck:
            • hier: ausführliche Erklärung der progressiven
              Muskelentspannung
            • Schritt-für-Schritt-Anleitung
            • PDF-Download

             Später ändern:
             • Überschrift
             • Erklärung
             • einzelne Übungen
             • PDF-Link

             Das ist bewusst ein eigener Abschnitt und
             nicht Teil der Audiokachel.
            ================================================= */}

        <section id="pmr-beitrag" className="pmr-band px-6 py-14">
          <div className="pmr-layout mx-auto max-w-[430px]">
            <div className="pmr-intro">
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-sage-foreground">
                Extra-Beitrag · Thema Prävention
              </p>

              <h2 className="mt-4 max-w-sm text-[2.5rem] leading-[1.02]">
                Erst anspannen, dann loslassen.
              </h2>

              <p className="mt-6 max-w-sm text-sm leading-7 text-foreground/70">
                Die progressive Muskelentspannung (kurz PMR) ist eine bewährte Entspannungsmethode,
                die auch in der Prävention eingesetzt wird. Du spannst einen Muskel kurz an, lässt
                ihn anschließend wieder locker und spürst bewusst die Entspannung.
              </p>

              <Button
                type="button"
                onClick={listenToPmr}
                className="pmr-listen mt-7 h-12 rounded-full px-6"
              >
                <Play className="size-4 fill-current" aria-hidden="true" />
                Übung anhören
              </Button>
            </div>

            <div className="pmr-body">
              <dl className="mt-10 max-w-sm">
                {[
                  [
                    "Was?",
                    "Eine Entspannungsmethode: Du spannst einzelne Muskelgruppen an und löst die Spannung anschließend wieder.",
                  ],
                  [
                    "Wie?",
                    "Gruppe für Gruppe: kurz anspannen, die Spannung einige Sekunden halten, beim Ausatmen loslassen und der Entspannung nachspüren.",
                  ],
                  [
                    "Wo?",
                    "Wo du gerade bist. Zu Hause, im Büro oder unterwegs, im Sitzen oder Liegen.",
                  ],
                  [
                    "Warum?",
                    "Weil Anspannung und Stress nachlassen und du leichter zur Ruhe kommst.",
                  ],
                ].map(([term, text]) => (
                  <div
                    key={term}
                    className="grid grid-cols-[4.5rem_minmax(0,1fr)] gap-4 border-b border-sage/15 py-4 last:border-b-0"
                  >
                    <dt className="text-sm font-semibold text-sage-foreground">{term}</dt>
                    <dd className="text-sm leading-6 text-muted-foreground">{text}</dd>
                  </div>
                ))}
              </dl>

              {/* Übungsschritte */}
              <ol className="mt-10 border-y border-sage/25">
                {[
                  [
                    "Schultern & Nacken",
                    "Schultern für einige Sekunden zu den Ohren ziehen. Beim Ausatmen fallen lassen.",
                  ],
                  [
                    "Hände & Arme",
                    "Hände zu Fäusten schließen und halten. Beim Ausatmen loslassen und die Arme locker werden lassen.",
                  ],
                  [
                    "Gesicht",
                    "Augen leicht zusammenkneifen, Nase rümpfen und Zähne sanft aufeinanderbeißen. Danach vollständig lockerlassen.",
                  ],
                  [
                    "Nachspüren",
                    "Einen Moment liegen oder sitzen bleiben. Dann Finger und Zehen bewegen und in deinem Tempo zurückkommen.",
                  ],
                ].map(([title, description], index) => (
                  <li
                    key={title}
                    className="grid grid-cols-[2.25rem_minmax(0,1fr)] gap-4 border-b border-sage/20 py-5 last:border-b-0"
                  >
                    <span className="pmr-step-no font-display font-semibold text-sage">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <div>
                      <h3 className="text-sm font-semibold">{title}</h3>

                      <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
                    </div>
                  </li>
                ))}
              </ol>

              <p className="mt-7 border-l-4 border-sage/40 pl-5 text-sm leading-7 text-muted-foreground">
                Übe nur so lange und so weit, wie es sich gut anfühlt. Wenn etwas wehtut oder
                unangenehm wird, mach eine Pause oder hör auf.
              </p>

              <p className="mt-7 text-sm leading-7 text-muted-foreground">
                Du brauchst keine Hilfsmittel. Die Übung klappt im Sitzen, Stehen, Gehen oder
                Liegen, also auch mal kurz zwischendurch.
              </p>

              {/* PMR-PDF */}
              <Button
                asChild
                variant="outline"
                className="mt-8 h-12 rounded-full border-sage/45 bg-background/45 px-5 text-sage-foreground shadow-none"
              >
                <PdfDownloadLink href="/pdf/pmr-spannung-trifft-entspannung.pdf">
                  <Download className="size-4" />
                  Anleitung herunterladen
                </PdfDownloadLink>
              </Button>
            </div>
          </div>
        </section>

        {/* =================================================
            WEITERHÖREN
            Zweck:
            • führt zurück zu Ausgabe 01
            • bewusst einfacher CTA statt SaaS-artigem Button
           ================================================= */}

        <section className="continue-band px-6 py-14">
          <div className="mx-auto max-w-[430px]">
            <p className="text-[10px] font-semibold uppercase text-muted-foreground">
              Weiterhören · Ausgabe 01
            </p>

            <Link
              to="/ehrlichkeit"
              className="continue-link mt-3 text-2xl leading-tight text-foreground"
            >
              Warum Ehrlichkeit Mut braucht
              <span className="mt-3 block text-sm font-medium text-foreground/70">
                Zur Audio-Auszeit
              </span>
            </Link>
          </div>
        </section>

        <SiteFooter />
      </main>
    </>
  );
}
