// =======================================================
// PDF LADEN UND SICHERN (in der installierten App)
// • loadPdf: lädt ein PDF einmalig und merkt es sich
// • savePdfInApp: iPhone/iPad → Teilen-Menü („In Dateien
//   sichern", „Drucken"), Android & Co. → direkter Download
// Nur im Browser aufrufen (z. B. in Event-Handlern).
// =======================================================

import { isIosDevice } from "@/lib/app-mode";

const cache = new Map<string, Promise<Blob>>();

// Einmal laden und merken: Auf dem iPhone muss das Teilen-Menü kurz nach
// dem Tippen öffnen, ein langer Ladevorgang dazwischen würde blockiert.
export function loadPdf(href: string) {
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

export async function savePdfInApp(href: string) {
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
