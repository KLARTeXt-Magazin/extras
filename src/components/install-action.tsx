import { useEffect, useState } from "react";
import { Download, Share2, Smartphone } from "lucide-react";

import { Button } from "@/components/ui/button";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export function InstallAction() {
  const [installPrompt, setInstallPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isIos, setIsIos] = useState(false);
  const [isStandalone, setIsStandalone] = useState(true);
  const [showIosHelp, setShowIosHelp] = useState(false);

  useEffect(() => {
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as Navigator & { standalone?: boolean }).standalone === true;
    const touch = window.matchMedia("(pointer: coarse)").matches;
    const userAgent = window.navigator.userAgent;
    const ios =
      /iPad|iPhone|iPod/.test(userAgent) ||
      (userAgent.includes("Macintosh") && touch);

    setIsStandalone(standalone);
    setIsIos(ios);

    const capturePrompt = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as BeforeInstallPromptEvent);
    };
    const markInstalled = () => setIsStandalone(true);

    window.addEventListener("beforeinstallprompt", capturePrompt);
    window.addEventListener("appinstalled", markInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", capturePrompt);
      window.removeEventListener("appinstalled", markInstalled);
    };
  }, []);

  if (isStandalone || (!isIos && !installPrompt)) return null;

  const install = async () => {
    if (isIos) {
      setShowIosHelp((current) => !current);
      return;
    }

    if (!installPrompt) return;
    await installPrompt.prompt();
    await installPrompt.userChoice;
    setInstallPrompt(null);
  };

  return (
    <div className="install-action mt-8 border-t border-border pt-7">
      <p className="text-[10px] font-semibold uppercase text-muted-foreground">
        Schnell erreichbar
      </p>
      <Button
        type="button"
        variant="ghost"
        onClick={install}
        aria-expanded={isIos ? showIosHelp : undefined}
        aria-controls={isIos ? "ios-install-help" : undefined}
        className="mt-3 min-h-11 w-full justify-start whitespace-normal px-3 text-left text-foreground"
      >
        <Smartphone className="size-5 text-accent-mineral" aria-hidden="true" />
        <span>App auf Homescreen installieren</span>
        {isIos ? (
          <Share2 className="ml-auto size-4" aria-hidden="true" />
        ) : (
          <Download className="ml-auto size-4" aria-hidden="true" />
        )}
      </Button>

      {isIos && showIosHelp ? (
        <p
          id="ios-install-help"
          role="status"
          className="mt-3 px-3 text-sm leading-6 text-muted-foreground"
        >
          Tippe in Safari auf <strong className="font-semibold text-foreground">Teilen</strong>
          {" und anschließend auf "}
          <strong className="font-semibold text-foreground">„Zum Home-Bildschirm“</strong>.
        </p>
      ) : null}
    </div>
  );
}