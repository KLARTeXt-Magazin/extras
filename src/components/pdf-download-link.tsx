// =======================================================
// PDF-LINK, DER IN DER APP BLEIBT
// • Browser: öffnet das PDF wie gewohnt in einem neuen Tab
// • Installierte App: ein neuer Tab würde die App verlassen
//   (iPhone: kein Weg zurück). Stattdessen öffnet sich die
//   PDF-Ansicht in der App – mit „PDF downloaden" darunter
//   (iPhone/iPad: Teilen-Menü, Android & Co.: Datei speichern)
// Verwendung wie ein <a>, auch als Kind von <Button asChild>.
// =======================================================

import { useEffect, useState, type ComponentProps, type ComponentType, type MouseEvent } from "react";

import { isStandaloneApp } from "@/lib/app-mode";
import { loadPdf, savePdfInApp } from "@/lib/pdf";

import type { PdfViewerProps } from "@/components/pdf-viewer";

export function PdfDownloadLink({
  href,
  onClick,
  children,
  ...props
}: ComponentProps<"a"> & { href: string }) {
  const [PdfViewer, setPdfViewer] = useState<ComponentType<PdfViewerProps> | null>(null);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerTitle, setViewerTitle] = useState("PDF-Vorschau");

  // In der App schon vorab laden (PDF und Ansicht), damit alles
  // sofort bereit ist, wenn getippt wird.
  useEffect(() => {
    if (!isStandaloneApp()) return;

    loadPdf(href).catch(() => {});
    import("@/components/pdf-viewer")
      .then((module) => setPdfViewer(() => module.PdfViewer))
      .catch(() => {});
  }, [href]);

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (event.defaultPrevented || !isStandaloneApp()) return;

    event.preventDefault();

    const label = event.currentTarget.textContent?.trim();
    setViewerTitle(label ? label : "PDF-Vorschau");
    setViewerOpen(true);

    // Ansicht noch nicht geladen (z. B. offline) → bisheriges Verhalten
    import("@/components/pdf-viewer")
      .then((module) => setPdfViewer(() => module.PdfViewer))
      .catch(() => {
        setViewerOpen(false);
        savePdfInApp(href).catch(() => window.open(href, "_blank", "noreferrer"));
      });
  };

  return (
    <>
      <a href={href} target="_blank" rel="noreferrer" {...props} onClick={handleClick}>
        {children}
      </a>
      {PdfViewer ? (
        <PdfViewer
          open={viewerOpen}
          onOpenChange={setViewerOpen}
          href={href}
          title={viewerTitle}
        />
      ) : null}
    </>
  );
}
