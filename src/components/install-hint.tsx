import { useEffect, useState } from "react";
import { Share, MoreVertical } from "lucide-react";

/**
 * Dezenter Hinweis, wie sich die Seite auf den Startbildschirm legen lässt.
 * Progressive Enhancement: erscheint nur auf Touch-Geräten und nur, solange
 * die Seite noch im Browser geöffnet ist. Ohne JavaScript oder auf dem
 * Desktop bleibt der Hinweis einfach aus – die Seite funktioniert vollständig.
 */
export function InstallHint() {
  const [show, setShow] = useState(false);
  const [platform, setPlatform] = useState<"ios" | "android">("android");

  useEffect(() => {
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      // iOS Safari
      (window.navigator as { standalone?: boolean }).standalone === true;

    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    const isSmall = window.matchMedia("(max-width: 900px)").matches;

    const ua = window.navigator.userAgent;
    const isIos =
      /iPad|iPhone|iPod/.test(ua) ||
      (ua.includes("Macintosh") && isTouch);

    setPlatform(isIos ? "ios" : "android");
    setShow(!standalone && isTouch && isSmall);
  }, []);

  if (!show) return null;

  return (
    <section
      aria-labelledby="install-hint-title"
      className="mt-10 rounded-2xl border border-border bg-surface/70 p-5"
    >
      <h3
        id="install-hint-title"
        className="font-display text-base font-semibold text-foreground"
      >
        Wie eine App auf dem Startbildschirm
      </h3>

      <p className="mt-2 text-sm leading-6 text-foreground/70">
        {platform === "ios" ? (
          <>
            Tippe unten in der Leiste deines Browsers auf das Teilen-Symbol
            <Share
              className="mx-1 inline size-4 align-[-2px] text-accent-mineral"
              aria-hidden="true"
            />
            <span className="sr-only">(Teilen)</span>
            und wähle <strong className="font-semibold">„Zum Home-Bildschirm“</strong>.
          </>
        ) : (
          <>
            Tippe oben in deinem Browser auf das Menü mit den drei Punkten
            <MoreVertical
              className="mx-1 inline size-4 align-[-2px] text-accent-mineral"
              aria-hidden="true"
            />
            <span className="sr-only">(Menü)</span>
            und wähle <strong className="font-semibold">„App installieren“</strong> oder
            {" "}
            <strong className="font-semibold">„Zum Startbildschirm hinzufügen“</strong>.
          </>
        )}
      </p>

      <p className="mt-3 text-xs leading-5 text-foreground/60">
        Danach öffnen sich die Audios direkt im Vollbild – ganz ohne
        Installation aus einem App-Store. Du kannst die Seite jederzeit
        weiterhin einfach im Browser nutzen.
      </p>
    </section>
  );
}
