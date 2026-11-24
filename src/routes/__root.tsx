import {
  Outlet,
  Link,
  createRootRoute,
  useRouter,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { BottomNav } from "../components/bottom-nav";
import { BreathIntro } from "../components/breath-intro";
import { PlayerProvider } from "../lib/player";
import { InstallBanner } from "../components/install-banner";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { SiteFooter, SiteHeader } from "../components/site-chrome";

function NotFoundComponent() {
  return (
    <>
      <a className="skip-link" href="#inhalt">
        Zum Inhalt springen
      </a>
      <main id="inhalt" className="min-h-screen bg-background font-body text-foreground">
        <SiteHeader hasScrolled={false} current="/" />
        <div className="flex min-h-[calc(100dvh-5rem)] items-center px-6 py-20">
          <div className="mx-auto max-w-[430px]">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              404 · Seite nicht gefunden
            </p>
            <h1 className="mt-4 font-display text-5xl font-bold leading-[0.95] text-wine">
              Dieser Weg führt nicht weiter.
            </h1>
            <p className="mt-6 text-base leading-7 text-muted-foreground">
              Vielleicht hat sich die Adresse geändert. Zurück zur Übersicht findest du alle
              verfügbaren Ausgaben.
            </p>
            <Link
              to="/"
              className="mt-8 inline-flex min-h-12 items-center justify-center rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground"
            >
              Zur Startseite
            </Link>
          </div>
        </div>
        <SiteFooter />
      </main>
    </>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          Die Seite konnte nicht geladen werden
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Da ist bei uns etwas schiefgelaufen. Bitte versuche es noch einmal oder gehe zur
          Startseite.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Erneut versuchen
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Zur Startseite
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1, viewport-fit=cover",
      },

      {
        title: "KLARTeXt. Extras – Audio & Impulse",
      },

      {
        name: "description",
        content: "Audio-Extras, Übungen und Impulse zu den Ausgaben von KLARTeXt.",
      },

      {
        name: "author",
        content: "KLARTeXt.",
      },

      {
        property: "og:title",
        content: "KLARTeXt. Extras – Audio & Impulse",
      },

      {
        property: "og:description",
        content: "Audio-Extras, Übungen und Impulse zu den Ausgaben von KLARTeXt.",
      },

      {
        property: "og:type",
        content: "website",
      },

      {
        name: "twitter:card",
        content: "summary_large_image",
      },

      {
        name: "theme-color",
        content: "#F2EDE5",
      },

      {
        name: "apple-mobile-web-app-capable",
        content: "yes",
      },

      {
        name: "mobile-web-app-capable",
        content: "yes",
      },

      {
        name: "apple-mobile-web-app-status-bar-style",
        content: "black-translucent",
      },

      {
        name: "apple-mobile-web-app-title",
        content: "Extras",
      },

      {
        name: "application-name",
        content: "KLARTeXt. Extras",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: "/favicon.png?v=7", type: "image/png", sizes: "64x64" },
      { rel: "icon", href: "/icon-192.png?v=7", type: "image/png", sizes: "192x192" },
      { rel: "icon", href: "/icon-512.png?v=7", type: "image/png", sizes: "512x512" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png?v=7", sizes: "180x180" },
      { rel: "manifest", href: "/manifest.webmanifest?v=7" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="de">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  useEffect(() => {
    if (!("serviceWorker" in navigator) || import.meta.env.DEV) return;
    void navigator.serviceWorker.register("/sw.js").catch((error) => {
      console.warn("Service Worker konnte nicht registriert werden:", error);
    });
  }, []);

  return (
    <PlayerProvider>
      <BreathIntro />
      {/* Hier werden die Seiten (Ausgaben) eingesetzt – nicht entfernen. */}
      <Outlet />
      <BottomNav />
      <InstallBanner />
    </PlayerProvider>
  );
}
