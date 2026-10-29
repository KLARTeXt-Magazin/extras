// =======================================================
// TEILEN-VORSCHAU (WhatsApp, Instagram, LinkedIn, …)
// Zweck:
// • eine zentrale Adresse + ein gemeinsames Vorschaubild
//   für alle Seiten
// Später ändern:
// • SITE_URL, wenn die Adresse der App sich ändert
// =======================================================

export const SITE_URL = "https://magazin-klartext-extras.vercel.app";

// Bild + Größe für die Vorschau, wenn man einen Link verschickt.
export function shareImageMeta(alt: string) {
  return [
    { property: "og:image", content: `${SITE_URL}/og-share.png` },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "630" },
    { property: "og:image:alt", content: alt },
    { name: "twitter:image", content: `${SITE_URL}/og-share.png` },
  ];
}

// Kanonische Adresse einer Seite (wichtig für Suchmaschinen).
export function canonicalLink(path: string) {
  return { rel: "canonical", href: `${SITE_URL}${path}` };
}
