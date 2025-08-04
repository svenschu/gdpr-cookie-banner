# Story 3.2 – Cookie‑Liste und Dokumentation pflegen

## Beschreibung

**Als** Datenschutzbeauftragter

**möchte ich**, dass eine aktuelle Liste aller eingesetzten Cookies und Tracker einschließlich Laufzeit, Anbieter und Zweck bereitgestellt wird,

**damit** Nutzer sich informieren können und die Liste jederzeit bei Änderungen aktualisiert wird.

## Akzeptanzkriterien

- Die Liste wird automatisiert (z. B. mit einem Scanner) wöchentlich oder monatlich aktualisiert [secureprivacy.ai].
- Änderungen an der Liste werden versioniert und im Consent‑Log dokumentiert.
- Die Cookie‑Richtlinie verlinkt auf diese Liste.

## Detaillierte Beschreibung

### Anforderungen an die Cookie-Dokumentation
Eine vollständige und aktuelle Dokumentation aller Cookies und Tracking-Technologien ist sowohl aus rechtlicher als auch aus Transparenzsicht erforderlich:

1. **Zu dokumentierende Informationen pro Cookie/Tracker**:
   - Name des Cookies/Trackers
   - Anbieter/Verantwortlicher (Erstanbieter oder Drittanbieter)
   - Zweck und Funktionsweise
   - Speicherdauer/Laufzeit
   - Kategorie (essentiell, funktional, Analyse, Marketing)
   - Rechtsgrundlage für die Verarbeitung (Einwilligung, berechtigtes Interesse, Vertragserfüllung)
   - Datenempfänger (insbesondere bei Drittanbieter-Cookies)
   - Datenschutzhinweise des Anbieters (Link)

2. **Aktualisierungsprozess**:
   - Automatisierte Erkennung von Cookies durch regelmäßige Scans
   - Wöchentliche oder monatliche Überprüfung der Website
   - Benachrichtigung bei Erkennung neuer oder geänderter Cookies
   - Manuelle Überprüfung und Ergänzung der automatisch erkannten Informationen

3. **Versionierung und Änderungsverfolgung**:
   - Jede Version der Cookie-Liste erhält eine eindeutige Versionsnummer
   - Änderungshistorie mit Datum, Art der Änderung und Begründung
   - Archivierung älterer Versionen für Nachweiszwecke

### Technische Umsetzung
1. **Cookie-Scanner**:
   - Implementierung oder Integration eines automatisierten Cookie-Scanners
   - Crawling aller relevanten Seiten der Website
   - Erkennung von Cookies, Pixel, Local Storage, Session Storage, etc.
   - Beispiele für Scanner-Tools: Cookiebot Scanner, OneTrust Cookie Scanning, Usercentrics Scanner

2. **Verwaltungssystem für Cookie-Informationen**:
   - Zentrale Datenbank für alle Cookie-Informationen
   - Benutzerfreundliche Oberfläche zur Pflege der Informationen
   - API für die Integration mit dem Cookie-Banner
   - Beispiel für Datenstruktur:
   ```json
   {
     "cookieId": "ga",
     "name": "_ga",
     "provider": "Google Analytics",
     "providerUrl": "https://analytics.google.com",
     "purpose": "Unterscheidet Benutzer durch Zuweisung einer zufällig generierten Nummer als Kundenkennung",
     "category": "analytics",
     "duration": "2 years",
     "legalBasis": "consent",
     "dataRecipients": ["Google LLC, USA (mit Standardvertragsklauseln)"],
     "privacyPolicyUrl": "https://policies.google.com/privacy",
     "firstDetected": "2023-01-15",
     "lastUpdated": "2023-06-20",
     "active": true
   }
   ```

3. **Publikationssystem**:
   - Automatische Generierung einer benutzerfreundlichen Cookie-Liste
   - Integration in die Datenschutzerklärung und Cookie-Richtlinie
   - Mehrsprachige Darstellung entsprechend der Website-Sprachen
   - Filtermöglichkeiten nach Kategorien, Anbietern, etc.

### Benutzerfreundliche Darstellung
1. **Strukturierung der Cookie-Liste**:
   - Gruppierung nach Kategorien
   - Sortierung nach Relevanz oder alphabetisch
   - Übersichtliche Tabellendarstellung
   - Erweiterte Informationen per Klick/Aufklappen

2. **Zugänglichkeit**:
   - Barrierefreie Darstellung (WCAG 2.1 AA)
   - Responsive Design für alle Endgeräte
   - Druckfreundliche Version
   - Exportmöglichkeit (z.B. als PDF)

3. **Integration in den Cookie-Banner**:
   - Direkte Verlinkung aus dem Cookie-Banner
   - Detailinformationen zu jeder Cookie-Kategorie
   - Möglichkeit, direkt aus der Liste heraus Einstellungen zu ändern

### Rechtliche Anforderungen
Die Bereitstellung einer vollständigen und aktuellen Cookie-Liste ist eine zentrale Anforderung der DSGVO und der ePrivacy-Richtlinie. Die Informationen müssen präzise, verständlich und leicht zugänglich sein. Die regelmäßige Aktualisierung ist notwendig, um die Transparenzpflicht zu erfüllen.

### Testszenarien
1. Scanner-Test - Alle auf der Website verwendeten Cookies werden korrekt erkannt
2. Aktualisierungstest - Bei Hinzufügen neuer Cookies wird die Liste automatisch aktualisiert
3. Versionierungstest - Änderungen werden korrekt versioniert und dokumentiert
4. Integrationstest - Die Cookie-Liste ist korrekt in die Datenschutzerklärung und den Cookie-Banner eingebunden
5. Darstellungstest - Die Liste wird auf verschiedenen Endgeräten korrekt angezeigt
6. Sprachtest - Die Liste ist in allen unterstützten Sprachen verfügbar
7. Vollständigkeitstest - Alle erforderlichen Informationen sind für jedes Cookie vorhanden
