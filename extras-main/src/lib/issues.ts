// =======================================================
// ALLE AUSGABEN – für Menü (site-chrome.tsx) und Übersicht (/)
// Neue Ausgabe → hier ergänzen.
// =======================================================

import coverLichtblicke from "@/assets/cover-moment-collage-v3.jpg";
import coverEhrlichkeit from "@/assets/cover-zeit-collage-v3.jpg";

export type IssueRoute = "/ehrlichkeit" | "/lichtblicke";
export type SiteRoute = "/" | "/events" | IssueRoute;

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
    cover: coverLichtblicke,
  },
  {
    eyebrow: "Ausgabe 01 · 08/26",
    title: "Warum Ehrlichkeit Mut braucht",
    subtitle: "Zwischen Anpassung, Angst und Wahrheit",
    to: "/ehrlichkeit",
    cover: coverEhrlichkeit,
  },
  { eyebrow: "Ausgabe 03 · 2027", title: "Demnächst", subtitle: "Neue Themen in Vorbereitung" },
];
