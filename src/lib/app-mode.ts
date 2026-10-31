// =======================================================
// APP-MODUS ERKENNEN
// • isStandaloneApp: Seite läuft als installierte Web-App (Homescreen)
// • isIosDevice: iPhone/iPad (iPadOS meldet sich als „Macintosh“ mit Touch)
// Nur im Browser aufrufen (z. B. in useEffect oder Event-Handlern).
// =======================================================

export function isMobileDevice() {
  return /Mobi|Android|iPhone|iPad|iPod/i.test(window.navigator.userAgent);
}

export function isStandaloneApp() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

export function isIosDevice() {
  const userAgent = window.navigator.userAgent;
  const touch = window.matchMedia("(pointer: coarse)").matches;
  return /iPad|iPhone|iPod/.test(userAgent) || (userAgent.includes("Macintosh") && touch);
}
