// =======================================================
// INSTALL-HINWEIS (Banner unten)
// • Gut sichtbarer Hinweis: KLARTeXt. Extras als App speichern
// • Android/Desktop-Chrome: echter Installationsdialog
// • iPhone/iPad: führt zur Kurzanleitung im Fußbereich
// • Erscheint nicht in der installierten App; Schließen wird gemerkt
// =======================================================

import { useEffect, useState } from "react";
import { Smartphone, X } from "lucide-react";

import { isIosDevice, isMobileDevice, isStandaloneApp } from "@/lib/app-mode";
import { clearInstallPrompt, useInstallPrompt } from "@/lib/install-prompt";

const DISMISS_KEY = "klartext-install-banner-dismissed";

export function InstallBanner() {
  const installPrompt = useInstallPrompt();
  const [ready, setReady] = useState(false);
  const [dismissed, setDismissed] = useState(true);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    setDismissed(window.localStorage.getItem(DISMISS_KEY) === "1");
    setReady(true);
    const markInstalled = () => setInstalled(true);
    window.addEventListener("appinstalled", markInstalled);
    return () => window.removeEventListener("appinstalled", markInstalled);
  }, []);

  if (!ready || installed || dismissed || isStandaloneApp()) return null;
  if (!installPrompt && !isIosDevice() && !isMobileDevice()) return null;

  const dismiss = () => {
    window.localStorage.setItem(DISMISS_KEY, "1");
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
      className="install-banner"
      role="region"
      aria-label="KLARTeXt. Extras als App speichern"
    >
      <img src="/icon-192.png" alt="" aria-hidden="true" className="install-banner__icon" />

      <div className="install-banner__body">
        <p className="install-banner__title font-display">KLARTeXt. als App</p>
        <p className="install-banner__text">
          Speichere dir die Extras auf deinen Startbildschirm – alle Audios immer griffbereit.
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
