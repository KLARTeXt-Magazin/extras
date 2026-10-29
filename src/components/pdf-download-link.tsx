// =======================================================
// PDF-LINK, DER IN DER APP BLEIBT
// • Browser: öffnet das PDF wie gewohnt in einem neuen Tab
// • Installierte App: ein neuer Tab würde die App verlassen
//   (iPhone: kein Weg zurück). Stattdessen wird das PDF geladen und
//   – iPhone/iPad: über das Teilen-Menü angeboten („In Dateien sichern“, „Drucken“)
//   – Android & Co.: direkt als Datei gespeichert
// Verwendung wie ein <a>, auch als Kind von <Button asChild>.
// =======================================================

import { useEffect, type ComponentProps, type MouseEvent } from "react";

import { isIosDevice, isStandaloneApp } from "@/lib/app-mode";

const cache = new Map<string, Promise<Blob>>();

// Einmal laden und merken: Auf dem iPhone muss das Teilen-Menü kurz nach
// dem Tippen öffnen, ein langer Ladevorgang dazwischen würde blockiert.
function loadPdf(href: string) {
  let pending = cache.get(href);
  if (!pending) {
    pending = fetch(href).then((response) => {
      if (!response.ok) throw new Error(`PDF nicht erreichbar: ${response.status}`);
      return response.blob();
    });
    pending.catch(() => cache.delete(href));
    cache.set(href, pending);
  }
  return pending;
}

function saveBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 10_000);
}

async function keepPdfInApp(href: string) {
  const fileName = href.split("/").pop() ?? "klartext-impuls.pdf";
  const blob = await loadPdf(href);
  const file = new File([blob], fileName, { type: "application/pdf" });

  if (isIosDevice() && navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title: "KLARTeXt. Begleitimpuls" });
      return;
    } catch (error) {
      // Teilen abgebrochen → nichts weiter tun
      if (error instanceof DOMException && error.name === "AbortError") return;
      // sonst (z. B. Tippen zu lange her) unten als Datei speichern
    }
  }

  saveBlob(blob, fileName);
}

export function PdfDownloadLink({
  href,
  onClick,
  ...props
}: ComponentProps<"a"> & { href: string }) {
  // In der App schon vorab laden, damit das Teilen-Menü sofort öffnet
  useEffect(() => {
    if (isStandaloneApp()) loadPdf(href).catch(() => {});
  }, [href]);

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (event.defaultPrevented || !isStandaloneApp()) return;

    event.preventDefault();
    keepPdfInApp(href).catch(() => {
      // Laden fehlgeschlagen (z. B. offline) → bisheriges Verhalten
      window.open(href, "_blank", "noreferrer");
    });
  };

  return <a href={href} target="_blank" rel="noreferrer" {...props} onClick={handleClick} />;
}
