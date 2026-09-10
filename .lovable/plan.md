# Edlerer Luxury-Japandi Audio-Player

## Ziel
Die bestehende Aufteilung bleibt erhalten, wirkt aber typografisch ruhiger, hochwertiger und räumlicher. Kleine Beschriftungen werden reduziert; die Audio-Kachel erhält eine klarere Glass-Wirkung und mehr Abstand zum Hintergrund.

## Umsetzung
- Überschrift deutlich größer und mit einer eleganteren Editorial-Schrift setzen; Begleittexte und Mikro-Labels reduzieren.
- Titelbereich beim Scrollen und während der Wiedergabe sanft zurücknehmen, damit der Player allein im Fokus steht.
- Player-Kachel mit transparenterer Glasfläche, feiner Lichtkante, stärkerem Floating-Schatten und subtiler Bewegung veredeln.
- Ausgabenmenü als hochwertige, weich einblendende Glasfläche mit größeren Ausgaben-Einträgen und klarer Hierarchie gestalten.
- Unterhalb des Hauptplayers für Ausgabe 2 ein horizontal wischbares Audio-Rondell mit Snap-Verhalten, sichtbarer nächster Kachel und drei echten Audio-Ausgaben ergänzen.
- Mobile Darstellung und Wiedergabe abschließend prüfen.

## Technische Details
- Scroll- und Wiedergabestatus steuern ausschließlich Präsentation und Animation; die vorhandene Audiofunktion bleibt erhalten.
- Das Rondell nutzt natives horizontales Scrollen mit CSS Scroll Snap und eigene Player-Zustände pro Audio.
- Animationen berücksichtigen reduzierte Bewegungseinstellungen.
