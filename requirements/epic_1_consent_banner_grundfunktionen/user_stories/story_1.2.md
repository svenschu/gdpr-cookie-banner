# Story 1.2 – Gleichwertiger „Alle akzeptieren" und „Alle ablehnen"‑Button

## Beschreibung

**Als** Besucher

**möchte ich**, dass mir auf dem Banner sowohl „Alle akzeptieren" als auch „Alle ablehnen" im gleichen Design angeboten werden,

**damit** ich frei wählen kann und mich nicht manipuliert fühle.

## Akzeptanzkriterien

- Beide Buttons befinden sich auf demselben Layer des Banners [orrick.com].
- Farbgebung und Größe beider Buttons sind gleichwertig (kein Nudging) [secureprivacy.ai].
- Es gibt zusätzlich einen „Einstellungen"‑Button für granulare Wahlmöglichkeiten [cookieinformation.com].

## Detaillierte Beschreibung

### Designanforderungen
Die Buttons "Alle akzeptieren" und "Alle ablehnen" müssen visuell gleichwertig gestaltet sein, um keine Manipulation des Nutzers zu bewirken. Dies bedeutet:

1. **Gleiche visuelle Hierarchie**:
   - Beide Buttons müssen die gleiche Größe haben
   - Beide Buttons müssen den gleichen Farbkontrast aufweisen
   - Beide Buttons müssen gleich gut sichtbar platziert sein

2. **Vermeidung von Dark Patterns**:
   - Keine Hervorhebung des "Akzeptieren"-Buttons durch auffälligere Farben
   - Keine Platzierung des "Ablehnen"-Buttons an weniger sichtbaren Stellen
   - Keine irreführenden Formulierungen, die zur Akzeptanz drängen

### Implementierungsdetails
1. **Button-Anordnung**:
   - Die Buttons sollten nebeneinander oder untereinander mit gleichem Abstand angeordnet sein
   - Der "Einstellungen"-Button kann weniger prominent gestaltet sein, muss aber deutlich erkennbar bleiben

2. **Funktionalität**:
   - "Alle akzeptieren" aktiviert alle Cookie-Kategorien
   - "Alle ablehnen" deaktiviert alle nicht-essentiellen Cookie-Kategorien
   - "Einstellungen" führt zu einer detaillierten Auswahlmöglichkeit

### Rechtliche Anforderungen
Diese Story erfüllt die DSGVO-Anforderung zur Vermeidung von Dark Patterns und zur gleichwertigen Präsentation von Zustimmungs- und Ablehnungsoptionen. Die Datenschutzbehörden haben in mehreren Entscheidungen betont, dass die Ablehnung genauso einfach sein muss wie die Zustimmung.

### Testszenarien
1. Visuelle Inspektion - Buttons müssen gleich groß und gleich auffällig sein
2. Funktionstest "Alle akzeptieren" - alle Kategorien werden aktiviert
3. Funktionstest "Alle ablehnen" - nur essentielle Cookies werden gesetzt
4. Funktionstest "Einstellungen" - führt zur detaillierten Auswahlseite
