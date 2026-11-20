// =======================================================
// UNTERE LEISTE (App-Navigation)
// • Start → Übersicht aller Ausgaben
// • Ausgaben → öffnet das Ausgaben-Menü (Sheet)
// • Veranstaltungen → Magazin-Domain, gleicher Tab
// Wird einmal in src/routes/__root.tsx eingebunden.
// =======================================================

import { Link, useRouterState } from "@tanstack/react-router";
import { ArrowRight, CalendarDays, House, LayoutGrid } from "lucide-react";

import { InstallAction } from "@/components/install-action";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { issues } from "@/lib/issues";
import { EVENTS_URL, MAGAZIN_URL } from "@/lib/links";
import { usePreview } from "@/lib/preview";

export function BottomNav() {
  const preview = usePreview();
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
          <House className="size-5" strokeWidth={1.75} />
          <span>Start</span>
        </Link>

        <Sheet>
          <SheetTrigger asChild>
            <button
              type="button"
              className={`bottom-nav-item ${isIssueRoute ? "bottom-nav-item-active" : ""}`}
              aria-label="Ausgaben öffnen"
            >
              <LayoutGrid className="size-5" strokeWidth={1.75} />
              <span>Ausgaben</span>
            </button>
          </SheetTrigger>

          <SheetContent className="issue-sheet w-full font-body border-0 bg-transparent p-0 shadow-none sm:w-[92%] sm:max-w-sm sm:p-3">
            <div className="issue-panel h-full w-full overflow-y-auto rounded-none sm:rounded-[2rem]">
              <div className="issue-panel-content px-7 py-10">
                <SheetHeader className="mt-8 text-left">
                  <p className="text-[10px] font-medium uppercase tracking-[0.1em] text-muted-foreground">
                    <span className="normal-case">KLARTeXt.</span> Extras
                  </p>
                  <SheetTitle className="font-display text-3xl font-semibold text-foreground">
                    <SheetClose asChild>
                      <Link
                        to="/"
                        aria-current={pathname === "/" ? "page" : undefined}
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
                    // isPublic: false → „Kommt demnächst“, außer in der Vorschau
                    const visible = issue.isPublic !== false || preview;
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
                        {issue.to && !visible ? (
                          <span className="status-badge mt-3">Kommt demnächst</span>
                        ) : null}
                      </>
                    );

                    return issue.to && visible ? (
                      <SheetClose asChild key={issue.title}>
                        <Link
                          to={issue.to}
                          className={`issue-entry ${issue.to === pathname ? "issue-entry-current" : ""}`}
                        >
                          {content}
                        </Link>
                      </SheetClose>
                    ) : (
                      <div
                        key={issue.title}
                        className={`issue-entry ${issue.to ? "opacity-70" : "opacity-40"}`}
                      >
                        {content}
                      </div>
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

        <a href={EVENTS_URL} className="bottom-nav-item">
          <CalendarDays className="size-5" strokeWidth={1.75} />
          <span>Veranstaltungen</span>
        </a>
      </div>
    </nav>
  );
}
