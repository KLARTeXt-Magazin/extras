// =======================================================
// VORSCHAU FÜR NICHT ÖFFENTLICHE AUSGABEN
// • lokal und in Lovable (Entwicklungsmodus) immer an
// • auf der Live-Seite mit ?vorschau an der Adresse; bleibt für den
//   Tab gespeichert, damit Links innerhalb der Seite funktionieren
// • ?vorschau=aus schaltet sie wieder ab
// Kein echter Schutz: Wer den Trick kennt, sieht die Seite.
// =======================================================

import { useEffect, useState } from "react";

import type { Issue } from "@/lib/issues";

const PREVIEW_KEY = "klartext-vorschau";

// sessionStorage kann im privaten Modus fehlen oder Fehler werfen.
function readPreviewFlag() {
  const param = new URLSearchParams(window.location.search).get("vorschau");
  try {
    if (param === "aus") window.sessionStorage.removeItem(PREVIEW_KEY);
    else if (param !== null) window.sessionStorage.setItem(PREVIEW_KEY, "1");
    return window.sessionStorage.getItem(PREVIEW_KEY) === "1";
  } catch {
    return param !== null && param !== "aus";
  }
}

export function usePreview() {
  const [preview, setPreview] = useState(import.meta.env.DEV);

  useEffect(() => {
    if (!import.meta.env.DEV) setPreview(readPreviewFlag());
  }, []);

  return preview;
}

// Ist die Ausgabe für den aktuellen Besuch sichtbar?
export function useIssueVisible(issue: Issue) {
  const preview = usePreview();
  return issue.isPublic !== false || preview;
}
