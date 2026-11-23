// =======================================================
// ROUTE: AUSGABE 02 – LICHTBLICKE
// Zweck:
// • Extras zu Ausgabe 02, Aufbau in Ebenen:
//   Kopf (Cover + Ausgabenfarbe) → Sandblatt mit „Hören“ (Regal)
//   und „Lesen“ (Liste) → Mini-Player (src/lib/player.tsx)

// Später ändern:
// • Audio-Inhalte → tracks (inkl. Farbpaar ink/accent, Dauer)
// • Ausgabenfarbe → src/lib/issues.ts (color/accent)
// • Veröffentlichungsdatum → issues / unlockAt
// • PMR-Text → Extra-Beitrag in der Lese-Liste

// Nicht unnötig ändern:
// • Track-ids = Hash-Links der QR-Codes (#nikolaus, #heiligabend, …)
// =======================================================

import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Download, Play } from "lucide-react";

import coverMoment from "../assets/cover-pmr-collage-v3.jpg";
import coverNikolausNeu from "../assets/cover-nikolaus-collage-v3.jpg";
import coverGrussNeu from "../assets/cover-heiligabend-collage-v3.jpg";
import coverMomentNeu from "../assets/cover-moment-collage-v3.jpg";

import {
  AudioShelf,
  Expandable,
  IssueHead,
  IssueSheet,
  SectionHead,
} from "@/components/issue-layout";
import { PdfDownloadLink } from "@/components/pdf-download-link";
import { usePlayer } from "@/lib/player";
import type { AudioTrack } from "@/lib/tracks";

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
    ink: "#173d3a",
    accent: "#b8d4d1",
    duration: "1:14",
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
    ink: "#40334b",
    accent: "#c9bed8",
    duration: "0:49",
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
    ink: "#4b2934",
    accent: "#e9bbcb",
    duration: "2:12",
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
    ink: "#263b2c",
    accent: "#bcd0bf",
    duration: "3:44",
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
// Aufbau in Ebenen (components/issue-layout.tsx):
// • Kopf: Heft-Cover → Ausgabenfarbe, Titel
// • Sandblatt: „Hören“ (Regal) und „Lesen“ (Liste)
// • Mini-Player / Vollbild-Player: src/lib/player.tsx
// Hash-Links der QR-Codes (#nikolaus, #heiligabend, …)
// führen zur passenden Karte im Regal.
// =======================================================

function Lichtblicke() {
  const player = usePlayer();
  const pmrTrack = tracks.find((track) => track.id === "pmr");
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
        <SiteHeader hasScrolled={hasScrolled} current="/lichtblicke" />

        <div className="issue-stage">
          {/* Ebene 1: Ausgabe */}
          <IssueHead
            issue={issue}
            title="Lichtblicke."
            intro="Zwei Lichtblicke aus dem Adventskalender zum Anhören. Dazu eine Auszeit und eine Übung zur progressiven Muskelentspannung."
          />

          {/* Ebene 2: Inhalt */}
          <IssueSheet>
            <section className="issue-section" aria-labelledby="hoeren-titel">
              <AudioShelf tracks={tracks} count={`${tracks.length} Audios`} />
            </section>

            <section className="issue-section issue-section--tight" aria-labelledby="lesen-titel">
              <SectionHead id="lesen-titel" title="Lesen" />
            </section>
          </IssueSheet>
        </div>

        {/* Lesen: Extra-Beitrag PMR in seiner Salbei-Farbwelt */}
        <section id="pmr-beitrag" className="pmr-band px-6 py-14">
          <div className="pmr-layout mx-auto max-w-[430px]">
            <div className="pmr-intro">
              <h2 className="pmr-chapter">Lesen</h2>
              <p className="text-xs font-semibold text-sage-foreground">
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
                onClick={() => pmrTrack && player.open(pmrTrack)}
                className="pmr-listen mt-7 h-12 rounded-full px-6"
              >
                <Play className="size-4 fill-current" aria-hidden="true" />
                Übung anhören
              </Button>
            </div>

            <Expandable hashId="pmr-beitrag">
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

                        <p className="mt-2 text-sm leading-6 text-muted-foreground">
                          {description}
                        </p>
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
            </Expandable>
          </div>
        </section>

        <IssueSheet flat>
          {/* Weiterhören */}
          <section className="issue-section issue-continue">
            <p className="text-xs font-semibold text-muted-foreground">Weiterhören · Ausgabe 01</p>

            <Link
              to="/ehrlichkeit"
              className="continue-link mt-3 text-2xl leading-tight text-foreground"
            >
              Warum Ehrlichkeit Mut braucht
              <span className="mt-3 block text-sm font-medium text-foreground/70">
                Zur Audio-Auszeit
              </span>
            </Link>
          </section>
        </IssueSheet>

        <SiteFooter />
      </main>
    </>
  );
}
