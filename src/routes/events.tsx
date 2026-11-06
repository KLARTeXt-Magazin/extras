// =======================================================
// ROUTE: EVENTS – Termine rund um KLARTeXt.
// • Hinweis „Neu“ + Link zur ausführlichen Info & Buchung
//   auf magazin-klartext.de/events (EVENTS_URL in links.ts)
// • eigene Termine → Liste `events` unten ergänzen
// =======================================================

import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { EVENTS_URL } from "@/lib/links";
import { SITE_URL, canonicalLink, shareImageMeta } from "@/lib/share";

export const Route = createFileRoute("/events")({
  head: () => ({
    meta: [
      { title: "KLARTeXt. Extras – Events" },
      { name: "description", content: "Neu: Veranstaltungen rund um KLARTeXt. Termine, Infos und Buchung findest du auf magazin-klartext.de/events." },
      { property: "og:title", content: "KLARTeXt. – Events" },
      { property: "og:description", content: "Neu: Veranstaltungen rund um KLARTeXt. Termine, Infos und Buchung auf magazin-klartext.de/events." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE_URL}/events` },
      ...shareImageMeta("KLARTeXt. Extras – Audio-Impulse und Übungen zu jeder Ausgabe"),
    ],
    links: [canonicalLink("/events")],
  }),
  component: Events,
});

// Beispiel: { date: "14.03.2027", title: "…", place: "…", text: "…" }
const events: { date: string; title: string; place: string; text?: string }[] = [];

function Events() {
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
        <SiteHeader hasScrolled={hasScrolled} current="/events" />

        <section className="overview-hero mx-auto w-full max-w-[430px] px-5 pb-12 sm:px-7">
          <p className="flex items-center gap-2.5 text-[10px] font-medium uppercase text-muted-foreground">
            KLARTeXt. Extras
            <span className="rounded-full bg-secondary px-2.5 py-1 text-[9px] font-semibold tracking-[0.12em] text-foreground">
              Neu
            </span>
          </p>
          <h1 className="hero-title mt-3">Events</h1>
        </section>

        <section className="companion-band px-6 py-16">
          <div className="companion-inner mx-auto max-w-[430px] border-l-4 pl-5">
            <p className="text-[10px] font-medium uppercase text-muted-foreground">
              Neu bei KLARTeXt.
            </p>
            <h2 className="mt-5 text-3xl leading-tight">Es gibt jetzt Veranstaltungen.</h2>
            <p className="mt-6 max-w-sm text-sm leading-7 text-muted-foreground">
              Termine, Infos und Buchung findest du auf unserer Website.
            </p>
            <Button
              asChild
              variant="outline"
              className="mt-7 h-11 rounded-full border-border bg-surface px-5 shadow-none"
            >
              <a href={EVENTS_URL}>
                Termine, Infos & Buchung
                <ArrowRight className="size-4" />
              </a>
            </Button>

            {events.length > 0 && (
              <ul className="mt-12 grid gap-8">
                {events.map((event) => (
                  <li key={`${event.date}-${event.title}`}>
                    <p className="text-[10px] font-medium uppercase text-muted-foreground">
                      {event.date} · {event.place}
                    </p>
                    <h3 className="mt-2 text-2xl leading-tight">{event.title}</h3>
                    {event.text && (
                      <p className="mt-3 text-sm leading-7 text-muted-foreground">{event.text}</p>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        <section className="continue-band px-6 py-14">
          <div className="mx-auto max-w-[430px]">
            <p className="text-[10px] font-semibold uppercase text-muted-foreground">Zurück</p>
            <Link to="/" className="continue-link mt-3 text-2xl leading-tight text-foreground">
              Alle Extras
              <span className="mt-3 block text-sm font-medium text-foreground/70">
                Zur Übersicht der Ausgaben
              </span>
            </Link>
          </div>
        </section>

        <SiteFooter />
      </main>
    </>
  );
}
