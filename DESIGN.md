---
name: KLARTeXt. Extras
description: Digitale Audio-Impulse und Begleitmaterialien als ruhige Verlängerung des Printmagazins.
colors:
  espresso: "#3b2723"
  espresso-deep: "#3a0c0c"
  ivory: "#f2ede5"
  pearl: "#f8f6f2"
  pampas-sand: "#dccbb2"
  muted-clay: "#715e58"
  linen-cool: "#e7e2dc"
  mist: "#ded8d1"
  line: "#cfc6bf"
  denim: "#c3ced3"
  listening-white: "#fffefa"
typography:
  display:
    fontFamily: "Syne, sans-serif"
    fontSize: "clamp(2.1rem, 9.2vw, 4.25rem)"
    fontWeight: 700
    lineHeight: 1
  body:
    fontFamily: "Plus Jakarta Sans, sans-serif"
    fontSize: "0.95rem"
    fontWeight: 400
    lineHeight: 1.65
  label:
    fontFamily: "Plus Jakarta Sans, sans-serif"
    fontSize: "0.72rem"
    fontWeight: 600
    letterSpacing: "0.04em"
rounded:
  base: "0.625rem"
  card: "1.35rem"
  sheet: "1.75rem"
  pill: "999px"
spacing:
  content: "1.25rem"
  section: "2.5rem"
  page: "3.5rem"
components:
  button-primary:
    backgroundColor: "{colors.espresso}"
    textColor: "{colors.ivory}"
    rounded: "{rounded.pill}"
    padding: "0 1.25rem"
    height: "3rem"
  button-secondary:
    backgroundColor: "{colors.pearl}"
    textColor: "{colors.espresso}"
    rounded: "{rounded.pill}"
    padding: "0 0.85rem"
    height: "2.5rem"
  issue-card:
    backgroundColor: "{colors.pearl}"
    textColor: "{colors.espresso}"
    rounded: "{rounded.card}"
    padding: "0"
  audio-card:
    backgroundColor: "{colors.espresso}"
    textColor: "{colors.ivory}"
    rounded: "{rounded.card}"
    padding: "0.95rem"

# Design System: KLARTeXt. Extras

## Overview

**Creative North Star: „Das redaktionelle Ruhehaus“**

KLARTeXt. Extras ist ein warmes, haptisches Zuhause für kleine Momente. Die Oberfläche verlängert das Printmagazin nicht als technische Plattform, sondern als ruhigen Übergang: Leser:innen scannen einen QR-Code und landen ohne Umwege bei einem passenden Audio-Impuls oder Begleittext.

Die visuelle Sprache verbindet redaktionelle Klarheit mit bewusst inszenierten Ausgabenwelten. Grundflächen bleiben ruhig und materialbasiert; Cover, Ausgabenfarben und Audio-Karten dürfen dagegen charaktervoll und kontrastreich auftreten. Tiefe entsteht primär durch Farbebenen, Überlagerungen, Rundungen und wenige gezielte Schatten.

**Key Characteristics:**
- Warmes Elfenbein, Espresso und Pampas-Sand als ruhige Grundstimmung
- Syne für expressive redaktionelle Titel, Plus Jakarta Sans für Orientierung und Lesetext
- Mobile-first mit einer konzentrierten Inhaltsbreite von maximal etwa 430px
- Ausgaben als eigene Farb- und Bildwelten innerhalb eines gemeinsamen Rahmens
- Flache Inhaltsflächen; Glas und stärkere Tiefe nur auf Bedienebenen wie Navigation und Player

## Colors

Die Palette fühlt sich wie Papier, Kaffee, Stoff und gedämpfte Editorial-Fotografie an. Dunkle Farben tragen Text und Bedienung, helle Flächen schaffen Ruhe, und die Ausgaben bringen ihre eigenen Akzentfarben mit.

### Primary
- **Espresso** (#3b2723): Primäre Schrift, Hauptaktionen und die verbindende Markenfarbe.
- **Tiefes Mineralrot** (#3a0c0c): Mineralischer Akzent für Fokus, sage-benannte Ausgabenflächen und starke Kontraste.

### Secondary
- **Pampas-Sand** (#dccbb2): Sekundäre Flächen und warme Hervorhebungen ohne laute Sättigung.
- **Staubiges Jeansblau** (#c3ced3): Kühle, zurückhaltende Ergänzung für neutrale Materialkontraste.

### Neutral
- **Elfenbein** (#f2ede5): Grundfläche und ruhiger Seitenhintergrund.
- **Perlmutt** (#f8f6f2): Karten, Dialoge und helle Bedienflächen.
- **Gedämpfter Lehm** (#715e58): Sekundärtext und erklärende Hinweise.
- **Kühles Leinen** (#e7e2dc): Abgesetzte neutrale Fläche.
- **Nebel** (#ded8d1): Hover- und Zwischenzustände.
- **Linie** (#cfc6bf): Dezente Trennlinien.
- **Hörweiß** (#fffefa): Helle Schrift über dunklen Cover- und Hörmodusflächen.

### Named Rules
**Die Ruhehaus-Regel.** Grundflächen bleiben warm, ruhig und lesbar; Farbe wird gezielt für Ausgaben, Zustände und aktive Bedienung eingesetzt.

## Typography

**Display Font:** Syne (mit sans-serif)

**Body Font:** Plus Jakarta Sans (mit sans-serif)

**Character:** Syne trägt die eigenständige, leicht plakative Magazinstimme. Plus Jakarta Sans hält QR-Einstieg, Navigation, Metadaten und längere Texte klar und zugänglich.

### Hierarchy
- **Display** (700, `clamp(2.1rem, 9.2vw, 4.25rem)`, 1): Ausgaben- und Hero-Titel, oft in Großbuchstaben.
- **Headline** (700, etwa 1.6–2.5rem, 1.02–1.1): Abschnittstitel und redaktionelle Einstiegspunkte.
- **Title** (700, etwa 1–1.25rem, 1.15–1.25): Karten- und Listentitel.
- **Body** (400, 0.875–0.95rem, 1.55–1.7): Erklärungen, Begleittexte und Hinweise.
- **Label** (600, 0.65–0.75rem, 0.04–0.12em, teils uppercase): Ausgabe, Datum, Status und Navigation.

### Named Rules
**Die Zwei-Stimmen-Regel.** Syne schafft Orientierung und Haltung; Jakarta Sans erklärt. Keine dritte Schriftfamilie ergänzen.

## Layout

Die Primärspalte ist mobile-first und auf etwa 430px begrenzt. Seitenränder liegen typischerweise bei 1.25rem; Abschnitte arbeiten mit großzügigem vertikalem Rhythmus von etwa 2.5rem bis 3.5rem. Ausgabenseiten sind als Ebenen aufgebaut: bildstarker Ausgabenkopf, darüberliegendes Inhaltsblatt, anschließend Hören und Lesen.

Auf größeren Bildschirmen erweitert sich die Ausgabendarstellung auf bis zu etwa 860px für Inhaltsbereiche; der Kopf darf zweispaltiger und großzügiger werden. Die untere Navigation bleibt eine mobile Bedienmetapher, während Desktop-Navigation im Header erscheint. Touch-Ziele bleiben mindestens 44px groß, auch wenn ihre sichtbare Beschriftung kleiner ist.

## Elevation & Depth

Das System ist überwiegend flach und materialbasiert. Karten und Inhaltsblätter unterscheiden sich durch Tonwert, Rundung, Bild und Überlagerung. Schatten sind sparsam und funktional: Installationshinweis, Player, Fokus- und Hoverzustände dürfen schweben. Glasunschärfe gehört ausschließlich zu Bedienebenen wie der unteren Navigation und dem Mini-Player, nicht zu den redaktionellen Inhaltsflächen.

### Shadow Vocabulary
- **Ambient UI** (`0 12px 32px color-mix(in srgb, var(--foreground) 18%, transparent)`): Installationshinweis und schwebende Hinweise.
- **Floating navigation** (`0 8px 28px -6px rgb(0 0 0 / 0.18)`): Untere Navigation als schwebende Bedienebene.
- **Quiet control** (`0 3px 10px color-mix(in srgb, var(--foreground) 8%, transparent)`): Kleine Header-Aktion „App speichern“.

### Named Rules
**Die Flat-by-Default-Regel.** Inhalte liegen ruhig und deckend; Schatten und Blur markieren nur Bedienung oder Zustandswechsel.

## Shapes

Die Formensprache ist weich, taktil und klar. Karten nutzen meist 1.35rem Rundung, Inhaltsblätter 1.75rem an der oberen Kante, und Aktionen erscheinen als Pillen mit 999px Radius. Trennlinien bleiben dünn und zurückhaltend. Bilder werden innerhalb der Karten beschnitten; Ausgabenköpfe dürfen stark überlagert und bildfüllend sein.

## Components

### Buttons
- **Shape:** Runde Pillen für primäre und redaktionelle Aktionen (`999px`); generische UI-Buttons können `0.625rem` nutzen.
- **Primary:** Espresso auf Elfenbein, mindestens 3rem hoch, großzügige horizontale Innenabstände.
- **Hover / Focus:** Tonwertwechsel statt dramatischer Bewegung; sichtbarer 2px-Fokusrahmen mit Abstand.
- **Secondary:** Helle Fläche oder transparenter Hintergrund mit dezenter Linie; nie als konkurrierende Primärfarbe.

### Cards / Containers
- **Corner Style:** Audio- und Ausgabenkarten `1.35rem`; Inhaltsblatt `1.75rem 1.75rem 0 0`.
- **Background:** Perlmutt für Übersichtskarten, ausgabenspezifische Ink-/Accent-Paare für Audio.
- **Shadow Strategy:** Flach im Ruhezustand; Schatten nur bei schwebenden Bedienflächen.
- **Border:** Dezente Linien über dem warmen Grund; Audio-Karten dürfen kontrastierende Konturen verwenden.
- **Internal Padding:** Kompakte Karten etwa `0.95rem`; redaktionelle Inhalte mindestens `1.25rem` seitlich.

### Navigation
- **Style:** Header mit Logo, Desktop-Textlinks und kleiner Installationsaktion; mobile untere Pillenleiste mit drei Hauptpunkten.
- **States:** Aktive mobile Navigation erhält eine helle innere Kapsel; Fokus bleibt sichtbar und tastaturfreundlich.
- **Behavior:** Header ist zunächst ruhig und wird beim Scrollen durch eine dezente Linie stabilisiert.

### Audio Shelf and Player
Audio-Karten bilden ein horizontales Regal mit Snap-Scrolling. Die ausgewählte Karte darf wachsen, während Nachbarn zurücktreten. Der Mini-Player ist eine dunkle, schwebende Pillenfläche; der Vollbild-Hörmodus übernimmt Bild, Text und große, leicht erreichbare Controls.

### Issue Head
Jede Ausgabe erhält einen bildstarken Kopf mit eigener Farbwelt. Ein deckender Verlauf verbindet das Cover mit dem Ausgabentitel, ohne die Lesbarkeit durch Unschärfe zu lösen. Die gemeinsame Site-Chrome bleibt dabei unverändert.

## Do's and Don'ts

### Do:
- **Do** den QR-Code-Weg in wenigen, klaren Schritten unterstützen.
- **Do** warme Papier- und Materialtöne mit den individuellen Ausgabenfarben verbinden.
- **Do** Syne nur für markante redaktionelle Titel und Plus Jakarta Sans für funktionale Information einsetzen.
- **Do** mobile Lesbarkeit, 44px-Touch-Ziele und sichtbaren Tastaturfokus bewahren.
- **Do** Glas- und Schatteneffekte auf Bedienebenen begrenzen.
- **Do** deutsche Inhalte, lokale Schriften und die exakte Schreibweise „KLARTeXt.“ bewahren.

### Don't:
- **Don't** Google Fonts, Tracking, Cookies oder unnötige Drittanbieter-Einbindungen ergänzen.
- **Don't** die ruhigen Inhaltsflächen mit dauerhaftem Blur, starken Verläufen oder dekorativen Schatten überladen.
- **Don't** die 430px-Inhaltslogik durch breite, beliebige Dashboard-Raster ersetzen.
- **Don't** Footer-Links zu Impressum oder Datenschutz entfernen.
- **Don't** generische SaaS-Farbwelten oder eine zusätzliche Schriftfamilie einführen.
