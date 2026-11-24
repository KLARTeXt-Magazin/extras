// =======================================================
// UNTERE LEISTE (App-Navigation, nur Handy/Tablet)
// • Start → Übersicht aller Ausgaben
// • Ausgaben → neueste Ausgabe (springt automatisch um,
//   sobald in src/lib/issues.ts eine neue öffentlich ist);
//   markiert auf jeder Ausgabenseite, auch bei älteren
// • Magazin → magazin-klartext.de (neuer Tab)
// Aktiver Punkt: helle Glas-Kapsel um Symbol und Text (wie in Safari/iOS).
// Ab 900 px ausgeblendet; dort stehen dieselben Punkte oben
// im Kopf (HeaderNav in components/site-chrome.tsx).
// =======================================================

import { Link } from "@tanstack/react-router";
import { BookOpen, House, Share2, Sparkles } from "lucide-react";

import { MAGAZIN_URL } from "@/lib/links";
import { useNavState } from "@/lib/nav";
import { useIsStandaloneApp } from "@/lib/app-mode";

export function BottomNav() {
  const { latest, isIssue, issuesCurrent, isStart } = useNavState();
  const standalone = useIsStandaloneApp();

  const sharePage = async () => {
    const data = {
      title: document.title,
      text: "KLARTeXt. Extras",
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(data);
        return;
      } catch {
        return;
      }
    }

    try {
      await navigator.clipboard.writeText(window.location.href);
    } catch {
      window.prompt("Link zum Teilen", window.location.href);
    }
  };

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
            className={`bottom-nav-item ${isIssue ? "bottom-nav-item-active" : ""}`}
            aria-current={issuesCurrent}
            aria-label={`Ausgaben: neueste Ausgabe ${latest.title}`}
          >
            <Sparkles className="size-5" strokeWidth={1.75} aria-hidden="true" />
            <span>Ausgaben</span>
          </Link>
        ) : null}

        {standalone ? (
          <button
            type="button"
            className="bottom-nav-item"
            onClick={sharePage}
            aria-label="Diese Seite teilen"
          >
            <Share2 className="size-5" strokeWidth={1.75} aria-hidden="true" />
            <span>Teilen</span>
          </button>
        ) : (
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
        )}
      </div>
    </nav>
  );
}
