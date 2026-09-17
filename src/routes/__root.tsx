/* =======================================================
   KLARTeXt. EXTRAS – GLOBALE STYLES

   Enthält:
   • Farben & Schriften
   • Glass-Effekte
   • Header & Hero
   • Audio-Kacheln & Player
   • Ausgaben-Menü
   • Animationen
   • Barrierefreiheit
   ======================================================= */


/* -------------------------------------------------------
   TAILWIND / GRUNDLAGEN
   • Tailwind CSS laden
   • eigene Source-Dateien festlegen
   • Animationserweiterung laden
   ------------------------------------------------------- */

@import "tailwindcss" source(none);
@source "../src";

@custom-variant dark (&:is(.dark *));


/* =======================================================
   DESIGN-SYSTEM
   =======================================================

   Hier werden:
   • Farben
   • Rundungen
   • Schatten
   • Schriften

   mit Tailwind verbunden.

   Die eigentlichen Farbwerte stehen weiter unten bei
   :root.
   ======================================================= */

@theme inline {

  /* Rundungen */
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
  --radius-2xl: calc(var(--radius) + 8px);
  --radius-3xl: calc(var(--radius) + 12px);

  /* Grundfarben */
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);

  /* Hauptfarben */
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);

  /* Dezente Farben */
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);

  /* Fehler / Formulare / Fokus */
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --color-ring-offset-background: var(--background);

  /* Eigene KLARTeXt.-Farben */
  --color-surface: var(--surface);
  --color-panel-border: var(--panel-border);
  --color-light: var(--light);

  /* Sage */
  --color-sage: var(--sage);
  --color-sage-foreground: var(--sage-foreground);
  --color-sage-soft: var(--sage-soft);

  /* Mineralblau */
  --color-accent-mineral: var(--accent-mineral);
  --color-accent-mineral-soft: var(--accent-mineral-soft);
  --color-mineral-band: var(--mineral-band);

  /* Weitere Abschnittsfarben */
  --color-companion-band: var(--companion-band);
  --color-continue-band: var(--continue-band);
  --color-lilac: var(--lilac);
  --color-wine: var(--wine);
  --color-olive: var(--olive);
  --color-listening: var(--listening);
  --color-listening-muted: var(--listening-muted);

  /* Schatten */
  --shadow-player:
    0 24px 70px color-mix(
      in oklab,
      var(--primary) 11%,
      transparent
    );

  --shadow-play:
    0 12px 24px color-mix(
      in oklab,
      var(--primary) 24%,
      transparent
    );

  /* Schriften */
  --font-display: "Urbanist", sans-serif;
  --font-body: "Plus Jakarta Sans", sans-serif;
}


/* =======================================================
   FARBPALETTE
   =======================================================

   HIER kannst du die globale Farbwelt verändern.

   • background       → Seitenhintergrund
   • foreground       → Haupttext
   • primary          → Braun / Play-Button
   • secondary        → warme Nebenfarbe
   • muted            → dezente Texte
   • sage             → grüner Übungsbereich
   • mineral-band     → blauer Abschnitt
   • accent-mineral   → kräftigeres Blau für Akzente

   ======================================================= */

/* =======================================================
   FARBPALETTE – KLARTeXt.
   ======================================================= */

:root {

  --radius: 0.625rem;

  /* Grundfarben – Pantone Cloud Dancer / Wolkenweiß */
  --background: #FFFFFA;
  --foreground: #260808;

  /* Karten */
  --card: #FFFFFA;
  --card-foreground: #260808;

  /* Popover */
  --popover: #FFFFFA;
  --popover-foreground: #260808;

  /* Hauptfarbe – tiefes Burgunder */
  --primary: #3A0C0C;
  --primary-foreground: #FFFFFA;

  /* Sekundärfarbe – warmes Taupe-Braun */
  --secondary: #9A8065;
  --secondary-foreground: #260808;

  /* Dezente Farben – zitronenfrisch statt beige */
  --muted: #FBFBC1;
  --muted-foreground: #5C4A33;

  --accent: #FBFBC1;
  --accent-foreground: #260808;

  /* Fehler */
  --destructive: oklch(0.58 0.2 25);
  --destructive-foreground: #FFFEFA;

  /* Rahmen / Formulare */
  --border: rgb(112 96 80 / 0.25);
  --input: rgb(112 96 80 / 0.32);

  /* Fokus */
  --ring: #3A0C0C;

  /* Glass / Oberflächen */
  --surface: rgb(255 255 250 / 0.66);
  --panel-border: rgb(255 255 255 / 0.68);
  --light: #FFFEFA;

  /* Übungsbereich – Burgunder auf zitronenfrischem Grund */
  --sage: #3A0C0C;
  --sage-foreground: #260808;
  --sage-soft: #FBFBC1;

  /* Akzent – Burgunder, aus der Logo-Palette abgeleitet */
  --mineral-band: #FBFBC1;
  --accent-mineral: #3A0C0C;
  --accent-mineral-soft: rgb(58 12 12 / 0.12);

  /* Weitere Abschnittsfarben */
  --companion-band: #FFFFFA;
  --continue-band: #9A8065;
  --lilac: #FBFBC1;
  --wine: #260808;
  --olive: #8D8E1F;
  --listening: #FFFFFA;
  --listening-muted: rgb(255 255 250 / 0.78);
}


/* =======================================================
   FOKUS / TASTATUR
   • sichtbarer Fokusrahmen
   • wichtig für Barrierefreiheit
   ======================================================= */

@layer base {
  :where(a, button, input, select, textarea, [tabindex]):focus-visible {
    outline: 2px solid var(--accent-mineral);
    outline-offset: 2px;
    border-radius: 0.5rem;
  }
}


/* =======================================================
   SKIP-LINK
   • "Zum Inhalt springen"
   • nur bei Tastatur-Fokus sichtbar
   ======================================================= */

.skip-link {
  position: fixed;
  top: 0.5rem;
  left: 0.5rem;
  z-index: 100;

  padding: 0.75rem 1.15rem;
  border-radius: 999px;

  background: var(--card);
  color: var(--foreground);

  font-size: 0.875rem;
  font-weight: 600;

  box-shadow: 0 10px 30px rgb(70 58 45 / 0.18);

  transform: translateY(-160%);
  transition: transform 180ms ease;
}

.skip-link:focus-visible {
  transform: translateY(0);
}


/* =======================================================
   GLOBALE BASISREGELN
   • Standardrahmen
   • Scrollverhalten
   • Seitenhintergrund
   • Mobile Tap-Effekt
   ======================================================= */

@layer base {

  * {
    border-color: var(--color-border);
  }

  html {
    scroll-behavior: smooth;
  }

  body {
    background-color: var(--color-background);
    color: var(--color-foreground);
    letter-spacing: 0;
  }

  button,
  a,
  input {
    -webkit-tap-highlight-color: transparent;
  }
}


/* =======================================================
   LIQUID GLASS
   =======================================================

   Allgemeiner Glass-Effekt für:
   • Header
   • Panels
   • schwebende UI-Elemente

   Die Audio-Kacheln haben weiter unten ihren eigenen
   Glass-Effekt.
   ======================================================= */

.liquid-glass {
  --liquid-filter: none;
  --liquid-blur: 20px;

  position: relative;
  isolation: isolate;

  background:
    linear-gradient(
      145deg,
      rgb(255 255 255 / 0.18),
      rgb(255 255 255 / 0.06)
    );

  border: 1px solid rgb(255 255 255 / 0.42);

  box-shadow:
    0 24px 70px rgb(70 58 45 / 0.10),
    inset 0 1px 0 rgb(255 255 255 / 0.72),
    inset 0 -1px 0 rgb(255 255 255 / 0.10);

  backdrop-filter:
    var(--liquid-filter)
    blur(var(--liquid-blur))
    saturate(135%);

  -webkit-backdrop-filter:
    var(--liquid-filter)
    blur(var(--liquid-blur))
    saturate(135%);

  overflow: hidden;
}


/* Glass-Lichtreflex */
.liquid-glass::before {
  content: "";
  position: absolute;
  inset: 0;

  pointer-events: none;
  z-index: -1;

  background:
    linear-gradient(
      125deg,
      rgb(255 255 255 / 0.34) 0%,
      rgb(255 255 255 / 0.08) 25%,
      transparent 46%,
      transparent 70%,
      rgb(255 255 255 / 0.10) 100%
    );

  opacity: 0.8;
}


/* Feine innere Glas-Kante */
.liquid-glass::after {
  content: "";
  position: absolute;
  inset: 1px;

  pointer-events: none;
  z-index: 20;

  border-radius: inherit;

  box-shadow:
    inset 0 0 0 1px rgb(255 255 255 / 0.12);

  opacity: 0.8;
}


/* Inhalt über den Glass-Ebenen */
.liquid-glass-content {
  position: relative;
  z-index: 10;
}


/* =======================================================
   HEADER – GLASS-BUTTON
   • Menübutton
   • transparenter Glass-Look
   • Hover-Effekt
   ======================================================= */

.liquid-glass-button {
  position: relative;

  border: 1px solid rgb(255 255 255 / 0.55) !important;

  background:
    linear-gradient(
      145deg,
      rgb(255 255 255 / 0.30),
      rgb(255 255 255 / 0.09)
    ) !important;

  box-shadow:
    0 10px 30px rgb(70 58 45 / 0.08),
    inset 0 1px 0 rgb(255 255 255 / 0.70);

  backdrop-filter:
    blur(18px)
    saturate(140%);

  -webkit-backdrop-filter:
    blur(18px)
    saturate(140%);

  transition:
    transform 220ms ease,
    background 220ms ease,
    box-shadow 220ms ease;
}

.liquid-glass-button:hover {
  transform: translateY(-1px);

  background:
    linear-gradient(
      145deg,
      rgb(255 255 255 / 0.42),
      rgb(255 255 255 / 0.13)
    ) !important;

  box-shadow:
    0 14px 34px rgb(70 58 45 / 0.11),
    inset 0 1px 0 rgb(255 255 255 / 0.78);
}


/* =======================================================
   SCHWEBENDER HEADER
   • normal: fast transparent
   • beim Scrollen: stärkerer Glass-Effekt
   ======================================================= */

.floating-site-header {
  background:
    color-mix(
      in oklab,
      var(--background) 72%,
      transparent
    );

  border-bottom: 1px solid transparent;

  backdrop-filter: blur(0) saturate(100%);
  -webkit-backdrop-filter: blur(0) saturate(100%);

  transition:
    background-color 300ms ease,
    border-color 300ms ease,
    backdrop-filter 300ms ease;
}


/* Zustand nach dem Scrollen */
.floating-site-header.is-scrolled {
  background:
    color-mix(
      in oklab,
      var(--background) 86%,
      transparent
    );

  border-color:
    color-mix(
      in oklab,
      var(--border) 72%,
      transparent
    );

  backdrop-filter:
    blur(20px)
    saturate(125%);

  -webkit-backdrop-filter:
    blur(20px)
    saturate(125%);
}


/* =======================================================
   HERO
   • große Einstiegsüberschrift
   • Scroll-Animation
   • Überschrift bleibt beim Komprimieren gleich breit
   ======================================================= */

.hero-presentation {
  transform-origin: top center;

  transition:
    opacity 420ms ease,
    transform 520ms cubic-bezier(0.22, 1, 0.36, 1);
}


/* Verhindert Verschiebung des restlichen Inhalts */
.hero-presentation.is-compact {
  padding-bottom: 2.5rem;
}


/* Hero-Titel */
.hero-title {
  transform-origin: left top;

  /* Nur Position + Transparenz animieren */
  transition:
    opacity 480ms ease,
    transform 620ms cubic-bezier(0.22, 1, 0.36, 1);
}


/* Titel beim Scrollen zurücknehmen */
.hero-presentation.is-compact .hero-title {
  opacity: 0.35;
  transform: translateY(-0.75rem);
}


/* Hero-Untertitel */
.hero-sub {
  transition:
    opacity 480ms ease,
    transform 620ms cubic-bezier(0.22, 1, 0.36, 1);
}

.hero-presentation.is-compact .hero-sub {
  opacity: 0.5;
  transform: translateY(-0.4rem);
}


/* =======================================================
   AUDIO-KACHELN
   =======================================================

   WICHTIG:
   • Die Kachel selbst hat immer dieselbe Größe.
   • Das Hintergrundbild beeinflusst NICHT die Größe.
   • Die Kachel bleibt neutral / warm.
   • Das Bild liegt ausschließlich hinter der Kachel.
   ======================================================= */

.audio-player-card {
  position: relative;

  width: 100%;
  max-width: 720px;
  box-sizing: border-box;

  background: rgb(255 254 251 / 0.88);

  border-color:
    rgb(255 255 255 / 0.92);

  box-shadow:
    inset 0 1px 0 rgb(255 255 255 / 0.96),
    inset 0 -1px 0 rgb(255 255 255 / 0.18),
    0 24px 54px -24px rgb(58 12 12 / 0.30),
    0 4px 14px rgb(58 12 12 / 0.07);

  backdrop-filter:
    blur(10px)
    saturate(108%);

  -webkit-backdrop-filter:
    blur(10px)
    saturate(108%);

  transition:
    opacity 420ms ease,
    transform 520ms cubic-bezier(0.22, 1, 0.36, 1),
    filter 420ms ease,
    box-shadow 520ms ease;
}


/* Desktop:
   etwas mehr Deckkraft, damit die Kachel auf Fotos
   nicht deutlich transparenter wirkt als mobil. */
@media (min-width: 768px) {

  .audio-player-card {
    background:
      rgb(255 254 251 / 0.92);
  }
}


/* Feiner Lichtreflex auf der Kachel */
.audio-player-card::before {
  content: "";

  position: absolute;
  inset: 0;

  pointer-events: none;

  border-top: 1px solid rgb(255 255 255 / 0.98);
  border-left: 1px solid rgb(255 255 255 / 0.72);

  opacity: 1;
}


/* =======================================================
   AUDIO-SECTIONS
   =======================================================

   Die Größe der Section ist vollständig unabhängig
   vom verwendeten Foto.

   background-image:
   → rein visuell

   min-height:
   → bestimmt die tatsächliche Section-Größe

   background-size: cover:
   → Foto wird zugeschnitten, niemals die Section
     vergrößert oder verkleinert.
   ======================================================= */

.audio-band {
  position: relative;
  isolation: isolate;
  overflow: hidden;

  /* Feste Mindesthöhe – unabhängig vom Bild */
  min-height: 620px;

  /* KLARTeXt. Grundfarbe als Fallback */
  background-color: var(--lilac);

  /* Foto bleibt immer innerhalb dieser Fläche */
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;

  display: flex;
  align-items: center;
}


/* -------------------------------------------------------
   AUSGABE 1
   ------------------------------------------------------- */

.audio-band--ausgabe-1 {
  background: var(--lilac);
}


/* -------------------------------------------------------
   AUSGABE 2
   ------------------------------------------------------- */

.audio-band--ausgabe-2 {
  background: var(--lilac);
}


/* -------------------------------------------------------
   DEZENTE BILDVEREDLUNG
   ------------------------------------------------------- */

.audio-band::before {
  content: "";

  position: absolute;
  inset: 0;

  z-index: -1;

  pointer-events: none;

  background: none;

  mix-blend-mode: normal;
}


/* -------------------------------------------------------
   FALLBACK
   ------------------------------------------------------- */

.audio-band:not(
  .audio-band--ausgabe-1,
  .audio-band--ausgabe-2
) {
  background-color: var(--secondary);
}


/* =======================================================
   MOBILE
   =======================================================

   Die Section bleibt auch auf kleinen Displays
   bildunabhängig dimensioniert.
   ======================================================= */

@media (max-width: 767px) {

  .audio-band {
    min-height: 620px;
  }

}
/* -------------------------------------------------------
   DIE ANDEREN SECTIONS BLEIBEN WIE BISHER
   ------------------------------------------------------- */

.companion-band {
  background: var(--background);
  border-top: 1px solid color-mix(in oklab, var(--wine) 12%, transparent);
}


.continue-band {
  background: var(--secondary);
}

/* =======================================================
   AKTIVE AUDIO-KACHEL
   ======================================================= */

.audio-player-card.is-active {
  opacity: 1;

  transform:
    translateY(0)
    scale(1);

  box-shadow:
    inset 0 1px 0 rgb(255 255 255 / 0.96),
    inset 0 -1px 0 rgb(255 255 255 / 0.18),
    0 26px 58px -24px rgb(38 8 8 / 0.28),
    0 4px 14px rgb(38 8 8 / 0.07);
}


.audio-player-card.is-dimmed {
  opacity: 0.7;

  transform:
    scale(0.975);

  filter: saturate(0.88);
}

.audio-cover-badge,
.audio-lock {
  border-color: rgb(255 255 250 / 0.42);
  background: rgb(38 8 8 / 0.52);
  color: var(--listening);
}

.audio-carousel-shell {
  position: relative;
}

.audio-band.audio-tone-2 { background: #F5F6C9; }
.audio-band.audio-tone-3 { background: #EDEFB7; }
.audio-band.audio-tone-4 { background: #E3E6A2; }

.companion-inner { border-color: var(--secondary); }
.companion-tone-2 .companion-inner { border-color: var(--olive); }
.companion-tone-3 .companion-inner { border-color: var(--secondary); }
.companion-tone-4 .companion-inner { border-color: var(--primary); }

.listening-mode {
  background: var(--wine);
  color: var(--listening);
}

.listening-mode__image,
.listening-mode__wash {
  position: absolute;
  inset: 0;
}

.listening-mode__image {
  background-image: var(--listening-image);
  background-position: center;
  background-size: cover;
  transform: scale(1.02);
}

.listening-mode__wash {
  background: linear-gradient(180deg, rgb(38 8 8 / 0.06) 10%, rgb(38 8 8 / 0.34) 48%, rgb(38 8 8 / 0.94) 100%);
}

.listening-control {
  border: 1px solid rgb(255 255 250 / 0.34);
  background: rgb(255 255 250 / 0.14);
  color: var(--listening);
  backdrop-filter: blur(14px);
}

.listening-play {
  background: var(--listening);
  color: var(--wine);
  box-shadow: 0 16px 34px rgb(38 8 8 / 0.30);
}

.listening-play:hover { background: var(--background); }

.listening-range::-webkit-slider-runnable-track {
  background: linear-gradient(to right, var(--listening) 0 var(--player-progress), rgb(255 255 250 / 0.28) var(--player-progress) 100%);
}

.listening-range::-moz-range-track { background: rgb(255 255 250 / 0.28); }
.listening-range::-moz-range-progress { background: var(--listening); }
.listening-range::-webkit-slider-thumb,
.listening-range::-moz-range-thumb {
  border-color: var(--wine);
  background: var(--listening);
}

/* =======================================================
   AUSGABEN-MENÜ / SLIDE-OUT PANEL
   =======================================================

   • Hintergrund des geöffneten Ausgabe-Menüs
   • einzelne Ausgabe-Einträge
   ======================================================= */

.issue-sheet {
  background: transparent !important;
}


.issue-panel {
  min-height: 100%;

  background:
    linear-gradient(
      145deg,
      rgb(255 255 255 / 0.96),
      rgb(255 255 250 / 0.94)
    );

  border-color:
    rgb(255 255 255 / 0.72);

  box-shadow:
    0 24px 70px rgb(70 58 45 / 0.14),
    inset 0 1px 0 rgb(255 255 255 / 0.90),
    inset 0 -1px 0 rgb(255 255 255 / 0.16);
}


/* Einzelne Ausgabe */
.issue-entry {
  position: relative;
  display: block;

  padding:
    1.25rem
    1rem
    1.35rem;

  margin-top: 0.35rem;

  border-radius: 1.25rem;

  transition:
    background-color 220ms ease,
    transform 220ms ease,
    box-shadow 220ms ease;
}


/* Erster Eintrag ohne oberen Abstand */
.issue-entry:first-child {
  margin-top: 0;
}


/* Hover */
.issue-entry:hover {
  background:
    rgb(255 255 255 / 0.16);

  transform:
    translateX(2px);

  box-shadow:
    inset 0 1px 0 rgb(255 255 255 / 0.25);
}


/* Aktuelle Ausgabe */
.issue-entry-current {
  background:
    rgb(255 255 255 / 0.10);
}


/* =======================================================
   AUDIO-PLAYER / FORTSCHRITTSBALKEN
   =======================================================

   Steuert:
   • Fortschrittslinie
   • Fortschrittspunkt
   • Farbe
   • Fokus

   Der Wert --player-progress wird von React aktualisiert.
   ======================================================= */

.player-range {
  --player-progress: 0%;

  appearance: none;

  height: 2px;

  border-radius: 999px;

  background:
    linear-gradient(
      to right,
      var(--primary)
        0
        var(--player-progress),
      var(--secondary)
        var(--player-progress)
        100%
    );

  cursor: pointer;
}


/* Fortschrittspunkt – Chrome/Safari */
.player-range::-webkit-slider-thumb {
  appearance: none;

  width: 10px;
  height: 10px;

  border-radius: 999px;

  border:
    3px solid
    rgb(255 255 255 / 0.70);

  background:
    var(--primary);

  box-shadow:
    0 0 0 1px var(--primary),
    0 2px 8px rgb(70 58 45 / 0.18);
}


/* Fortschrittspunkt – Firefox */
.player-range::-moz-range-thumb {
  width: 6px;
  height: 6px;

  border-radius: 999px;

  border:
    3px solid
    rgb(255 255 255 / 0.70);

  background:
    var(--primary);
}


/* =======================================================
   ANIMATIONEN
   ======================================================= */

@keyframes audio-card-glow {

  /* Start / Ende */
  0%,
  100% {
    transform:
      translate3d(0, 0, 0)
      scale(1);

    opacity: 0.45;
  }

  /* Mitte */
  50% {
    transform:
      translate3d(-10px, 8px, 0)
      scale(1.08);

    opacity: 0.72;
  }
}


/* =======================================================
   REDUCED MOTION
   • Animationen reduzieren, wenn Nutzer das wünscht
   • wichtig für Accessibility
   ======================================================= */

@media (prefers-reduced-motion: reduce) {

  html {
    scroll-behavior: auto;
  }

  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}


/* =======================================================
   AUDIO-PLAYER – BARRIEREFREUNDLICHER SLIDER
   =======================================================

   Dieser Block überschreibt teilweise die Einstellungen
   des ersten .player-range-Blocks.

   Ziel:
   • größere Tippfläche
   • sichtbare 4px-Linie
   • Mineralblau für den abgespielten Bereich
   • größere Bedienfläche
   ======================================================= */

.player-range {
  height: 1.5rem;
  background: none;
  border-radius: 999px;
}


/* Slider-Linie – Chrome/Safari */
.player-range::-webkit-slider-runnable-track {
  height: 6px;
  border-radius: 999px;

  background:
    linear-gradient(
      to right,
      var(--accent-mineral)
        0
        var(--player-progress),

      color-mix(
        in oklab,
        var(--foreground) 22%,
        transparent
      )
        var(--player-progress)
        100%
    );
}


/* Slider-Linie – Firefox */
.player-range::-moz-range-track {
  height: 6px;
  border-radius: 999px;

  background:
    color-mix(
      in oklab,
      var(--foreground) 22%,
      transparent
    );
}


/* Abgespielter Bereich – Firefox */
.player-range::-moz-range-progress {
  height: 6px;
  border-radius: 999px;

  background:
    var(--accent-mineral);
}


/* Größerer Bedienpunkt – Chrome/Safari */
.player-range::-webkit-slider-thumb {
  width: 18px;
  height: 18px;

  margin-top: -6px;

  border:
    3px solid
    var(--light);

  background:
    var(--accent-mineral);

  box-shadow:
    0 2px 10px rgb(70 58 45 / 0.28);
}


/* Größerer Bedienpunkt – Firefox */
.player-range::-moz-range-thumb {
  width: 12px;
  height: 12px;

  border:
    3px solid
    var(--light);

  background:
    var(--accent-mineral);
}


/* Fokus des Sliders */
.player-range:focus-visible {
  outline:
    2px solid
    var(--accent-mineral);

  outline-offset: 4px;
}


/* =======================================================
   TOUCH-ZIELE
   • mindestens 44 × 44 px
   • wichtig für Smartphone-Bedienung
   ======================================================= */

.tap-target {
  position: relative;

  min-width: 44px;
  min-height: 44px;

  display: inline-flex;

  align-items: center;
  justify-content: center;
}


/* =======================================================
   CAROUSEL-PUNKTE
   • zeigen die aktuelle Audio-Kachel
   • normal = dezent
   • aktiv = Mineralblau
   ======================================================= */

.carousel-dot {
  height: 0.375rem;

  border-radius: 999px;

  background:
    color-mix(
      in oklab,
      var(--foreground) 22%,
      transparent
    );

  transition:
    width 300ms ease,
    background-color 300ms ease;
}


/* Aktiver Punkt */
.carousel-dot[aria-selected="true"] {
  background:
    var(--accent-mineral);
}


/* =======================================================
   REDUCED MOTION – AUDIO / CAROUSEL
   ======================================================= */

@media (prefers-reduced-motion: reduce) {

  /* Glow abschalten */
  .audio-card-glow {
    animation: none !important;
  }

  /* Smooth Scrolling abschalten */
  .scroll-smooth,
  [class*="scroll-smooth"] {
    scroll-behavior: auto !important;
  }
}
