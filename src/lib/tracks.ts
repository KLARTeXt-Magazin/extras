// =======================================================
// DATENSTRUKTUR FÜR EINE AUDIO
// • Inhalte stehen in den Ausgaben-Seiten (src/routes/*.tsx)
// • ink/accent = Farbpaar der Audio: dunkle Fläche (Karte,
//   Player) und heller Partner (Play-Knopf, Fortschritt)
// =======================================================

import { useEffect, useState } from "react";

import { usePreview } from "@/lib/preview";

export type AudioTrack = {
  id: string;
  eyebrow: string;
  title: string;
  /** Überschrift des Begleitimpulses (Standard: „Begleitimpuls · …“) */
  kicker?: string;
  quote?: string;
  note?: string;
  cover: string;
  coverAlt: string;
  coverWord?: string;
  src: string;
  /** Länge zur Anzeige, z. B. "2:12" */
  duration?: string;
  /** Farbpaar: dunkle Fläche + heller Partner */
  ink: string;
  accent: string;
  credit?: string;
  downloadUrl?: string;
  downloadLabel?: string;
  /** optionaler Verweis auf einen ausführlichen Beitrag (Sprungmarke) */
  moreHref?: string;
  moreLabel?: string;
  unlockAt?: string;
  unlockLabel?: string;
};

// Freigeschaltet? Mit ?vorschau schon vor dem Datum.
export function useUnlocked(unlockAt?: string) {
  const [unlocked, setUnlocked] = useState(!unlockAt);
  const preview = usePreview();

  useEffect(() => {
    if (!unlockAt) return;
    setUnlocked(preview || Date.now() >= new Date(unlockAt).getTime());
  }, [unlockAt, preview]);

  return unlocked;
}
