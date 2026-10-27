// =======================================================
// ROUTE: AUSGABE 01 – Startseite der KLARTeXt. Extras
// • Audio „Zeit für Dich“ + Begleitimpuls (PDF)
// Inhalte ändern → `track` und Begleittext unten.
// =======================================================

import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Download } from "lucide-react";

import coverImage from "@/assets/cover-zeit-collage-v3.jpg";
import { AudioCard, type AudioTrack } from "@/components/audio-card";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { Button } from "@/components/ui/button";

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
    ],
  }),
  component: Index,
});

const track: AudioTrack = {
  id: "zeit-fuer-dich",
  eyebrow: "Auszeit",
  title: "Zeit für Dich",
  cover: coverImage,
  coverAlt:
    "Editoriale Collage aus weinrotem Papier, rosafarbenem Organza, feinen Blüten und blauem Glas",
  coverWord: "ZEIT FÜR DICH.",
  src: "/audio/2026-q3_extra01.m4a",
};

function Index() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const update = () => setHasScrolled(window.scrollY > 24);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <>
      <a className="skip-link" href="#inhalt">
        Zum Inhalt springen
      </a>

      <main
        id="inhalt"
        className="min-h-screen overflow-hidden bg-background font-body text-foreground"
      >
        <SiteHeader hasScrolled={hasScrolled} current="/" />

        <div className="editorial-stage editorial-stage--single">
          <section
            className={`hero-presentation mx-auto w-full max-w-[430px] px-5 pb-12 sm:px-7 ${
              hasScrolled || activeId ? "is-compact" : ""
            }`}
          >
            <div className="mt-4">
              <p className="text-[10px] font-medium uppercase text-muted-foreground">
                Ausgabe 01 · 08/26
              </p>
              <h1 className="hero-title mt-3 max-w-[340px]">Warum Ehrlichkeit Mut braucht</h1>
            </div>
          </section>

          <section className="audio-band" aria-label="Audio">
            <div className="mx-auto w-full max-w-[430px]">
              <AudioCard track={track} isActive onPlay={setActiveId} />

              <p className="section-cue-badge mx-auto mt-8 w-fit text-center text-[10px] font-semibold uppercase tracking-[0.12em]">
                Weiter zum Begleitimpuls
              </p>
            </div>
          </section>
        </div>

        <section className="companion-band px-6 py-24">
          <div className="companion-inner mx-auto max-w-[430px] border-l-4 pl-5">
            <p className="text-[10px] font-medium uppercase text-muted-foreground">
              Ein Moment für dich
            </p>

            <h2 className="mt-5 text-4xl leading-tight">
              „Wie geht es mir eigentlich gerade wirklich, nicht, wie es sein sollte?“
            </h2>

            <p className="mt-7 max-w-sm text-sm leading-7 text-muted-foreground">
              Das Audio-Extra der ersten Ausgabe ist eine kurze Pause, wenn gerade viel im Kopf los
              ist. Ein paar Minuten, in denen es einmal nicht darum geht, etwas zu schaffen oder zu
              lösen, sondern wahrzunehmen, wie es dir gerade geht.
            </p>

            <Button
              asChild
              variant="outline"
              className="mt-9 h-12 rounded-full border-border bg-surface px-5 shadow-none"
            >
              <a href="/pdf/zeit-fuer-dich-begleitimpuls.pdf" target="_blank" rel="noreferrer">
                <Download className="size-4" />
                Impuls zum Downloaden
              </a>
            </Button>
          </div>
        </section>

        <SiteFooter />
      </main>
    </>
  );
}
