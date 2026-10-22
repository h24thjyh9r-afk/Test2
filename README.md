# FixkostenWächter V6

Kostenlose deutschsprachige Offline-PWA mit linker Navigation.

## Neu
- Regelbasierter Sparassistent (hohe Kostenanteile, gleiche Vertragsnamen, nahe Kündigungsfristen). Keine externen Preise oder KI.
- Zahlungskalender nach gespeicherten Zahlungsterminen und Intervallen. Planung, keine tatsächlichen Bankabbuchungen.
- Preisentwicklung: manuell eingegebene Änderungen mit Verlauf; aktuelle Fixkosten werden angepasst.
- Datensicherung: V6-Komplettsicherung enthält Fixkosten und Preisverläufe; V5-Listenexport bleibt erhalten. Hinweis auf letzten gestarteten Export.

## Installation Windows
1. ZIP entpacken. Im Ordner `FixkostenWaechter_V6` ein Terminal öffnen.
2. `py -m http.server 8000` ausführen (Python 3 erforderlich).
3. `http://localhost:8000` öffnen.

## iPhone
Die Dateien auf einem kostenlosen HTTPS-Host wie GitHub Pages veröffentlichen. In Safari öffnen und über Teilen > Zum Home-Bildschirm hinzufügen. GitHub-Pages-Repositories können öffentlich einsehbar sein; keine privaten Finanzdaten in den Quellcode schreiben.

## Update / Datensicherheit
Vor dem Update V5-Daten als JSON exportieren. Dateien auf demselben Ursprung ersetzen. Der lokale Speicherschlüssel `fixkostenwaechter.v1` bleibt unverändert. Nach einem Gerätewechsel Daten importieren. Für Preisverläufe ab V6 stets **Komplettsicherung V6** verwenden; der alte Listenexport enthält keine Preisverläufe. Alte JSON-Listen lassen sich weiterhin über `Daten importieren` einlesen.

## Hinweise
Keine Server-, API- oder Abokosten. Keine Konten, keine Cloud-Synchronisierung. Lokale Browserdaten können durch Browserbereinigung verloren gehen. Zahlungskalender und Sparhinweise sind Schätzungen und keine Finanzberatung. Erinnerungen erscheinen beim Öffnen der App; keine Hintergrund-Pushmeldungen.
