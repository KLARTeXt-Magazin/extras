// =======================================================
// UNTERE LEISTE (App-Navigation, nur Handy/Tablet)
// • Start → Übersicht aller Ausgaben
// • Aktuell → neueste Ausgabe (springt automatisch um,
//   sobald in src/lib/issues.ts eine neue öffentlich ist)
// • Magazin → magazin-klartext.de (neuer Tab)
// Aktiver Punkt: Symbol in sandfarbener Pille, Schrift dunkelbraun.
// Ab 900 px ausgeblendet; dort stehen dieselben Punkte oben
// im Kopf (HeaderNav in components/site-chrome.tsx).
// =======================================================

import { Link } from "@tanstack/react-router";
import { BookOpen, House, Sparkles } from "lucide-react";

import { MAGAZIN_URL } from "@/lib/links";
import { useNavState } from "@/lib/nav";

export function BottomNav() {
  const { latest, isLatest, isStart } = useNavState();

  return (
    <nav className="bottom-nav" aria-label="Hauptnavigation">
      <div className="bottom-nav-inner">
        <Link
          to="/"
          className={`bottom-nav-item ${isStart ? "bottom-nav-item-active" : ""}`}
          aria-current={isStart ? "page" : undefined}
          aria-label="Start: alle Ausgaben"
        >
          <House className="size-5" strokeWidth={1.75} aria-hidden="true" />
          <span>Start</span>
        </Link>

        {latest?.to ? (
          <Link
            to={latest.to}
            className={`bottom-nav-item ${isLatest ? "bottom-nav-item-active" : ""}`}
            aria-current={isLatest ? "page" : undefined}
            aria-label={`Aktuelle Ausgabe: ${latest.title}`}
          >
            <Sparkles className="size-5" strokeWidth={1.75} aria-hidden="true" />
            <span>Aktuell</span>
          </Link>
        ) : null}

        <a
          href={MAGAZIN_URL}
          target="_blank"
          rel="noreferrer"
          className="bottom-nav-item"
          aria-label="Zum Magazin (öffnet neuen Tab)"
        >
          <BookOpen className="size-5" strokeWidth={1.75} aria-hidden="true" />
          <span>Magazin</span>
        </a>
      </div>
    </nav>
  );
}
