import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Menu } from "lucide-react";

import coverNikolaus from "../assets/lichtblicke-nikolaus.jpg";
import coverGruss from "../assets/lichtblicke-weihnachtsgruss.jpg";
import coverMoment from "../assets/lichtblicke-moment.jpg";

import { AudioCard, type AudioTrack } from "@/components/audio-card";
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

export const Route = createFileRoute("/lichtblicke")({
head: () => ({
  meta: [
    {
      title: "KLARTeXt. Extras zu Ausgabe 02: Lichtblicke",
    },
    {
      name: "description",
      content:
        "Drei Audio-Impulse der zweiten KLARTeXt.-Ausgabe: Momente zum Innehalten im Dezember.",
    },
    {
      property: "og:title",
      content: "KLARTeXt. – Lichtblicke",
    },
    {
      property: "og:description",
      content:
        "Drei Audio-Momente zum Innehalten im Dezember – dein Advents-Extra zur zweiten KLARTeXt.-Ausgabe.",
    },
    {
      property: "og:type",
      content: "website",
    },
    {
      name: "twitter:card",
      content: "summary_large_image",
    },
  ],
}),
  component: Lichtblicke,
});

const issues: {
  eyebrow: string;
  title: string;
  subtitle: string;
  to?: "/" | "/lichtblicke";
}[] = [
  {
    eyebrow: "Ausgabe 02 · 12/26",
    title: "Lichtblicke",
    subtitle: "Momente zum Innehalten · 3 Audios",
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

const tracks: AudioTrack[] = [
  {
    id: "nikolaus",
    eyebrow: "6. Dezember",
    title: "Einen Moment zum Nikolaus",
    quote:
      "„Vielleicht kannst du heute genau dieser Lichtblick für jemanden sein.“",
    cover: coverNikolaus,
    coverAlt:
      "Brennende Kerze neben einem Tannenzweig auf dunklem Holz",
    src: "/audio/2026-q4_extra01.m4a",
    unlockAt:
      "2026-12-06T00:00:00+01:00",
    unlockLabel:
      "Öffnet sich am 6. Dezember",
    credit:
      "Music by Alexandr Kazantsev from Pixabay · Content License Pixabay.",
  },
  {
    id: "heiligabend",
    eyebrow: "24. Dezember",
    title:
      "Ein kleiner Weihnachtsimpuls für dich",
    quote:
      "„Nicht das Perfekte zählt, sondern das Gemeinsame und Bewusste im Augenblick.“",
    cover: coverGruss,
    coverAlt:
      "Warme Lichterkette hinter Leinentuch und Keramiktasse",
    src: "/audio/2026-q4_extra02.m4a",
    unlockAt:
      "2026-12-24T00:00:00+01:00",
    unlockLabel:
      "Öffnet sich am 24. Dezember",
    credit:
      "Music by AudioCoffee (audiocoffee.net) / Denys Kyshchuk from Pixabay · Content License Pixabay.",
  },
  {
    id: "moment",
    eyebrow: "Achtsamkeitsübung",
    title:
      "Ein kleiner Moment für dich",
    quote:
      "„Du darfst dich um andere kümmern, ohne dich selbst dabei zu vergessen.“",
    cover: coverMoment,
    coverAlt:
      "Helle Keramikschale und Wolldecke an einem winterlichen Fenster",
    src: "/audio/2026-q4_extra03.m4a",
    downloadUrl:
      "/pdf/2026-q4_Auszeit01.pdf",
    downloadLabel:
      "Impuls zum Ausdrucken",
    credit:
      "Music by Elijah K from Pixabay · Content License Pixabay.",
  },
];

function Lichtblicke() {
  const scrollerRef =
    useRef<HTMLDivElement | null>(null);

  const slideRefs =
    useRef<(HTMLDivElement | null)[]>([]);

  const [activeIndex, setActiveIndex] =
    useState(0);

  const [activeId, setActiveId] =
    useState<string | null>(null);

  const [hasScrolled, setHasScrolled] =
    useState(false);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const updateScrollState = () => {
      setHasScrolled(
        scroller.scrollTop > 24 ||
          window.scrollY > 24,
      );
    };

    updateScrollState();

    window.addEventListener(
      "scroll",
      updateScrollState,
      { passive: true },
    );

    scroller.addEventListener(
      "scroll",
      updateScrollState,
      { passive: true },
    );

    return () => {
      window.removeEventListener(
        "scroll",
        updateScrollState,
      );

      scroller.removeEventListener(
        "scroll",
        updateScrollState,
      );
    };
  }, []);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const observer =
      new IntersectionObserver(
        (entries) => {
          const visible = entries
            .filter(
              (entry) => entry.isIntersecting,
            )
            .sort(
              (a, b) =>
                b.intersectionRatio -
                a.intersectionRatio,
            );

          const top = visible[0];
          if (!top) return;

          const index =
            slideRefs.current.findIndex(
              (node) => node === top.target,
            );

          if (index >= 0) {
            setActiveIndex(index);
          }
        },
        {
          root: scroller,
          threshold: [
            0.45,
            0.6,
            0.75,
            0.9,
          ],
        },
      );

    slideRefs.current.forEach((slide) => {
      if (slide) observer.observe(slide);
    });

  return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (!hash) return;

    const index = tracks.findIndex(
      (track) => track.id === hash,
    );

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

    // Wait a frame so the slide refs and layout are ready
    // before jumping, otherwise scrollIntoView can miss.
    requestAnimationFrame(scrollToSlide);
  }, []);

  const goTo = (index: number) => {
    const card = slideRefs.current[index];

    card?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "start",
    });
  };

  const presentationCompact =
    hasScrolled || activeId !== null;

  return (
    <main className="min-h-screen bg-background font-body text-foreground">
      <section
        className={`hero-presentation mx-auto w-full max-w-[430px] px-5 pb-10 pt-5 sm:px-7 sm:pt-7 ${
          presentationCompact
            ? "is-compact"
            : ""
        }`}
      >
        <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
          <div className="min-w-0">
            <img
              src="/logo.png"
              alt="KLARTeXt."
              className="h-6 w-auto"
            />

            <p className="mt-0.5 text-[9px] uppercase text-muted-foreground">
              Das Magazin mit Haltung
            </p>
          </div>

          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="liquid-glass-button size-10 shrink-0 rounded-full"
                aria-label="Ausgaben öffnen"
              >
                <Menu
                  className="size-[18px]"
                  strokeWidth={1.5}
                />
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

                    <SheetTitle className="font-display text-3xl font-medium">
                      Alle Ausgaben
                    </SheetTitle>

                    <SheetDescription className="font-body text-foreground/65">
                      Audio-Experiences und Impulse
                      zum Magazin.
                    </SheetDescription>
                  </SheetHeader>

                  <nav
                    className="mt-10"
                    aria-label="Ausgaben"
                  >
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
                        <SheetClose
                          asChild
                          key={issue.title}
                        >
                          <Link
                            to={issue.to}
                            className={`issue-entry ${
                              index === 0
                                ? "issue-entry-current"
                                : ""
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

        <div className="mt-8">
          <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
            Ausgabe 02 · 12/26
          </p>

          <h1 className="hero-title mt-3 max-w-[340px] font-display text-[clamp(2.5rem,12vw,3.7rem)] font-semibold leading-[0.95] tracking-[-0.02em]">
            Lichtblicke.
          </h1>

          <p className="hero-sub mt-4 max-w-[19rem] text-sm leading-7 text-muted-foreground">
            Zwei der 24 Lichtblicke im Adventskalender
            sind Audios. Sie werden am 6. und am
            24. Dezember hörbar.
          </p>
        </div>

        <div className="mt-8 flex items-center justify-between">
          <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
            Audio {activeIndex + 1} von{" "}
            {tracks.length}
          </p>

          <div
            className="flex gap-2"
            role="tablist"
            aria-label="Audios wechseln"
          >
            {tracks.map((track, index) => (
              <button
                key={track.id}
                type="button"
                role="tab"
                aria-selected={
                  index === activeIndex
                }
                aria-label={track.title}
                onClick={() => goTo(index)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  index === activeIndex
                    ? "w-6 bg-primary"
                    : "w-1.5 bg-secondary"
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      <div
        ref={scrollerRef}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-5 pb-4 [scrollbar-width:none] sm:px-7 [&::-webkit-scrollbar]:hidden"
        style={{
          scrollPaddingInline: "1.25rem",
        }}
      >
        {tracks.map((track, index) => (
          <div
            key={track.id}
            ref={(node) => {
              slideRefs.current[index] =
                node;
            }}
            className="w-[86%] max-w-[380px] shrink-0 snap-start"
          >
            <AudioCard
              track={track}
              isActive={
                activeId === null ||
                activeId === track.id
              }
              onPlay={setActiveId}
            />
          </div>
        ))}
      </div>

      <p className="mt-2 px-5 text-center text-[9px] uppercase tracking-[0.1em] text-muted-foreground sm:px-7">
        Zum Wechseln seitlich wischen
      </p>

      <section className="mt-16 border-t border-border bg-secondary/45 px-6 py-20">
        <div className="mx-auto max-w-[430px]">
          <h2 className="font-display text-3xl font-medium leading-tight">
            Momente zum Innehalten
          </h2>

          <p className="mt-6 max-w-sm text-sm leading-7 text-muted-foreground">
            Der Adventskalender der zweiten Ausgabe
            begleitet dich durch den Dezember. Zwei
            der Lichtblicke kannst du hier als Audio
            hören, die Auszeit-Audio ist jetzt schon
            jederzeit für dich da.
          </p>

          <Button
            asChild
            variant="outline"
            className="mt-9 h-12 rounded-full border-border bg-surface px-5 shadow-none"
          >
            <Link to="/">
              <Menu className="size-4" />
              Zu Ausgabe 01
            </Link>
          </Button>
        </div>
      </section>

      <footer className="bg-primary px-6 py-12 text-primary-foreground">
        <div className="mx-auto flex max-w-[430px] items-end justify-between gap-6">
          <div>
            <p className="font-display text-lg font-semibold">
              KLARTeXt.
            </p>

            <p className="mt-1 text-[10px] uppercase opacity-60">
              Echt. Mutig. Klar.
            </p>
          </div>

          <div className="flex gap-4 text-[10px] opacity-70">
            <a
              href="https://www.magazin-klartext.de/impressum/"
              target="_blank"
              rel="noreferrer"
            >
              Impressum
            </a>

            <a
              href="https://www.magazin-klartext.de/datenschutzerklaerung/"
              target="_blank"
              rel="noreferrer"
            >
              Datenschutz
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
