# Story 2.4 – Integration mit zertifiziertem CMP

## Beschreibung

**Als** Datenschutzbeauftragter

**möchte ich**, dass die Consent‑Signale über eine zertifizierte Consent Management Platform (CMP) gesendet werden,

**damit** die Einhaltung von Googles Vorgaben sichergestellt ist.

## Akzeptanzkriterien

- Verwendete CMP ist im Google‑CMP‑Partnerprogramm gelistet [madebybramble.co.uk].
- Consent‑Einstellungen aus dem CMP werden korrekt in die vier Parameter übersetzt.
- Änderungen im CMP (z. B. neue Anbieter) werden automatisch in der Banner‑Konfiguration reflektiert.

## Detaillierte Beschreibung

### Google-zertifizierte CMPs
Google hat ein Partnerprogramm für Consent Management Platforms (CMPs) eingerichtet, um sicherzustellen, dass diese die Anforderungen des Consent Mode v2 korrekt umsetzen:

1. **Zertifizierte CMP-Anbieter**:
   - OneTrust
   - TrustArc
   - Cookiebot
   - Usercentrics
   - Sourcepoint
   - Quantcast Choice
   - Didomi
   - Cookiefirst
   - Weitere aktuelle Anbieter können der Google-Liste entnommen werden

2. **Vorteile zertifizierter CMPs**:
   - Garantierte Kompatibilität mit Google Consent Mode v2
   - Regelmäßige Updates bei Änderungen der Google-Anforderungen
   - Technischer Support bei Integrationsproblemen
   - Rechtliche Absicherung durch Einhaltung der Standards

### Auswahlkriterien für eine CMP
Bei der Auswahl einer geeigneten CMP sollten folgende Faktoren berücksichtigt werden:

1. **Funktionsumfang**:
   - Unterstützung aller vier Google Consent Mode v2 Parameter
   - Granulare Einstellungsmöglichkeiten für verschiedene Tracking-Kategorien
   - Mehrsprachigkeit und Geo-Targeting
   - Anpassbare Benutzeroberfläche

2. **Technische Integration**:
   - Einfache Integration in bestehende Websites
   - Kompatibilität mit Google Tag Manager
   - API-Zugriff für benutzerdefinierte Integrationen
   - Performance-Optimierung (asynchrones Laden, minimale Auswirkung auf Ladezeiten)

3. **Compliance und Dokumentation**:
   - Unterstützung für DSGVO, ePrivacy, CCPA und andere relevante Gesetze
   - Automatische Aktualisierung bei rechtlichen Änderungen
   - Umfassende Audit-Logs und Reporting-Funktionen
   - Dokumentation der Consent-Einstellungen für Nachweiszwecke

### Implementierungsdetails
1. **Integration der CMP**:
   - Einbindung des CMP-Skripts im <head>-Bereich der Website
   - Konfiguration der CMP entsprechend den Anforderungen (Kategorien, Texte, Design)
   - Mapping der CMP-Kategorien zu Google Consent Mode Parametern
   - Beispiel für OneTrust-Integration:
   ```javascript
   // OneTrust-Skript laden
   <script src="https://cdn.cookielaw.org/consent/[YOUR-ID]/otSDKStub.js" type="text/javascript" charset="UTF-8" data-domain-script="[YOUR-ID]"></script>
   
   // Callback für Consent-Änderungen
   function OptanonWrapper() {
     // Bei Änderung der Consent-Einstellungen
     if (typeof OnetrustActiveGroups !== 'undefined') {
       updateGoogleConsentMode(OnetrustActiveGroups);
     }
   }
   
   // Mapping zu Google Consent Mode
   function updateGoogleConsentMode(activeGroups) {
     const hasAnalyticsConsent = activeGroups.includes('C0003');
     const hasMarketingConsent = activeGroups.includes('C0004');
     
     gtag('consent', 'update', {
       'analytics_storage': hasAnalyticsConsent ? 'granted' : 'denied',
       'ad_storage': hasMarketingConsent ? 'granted' : 'denied',
       'ad_user_data': hasMarketingConsent ? 'granted' : 'denied',
       'ad_personalization': hasMarketingConsent ? 'granted' : 'denied'
     });
   }
   ```

2. **Automatische Aktualisierung**:
   - Implementierung von Callbacks für Änderungen in der CMP-Konfiguration
   - Regelmäßige Synchronisation der Anbieter-Liste
   - Versionierung der Consent-Einstellungen

3. **Fehlerbehandlung**:
   - Fallback-Mechanismen bei Ausfall der CMP
   - Monitoring der CMP-Funktionalität
   - Logging von Fehlern und Inkonsistenzen

### Technische Anforderungen
1. **Interoperabilität**:
   - Nahtlose Integration mit Google Consent Mode v2
   - Kompatibilität mit anderen Tracking-Tools und Drittanbieter-Skripten
   - Unterstützung für verschiedene Browser und Geräte

2. **Skalierbarkeit**:
   - Unterstützung für mehrere Domains und Subdomains
   - Zentrale Verwaltung aller Consent-Einstellungen
   - Hohe Verfügbarkeit und Lastverteilung

3. **Sicherheit**:
   - Verschlüsselte Übertragung der Consent-Daten
   - Schutz vor Manipulation der Consent-Einstellungen
   - Regelmäßige Sicherheitsupdates

### Rechtliche Anforderungen
Die Integration einer zertifizierten CMP unterstützt die Einhaltung der DSGVO und anderer Datenschutzgesetze. Die CMP muss alle rechtlichen Anforderungen erfüllen, insbesondere hinsichtlich der Einwilligungseinholung, Dokumentation und Widerrufsmöglichkeit.

### Testszenarien
1. Integrationstest - CMP wird korrekt geladen und initialisiert
2. Mapping-Test - CMP-Kategorien werden korrekt auf Google Consent Mode Parameter abgebildet
3. Update-Test - Änderungen in den Consent-Einstellungen werden sofort an Google übermittelt
4. Konfigurationstest - Änderungen in der CMP-Konfiguration (z.B. neue Anbieter) werden korrekt reflektiert
5. Fehlertest - System verhält sich robust bei Ausfällen oder Verzögerungen der CMP
