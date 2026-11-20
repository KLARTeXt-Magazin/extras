// =======================================================
// UNTERE LEISTE (App-Navigation, nur Handy/Tablet)
// • Start → Übersicht aller Ausgaben
// • Ausgaben → öffnet das Ausgaben-Menü (components/issues-sheet.tsx)
// • Magazin → magazin-klartext.de (neuer Tab)
// Ab 900 px Breite ausgeblendet; dort stehen dieselben Punkte
// oben im Kopf (SiteHeader in components/site-chrome.tsx).
// Wird einmal in src/routes/__root.tsx eingebunden.
// =======================================================

import { Link, useRouterState } from "@tanstack/react-router";
import { BookOpen, House, LayoutGrid } from "lucide-react";

import { IssuesSheet } from "@/components/issues-sheet";
import { issues } from "@/lib/issues";
import { MAGAZIN_URL } from "@/lib/links";

export function BottomNav() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const isIssueRoute = issues.some((issue) => issue.to === pathname);

  return (
    <nav className="bottom-nav" aria-label="Hauptnavigation">
      <div className="bottom-nav-inner">
        <Link
          to="/"
          className={`bottom-nav-item ${pathname === "/" ? "bottom-nav-item-active" : ""}`}
          aria-current={pathname === "/" ? "page" : undefined}
        >
          <House className="size-5" strokeWidth={1.75} aria-hidden="true" />
          <span>Start</span>
        </Link>

        <IssuesSheet>
          <button
            type="button"
            className={`bottom-nav-item ${isIssueRoute ? "bottom-nav-item-active" : ""}`}
            aria-label="Ausgaben öffnen"
          >
            <LayoutGrid className="size-5" strokeWidth={1.75} aria-hidden="true" />
            <span>Ausgaben</span>
          </button>
        </IssuesSheet>

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
