// =======================================================
// ALLE AUSGABEN – für Menü (site-chrome.tsx) und Übersicht (/)
// Neue Ausgabe → hier ergänzen.
// • cover = Heft-Cover (Hochformat) für die Übersicht; ohne Cover
//   erscheint dort ein Platzhalter im Heftformat
// • isPublic = Schalter „öffentlich“
//   - true:  Ausgabe ist für alle sichtbar
//   - false: Übersicht und Menü zeigen Cover, Titel und
//            Untertitel mit „Kommt demnächst“, aber ohne Link. Die Seite
//            selbst zeigt einen Platzhalter. Du siehst die fertige Seite
//            trotzdem: in Lovable / lokal und auf der Live-Seite mit
//            ?vorschau an der Adresse (z. B. /lichtblicke?vorschau).
//            Mit ?vorschau=aus schaltest du die Vorschau wieder ab.
//   Zum Veröffentlichen einfach auf true stellen.
// =======================================================

import coverHeft01 from "@/assets/heft-01-cover.webp";
import coverHeft02 from "@/assets/heft-02-cover.webp";
import { SITE_URL, shareImageMeta } from "@/lib/share";

export type IssueRoute = "/ehrlichkeit" | "/lichtblicke";
export type SiteRoute = "/" | "/events" | IssueRoute;

export type Issue = {
  eyebrow: string;
  title: string;
  subtitle: string;
  to?: IssueRoute;
  cover?: string;
  isPublic?: boolean;
};

export const issues: Issue[] = [
  {
    eyebrow: "Ausgabe 02 · 12/26",
    title: "Lichtblicke",
    subtitle: "Momente zum Innehalten · 4 Audios",
    to: "/lichtblicke",
    cover: coverHeft02,
    isPublic: false,
  },
  {
    eyebrow: "Ausgabe 01 · 08/26",
    title: "Warum Ehrlichkeit Mut braucht",
    subtitle: "Zwischen Anpassung, Angst und Wahrheit",
    to: "/ehrlichkeit",
    cover: coverHeft01,
    isPublic: true,
  },
  { eyebrow: "Ausgabe 03 · 2027", title: "In Planung", subtitle: "Die Themen entstehen gerade" },
];

export function getIssue(route: IssueRoute) {
  const issue = issues.find((entry) => entry.to === route);
  if (!issue) throw new Error(`Ausgabe für ${route} fehlt in issues.ts`);
  return issue;
}

// Text für die Teilen-Vorschau einer Ausgabe, die noch nicht öffentlich ist.
// So verrät auch der Seitenquelltext nichts vom Inhalt.
export function comingSoonMeta(issue: Issue) {
  const description = "Die Extras zu dieser Ausgabe von KLARTeXt. kommen bald.";
  return [
    { title: `KLARTeXt. Extras – ${issue.eyebrow}: Kommt demnächst` },
    { name: "description", content: description },
    { name: "robots", content: "noindex" },
    { property: "og:title", content: `KLARTeXt. Extras – ${issue.title}: Kommt demnächst` },
    { property: "og:description", content: description },
    { property: "og:url", content: `${SITE_URL}${issue.to ?? "/"}` },
    ...shareImageMeta("KLARTeXt. Extras – Audio-Impulse und Übungen zu jeder Ausgabe"),
  ];
}
