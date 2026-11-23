// =======================================================
// ROUTE: AUSGABE 01 – Warum Ehrlichkeit Mut braucht
// • Audio „Zeit für Dich“ + Begleitimpuls (PDF)
// • Lag früher auf `/` – der QR-Code aus Heft 01 landet daher auf
//   der Übersicht, die Ausgabe 01 an erster Stelle verlinkt.
// Inhalte ändern → `track` und Begleittext unten.
// =======================================================

import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

import coverImage from "@/assets/cover-zeit-collage-v3.jpg";
import { AudioShelf, IssueHead, IssueSheet } from "@/components/issue-layout";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { getIssue, latestIssue } from "@/lib/issues";
import { usePreview } from "@/lib/preview";
import { SITE_URL, canonicalLink, shareImageMeta } from "@/lib/share";
import type { AudioTrack } from "@/lib/tracks";

const issue = getIssue("/ehrlichkeit");

export const Route = createFileRoute("/ehrlichkeit")({
  head: () => ({
    meta: [
      { title: "KLARTeXt. Extras zu Ausgabe 01: Warum Ehrlichkeit Mut braucht" },
      {
        name: "description",
        content: "„Zeit für Dich“: eine Achtsamkeitsübung zur ersten Ausgabe von KLARTeXt.",
      },
      { property: "og:title", content: "KLARTeXt. – Warum Ehrlichkeit Mut braucht" },
      {
        property: "og:description",
        content: "Die Audio-Übung „Zeit für Dich“ zur ersten KLARTeXt.-Ausgabe.",
      },
      { property: "og:type", content: "article" },
      { property: "og:url", content: `${SITE_URL}/ehrlichkeit` },
      ...shareImageMeta("KLARTeXt. – Warum Ehrlichkeit Mut braucht: Audio-Übung Zeit für Dich"),
    ],
    links: [canonicalLink("/ehrlichkeit")],
  }),
  component: Ehrlichkeit,
});

const QUOTE =
  "„Wie geht es mir eigentlich gerade? Ehrlich, nicht so, wie ich es nach außen zeige.“";
const TEXT =
  "Das Audio-Extra der ersten Ausgabe ist eine kurze Pause für Tage, an denen viel im Kopf los ist. Ein paar Minuten, in denen du nichts schaffen oder lösen musst. Du hörst einfach hin, wie es dir gerade geht.";

const track: AudioTrack = {
  id: "zeit-fuer-dich",
  ink: "#3e2b24",
  accent: "#dccbb2",
  duration: "3:35",
  quote: QUOTE,
  note: TEXT,
  downloadUrl: "/pdf/zeit-fuer-dich-begleitimpuls.pdf",
  downloadLabel: "Impuls zum Downloaden",
  eyebrow: "Auszeit",
  title: "Zeit für Dich",
  cover: coverImage,
  coverAlt:
    "Editoriale Collage aus weinrotem Papier, rosafarbenem Organza, feinen Blüten und blauem Glas",
  coverWord: "ZEIT FÜR DICH.",
  src: "/audio/2026-q3_extra01.m4a",
};

function Ehrlichkeit() {
  const [hasScrolled, setHasScrolled] = useState(false);
  // Weiterhören: neueste sichtbare Ausgabe (springt bei neuen Ausgaben mit um)
  const next = latestIssue(usePreview());
  const nextIssue = next?.to && next.to !== "/ehrlichkeit" ? next : null;

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

      <main id="inhalt" className="min-h-screen bg-background font-body text-foreground">
        <SiteHeader hasScrolled={hasScrolled} current="/ehrlichkeit" />

        <div className="issue-stage">
          {/* Ebene 1: Ausgabe */}
          <IssueHead issue={issue} />

          {/* Ebene 2: Inhalt */}
          <IssueSheet>
            <section className="issue-section" aria-labelledby="hoeren-titel">
              <AudioShelf tracks={[track]} count="1 Audio" />
            </section>
          </IssueSheet>
        </div>

        {nextIssue?.to ? (
          <IssueSheet flat>
            {/* Weiterhören */}
            <section className="issue-section issue-continue">
              <p className="text-xs font-semibold text-muted-foreground">
                Weiterhören · {nextIssue.eyebrow.split(" · ")[0]}
              </p>

              <Link
                to={nextIssue.to}
                className="continue-link mt-3 text-2xl leading-tight text-foreground"
              >
                {nextIssue.title}
                <span className="mt-3 block text-sm font-medium text-foreground/70">
                  {nextIssue.subtitle} <ArrowRight aria-hidden="true" className="continue-arrow" />
                </span>
              </Link>
            </section>
          </IssueSheet>
        ) : null}

        <SiteFooter />
      </main>
    </>
  );
}
