import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { isStandaloneApp } from "@/lib/app-mode";

/**
 * Begrüßung beim Öffnen der App (nur als installierte Web-App), rund 5 Sekunden:
 * 1. eine kleine Figur winkt, Sprechblasen ploppen auf (hallo · hola · hello · servus)
 * 2. „schön, dass du da bist.“ – „lass uns kurz zusammen atmen“
 * 3. Einatmen: alles wird groß. Ausatmen: alles wird klein und die Fläche
 *    wischt nach oben weg.
 * Eigene Illustration, flach mit Kontur, nur KLARTeXt.-Farben.
 * Zum Ansehen im Browser: ?intro an die Adresse hängen.
 */

// Zeitplan in Millisekunden
const INHALE_AT = 2700;
const EXHALE_AT = 4300;
const DONE_AT = 5500;

const GREETINGS = [
  { text: "hallo", className: "hello-bubble--1" },
  { text: "hola", className: "hello-bubble--2" },
  { text: "hello", className: "hello-bubble--3" },
  { text: "servus", className: "hello-bubble--4" },
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

type Stage = "greet" | "in" | "out";

export function BreathIntro() {
  const [isVisible, setIsVisible] = useState(false);
  const [stage, setStage] = useState<Stage>("greet");
  const timers = useRef<number[]>([]);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // ?intro zeigt das Intro auch im normalen Browser (zum Ansehen/Testen)
    const forced = new URLSearchParams(window.location.search).has("intro");
    if (!forced && (!isStandaloneApp() || reduced || hasSeenIntro())) return;

    markIntroSeen();
    setIsVisible(true);
    timers.current.push(
      window.setTimeout(() => setStage("in"), INHALE_AT),
      window.setTimeout(() => setStage("out"), EXHALE_AT),
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
    setStage("out");
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
          <HelloFigure />
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

/**
 * Kleine runde Figur: winkt, blinzelt, rosige Wangen.
 * Flach gefüllt mit dunkler Kontur.
 */
function HelloFigure() {
  return (
    <svg viewBox="0 0 220 220" className="hello-figure">
      <g className="hello-figure__body">
        {/* Körper */}
        <path
          d="M110 34c46 0 76 32 76 80 0 46-30 76-76 76s-76-30-76-76c0-48 30-80 76-80Z"
          fill="#FCF3DF"
          stroke="#2b1d18"
          strokeWidth="5"
          strokeLinejoin="round"
        />
        {/* Augen (blinzeln) */}
        <g className="hello-figure__eyes" fill="#2b1d18">
          <ellipse cx="86" cy="106" rx="6.5" ry="8.5" />
          <ellipse cx="134" cy="106" rx="6.5" ry="8.5" />
        </g>
        {/* Wangen */}
        <g fill="#E9BBCB">
          <ellipse cx="70" cy="128" rx="11" ry="7" />
          <ellipse cx="150" cy="128" rx="11" ry="7" />
        </g>
        {/* Lächeln */}
        <path
          d="M94 132c8 10 24 10 32 0"
          fill="none"
          stroke="#2b1d18"
          strokeWidth="5"
          strokeLinecap="round"
        />
        {/* Hand links, ruhig */}
        <circle cx="38" cy="150" r="14" fill="#A2B5D8" stroke="#2b1d18" strokeWidth="5" />
      </g>
      {/* Hand rechts, winkt */}
      <g className="hello-figure__wave">
        <path d="M170 118l18-30" stroke="#2b1d18" strokeWidth="5" strokeLinecap="round" />
        <circle cx="192" cy="80" r="15" fill="#A2B5D8" stroke="#2b1d18" strokeWidth="5" />
      </g>
    </svg>
  );
}
