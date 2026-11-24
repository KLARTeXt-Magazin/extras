// =======================================================
// HINWEIS „NEUES APP-ICON“ (nur iPhone/iPad, nur in der installierten App)
// iOS übernimmt ein neues Icon nicht von selbst: Wer die App schon auf
// dem Homebildschirm hat, muss sie dort einmal neu hinzufügen.
// Android aktualisiert das Icon selbst, dort erscheint nichts.
// Wird einmal gezeigt; nach „Okay“ oder ✕ nicht wieder.
// Beim nächsten Icon-Wechsel: ICON_VERSION hochzählen.
// =======================================================

import { X } from "lucide-react";
import { useEffect, useState } from "react";

import { isIosDevice, isStandaloneApp } from "@/lib/app-mode";

const ICON_VERSION = "8";
const SEEN_KEY = `klartext-icon-hint-v${ICON_VERSION}`;

export function IconUpdateHint() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!isStandaloneApp() || !isIosDevice()) return;
    try {
      if (window.localStorage.getItem(SEEN_KEY) === "1") return;
    } catch {
      // ohne Speicher trotzdem einmal zeigen
    }
    setShow(true);
  }, []);

  if (!show) return null;

  const close = () => {
    try {
      window.localStorage.setItem(SEEN_KEY, "1");
    } catch {
      // nur für diese Sitzung ausblenden
    }
    setShow(false);
  };

  return (
    <aside className="install-banner" role="region" aria-label="Neues App-Icon">
      <img src="/icon-192.png?v=8" alt="" aria-hidden="true" className="install-banner__icon" />

      <div className="install-banner__body">
        <p className="install-banner__title font-display">Neues App-Icon</p>
        <p className="install-banner__text">
          Damit du es auf dem Homebildschirm siehst: App dort entfernen und über „Teilen“ → „Zum
          Home-Bildschirm“ neu hinzufügen.
        </p>
        <button type="button" className="install-banner__install" onClick={close}>
          <span>Okay</span>
        </button>
      </div>

      <button
        type="button"
        className="install-banner__close"
        aria-label="Hinweis ausblenden"
        onClick={close}
      >
        <X className="size-4" aria-hidden="true" />
      </button>
    </aside>
  );
}
