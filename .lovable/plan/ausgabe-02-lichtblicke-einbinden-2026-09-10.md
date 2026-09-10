# Ausgabe 02 „Lichtblicke“ einbinden

## Ziel
Eine eigene Seite für Ausgabe 02 mit den drei Audios, im gleichen ruhigen Look wie Ausgabe 01. Die Audios liegen als wischbares Widget nebeneinander. Zwei davon bleiben bis zum 6. bzw. 24. Dezember eine Überraschung und schalten sich danach von selbst frei.

## Inhalte der Seite
- Titel: „Lichtblicke. Momente zum Innehalten“, Ausgabe 02 · 12/26
- Audio 1 — „Einen Moment zum Nikolaus“: „Vielleicht kannst du heute genau dieser Lichtblick für jemanden sein.“ Frei ab 6. Dezember.
- Audio 2 — „Ein kleiner Weihnachtsgruß für dich“: „Nicht das Perfekte zählt, sondern das Gemeinsame und das Bewusste im Augenblick.“ Frei ab 24. Dezember.
- Audio 3 — „Ein kleiner Moment für dich“: „Du darfst dich um andere kümmern, ohne dich selbst dabei zu vergessen.“ Sofort hörbar, mit Übungsblatt zum Ausdrucken.
- Musik-Hinweise (Pixabay) klein unter dem jeweiligen Audio.

## Umsetzung
- Neue Seite für Ausgabe 02, erreichbar über das Ausgaben-Menü; das Menü verlinkt künftig auf die eigenen Seiten statt nach außen.
- Wischbares Audio-Widget: drei Kacheln nebeneinander, sanftes Einrasten, die nächste Kachel schaut am Rand hervor, kleine Punkte zeigen die Position.
- Gesperrte Audios: Cover leicht verschleiert, Hinweis „Öffnet sich am 6. Dezember“, kein Abspielen möglich. Freischaltung nach Datum automatisch.
- Übungsblatt-Download nur beim dritten Audio.
- Ausgabe 01 bleibt inhaltlich unverändert; nur die Menü-Verlinkung wird angepasst.
- Anschließend prüfe ich Wischen und Wiedergabe am Handy-Format.

## Danach (Prio 2, nach deiner Freigabe)
- Player-Leiste kräftiger, Zeiten größer und lesbarer.
- Kachel stärker in Richtung Glas-Widget: klarere Lichtkante, weicherer Schatten.

## Offen
- Die drei Audio-Dateien und passende Cover-Bilder fehlen noch. Bis dahin nutze ich vorübergehend das vorhandene Audio und stimmige Platzhalter-Bilder; sobald du die Dateien hochlädst, tausche ich sie aus.

## Technische Details
- Eigene Route `src/routes/lichtblicke.tsx` mit eigenem `head()`-Titel und Beschreibung.
- Player-Logik als wiederverwendbare Komponente, ein Audio-Element pro Kachel, nur eine Wiedergabe gleichzeitig.
- Wischen über natives horizontales Scrollen mit CSS Scroll Snap; reduzierte Bewegung wird respektiert.
- Freischaltung über Datumsvergleich im Client, Cover-Bilder als generierte Assets.
