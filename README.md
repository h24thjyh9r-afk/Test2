# FixkostenWächter Version 5 – neue Navigation

## Neu
Die App hat jetzt ein links angeordnetes Seitenmenü (auf dem iPhone über ☰ erreichbar). Die Startseite zeigt nur Monats-/Jahreskosten, Vertragsstatus und einen kurzen Spar-Check. Weitere Bereiche: Fixkosten, Sparanalyse, Verträge & Fristen, Prognose & Bericht sowie Daten & Einstellungen. Die bisherigen Funktionen aus Version 4 sind erhalten.

## Windows
1. ZIP entpacken und Ordner `FixkostenWaechter_V5` öffnen.
2. PowerShell im Ordner starten: `py -m http.server 8000` (Python 3 erforderlich).
3. `http://localhost:8000` im Browser öffnen.

## iPhone / Update von Version 4
1. **Vor dem Update** in Version 4 unter „Daten exportieren“ eine JSON-Sicherung erstellen.
2. Die Dateien aus Version 5 am **gleichen Veröffentlichungsort** wie Version 4 ersetzen (z. B. bestehendes GitHub-Pages-Repository).
3. Safari öffnen und die Seite neu laden, gegebenenfalls die installierte Web-App neu starten. Über ☰ wird das linke Menü eingeblendet.
4. Bei gleicher Origin und gleichem Browser bleibt `localStorage` mit Schlüssel `fixkostenwaechter.v1` erhalten. Bei einer neuen Webadresse oder einem anderen Gerät über „Daten & Einstellungen“ → „Daten importieren“ die Sicherung einspielen.

## Datenschutz und Kosten
Keine Datenbank, kein Konto, keine kostenpflichtige API. Fixkosten bleiben lokal im Browser; keine automatische Synchronisierung. GitHub Pages kann für öffentliche Repositories kostenlos verwendet werden. Erinnerungen erscheinen in der App, nicht als Hintergrund-Push. Die 12-Monats-Prognose ist eine Hochrechnung. Der PDF-Bericht wird über den Druckdialog des Browsers erstellt.
