// =======================================================
// GEMEINSAMER RAHMEN ALLER AUSGABEN
// • Header mit Logo und „App speichern“
// • Footer mit Impressum / Datenschutz
// • Navigation: Handy → untere Leiste (components/bottom-nav.tsx),
//   Desktop → Textlinks hier im Kopf (Start / Ausgaben / Magazin)
// Neue Ausgabe → nur `issues` in src/lib/issues.ts ergänzen.
// =======================================================

import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Smartphone } from "lucide-react";

import { MAGAZIN_URL } from "@/lib/links";

import { HomescreenGuide } from "@/components/homescreen-guide";
import { useNavState } from "@/lib/nav";
import { Button } from "@/components/ui/button";
import type { SiteRoute } from "@/lib/issues";

// Desktop-Navigation (gleiche Punkte wie die untere Leiste)
function HeaderNav() {
  const { latest, issuesCurrent, isStart } = useNavState();

  return (
    <nav className="header-nav" aria-label="Hauptnavigation">
      <Link to="/" aria-current={isStart ? "page" : undefined}>
        Start
      </Link>
      {latest?.to ? (
        <Link
          to={latest.to}
          aria-current={issuesCurrent}
          aria-label={`Ausgaben: neueste Ausgabe ${latest.title}`}
        >
          Ausgaben
        </Link>
      ) : null}
      <a href={MAGAZIN_URL} target="_blank" rel="noreferrer">
        Magazin
        <ArrowUpRight className="size-3.5" aria-hidden="true" />
      </a>
    </nav>
  );
}

export function SiteHeader({ hasScrolled }: { hasScrolled: boolean; current: SiteRoute }) {
  return (
    <header
      className={`floating-site-header fixed inset-x-0 top-0 z-50 ${hasScrolled ? "is-scrolled" : ""}`}
    >
      <div className="site-header-inner mx-auto grid w-full max-w-[430px] grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 sm:px-7">
        <a
          href={MAGAZIN_URL}
          target="_blank"
          rel="noreferrer"
          className="-my-2 block w-fit py-2"
          aria-label="Zum KLARTeXt. Magazin"
        >
          <img src="/logo-header.png" alt="KLARTeXt." className="site-logo" />
        </a>

        <div className="flex items-center gap-2">
          <HeaderNav />

          <Button asChild variant="outline" className="install-guide-jump h-10 rounded-full px-3">
            <a href="#app-installieren" aria-label="Zur Anleitung: Als App speichern">
              <Smartphone className="size-4" />
              <span>App speichern</span>
            </a>
          </Button>
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  const legal = [
    ["Impressum", `${MAGAZIN_URL}impressum/`],
    ["Datenschutz", `${MAGAZIN_URL}datenschutzerklaerung/`],
  ];

  return (
    <footer className="site-footer px-6 py-12">
      <div className="mx-auto flex max-w-[430px] items-end justify-between gap-6">
        <div>
          <p className="font-display text-lg font-semibold">KLARTeXt.</p>
          <p className="mt-1 text-[11px] uppercase tracking-[0.1em] opacity-80">
            Echt. Mutig. Klar.
          </p>
        </div>

        <div className="flex flex-col items-end gap-1">
          <nav className="flex gap-4 text-xs" aria-label="Rechtliches">
            {legal.map(([label, href]) => (
              <a
                key={label}
                className="inline-flex min-h-[44px] items-end underline underline-offset-4"
                href={href}
                target="_blank"
                rel="noreferrer"
              >
                {label}
              </a>
            ))}
          </nav>
        </div>
      </div>

      <p className="mx-auto mt-6 max-w-[430px] text-[10px] leading-relaxed opacity-90">
        Schriften:{" "}
        <a
          className="underline underline-offset-2"
          href="/font-licenses/syne-OFL.txt"
          target="_blank"
          rel="noreferrer"
        >
          Syne
        </a>{" "}
        und{" "}
        <a
          className="underline underline-offset-2"
          href="/font-licenses/plus-jakarta-sans-OFL.txt"
          target="_blank"
          rel="noreferrer"
        >
          Plus Jakarta Sans
        </a>
        , lizenziert unter der SIL Open Font License.
      </p>

      <div className="mx-auto max-w-[430px]">
        <HomescreenGuide />
      </div>
    </footer>
  );
}
