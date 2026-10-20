# FixkostenWächter – Version 3

Kostenlose, deutschsprachige Progressive Web App (PWA) ohne Backend, Werbung oder laufende Servergebühren.

## Neu in Version 3

- Vertragsende, Kündigungsfrist in Kalendertagen und frei wählbarer Erinnerungsvorlauf pro Ausgabe.
- Übersicht der anstehenden und bereits überschrittenen Kündigungsfristen.
- Hinweise innerhalb der App beim Öffnen; keine Hintergrund-Push-Nachrichten und keine E-Mails.
- Vertragsnotiz, z. B. Kündigungsweg.
- JSON-Import zusätzlich zum bisherigen Export.
- Alle Funktionen von Version 2: Ausgabenverwaltung, Sparsimulation, Kategorien, Suche und Filter.

## Wichtig zur Fristberechnung

Die App berechnet **Kündigen bis = Vertragsende minus Kündigungsfrist (Kalendertage)**. Das Erinnerungsfenster beginnt entsprechend viele Tage vor dieser Frist. Vertragliche Sonderregelungen, Werktage, automatische Verlängerungen, Zugangserfordernisse und gesetzliche Vorgaben werden **nicht** automatisch berücksichtigt. Die Frist ist eine Orientierung und muss anhand des Vertrags geprüft werden. Bei abgelaufenen Fristen wird **keine neue Vertragslaufzeit erfunden**.

## Windows – lokaler Start

1. ZIP-Datei entpacken und in `FixkostenWaechter_V3` wechseln.
2. Python 3 installieren, falls nicht vorhanden.
3. In diesem Ordner PowerShell öffnen und `py -m http.server 8000` ausführen.
4. `http://localhost:8000` im Browser öffnen.
5. Server beenden: `Strg+C`.

## Update von Version 2

1. **Vor dem Update:** In Version 2 über „Daten exportieren“ eine JSON-Sicherung herunterladen.
2. Dateien der Version 3 **an derselben Webadresse** wie Version 2 bereitstellen (gleicher Ursprung: Protokoll, Domain und Port).
3. Die App neu laden; bei alter Darstellung Browserseite erneut laden oder Website-Daten-Cache aktualisieren.
4. Version 3 verwendet unverändert den bisherigen `localStorage`-Schlüssel `fixkostenwaechter.v1`. Bei identischer Adresse und Browser bleiben die bisherigen Einträge erhalten; neue Vertragsfelder sind zunächst leer.
5. Bei anderer Webadresse oder auf einem anderen Gerät „Daten importieren“ verwenden. **Import ersetzt alle vorhandenen Einträge** auf dem Zielgerät.

## iPhone – Installation als App

1. Die Projektdateien z. B. in einem **öffentlichen** GitHub-Repository kostenlos über GitHub Pages bereitstellen (`Settings → Pages → Deploy from a branch`).
2. HTTPS-Adresse auf dem iPhone in Safari öffnen.
3. Safari → Teilen → Zum Home-Bildschirm.
4. Auf dem iPhone bei Bedarf den zuvor exportierten JSON-Datensatz importieren.

**Datenschutz:** Kosten- und Vertragsdaten liegen im lokalen Browserspeicher und werden nicht an GitHub gesendet. GitHub Pages stellt nur die öffentlichen App-Dateien bereit. Browserdaten können durch das Löschen von Website-Daten verloren gehen; regelmäßig exportieren. Es findet keine Synchronisierung statt.

**Offline:** Nach dem ersten erfolgreichen Laden über localhost oder HTTPS werden App-Dateien für die Offline-Nutzung zwischengespeichert. Benachrichtigungen erscheinen nur, wenn die App geöffnet wird.

**Kosten:** Lokaler Betrieb und öffentliches GitHub Pages benötigen keine laufenden Servergebühren. Für eine private, nichtöffentliche Veröffentlichung können andere Hostingbedingungen gelten.
