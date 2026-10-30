// =======================================================
// GEMEINSAMER RAHMEN ALLER AUSGABEN
// • Header mit Logo, „App speichern“ und Ausgaben-Menü
// • Footer mit Impressum / Datenschutz
// Neue Ausgabe → nur `issues` in src/lib/issues.ts ergänzen.
// =======================================================

import { Link } from "@tanstack/react-router";
import { ArrowRight, CalendarDays, Menu, Smartphone } from "lucide-react";

import { MAGAZIN_URL, VERANSTALTUNGEN_URL } from "@/lib/links";


import { HomescreenGuide } from "@/components/homescreen-guide";
import { InstallAction } from "@/components/install-action";
import { Button } from "@/components/ui/button";
import { issues, type SiteRoute } from "@/lib/issues";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";



export function SiteHeader({ hasScrolled, current }: { hasScrolled: boolean; current: SiteRoute }) {
  return (
    <header
      className={`floating-site-header fixed inset-x-0 top-0 z-50 ${hasScrolled ? "is-scrolled" : ""}`}
    >
      <div className="site-header-inner mx-auto grid w-full max-w-[430px] grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 sm:px-7">
        <a
          href={MAGAZIN_URL}
          target="_blank"
          rel="noreferrer"
          className="block w-fit"
          aria-label="Zum KLARTeXt. Magazin"
        >
          <img src="/logo.png" alt="KLARTeXt." className="site-logo" />
        </a>

        <div className="flex items-center gap-2">
          <Button asChild variant="outline" className="install-guide-jump h-10 rounded-full px-3">
            <a href="#app-installieren" aria-label="Zur Anleitung: Als App speichern">
              <Smartphone className="size-4" />
              <span>App speichern</span>
            </a>
          </Button>

          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="liquid-glass-button size-10 shrink-0 rounded-full"
                aria-label="Ausgaben öffnen"
              >
                <Menu className="size-[18px]" strokeWidth={1.5} />
              </Button>
            </SheetTrigger>

            <SheetContent className="issue-sheet w-full font-body border-0 bg-transparent p-0 shadow-none sm:w-[92%] sm:max-w-sm sm:p-3">
              <div className="issue-panel h-full w-full overflow-y-auto rounded-none sm:rounded-[2rem]">
                <div className="issue-panel-content px-7 py-10">
                  <SheetHeader className="mt-8 text-left">
                    <p className="text-[10px] font-medium uppercase tracking-[0.1em] text-muted-foreground">
                      KLARTeXt. Extras
                    </p>
                    <SheetTitle className="font-display text-3xl font-semibold text-foreground">
                      <SheetClose asChild>
                        <Link
                          to="/"
                          aria-current={current === "/" ? "page" : undefined}
                          className="issue-sheet-title-link"
                        >
                          Alle Ausgaben
                          <ArrowRight className="size-6" strokeWidth={1.75} />
                        </Link>
                      </SheetClose>
                    </SheetTitle>
                    <SheetDescription className="font-body text-muted-foreground">
                      Extras zu den Ausgaben.
                    </SheetDescription>
                  </SheetHeader>

                  <nav className="mt-10" aria-label="Ausgaben">
                    {issues.map((issue) => {
                      const content = (
                        <>
                          <span className="text-[9px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                            {issue.eyebrow}
                          </span>
                          <span className="mt-2 block font-display text-[2rem] font-semibold leading-[1.02] tracking-[-0.025em] text-foreground">
                            {issue.title}
                          </span>
                          <span className="mt-2 block max-w-[17rem] text-sm leading-6 text-muted-foreground">
                            {issue.subtitle}
                          </span>
                        </>
                      );

                      return issue.to ? (
                        <SheetClose asChild key={issue.title}>
                          <Link
                            to={issue.to}
                            className={`issue-entry ${issue.to === current ? "issue-entry-current" : ""}`}
                          >
                            {content}
                          </Link>
                        </SheetClose>
                      ) : (
                        <div key={issue.title} className="issue-entry opacity-40">
                          {content}
                        </div>
                      );
                    })}
                  </nav>

                  <nav className="mt-8" aria-label="Weitere Seiten">
                    <p className="text-[10px] font-medium uppercase tracking-[0.1em] text-muted-foreground">
                      Mehr entdecken
                    </p>
                    {pages.map((page) => {
                      const Icon = page.icon;
                      return (
                        <SheetClose asChild key={page.to}>
                          <Link
                            to={page.to}
                            aria-current={page.to === current ? "page" : undefined}
                            className={`issue-entry ${page.to === current ? "issue-entry-current" : ""}`}
                          >
                            <span className="flex items-center gap-3.5">
                              <span className="issue-page-icon grid size-11 shrink-0 place-items-center rounded-full">
                                <Icon className="size-5" strokeWidth={1.5} />
                              </span>
                              <span className="min-w-0">
                                <span className="block font-display text-lg font-semibold leading-tight">
                                  {page.label}
                                </span>
                                <span className="block text-sm leading-6 text-muted-foreground">
                                  {page.hint}
                                </span>
                              </span>
                            </span>
                          </Link>
                        </SheetClose>
                      );
                    })}
                  </nav>

                  <a
                    href={MAGAZIN_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 inline-flex min-h-[44px] items-center text-sm font-medium text-foreground underline underline-offset-4"
                  >
                    Zum Magazin
                  </a>

                  <InstallAction />
                </div>
              </div>
            </SheetContent>
          </Sheet>
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

      <p className="mx-auto mt-6 max-w-[430px] text-[10px] leading-relaxed opacity-70">
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
