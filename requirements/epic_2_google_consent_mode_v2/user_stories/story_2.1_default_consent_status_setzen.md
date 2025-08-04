# Story 2.1 – Default‑Consent‑Status setzen

## Beschreibung

**Als** Entwickler

**möchte ich**, dass bei Seitenaufruf der Standard‑Consent‑Status für alle vier Google‑Parameter auf „denied" gesetzt wird,

**damit** Google‑Tags keine Daten verarbeiten, bevor der Nutzer zugestimmt hat.

## Akzeptanzkriterien

- Vor Benutzerinteraktion werden ad_storage, analytics_storage, ad_user_data und ad_personalization jeweils auf 'denied' gesetzt [developers.google.com].
- Die Default‑Einstellungen sind konfigurierbar (basic/advanced mode).

## Detaillierte Beschreibung

### Google Consent Mode v2 Parameter
Der Google Consent Mode v2 umfasst vier Parameter, die den Umgang mit Nutzerdaten steuern:

1. **ad_storage**:
   - Steuert die Speicherung von Werbe-Cookies
   - Bei 'denied': Keine Werbe-Cookies werden gesetzt, keine Conversion-Tracking-Cookies
   - Betrifft: Google Ads, Floodlight-Tags

2. **analytics_storage**:
   - Steuert die Speicherung von Analytics-Cookies
   - Bei 'denied': Keine Analytics-Cookies werden gesetzt, keine Nutzer-Identifikation über Sitzungen hinweg
   - Betrifft: Google Analytics, Firebase Analytics

3. **ad_user_data**:
   - Steuert die Übermittlung von Nutzerdaten für Werbezwecke
   - Bei 'denied': Keine personenbezogenen Daten werden für Werbezwecke an Google gesendet
   - Betrifft: Remarketing, benutzerdefinierte Zielgruppen

4. **ad_personalization**:
   - Steuert die Personalisierung von Werbung
   - Bei 'denied': Keine personalisierte Werbung wird angezeigt
   - Betrifft: Interessenbasierte Werbung, Remarketing

### Implementierungsdetails
1. **Zeitpunkt der Initialisierung**:
   - Die Default-Einstellungen müssen vor dem Laden von Google-Tags gesetzt werden
   - Idealerweise im <head>-Bereich der Seite, vor dem Google Tag Manager oder gtag.js
   - Code muss synchron ausgeführt werden, um Race Conditions zu vermeiden

2. **Code-Beispiel**:
   ```javascript
   // Beispiel für die Implementierung des Default-Consent-Status
   window.dataLayer = window.dataLayer || [];
   function gtag(){dataLayer.push(arguments);}
   
   gtag('consent', 'default', {
     'ad_storage': 'denied',
     'analytics_storage': 'denied',
     'ad_user_data': 'denied',
     'ad_personalization': 'denied',
     'wait_for_update': 500  // Wartezeit in Millisekunden
   });
   ```

3. **Konfigurierbarkeit**:
   - Die Einstellungen sollten über eine Konfigurationsdatei oder CMS-Einstellungen anpassbar sein
   - Der Modus (basic/advanced) sollte ebenfalls konfigurierbar sein
   - Bei Basic Mode: Tags werden erst nach Einwilligung geladen
   - Bei Advanced Mode: Tags werden sofort geladen, senden aber nur minimale Daten bis zur Einwilligung

### Technische Anforderungen
1. **Performance**:
   - Die Initialisierung darf die Ladezeit der Seite nicht spürbar beeinträchtigen
   - Der Code sollte minimal und effizient sein

2. **Kompatibilität**:
   - Unterstützung für verschiedene Implementierungen (GTM, gtag.js, analytics.js)
   - Funktioniert in allen gängigen Browsern

3. **Fehlerbehandlung**:
   - Robuste Implementierung, die auch bei Fehlern nicht die Seitenfunktionalität beeinträchtigt
   - Logging von Fehlern für Debugging-Zwecke

### Rechtliche Anforderungen
Diese Story erfüllt die DSGVO-Anforderung zur vorherigen Einwilligung (Prior Consent) und stellt sicher, dass keine Tracking-Daten ohne Einwilligung an Google übermittelt werden.

### Testszenarien
1. Initialisierungstest - Default-Status wird korrekt gesetzt, bevor Tags geladen werden
2. Funktionstest Basic Mode - Tags werden erst nach Einwilligung geladen
3. Funktionstest Advanced Mode - Tags werden sofort geladen, senden aber nur minimale Daten
4. Konfigurationstest - Änderungen in der Konfiguration werden korrekt übernommen
