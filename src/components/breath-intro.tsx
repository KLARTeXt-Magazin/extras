import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

/**
 * Ein ruhiger Atemzug beim Öffnen der App (nur als installierte Web-App).
 * Einatmen · Ausatmen, dann öffnet sich die Seite – insgesamt rund 10 Sekunden.
 */

const PHASES = [
  { label: "Einatmen", duration: 4000, mode: "in" },
  { label: "Ausatmen", duration: 6000, mode: "out" },
] as const;

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
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as Navigator & { standalone?: boolean }).standalone === true;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!standalone || reduced || hasSeenIntro()) return;

    markIntroSeen();
    setIsVisible(true);

    const total = PHASES.reduce((sum, item) => sum + item.duration, 0);

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
      className={`breath-intro${isLeaving ? " is-leaving" : ""}`}
      role="status"
      aria-live="polite"
    >
      <p className="breath-intro__eyebrow">KLARTeXt. · Ein Atemzug</p>

      <div className="breath-intro__stage">
        <div className="breath-intro__art" aria-hidden="true">
          <span className="breath-ring" />
          <span
            className={`breath-disc is-${current.mode}`}
            style={{ animationDuration: `${current.duration}ms` }}
          />
        </div>
        <p key={phase} className="breath-intro__label">
          {current.label}
        </p>
      </div>

      <Button type="button" variant="ghost" className="breath-intro__skip" onClick={skip}>
        Überspringen
      </Button>
    </div>
  );
}
