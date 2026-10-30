// =======================================================
// ROUTE: ÜBERSICHT – Startseite der KLARTeXt. Extras
// • führt zu allen Ausgaben (Liste `issues` in src/lib/issues.ts)
//   und zu den Veranstaltungen auf der Magazin-Domain
// • Heft-Cover leicht in Peony getönt, in Originalfarbe beim Hover
// =======================================================

import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, CalendarDays } from "lucide-react";

import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { VERANSTALTUNGEN_URL } from "@/lib/links";
import { issues } from "@/lib/issues";
import { SITE_URL, canonicalLink, shareImageMeta } from "@/lib/share";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "KLARTeXt. Extras – Alle Ausgaben und Veranstaltungen" },
      {
        name: "description",
        content:
          "Audio-Übungen und Begleitimpulse zu allen Ausgaben von KLARTeXt. sowie Veranstaltungen.",
      },
      { property: "og:title", content: "KLARTeXt. Extras" },
      {
        property: "og:description",
        content: "Alle Extras zu den Ausgaben von KLARTeXt. – und unsere Veranstaltungen.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: SITE_URL },
      ...shareImageMeta("KLARTeXt. Extras – Audio-Impulse und Übungen zu jeder Ausgabe"),
    ],
    links: [canonicalLink("/")],
  }),
  component: Overview,
});

function Overview() {
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

        <section className="overview-hero mx-auto w-full max-w-[430px] px-5 pb-10 sm:px-7">
          <p className="text-[10px] font-medium uppercase text-muted-foreground">
            KLARTeXt. Extras
          </p>
          <h1 className="hero-title mt-3">Alle Extras</h1>
          <p className="mt-6 max-w-sm text-sm leading-7 text-muted-foreground">
            Audio-Übungen und Begleitimpulse zu den Ausgaben – und was sonst noch los ist.
          </p>
        </section>

        <section className="px-5 pb-20 sm:px-7" aria-label="Ausgaben">
          <div className="mx-auto grid w-full max-w-[430px] gap-4">
            {issues.map((issue) =>
              issue.to ? (
                <Link
                  key={issue.title}
                  to={issue.to}
                  className="overview-card overview-card--issue"
                >
                  {issue.cover ? (
                    <span className="overview-card-media">
                      <img src={issue.cover} alt="" />
                    </span>
                  ) : (
                    <span
                      className="overview-card-media overview-cover-placeholder"
                      aria-hidden="true"
                    >
                      <span className="overview-cover-placeholder__brand">KLARTeXt.</span>
                      <span className="overview-cover-placeholder__title">{issue.title}.</span>
                      <span className="overview-cover-placeholder__note">Cover folgt</span>
                    </span>
                  )}
                  <span className="overview-card-body">
                    <span className="min-w-0">
                      <span className="block text-[9px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                        {issue.eyebrow}
                      </span>
                      <span className="mt-1 block font-display text-xl font-semibold leading-tight">
                        {issue.title}
                      </span>
                      <span className="mt-1 block text-sm leading-6 text-muted-foreground">
                        {issue.subtitle}
                      </span>
                    </span>
                    <ArrowRight className="size-5 shrink-0" />
                  </span>
                </Link>
              ) : (
                <div key={issue.title} className="overview-card overview-card--soon">
                  <span className="overview-card-body">
                    <span className="min-w-0">
                      <span className="block text-[9px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                        {issue.eyebrow}
                      </span>
                      <span className="mt-1 block font-display text-xl font-semibold leading-tight">
                        {issue.title}
                      </span>
                    </span>
                  </span>
                </div>
              ),
            )}

            {/* Externe Seite (Magazin-Domain), öffnet im selben Tab */}
            <a href={VERANSTALTUNGEN_URL} className="overview-card overview-card--events">
              <span className="overview-card-body">
                <span className="overview-card-icon">
                  <CalendarDays className="size-6" strokeWidth={1.5} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[9px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                    Neu
                  </span>
                  <span className="mt-1 block font-display text-2xl font-semibold leading-tight">
                    Veranstaltungen
                  </span>
                  <span className="mt-1 block text-sm leading-6 text-muted-foreground">
                    Termine rund um KLARTeXt.
                  </span>
                </span>
                <ArrowRight className="size-5 shrink-0" />
              </span>
            </a>
          </div>
        </section>

        <SiteFooter />
      </main>
    </>
  );
}
