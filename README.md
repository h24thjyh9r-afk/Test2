# FixkostenWächter – Version 2

Eine deutschsprachige Progressive Web App (PWA) ohne Backend, Abo oder laufende Betriebskosten. Alle Einträge liegen lokal im jeweiligen Browser (localStorage).

## Neu in Version 2
- Monats- und Jahresauswertung sowie die fünf größten aktiven Kostenpositionen.
- Balkenauswertung nach Kategorien (Monatswerte und Prozentanteile).
- Sparsimulator: Ausgaben auswählen, mögliche Monats- und Jahresersparnis berechnen, ohne Daten zu verändern.
- Volltextsuche nach Name und Kategorie sowie Kategorie-Filter.
- Alle Funktionen aus Version 1: Anlegen, Bearbeiten, Pausieren, Löschen, JSON-Export und Offline-Nutzung nach erfolgreichem Laden.

## Installation auf Windows (kostenlos)
1. ZIP entpacken.
2. Im entpackten Ordner `FixkostenWaechter_V2` ein Terminal öffnen.
3. Python 3 vorausgesetzt: `py -m http.server 8000` ausführen (alternativ `python -m http.server 8000`).
4. Im Browser `http://localhost:8000` öffnen.
5. Mit Strg+C den lokalen Testserver beenden.

## Installation auf dem iPhone
1. Dateien aus `FixkostenWaechter_V2` in ein **öffentliches** GitHub-Repository hochladen (die Dateien müssen im Repository-Stamm liegen).
2. Unter **Settings → Pages** die Bereitstellung über **Deploy from a branch**, Branch `main`, Ordner `/ (root)` aktivieren.
3. Die von GitHub Pages angezeigte HTTPS-Adresse in Safari auf dem iPhone öffnen.
4. In Safari **Teilen → Zum Home-Bildschirm** wählen.
5. Einmal online öffnen; anschließend sind die gecachten App-Dateien offline nutzbar.

GitHub Pages kann für ein öffentliches Repository kostenlos verwendet werden (abhängig von den jeweils geltenden GitHub-Bedingungen). Die Quelldateien sind dort öffentlich, **deine persönlichen Ausgaben werden nicht hochgeladen**, sondern lokal im Browser gespeichert. Kein automatischer Abgleich zwischen Windows und iPhone.

## Update von Version 1
- **Vor dem Update** in Version 1 die Daten über „Daten exportieren“ sichern.
- Für den Erhalt vorhandener Daten Version 2 unter **derselben URL und im selben Browserprofil** bereitstellen. Version 2 nutzt absichtlich denselben lokalen Speicherschlüssel `fixkostenwaechter.v1`.
- Bei anderer Domain, anderem Browser oder anderem Gerät sind die Daten nicht automatisch vorhanden. Ein Import ist in Version 2 noch nicht enthalten; der JSON-Export dient als Sicherung.
- Nach einem Update die Seite bei Bedarf neu laden, damit der Service Worker den neuen Cache aktiviert.

## Hinweise
Die Monatswerte werden für wöchentliche Ausgaben mit `52/12`, für Quartalsbeträge mit `1/3` und für Jahresbeträge mit `1/12` berechnet. Die Jahreskosten sind hochgerechnete Monatswerte, keine Prognose einzelner Abbuchungstage. Der Sparsimulator ist rein hypothetisch und kündigt keine Verträge. Die App enthält keine Bankanbindung, keine Nutzerkonten und keine kostenpflichtigen Dienste.
