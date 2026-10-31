// =======================================================
// INSTALL-DIALOG (beforeinstallprompt) GEMEINSAM NUTZEN
// • Ein einziger Listener; alle Komponenten hören mit
// • Chrome erlaubt nur einen prompt()-Aufruf pro Ereignis,
//   deshalb wird der Dialog zentral verwaltet
// =======================================================

import { useEffect, useState } from "react";

export type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

let currentInstallPrompt: BeforeInstallPromptEvent | null = null;
const listeners = new Set<(prompt: BeforeInstallPromptEvent | null) => void>();

function notify() {
  listeners.forEach((listener) => listener(currentInstallPrompt));
}

if (typeof window !== "undefined") {
  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    currentInstallPrompt = event as BeforeInstallPromptEvent;
    notify();
  });
  window.addEventListener("appinstalled", () => {
    currentInstallPrompt = null;
    notify();
  });
}

/** Aktuelles Install-Ereignis des Browsers (oder null). */
export function useInstallPrompt() {
  const [installPrompt, setInstallPrompt] = useState(currentInstallPrompt);

  useEffect(() => {
    listeners.add(setInstallPrompt);
    return () => {
      listeners.delete(setInstallPrompt);
    };
  }, []);

  return installPrompt;
}

/** Nach dem prompt()-Aufruf freigeben – das Ereignis ist verbraucht. */
export function clearInstallPrompt() {
  currentInstallPrompt = null;
  notify();
}
