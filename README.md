# KLARTeXt. Extras

Digitale Extras zum Printmagazin **KLARTeXt.** – Audio-Übungen und Begleitimpulse (PDF), die über QR-Codes im Heft verlinkt sind.

Live: <https://magazin-klartext-extras.vercel.app>

| Seite          | Ausgabe                                | Datei                        |
| -------------- | -------------------------------------- | ---------------------------- |
| `/`            | 01 – Warum Ehrlichkeit Mut braucht     | `src/routes/index.tsx`       |
| `/lichtblicke` | 02 – Lichtblicke (mit Adventskalender) | `src/routes/lichtblicke.tsx` |

QR-Codes können direkt auf ein Audio zeigen, z. B. `/lichtblicke#nikolaus` oder `/lichtblicke#heiligabend` – der Teil nach `#` muss der `id` des Tracks entsprechen.

## Inhalte pflegen

- **Audios:** Datei nach `public/audio/` legen (Schema `JJJJ-qN_extraNN.m4a`), dann in der jeweiligen Seite im `tracks`-Array eintragen. `unlockAt` sperrt ein Audio bis zu einem Datum.
- **PDFs:** nach `public/pdf/`, verlinkt über `downloadUrl` im Track oder direkt auf der Seite.
- **Cover:** nach `src/assets/` (quadratisch, 1024 px).
- **Neue Ausgabe:** neue Datei in `src/routes/` anlegen und in `src/components/site-chrome.tsx` in der Liste `issues` ergänzen.
- **Musik-Credits** (Pixabay) stehen im Feld `credit` des Tracks und werden unter dem Begleitimpuls angezeigt.

## Aufbau

- `src/components/site-chrome.tsx` – Header, Ausgaben-Menü, Footer (Impressum/Datenschutz verlinken auf magazin-klartext.de)
- `src/components/audio-card.tsx` – Audiokachel inkl. Player und Sperre
- `src/components/listening-mode.tsx` – bildschirmfüllender Hörmodus
- `src/components/breath-intro.tsx` – Atem-Intro, nur wenn die Seite als App vom Homescreen geöffnet wird
- `src/styles.css` – Farben, Schriften und alle eigenen Styles

## Datenschutz

- Keine Cookies, kein Tracking, keine Einbindungen von Drittanbietern.
- Schriften (Syne, Plus Jakarta Sans) liegen lokal über `@fontsource` – keine Verbindung zu Google Fonts. Lizenztexte unter `public/font-licenses/`.
- Hosting über Vercel (Server-Logs mit IP-Adressen) – muss in der Datenschutzerklärung auf magazin-klartext.de genannt sein.

## Entwicklung

```bash
bun install
bun run dev        # lokale Vorschau
bun run build      # Produktions-Build
bun run test       # Tests
bun run typecheck  # TypeScript prüfen
bun run lint       # ESLint + Prettier
```

Das Projekt ist mit [Lovable](https://lovable.dev) verbunden; Commits auf `main` erscheinen dort und werden über Vercel veröffentlicht.
