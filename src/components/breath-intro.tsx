import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Button } from "@/components/ui/button";
import { isStandaloneApp } from "@/lib/app-mode";

/**
 * Ein ruhiger Atemzug beim Öffnen der App (nur als installierte Web-App).
 * Einatmen · Ausatmen, dann öffnet sich die Seite – insgesamt rund 10 Sekunden.
 * Optik: flach und satt – brauner Grund, jeansblauer Himmel, Hügel in Aubergine und Beere, rosé Sonne.
 * Zum Ansehen im Browser: ?intro an die Adresse hängen.
 */

const PHASES = [
  { label: "Einatmen", hint: "langsam durch die Nase", duration: 4000, mode: "in" },
  { label: "Ausatmen", hint: "und alles loslassen", duration: 6000, mode: "out" },
] as const;

const TOTAL = PHASES.reduce((sum, item) => sum + item.duration, 0);

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

export function BreathIntro() {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const [phase, setPhase] = useState(0);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // ?intro zeigt das Intro auch im normalen Browser (zum Ansehen/Testen)
    const forced = new URLSearchParams(window.location.search).has("intro");
    if (!forced && (!isStandaloneApp() || reduced || hasSeenIntro())) return;

    markIntroSeen();
    setIsVisible(true);

    const total = TOTAL;

    let t = 0;
    PHASES.forEach((p, i) => {
      t += p.duration;
      if (i < PHASES.length - 1) {
        timers.current.push(window.setTimeout(() => setPhase(i + 1), t));
      }
    });
    timers.current.push(
      window.setTimeout(() => setIsLeaving(true), total),
      window.setTimeout(() => setIsVisible(false), total + 700),
    );

    return () => {
      timers.current.forEach((id) => window.clearTimeout(id));
      timers.current = [];
    };
  }, []);

  if (!isVisible) return null;

  const current = PHASES[phase] ?? PHASES[0];

  const skip = () => {
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current = [];
    setIsLeaving(true);
    window.setTimeout(() => setIsVisible(false), 500);
  };

  return (
    <div
      className={`breath-intro is-${current.mode}${isLeaving ? " is-leaving" : ""}`}
      role="status"
      aria-live="polite"
      style={{ "--phase-ms": `${current.duration}ms` } as CSSProperties}
    >
      <p className="breath-intro__eyebrow">KLARTeXt. · Ein Atemzug für dich</p>

      <div className="breath-intro__stage">
        <BreathArt />
        <p key={phase} className="breath-intro__label">
          {current.label}
        </p>
        <p className="breath-intro__hint">{current.hint}</p>
      </div>

      <div className="breath-intro__footer">
        {/* Fortschritt über beide Phasen */}
        <span className="breath-progress" aria-hidden="true">
          <span style={{ animationDuration: `${TOTAL}ms` }} />
        </span>

        <Button type="button" variant="ghost" className="breath-intro__skip" onClick={skip}>
          Überspringen
        </Button>
      </div>
    </div>
  );
}

/**
 * Illustration: flache Hügel in den KLARTeXt.-Farben,
 * dahinter eine Sonne („Lichtblick“), die mitatmet.
 */
function BreathArt() {
  return (
    <div className="breath-art" aria-hidden="true">
      <svg viewBox="0 0 320 320" className="breath-art__paper">
        <path className="paper paper--rose" d="M214 96 a 18 18 0 1 1 36 0 a 18 18 0 1 1 -36 0" />
        <path
          className="paper paper--lilac"
          d="M-10 236 C 40 188, 92 200, 138 214 S 236 170, 330 196 L 330 330 L -10 330 Z"
        />
        <path
          className="paper paper--teal"
          d="M-10 262 C 56 230, 118 246, 170 258 S 270 236, 330 248 L 330 330 L -10 330 Z"
        />
      </svg>
      <span className="breath-art__glow" />
      <span className="breath-art__light" />
    </div>
  );
}
