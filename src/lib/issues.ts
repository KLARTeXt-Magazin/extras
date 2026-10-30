// =======================================================
// ALLE AUSGABEN – für Menü (site-chrome.tsx) und Übersicht (/)
// Neue Ausgabe → hier ergänzen.
// • cover = Heft-Cover (Hochformat) für die Übersicht; ohne Cover
//   erscheint dort ein Platzhalter im Heftformat
// =======================================================

import coverHeft01 from "@/assets/heft-01-cover.webp";

export type IssueRoute = "/ehrlichkeit" | "/lichtblicke";
export type SiteRoute = "/" | IssueRoute;

export const issues: {
  eyebrow: string;
  title: string;
  subtitle: string;
  to?: IssueRoute;
  cover?: string;
}[] = [
  {
    eyebrow: "Ausgabe 02 · 12/26",
    title: "Lichtblicke",
    subtitle: "Momente zum Innehalten · 4 Audios",
    to: "/lichtblicke",
    // Cover folgt, sobald das Heft-Cover final ist
  },
  {
    eyebrow: "Ausgabe 01 · 08/26",
    title: "Warum Ehrlichkeit Mut braucht",
    subtitle: "Zwischen Anpassung, Angst und Wahrheit",
    to: "/ehrlichkeit",
    cover: coverHeft01,
  },
  { eyebrow: "Ausgabe 03 · 2027", title: "Demnächst", subtitle: "Neue Themen in Vorbereitung" },
];
