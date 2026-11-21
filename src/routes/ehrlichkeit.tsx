// =======================================================
// ROUTE: AUSGABE 01 – Warum Ehrlichkeit Mut braucht
// • Audio „Zeit für Dich“ + Begleitimpuls (PDF)
// • Lag früher auf `/` – der QR-Code aus Heft 01 landet daher auf
//   der Übersicht, die Ausgabe 01 an erster Stelle verlinkt.
// Inhalte ändern → `track` und Begleittext unten.
// =======================================================

import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import coverImage from "@/assets/cover-zeit-collage-v3.jpg";
import { AudioAccess } from "@/components/audio-access";
import {
  AudioShelf,
  IssueHead,
  IssueSheet,
  ReadLink,
  ReadRow,
  SectionHead,
  readingTime,
} from "@/components/issue-layout";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { getIssue } from "@/lib/issues";
import { SITE_URL, canonicalLink, shareImageMeta } from "@/lib/share";
import type { AudioTrack } from "@/lib/tracks";
import { transcripts } from "@/lib/transcripts";

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

const track: AudioTrack = {
  id: "zeit-fuer-dich",
  ink: "#3e2b24",
  accent: "#dccbb2",
  duration: "3:35",
  eyebrow: "Auszeit",
  title: "Zeit für Dich",
  cover: coverImage,
  coverAlt:
    "Editoriale Collage aus weinrotem Papier, rosafarbenem Organza, feinen Blüten und blauem Glas",
  coverWord: "ZEIT FÜR DICH.",
  src: "/audio/2026-q3_extra01.m4a",
};

const QUOTE =
  "„Wie geht es mir eigentlich gerade? Ehrlich, nicht so, wie ich es nach außen zeige.“";
const TEXT =
  "Das Audio-Extra der ersten Ausgabe ist eine kurze Pause für Tage, an denen viel im Kopf los ist. Ein paar Minuten, in denen du nichts schaffen oder lösen musst. Du hörst einfach hin, wie es dir gerade geht.";

function Ehrlichkeit() {
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

      <main id="inhalt" className="min-h-screen bg-background font-body text-foreground">
        <SiteHeader hasScrolled={hasScrolled} current="/ehrlichkeit" />

        {/* Ebene 1: Ausgabe */}
        <IssueHead issue={issue} />

        {/* Ebene 2: Inhalt */}
        <IssueSheet>
          <section className="issue-section" aria-labelledby="hoeren-titel">
            <SectionHead id="hoeren-titel" title="Hören" count="1 Audio" />
            <AudioShelf tracks={[track]} labelledBy="hoeren-titel" />
          </section>

          <section className="issue-section" aria-labelledby="lesen-titel">
            <SectionHead id="lesen-titel" title="Lesen" />

            <div className="read-list">
              <ReadRow
                id="impuls-zeit-fuer-dich"
                color={track.ink}
                kicker="Ein Moment für dich"
                title={QUOTE}
                teaser={TEXT}
                meta={readingTime(QUOTE, TEXT, ...(transcripts[track.id] ?? []))}
              >
                <p className="text-muted-foreground">{TEXT}</p>
                <AudioAccess track={track} />
              </ReadRow>

              <ReadLink
                href="/pdf/zeit-fuer-dich-begleitimpuls.pdf"
                color={track.ink}
                title="Impuls zum Downloaden"
                teaser={track.title}
                meta="PDF · 2 Seiten"
              />
            </div>
          </section>
        </IssueSheet>

        <SiteFooter />
      </main>
    </>
  );
}
