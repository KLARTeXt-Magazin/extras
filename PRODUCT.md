# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Leser:innen des Printmagazins KLARTeXt., die über einen QR-Code direkt zu einem passenden Audio-Impuls oder PDF gelangen und diesen unmittelbar nutzen möchten.

## Product Purpose

Die digitalen Extras schaffen einen ruhigen, unmittelbaren Übergang vom gedruckten Heft in einen passenden Moment der Selbstfürsorge. Erfolg bedeutet, dass Leser:innen den verlinkten Impuls ohne Umwege finden, starten und bis zum Ende nutzen können.

## Positioning

Die Extras verbinden den konkreten Kontext einer Magazinausgabe mit einem passenden digitalen Audio- oder PDF-Impuls. Sie sind kein allgemeines Archiv, sondern eine direkte Verlängerung des gedruckten Hefts in einen persönlichen Moment der Ruhe.

## Operating Context

Der Einstieg erfolgt typischerweise unterwegs oder in einem persönlichen Ruhe-Moment über einen QR-Code im Printmagazin. Die Seite dient als unmittelbare Nutzungsschnittstelle für Audio-Übungen, Begleitimpulse und saisonale Inhalte.

## Capabilities and Constraints

- Audio-Impulse können direkt über QR-Codes oder über Ausgabenseiten geöffnet werden.
- PDFs werden als Begleitimpulse angeboten.
- Audio-Inhalte können zeitgesteuert freigeschaltet werden.
- Die Anwendung läuft als Webprojekt und kann zusätzlich vom Homescreen installiert werden.
- Es gibt keine Cookies, kein Tracking und keine Einbindungen von Drittanbietern.
- Schriften werden lokal eingebunden; Google Fonts dürfen nicht verwendet werden.
- Jede Seite muss Impressum und Datenschutz verlinken.
- Inhalte und UI-Texte bleiben auf Deutsch.
- Die Marke wird exakt als „KLARTeXt.“ geschrieben.

## Brand Commitments

- Markenname: KLARTeXt.
- Die digitalen Extras gehören zum Printmagazin KLARTeXt.
- Lokale Schriften Syne und Plus Jakarta Sans sind bereits als Markenbestandteil vorhanden.

## Evidence on Hand

- Produktdokumentation und Inhaltsübersicht: `README.md`
- Leitstern: `.lovable/north-star/north-star.md`
- Audio- und PDF-Inhalte: `public/audio/`, `public/pdf/`
- Ausgaben und Seiten: `src/routes/index.tsx`, `src/routes/lichtblicke.tsx`
- Gemeinsamer Header, Ausgaben-Navigation und Footer: `src/components/site-chrome.tsx`
- Audio-Nutzung und Hörmodus: `src/components/audio-access.tsx`, `src/components/listening-mode.tsx`
- Lokale Schriftlizenzen: `public/font-licenses/`
- Live-Projekt: `https://magazin-klartext-extras.vercel.app`

## Product Principles

1. Der QR-Code-Einstieg führt ohne Umwege zum passenden Inhalt.
2. Der Übergang vom Printmedium zur digitalen Nutzung bleibt ruhig und unmittelbar.
3. Der konkrete Kontext der jeweiligen Ausgabe bleibt sichtbar und verständlich.
4. Inhalte werden ohne Tracking und ohne unnötige Drittanbieter-Abhängigkeiten angeboten.
5. Jede Weiterentwicklung bewahrt deutsche Inhalte, die Marke KLARTeXt. und die rechtlichen Pflichtlinks.
