# Story 1.4 – Widerruf und Präferenzen ändern

## Beschreibung

**Als** Nutzer

**möchte ich** meine Consent‑Entscheidungen jederzeit einfach widerrufen oder anpassen können,

**damit** ich die Kontrolle über meine Daten behalte.

## Akzeptanzkriterien

- Ein dauerhaft sichtbares Icon oder ein Link (z. B. im Footer) öffnet die Präferenzen [orrick.com].
- Nach Widerruf werden alle nicht notwendigen Cookies gelöscht und Tracking wird gestoppt [secureprivacy.ai].
- Die Benutzeroberfläche zum Ändern der Einstellungen ist mit denselben Sprachen und Funktionen wie bei der ersten Anzeige verfügbar.

## Detaillierte Beschreibung

### Zugänglichkeit der Widerrufsoption
Die Möglichkeit zum Widerruf oder zur Änderung der Cookie-Einstellungen muss jederzeit leicht zugänglich sein:

1. **Permanente Zugänglichkeit**:
   - Ein dauerhaft sichtbares Element muss auf allen Seiten der Website vorhanden sein
   - Typische Umsetzungen: Cookie-Symbol in einer Ecke, Link im Footer, Button in der Navigation
   - Das Element muss eindeutig als Cookie-/Datenschutz-bezogen erkennbar sein (z.B. "Cookie-Einstellungen")

2. **Barrierefreiheit**:
   - Das Widerrufselement muss auch für Screenreader zugänglich sein
   - Die Bedienung muss auch per Tastatur möglich sein
   - Kontrast und Größe müssen ausreichend sein, um die Lesbarkeit zu gewährleisten

### Funktionalität des Widerrufs
Bei Aufruf der Widerrufsoption:

1. **Anzeige der aktuellen Einstellungen**:
   - Der aktuelle Consent-Status muss korrekt angezeigt werden
   - Alle Kategorien mit ihrem aktuellen Status (aktiviert/deaktiviert) müssen sichtbar sein

2. **Änderungsmöglichkeiten**:
   - Nutzer können einzelne Kategorien aktivieren/deaktivieren
   - Buttons für "Alle akzeptieren" und "Alle ablehnen" müssen vorhanden sein
   - Änderungen müssen durch einen "Speichern"- oder "Bestätigen"-Button übernommen werden

3. **Sofortige Wirksamkeit**:
   - Bei Deaktivierung einer Kategorie müssen alle zugehörigen Cookies sofort gelöscht werden
   - Tracking-Skripte müssen sofort deaktiviert werden
   - Bei Aktivierung einer Kategorie müssen die entsprechenden Funktionen sofort verfügbar sein

### Technische Umsetzung
1. **Cookie-Löschung**:
   - Identifikation aller Cookies nach Kategorien
   - Gezielte Löschung der Cookies der deaktivierten Kategorien
   - Aktualisierung des Consent-Status in allen relevanten Systemen (z.B. Google Consent Mode)

2. **Persistenz der neuen Einstellungen**:
   - Die geänderten Einstellungen müssen im Browser gespeichert werden
   - Bei erneutem Besuch müssen die letzten Einstellungen berücksichtigt werden
   - Die Speicherung muss DSGVO-konform erfolgen

### Rechtliche Anforderungen
Diese Story erfüllt die DSGVO-Anforderung zur leichten Widerrufbarkeit der Einwilligung. Die Widerrufsmöglichkeit muss genauso einfach zugänglich sein wie die ursprüngliche Einwilligungsoption.

### Testszenarien
1. Zugänglichkeitstest - Widerrufsoption muss auf allen Seiten sichtbar sein
2. Funktionstest Widerruf - Deaktivierung von Kategorien muss zur Löschung der entsprechenden Cookies führen
3. Persistenztest - Geänderte Einstellungen müssen bei erneutem Besuch erhalten bleiben
4. Sprachtest - Die Widerrufsoberfläche muss in allen unterstützten Sprachen korrekt angezeigt werden
