# DBS-Projekt

## Covid-19

### Laura Schäfer, Felix Suhl, Leander Tolksdorf

#### Tasks

##### Daten bereinigen/reparieren

Fehler/Hindernisse im Datensatz:

- Unvollständig: Endet nach Italien.
- Syntaxfehler am Ende der Datei.
- Teilweise fehlende Daten. Beispiel: popData2018 : ""
- Einige Daten sind in unpassendem Format, z.B. Einwohnerzahl als String.
- Daten falsch: z.B. negative Fallzahlen
- Daten evtl. veraltet (Einwohnerzahl von 2018)

Bereinigung:

Originalquelle: https://data.europa.eu/euodp/de/data/dataset/covid-19-coronavirus-data/resource/7285c9d3-d61e-4437-86a0-6769df5662b2

- MEHR. DATEN!
- Datentypen passender.
- Aktuellere Einwohnerzahl.

##### Zielgruppe

- Normalos (erstmal, dann kann man weiter gucken.)

##### Geplante Ansichten

**Weltkarte:**

- Visualisierung der aktuellen Daten.
  - Fallzahlen
    - Erkrankte (cases)
    - Tote (deaths)
    - (Genesene)
  - Einwohnerzahlen (popData2019)
  - Erkrankte / 100.000 EW letzte 14 Tage.
  - Anzeigen, wenn keine Daten verfügbar.

Bei Klicken auf Land kommt man auf die:

**Landesansicht:**

- Neue Fälle pro Tag
- Änderungsrate/100.000 EW (kumuliert) der letzten 14 Tage.
- Kumulierte Infizierte (insgesamt) aus Änderungsrate berechnen.

##### Datenbank aufsetzen

Technologien (Vorschläge):

Datenbank:

Für einfachere Zusammenarbeit: Online-DB? Zum Beispiel:
- Digital Ocean (Postgres)
- Microsoft Azure
- Amazon

Web-Server/Backend:
- Flask (Python)
- Node.js

Front-End:
- HTML
- JS
- Visualisierungs-Framework:
  - https://d3js.org/
    - World view: https://observablehq.com/@d3/world-choropleth
    - Country view: https://observablehq.com/@d3/stacked-area-chart
  - https://metricsgraphicsjs.org/examples.htm
    - leider keine Kartenvisualisierung, dafür sehr simpel (auf den ersten Blick).
  - https://c3js.org/examples.html
    - Basiert auf D3
    - Sieht auch relativ einfach aus
    - Aber hat anscheinend keine Karten.
  - https://www.chartjs.org/
    - Hatte Swenja empfohlen. Sieht auch gut aus

