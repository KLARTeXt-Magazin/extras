// =======================================================
// PDF-ANSICHT (nur in der installierten App geöffnet)
// • zeigt das PDF seitenweise direkt in der App an
// • „PDF downloaden" ruft das Teilen-Menü bzw. den Download auf
// • pdf.js wird erst beim Öffnen geladen (dynamischer Import)
// =======================================================

import { useEffect, useRef, useState } from "react";
import { Download, X } from "lucide-react";
import * as pdfjsLib from "pdfjs-dist";
// Worker aus dem Paket, damit Version und Worker zusammenpassen.
import workerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { loadPdf, savePdfInApp } from "@/lib/pdf";

pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;

// Sicherheitsnetz: keine Endlos-PDFs vollständig rendern.
const MAX_PAGES = 12;

export type PdfViewerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  href: string;
  title: string;
};

export function PdfViewer({ open, onOpenChange, href, title }: PdfViewerProps) {
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [pagesNode, setPagesNode] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    // Radix hängt den Dialog-Inhalt erst nach dem ersten Rendern ein –
    // deshalb kommt der Behälter über einen Callback-Ref hier an.
    if (!open || !pagesNode) return;

    let cancelled = false;
    pagesNode.replaceChildren();
    setStatus("loading");

    // Eine Seite braucht zuweilen zu lange oder bricht unterm Strich
    // nicht ab (Sonderfälle im PDF) – dann überspringen statt hängen.
    const mitZeitlimit = <T,>(job: Promise<T>) =>
      Promise.race([
        job,
        new Promise<never>((_, ablehnen) =>
          setTimeout(() => ablehnen(new Error("Seite hat zu lange gebraucht")), 20_000),
        ),
      ]);

    void (async () => {
      try {
        const blob = await loadPdf(href);
        const data = new Uint8Array(await blob.arrayBuffer());
        const loadingTask = pdfjsLib.getDocument({ data });
        const pdf = await loadingTask.promise;

        if (cancelled) {
          loadingTask.destroy();
          return;
        }

        const pages = Math.min(pdf.numPages, MAX_PAGES);
        let shown = 0;

        for (let number = 1; number <= pages; number += 1) {
          try {
            const page = await pdf.getPage(number);
            const viewport = page.getViewport({ scale: 2 });
            const canvas = document.createElement("canvas");
            canvas.width = viewport.width;
            canvas.height = viewport.height;
            canvas.className = "pdf-viewer-page";

            const context = canvas.getContext("2d");
            if (!context) throw new Error("Canvas nicht verfügbar");

            await mitZeitlimit(page.render({ canvasContext: context, viewport }).promise);
            if (cancelled) return;

            pagesNode.append(canvas);
            shown += 1;
          } catch (error) {
            console.warn(`PDF-Ansicht: Seite ${number} nicht darstellbar`, error);
          }
        }

        loadingTask.destroy();
        if (!cancelled) setStatus(shown > 0 ? "ready" : "error");
      } catch (error) {
        console.error("PDF-Ansicht:", error);
        if (!cancelled) setStatus("error");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [open, href, pagesNode]);

  const download = () => {
    savePdfInApp(href).catch(() => {
      // Sichern fehlgeschlagen (z. B. offline) → bisheriges Verhalten
      window.open(href, "_blank", "noreferrer");
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="pdf-viewer fixed inset-0 left-0 top-0 z-[150] h-[100dvh] max-h-none w-full max-w-none translate-x-0 translate-y-0 gap-0 overflow-hidden border-0 p-0 shadow-none sm:rounded-none">
        <div className="flex h-full flex-col">
          <div className="pdf-viewer-bar flex items-center justify-between gap-3 border-b px-4 pb-2 pt-[max(0.75rem,env(safe-area-inset-top))]">
            <DialogTitle className="min-w-0 truncate font-display text-lg font-semibold">
              {title}
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              className="size-11 shrink-0 rounded-full border"
              onClick={() => onOpenChange(false)}
              aria-label="PDF-Ansicht schließen"
            >
              <X className="size-5" strokeWidth={2.5} aria-hidden="true" />
            </Button>
          </div>

          <DialogDescription className="sr-only">Vorschau von „{title}“</DialogDescription>

          <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
            {status === "loading" ? (
              <p className="text-sm text-muted-foreground">PDF wird geladen …</p>
            ) : null}
            {status === "error" ? (
              <p className="text-sm text-muted-foreground">
                Das PDF konnte nicht angezeigt werden. Du kannst es unten trotzdem downloaden.
              </p>
            ) : null}
            <div
              ref={setPagesNode}
              className="mx-auto flex w-full max-w-[430px] flex-col gap-3"
              aria-hidden="true"
            />
          </div>

          <div className="pdf-viewer-bar border-t px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3">
            <Button className="min-h-12 w-full rounded-full px-5" onClick={download}>
              <Download className="size-4" aria-hidden="true" />
              PDF downloaden
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
