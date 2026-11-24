import { Hand } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { isStandaloneApp } from "@/lib/app-mode";

/**
 * Begrüßung beim Öffnen der App (nur als installierte Web-App), rund 12 Sekunden:
 * 1. „KLARTeXt.“ erscheint, Sprechblasen ploppen auf (hallo · hola · hello
 *    und eine winkende Hand für „Hallo“ in Gebärdensprache)
 * 2. „schön, dass du da bist.“ – „lass uns kurz zusammen atmen“
 * 3. Der Punkt aus „KLARTeXt.“ atmet: einatmen groß, ausatmen klein,
 *    dann wischt die Fläche nach oben weg.
 * Keine fremde Illustration – nur Schrift und der Punkt der Marke.
 * Zum Ansehen im Browser: ?intro an die Adresse hängen.
 */

// Zeitplan in Millisekunden
// ruhiger Atem: 4 s einatmen, 4 s ausatmen, dann wischt die Fläche weg
const INHALE_AT = 3600;
const EXHALE_AT = INHALE_AT + 4000;
const LEAVE_AT = EXHALE_AT + 4000;
const DONE_AT = LEAVE_AT + 1100;

const GREETINGS = [
  { text: "hallo", className: "hello-bubble--1" },
  { text: "hola", className: "hello-bubble--2" },
  { text: "hello", className: "hello-bubble--3" },
];

const SESSION_KEY = "klartext-breath-intro";

// sessionStorage kann im privaten Modus oder bei blockierten Website-Daten
// fehlen oder Fehler werfen – dann läuft das Intro einfach ohne Merker.
function hasSeenIntro() {
  try {
    return window.sessionStorage.getItem(SESSION_KEY) === "1";
  } catch {
    return false;
  }
}

function markIntroSeen() {
  try {
    window.sessionStorage.setItem(SESSION_KEY, "1");
  } catch {
    // ignorieren
  }
}

type Stage = "greet" | "in" | "out" | "leave";

export function BreathIntro() {
  const [isVisible, setIsVisible] = useState(false);
  const [stage, setStage] = useState<Stage>("greet");
  const timers = useRef<number[]>([]);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // ?intro zeigt das Intro auch im normalen Browser (zum Ansehen/Testen)
    const forced = new URLSearchParams(window.location.search).has("intro");
    // QR-Links führen direkt zum Impuls. Die Begrüßung darf diesen
    // PWA-Einstieg nicht verdecken.
    if (window.location.hash) return;
    if (!forced && (!isStandaloneApp() || reduced || hasSeenIntro())) return;

    markIntroSeen();
    setIsVisible(true);
    timers.current.push(
      window.setTimeout(() => setStage("in"), INHALE_AT),
      window.setTimeout(() => setStage("out"), EXHALE_AT),
      window.setTimeout(() => setStage("leave"), LEAVE_AT),
      window.setTimeout(() => setIsVisible(false), DONE_AT),
    );

    return () => {
      timers.current.forEach((id) => window.clearTimeout(id));
      timers.current = [];
    };
  }, []);

  if (!isVisible) return null;

  const skip = () => {
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current = [];
    setStage("leave");
    timers.current.push(window.setTimeout(() => setIsVisible(false), 1100));
  };

  return (
    <div className={`breath-intro is-${stage}`} role="status" aria-live="polite">
      <div className="breath-intro__stage">
        <div className="hello-scene" aria-hidden="true">
          {GREETINGS.map((greeting) => (
            <span key={greeting.text} className={`hello-bubble ${greeting.className}`}>
              {greeting.text}
            </span>
          ))}
          <span className="hello-bubble hello-bubble--4" title="Hallo in Gebärdensprache">
            <Hand className="hello-bubble__hand" strokeWidth={2.25} />
          </span>
          <p className="hello-mark">
            <img
              src="/icon-192.png?v=8"
              alt="KLARTeXt."
              className="hello-mark__logo"
              width={192}
              height={192}
            />
          </p>
        </div>

        <p className="breath-intro__label">schön, dass du da bist.</p>
        <p className="breath-intro__hint">
          {stage === "greet"
            ? "lass uns kurz zusammen atmen"
            : stage === "in"
              ? "einatmen …"
              : "… und aus."}
        </p>
      </div>

      <Button type="button" variant="ghost" className="breath-intro__skip" onClick={skip}>
        Überspringen
      </Button>
    </div>
  );
}
