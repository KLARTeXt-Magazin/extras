// =======================================================
// TEILEN-VORSCHAU (WhatsApp, Instagram, LinkedIn, …)
// Zweck:
// • eine zentrale Adresse + ein gemeinsames Vorschaubild
//   für alle Seiten
// Später ändern:
// • SITE_URL, wenn die Adresse der App sich ändert
// =======================================================

export const SITE_URL = "https://magazin-klartext-extras.vercel.app";

export async function shareCurrentPage(title = document.title) {
  const data = {
    title,
    text: "KLARTeXt. Extras",
    url: window.location.href,
  };

  if (navigator.share) {
    await navigator.share(data);
    return true;
  }

  await navigator.clipboard.writeText(window.location.href);
  return false;
}

// Bild + Größe für die Vorschau, wenn man einen Link verschickt.
export function shareImageMeta(alt: string) {
  return [
    { property: "og:site_name", content: "KLARTeXt. Extras" },
    { property: "og:image", content: `${SITE_URL}/og-share.png?v=4` },
    { property: "og:image:secure_url", content: `${SITE_URL}/og-share.png?v=4` },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "640" },
    { property: "og:image:alt", content: alt },
    { name: "twitter:image", content: `${SITE_URL}/og-share.png?v=4` },
    { name: "twitter:image:alt", content: alt },
  ];
}

// Kanonische Adresse einer Seite (wichtig für Suchmaschinen).
export function canonicalLink(path: string) {
  return { rel: "canonical", href: `${SITE_URL}${path}` };
}
