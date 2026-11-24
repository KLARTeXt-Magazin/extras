// =======================================================
// INSTALL-HINWEIS (Banner unten)
// • Gut sichtbarer Hinweis: KLARTeXt. Extras als App speichern
// • Android/Desktop-Chrome: echter Installationsdialog
// • iPhone/iPad: führt zur Kurzanleitung im Fußbereich
// • Erscheint nicht in der installierten App; Schließen wird gemerkt
// • Nicht beim ersten Besuch: erst wenn jemand wiederkommt oder
//   schon etwas angehört hat – und nie, während eine Audio läuft
// • Liegt über dem Mini-Player statt ihn zu verdecken
// =======================================================

import { useEffect, useState } from "react";
import { Smartphone, X } from "lucide-react";

import { isIosDevice, isMobileDevice, isStandaloneApp } from "@/lib/app-mode";
import { clearInstallPrompt, useInstallPrompt } from "@/lib/install-prompt";
import { usePlayer } from "@/lib/player-context";

const DISMISS_KEY = "klartext-install-banner-dismissed";
const VISITS_KEY = "klartext-visits";
const VISIT_COUNTED_KEY = "klartext-visit-counted";

/** Besuche zählen (einmal pro Browser-Sitzung) und die Anzahl zurückgeben */
function countVisit(): number {
  try {
    let visits = Number(window.localStorage.getItem(VISITS_KEY)) || 0;
    if (!window.sessionStorage.getItem(VISIT_COUNTED_KEY)) {
      visits += 1;
      window.localStorage.setItem(VISITS_KEY, String(visits));
      window.sessionStorage.setItem(VISIT_COUNTED_KEY, "1");
    }
    return visits;
  } catch {
    // Speicher gesperrt (z. B. privates Fenster): lieber nicht stören
    return 1;
  }
}

export function InstallBanner() {
  const installPrompt = useInstallPrompt();
  const { track, isPlaying, currentTime } = usePlayer();
  const [ready, setReady] = useState(false);
  const [dismissed, setDismissed] = useState(true);
  const [installed, setInstalled] = useState(false);
  const [returning, setReturning] = useState(false);

  useEffect(() => {
    try {
      setDismissed(window.localStorage.getItem(DISMISS_KEY) === "1");
    } catch {
      setDismissed(false);
    }
    setReturning(countVisit() >= 2);
    setReady(true);
    const markInstalled = () => setInstalled(true);
    window.addEventListener("appinstalled", markInstalled);
    return () => window.removeEventListener("appinstalled", markInstalled);
  }, []);

  // schon reingehört: es gibt eine Audio, sie ist angehalten oder zu Ende
  const hasListened = Boolean(track) && !isPlaying && currentTime > 0;

  if (!ready || installed || dismissed || isStandaloneApp()) return null;
  if (!installPrompt && !isIosDevice() && !isMobileDevice()) return null;
  if (isPlaying) return null;
  if (!returning && !hasListened) return null;

  const dismiss = () => {
    try {
      window.localStorage.setItem(DISMISS_KEY, "1");
    } catch {
      // nur für diese Sitzung ausblenden
    }
    setDismissed(true);
  };

  const install = async () => {
    if (!installPrompt) {
      // iPhone/iPad: kein automatischer Dialog – zur Anleitung im Fußbereich.
      dismiss();
      document
        .getElementById("app-installieren")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    await installPrompt.prompt();
    await installPrompt.userChoice;
    clearInstallPrompt();
  };

  return (
    <aside
      className={track ? "install-banner install-banner--above-player" : "install-banner"}
      role="region"
      aria-label="KLARTeXt. Extras als App speichern"
    >
      <img src="/icon-192.png?v=8" alt="" aria-hidden="true" className="install-banner__icon" />

      <div className="install-banner__body">
        <p className="install-banner__title font-display">KLARTeXt. Extras als App</p>
        <p className="install-banner__text">
          Leg dir die Extras auf den Startbildschirm, dann hast du alle Audios immer dabei.
        </p>
        <button type="button" className="install-banner__install" onClick={install}>
          <Smartphone className="size-4" aria-hidden="true" />
          <span>{installPrompt ? "Jetzt installieren" : "So geht's"}</span>
        </button>
      </div>

      <button
        type="button"
        className="install-banner__close"
        aria-label="Hinweis ausblenden"
        onClick={dismiss}
      >
        <X className="size-4" aria-hidden="true" />
      </button>
    </aside>
  );
}
