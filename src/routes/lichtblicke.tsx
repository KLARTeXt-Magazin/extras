import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Menu } from "lucide-react";

import coverNikolaus from "../assets/lichtblicke-nikolaus.jpg";
import coverGruss from "../assets/lichtblicke-weihnachtsgruss.jpg";
import coverMoment from "../assets/lichtblicke-moment.jpg";
import exerciseAsset from "../assets/zeit-fuer-dich-achtsamkeitsuebung.pdf.asset.json";
import { AudioCard, type AudioTrack } from "@/components/audio-card";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/lichtblicke")({
  head: () => ({
    meta: [
      { title: "Lichtblicke — KLARTeXt. Audio zu Ausgabe 02" },
      {
        name: "description",
        content:
          "Drei Audio-Lichtblicke aus dem Adventskalender der zweiten KLARTeXt-Ausgabe: Momente zum Innehalten im Dezember.",
      },
      { property: "og:title", content: "Lichtblicke — KLARTeXt. Audio zu Ausgabe 02" },
      {
        property: "og:description",
        content:
          "Drei Audio-Lichtblicke aus dem Adventskalender der zweiten KLARTeXt-Ausgabe: Momente zum Innehalten im Dezember.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Lichtblicke,
});

const tracks: AudioTrack[] = [
  {
    id: "nikolaus",
    eyebrow: "6. Dezember",
    title: "Einen Moment zum Nikolaus",
    quote: "„Vielleicht kannst du heute genau dieser Lichtblick für jemanden sein.“",
    description: "Ein kurzes Innehalten mitten im Dezember.",
    cover: coverNikolaus,
    coverAlt: "Brennende Kerze neben einem Tannenzweig auf dunklem Holz",
    src: "/audio/2026-q4_extra01.m4a",
    unlockAt: "2026-12-06T00:00:00+01:00",
    unlockLabel: "Öffnet sich am 6. Dezember",
    credit: "Music by Alexandr Kazantsev from Pixabay · Content License Pixabay.",
  },
  {
    id: "weihnachtsgruss",
    eyebrow: "24. Dezember",
    title: "Ein kleiner Weihnachtsimpuls für dich",
    quote: "„Nicht das Perfekte zählt, sondern das Gemeinsame und Bewusste im Augenblick.“",
    description: "Ein Impuls für den Heiligen Abend.",
    cover: coverGruss,
    coverAlt: "Warme Lichterkette hinter Leinentuch und Keramiktasse",
    src: "/audio/2026-q4_extra02.m4a",
    unlockAt: "2026-12-24T00:00:00+01:00",
    unlockLabel: "Öffnet sich am 24. Dezember",
    credit: "Music by AudioCoffee (audiocoffee.net) / Denys Kyshchuk from Pixabay · Content License Pixabay.",
  },
  {
    id: "moment",
    eyebrow: "Auszeit",
    title: "Ein kleiner Moment für dich",
    quote: "„Du darfst dich um andere kümmern, ohne dich selbst dabei zu vergessen.“",
    description: "Eine Pause, um an dich zu denken.",
    cover: coverMoment,
    coverAlt: "Helle Keramikschale und Wolldecke an einem winterlichen Fenster",
    src: "/audio/2026-q4_extra03.m4a",
    downloadUrl: exerciseAsset.url,
    downloadLabel: "Impuls zum Ausdrucken",
    credit: "Music by Elijah K from Pixabay · Content License Pixabay.",
  },
];

function Lichtblicke() {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const onScroll = () => {
      const width = scroller.clientWidth * 0.86;
      setActiveIndex(Math.round(scroller.scrollLeft / Math.max(width, 1)));
    };
    scroller.addEventListener("scroll", onScroll, { passive: true });
    return () => scroller.removeEventListener("scroll", onScroll);
  }, []);

  const goTo = (index: number) => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const card = scroller.children[index] as HTMLElement | undefined;
    card?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
  };

  return (
    <main className="min-h-screen bg-background font-body text-foreground">
      <section className="mx-auto w-full max-w-[430px] px-5 pb-10 pt-5 sm:px-7 sm:pt-7">
        <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
          <div className="min-w-0">
            <p className="font-display text-[15px] font-semibold uppercase">KLARTeXt.</p>
            <p className="mt-0.5 text-[9px] uppercase text-muted-foreground">Das Magazin mit Haltung</p>
          </div>
          <Button
            asChild
            variant="outline"
            size="icon"
            className="size-10 shrink-0 rounded-full border-border bg-surface/70 shadow-none backdrop-blur-xl"
          >
            <Link to="/" aria-label="Zurück zu Ausgabe 01">
              <ArrowLeft className="size-[18px]" strokeWidth={1.5} />
            </Link>
          </Button>
        </header>

        <div className="mt-8">
          <p className="text-[10px] font-medium uppercase text-muted-foreground">Ausgabe 02 · 12/26</p>
          <h1 className="mt-3 max-w-[340px] font-display text-[clamp(2.5rem,12vw,3.7rem)] font-medium leading-[0.95]">
            Lichtblicke.
          </h1>
          <p className="mt-4 max-w-[19rem] text-sm leading-7 text-muted-foreground">
            Zwei der 24 Lichtblicke im Adventskalender sind Audios. Sie werden am 6. und am 24. Dezember hörbar.
          </p>
        </div>

        <div className="mt-8 flex items-center justify-between">
          <p className="text-[10px] font-medium uppercase text-muted-foreground">
            Audio {activeIndex + 1} von {tracks.length}
          </p>
          <div className="flex gap-2" role="tablist" aria-label="Audios wechseln">
            {tracks.map((track, index) => (
              <button
                key={track.id}
                type="button"
                role="tab"
                aria-selected={index === activeIndex}
                aria-label={track.title}
                onClick={() => goTo(index)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  index === activeIndex ? "w-6 bg-primary" : "w-1.5 bg-secondary"
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      <div
        ref={scrollerRef}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-5 pb-4 [scrollbar-width:none] sm:px-7 [&::-webkit-scrollbar]:hidden"
        style={{ scrollPaddingInline: "1.25rem" }}
      >
        {tracks.map((track) => (
          <div key={track.id} className="w-[86%] max-w-[380px] shrink-0 snap-start">
            <AudioCard track={track} isActive={activeId === null || activeId === track.id} onPlay={setActiveId} />
          </div>
        ))}
      </div>

      <p className="mt-2 px-5 text-center text-[9px] uppercase text-muted-foreground sm:px-7">
        Zum Wechseln seitlich wischen
      </p>

      <section className="mt-16 border-t border-border bg-secondary/45 px-6 py-20">
        <div className="mx-auto max-w-[430px]">
          <p className="text-[10px] font-medium uppercase text-muted-foreground">Momente zum Innehalten</p>
                <p className="mt-7 max-w-sm text-sm leading-7 text-muted-foreground">
            Der Adventskalender der zweiten Ausgabe begleitet dich durch den Dezember. Zwei der Lichtblicke kannst du
            hier als Audio hören, die Auszeit-Audio ist jetzt schon jederzeit für dich da.
          </p>
          <Button asChild variant="outline" className="mt-9 h-12 rounded-full border-border bg-surface px-5 shadow-none">
            <Link to="/">
              <Menu className="size-4" /> Zu Ausgabe 01
            </Link>
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
            <a href="https://www.magazin-klartext.de/impressum/" target="_blank" rel="noreferrer">
              Impressum
            </a>
            <a href="https://www.magazin-klartext.de/datenschutzerklaerung/" target="_blank" rel="noreferrer">
              Datenschutz
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
