# FixkostenWächter Version 4

Deutschsprachige, lokal speichernde PWA ohne Backend oder laufende Servergebühren.

## Neu in Version 4
- Vertrags-Dashboard: aktive Ausgaben, Verträge mit Enddatum, bevorstehende und überschrittene Kündigungsfristen.
- 12-Monats-Prognose: auf Monatsbasis umgerechnete, unveränderte aktuelle Fixkosten für die nächsten 12 Monate. **Keine exakten Abbuchungstermine und keine automatische Berücksichtigung von Vertragsende, Preisänderungen oder Kündigungen.**
- Vertragsbericht: Schaltfläche „Vertragsbericht drucken / als PDF speichern“ öffnet den Druckdialog. Unter Windows dort „Microsoft Print to PDF“ oder „Als PDF speichern“ wählen; auf dem iPhone über die Druckvorschau als PDF in Dateien sichern. Es wird keine externe PDF-Bibliothek benötigt.
- Funktionen aus V1–V3 bleiben bestehen: Erfassen, Bearbeiten, Pausieren, Löschen, Sparsimulation, Kategorien, Suche, Fristen, Erinnerungen, JSON-Import und -Export.

## Installation auf Windows
1. ZIP entpacken, den Ordner `FixkostenWaechter_V4` öffnen.
2. Python 3 installieren, falls noch nicht vorhanden.
3. Terminal im Ordner öffnen und `py -m http.server 8000` ausführen.
4. `http://localhost:8000` im Browser öffnen.
5. Für einen Test ohne Python kann `index.html` direkt geöffnet werden; Offline-PWA-Funktionen benötigen jedoch localhost oder HTTPS.

## Update / iPhone
1. In Version 3 über „Daten exportieren“ eine JSON-Sicherung anlegen.
2. Die Dateien der V4 an derselben Webadresse wie V3 ersetzen. Bei GitHub Pages die neuen Dateien ins bestehende öffentliche Repository hochladen.
3. Im Browser neu laden; bei zwischengespeicherter Version ggf. App schließen und erneut öffnen.
4. Bei unveränderter Origin und Browser bleiben Einträge im localStorage erhalten (`fixkostenwaechter.v1`). Bei anderer Adresse oder Gerät „Daten importieren“ nutzen.
5. Auf dem iPhone Safari öffnen, Teilen → Zum Home-Bildschirm. GitHub Pages ist für öffentliche Repositories kostenlos; die App benötigt keine bezahlten Dienste.

## Datenschutz und Grenzen
Daten liegen nur im jeweiligen Browser (localStorage), ohne Synchronisierung. Die PDF-Druckvorschau wird lokal erstellt; der Browser bzw. das Betriebssystem übernimmt den PDF-Export. Beim Löschen von Browserdaten können Einträge verloren gehen: regelmäßig JSON exportieren. Kündigungsfristen sind Rechenhilfen und ersetzen nicht die Prüfung der Vertragsbedingungen. Erinnerungen erscheinen nur innerhalb der App, nicht als Hintergrund-Push. Die Kostenprognose ist eine Hochrechnung, keine Zahlungsstromplanung.
