# Story 2.3 – Basic vs. Advanced Mode konfigurieren

## Beschreibung

**Als** Product‑Owner

**möchte ich** entscheiden können, ob Consent Mode im Basic oder Advanced Modus eingesetzt wird,

**damit** wir das Tracking je nach Risiko‑ und Datenbedarf steuern können.

## Akzeptanzkriterien

- In der Konfiguration kann der Modus ausgewählt werden.
- Basic Mode: Google‑Tags werden erst nach Zustimmung geladen (keine Pings). Advanced Mode: Tags werden sofort geladen, senden aber nur minimale Pings bis zur Zustimmung [cookieyes.com].
- Der Modus wird dokumentiert und kann jederzeit geändert werden (erfordert ggf. erneute Tests).

## Detaillierte Beschreibung

### Unterschiede zwischen Basic und Advanced Mode
Der Google Consent Mode bietet zwei verschiedene Betriebsmodi, die unterschiedliche Vor- und Nachteile bieten:

1. **Basic Mode**:
   - **Funktionsweise**: Google-Tags werden erst nach expliziter Einwilligung des Nutzers geladen und ausgeführt
   - **Datenschutz**: Maximaler Datenschutz, da vor Einwilligung keine Verbindung zu Google-Servern hergestellt wird
   - **Nachteile**: Keine Daten über Nutzer, die keine Einwilligung erteilen; keine Conversion-Modellierung möglich

2. **Advanced Mode**:
   - **Funktionsweise**: Tags werden sofort geladen, senden aber vor Einwilligung nur anonymisierte "Ping"-Daten
   - **Datenschutz**: Eingeschränkter Datenschutz, da auch ohne Einwilligung eine Verbindung zu Google hergestellt wird
   - **Vorteile**: Ermöglicht Conversion-Modellierung und bessere Datenqualität auch bei Nutzern ohne Einwilligung
   - **Cookieless Pings**: Enthalten keine Identifikatoren, nur anonyme Informationen wie Seitenaufrufe

### Konfigurationsmöglichkeiten
Die Auswahl zwischen Basic und Advanced Mode sollte flexibel konfigurierbar sein:

1. **Konfigurationsschnittstelle**:
   - Einfache Benutzeroberfläche für Product Owner/Marketing-Team
   - Klare Erklärung der Unterschiede und Auswirkungen beider Modi
   - Möglichkeit zur Änderung ohne Entwicklereingriff (z.B. über CMS oder Konfigurationsdatei)

2. **Technische Umsetzung**:
   - Im Basic Mode: Verzögertes Laden der Google-Tags bis zur Einwilligung
   - Im Advanced Mode: Sofortiges Laden der Tags mit entsprechenden Parametern für cookieless Pings
   - Beispiel für Advanced Mode Konfiguration:
   ```javascript
   gtag('consent', 'default', {
     'ad_storage': 'denied',
     'analytics_storage': 'denied',
     'ad_user_data': 'denied',
     'ad_personalization': 'denied',
     'functionality_storage': 'denied',
     'security_storage': 'granted',
     'wait_for_update': 500
   });
   
   // Google-Tags werden sofort geladen, aber mit eingeschränkter Funktionalität
   ```

3. **Dokumentation**:
   - Der gewählte Modus muss dokumentiert werden (inkl. Begründung)
   - Änderungen am Modus müssen protokolliert werden (Datum, Grund der Änderung, verantwortliche Person)
   - Auswirkungen auf die Datenqualität und Datenschutz müssen transparent sein

### Entscheidungskriterien für die Modusauswahl
Folgende Faktoren sollten bei der Entscheidung zwischen Basic und Advanced Mode berücksichtigt werden:

1. **Datenschutzrisiko**:
   - Höheres Risiko → Basic Mode empfohlen
   - Geringeres Risiko → Advanced Mode möglich

2. **Datenqualitätsanforderungen**:
   - Hohe Anforderungen an Conversion-Tracking → Advanced Mode vorteilhaft
   - Geringe Anforderungen → Basic Mode ausreichend

3. **Zielmarkt und rechtliche Anforderungen**:
   - Strenge Datenschutzregionen (z.B. Deutschland) → Basic Mode sicherer
   - Weniger strenge Regionen → Advanced Mode möglich

### Technische Anforderungen
1. **Flexibilität**:
   - Modus muss pro Domain/Subdomain konfigurierbar sein
   - Änderungen müssen ohne Deployment möglich sein

2. **Testbarkeit**:
   - Beide Modi müssen in einer Testumgebung überprüfbar sein
   - A/B-Testing zwischen den Modi sollte möglich sein

3. **Monitoring**:
   - Auswirkungen des gewählten Modus auf Datenqualität sollten messbar sein
   - Dashboards zur Überwachung der Datenqualität je nach Modus

### Rechtliche Anforderungen
Die Wahl des Modus hat Auswirkungen auf die Datenschutzkonformität. Der Advanced Mode sendet minimale Daten auch ohne Einwilligung, was in einigen Regionen problematisch sein könnte. Eine rechtliche Bewertung sollte vor der Entscheidung eingeholt werden.

### Testszenarien
1. Konfigurationstest - Umschaltung zwischen Basic und Advanced Mode funktioniert
2. Basic Mode Test - Keine Verbindung zu Google vor Einwilligung
3. Advanced Mode Test - Nur anonyme Pings vor Einwilligung
4. Persistenztest - Konfiguration bleibt nach Deployment erhalten
5. Dokumentationstest - Änderungen werden korrekt protokolliert
