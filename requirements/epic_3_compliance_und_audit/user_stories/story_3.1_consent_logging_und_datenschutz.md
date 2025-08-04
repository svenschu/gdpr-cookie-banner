# Story 3.1 – Consent Logging und Datenschutz

## Beschreibung

**Als** Datenschutzbeauftragter

**möchte ich**, dass alle Consent‑Entscheidungen (Erteilung, Ablehnung, Anpassung) mit Zeitstempel, Version und anonymisiertem Benutzer‑Identifier gespeichert werden,

**damit** wir bei Prüfungen die Einhaltung der DSGVO nachweisen können [secureprivacy.ai].

## Akzeptanzkriterien

- Protokolle werden mindestens fünf Jahre lang aufbewahrt.
- Zugriff ist rollenbasiert; Änderungen an Logs werden protokolliert.
- Im Falle eines Widerrufs werden entsprechende Einträge ebenfalls gespeichert.

## Detaillierte Beschreibung

### Anforderungen an das Consent-Logging
Ein umfassendes Logging-System für Consent-Entscheidungen ist aus rechtlichen und Compliance-Gründen unerlässlich:

1. **Zu protokollierende Daten**:
   - Zeitstempel der Entscheidung (Datum und Uhrzeit mit Zeitzone)
   - Art der Entscheidung (Ersteinwilligung, Änderung, Widerruf)
   - Gewählte Kategorien (z.B. essentiell, funktional, Analyse, Marketing)
   - Verwendete Version des Cookie-Banners und der Datenschutzerklärung
   - Anonymisierter/pseudonymisierter Benutzer-Identifier (keine direkte Identifikation möglich)
   - IP-Adresse (gekürzt/anonymisiert gemäß DSGVO)
   - Geräte- und Browser-Informationen (in anonymisierter Form)
   - Referrer-URL (woher der Nutzer kam, falls relevant)

2. **Speicherdauer**:
   - Mindestens fünf Jahre Aufbewahrung aller Logs
   - Automatisierte Löschung nach Ablauf der Aufbewahrungsfrist
   - Möglichkeit zur manuellen Verlängerung bei laufenden Prüfungen

3. **Datenschutz der Logs**:
   - Pseudonymisierung aller personenbezogenen Daten
   - Verschlüsselung der Logs in Ruhe und bei Übertragung
   - Trennung von Identifikationsdaten und Consent-Informationen

### Technische Umsetzung
1. **Logging-Infrastruktur**:
   - Zentrale, sichere Datenbank für Consent-Logs
   - Hochverfügbare Architektur mit Redundanz
   - Skalierbare Lösung für hohe Zugriffszahlen
   - Beispiel für Log-Eintrag:
   ```json
   {
     "consentId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
     "timestamp": "2023-06-15T14:32:45.123Z",
     "action": "initial_consent",
     "userIdentifier": "hashed_user_id_or_session_id",
     "ipAddressHash": "f7a8b9c0d1e2...",
     "userAgent": "Mozilla/5.0 (anonymized)",
     "bannerVersion": "2.3.1",
     "privacyPolicyVersion": "1.2.0",
     "categories": {
       "essential": true,
       "functional": true,
       "analytics": false,
       "marketing": false
     },
     "googleParameters": {
       "ad_storage": "denied",
       "analytics_storage": "denied",
       "ad_user_data": "denied",
       "ad_personalization": "denied"
     },
     "geoLocation": "EU",
     "referrer": "https://example.com/product-page"
   }
   ```

2. **Zugriffskontrolle**:
   - Rollenbasiertes Zugriffsmodell (RBAC)
   - Nur autorisierte Personen (z.B. Datenschutzbeauftragte, Audit-Team) haben Zugriff
   - Zwei-Faktor-Authentifizierung für sensible Operationen
   - Protokollierung aller Zugriffe auf die Logs

3. **Audit-Trail**:
   - Lückenlose Dokumentation aller Änderungen an den Logs
   - Unveränderlichkeit der Logs (Immutability)
   - Digitale Signaturen zur Sicherstellung der Integrität

### Berichts- und Exportfunktionen
1. **Reporting**:
   - Dashboard mit Übersicht über Consent-Raten
   - Trendanalysen über Zeit
   - Filterung nach Zeitraum, Region, Kategorien etc.

2. **Export-Möglichkeiten**:
   - Export von Logs für externe Audits
   - Verschiedene Formate (CSV, JSON, PDF)
   - Automatisierte regelmäßige Berichte

3. **Compliance-Nachweise**:
   - Generierung von Compliance-Berichten für Behörden
   - Nachweis der Einhaltung der DSGVO-Anforderungen
   - Dokumentation der technischen und organisatorischen Maßnahmen

### Rechtliche Anforderungen
Die Protokollierung von Consent-Entscheidungen ist eine zentrale Anforderung der DSGVO, um die Rechenschaftspflicht zu erfüllen. Die Logs müssen revisionssicher sein und dürfen nicht manipuliert werden können. Gleichzeitig müssen die Datenschutzgrundsätze (Datenminimierung, Zweckbindung) beachtet werden.

### Testszenarien
1. Vollständigkeitstest - Alle relevanten Daten werden korrekt protokolliert
2. Persistenztest - Logs bleiben über den geforderten Zeitraum erhalten
3. Zugriffstest - Nur autorisierte Personen können auf die Logs zugreifen
4. Audit-Trail-Test - Änderungen an den Logs werden protokolliert
5. Exporttest - Logs können in verschiedenen Formaten exportiert werden
6. Datenschutztest - Personenbezogene Daten sind ausreichend pseudonymisiert
7. Löschtest - Logs werden nach Ablauf der Aufbewahrungsfrist automatisch gelöscht
