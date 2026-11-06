// =======================================================
// PLATZHALTER „KOMMT DEMNÄCHST“
// • für Ausgaben mit isPublic: false (siehe src/lib/issues.ts)
// • PreviewBadge: Hinweis, wenn du eine solche Ausgabe in der
//   Vorschau siehst
// =======================================================

import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import type { Issue, SiteRoute } from "@/lib/issues";

export function ComingSoon({ issue, current }: { issue: Issue; current: SiteRoute }) {
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
        <SiteHeader hasScrolled={hasScrolled} current={current} />

        <section className="overview-hero mx-auto w-full max-w-[430px] px-5 pb-12 sm:px-7">
          <p className="text-[10px] font-medium uppercase text-muted-foreground">{issue.eyebrow}</p>
          <h1 className="hero-title mt-3">Kommt demnächst</h1>
          <p className="mt-6 max-w-sm text-sm leading-7 text-muted-foreground">
            Die Extras zu dieser Ausgabe sind bald hier. Bis dahin findest du alle bisherigen Audios
            und Impulse in der Übersicht.
          </p>
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

export function PreviewBadge() {
  return (
    <p className="preview-badge" role="status">
      Vorschau · noch nicht öffentlich
    </p>
  );
}
