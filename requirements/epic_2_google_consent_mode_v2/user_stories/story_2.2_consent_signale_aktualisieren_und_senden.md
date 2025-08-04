# Story 2.2 – Consent‑Signale aktualisieren und senden

## Beschreibung

**Als** Entwickler

**möchte ich**, dass nach der Auswahl im Banner die Consent‑Parameter entsprechend aktualisiert und an Google Tag Manager oder gtag.js übergeben werden,

**damit** Google‑Tags nur gemäß der Benutzereinwilligung ausgelöst werden.

## Akzeptanzkriterien

- Bei Zustimmung zu Analytics wird analytics_storage = 'granted'; bei Ablehnung bleibt 'denied' [developers.google.com].
- Parameter ad_user_data und ad_personalization werden je nach Zustimmung gesetzt [developers.google.com].
- Nach der Aktualisierung feuern Tags für Google Ads/Analytics nur, wenn die entsprechenden Parameter auf 'granted' stehen [madebybramble.co.uk].
- Bei Verwendung von GTM erfolgt die Übergabe vor dem Auslösen von Tags [madebybramble.co.uk].

## Detaillierte Beschreibung

### Aktualisierung der Consent-Parameter
Nach der Benutzerinteraktion mit dem Cookie-Banner müssen die Consent-Parameter entsprechend aktualisiert werden:

1. **Mapping von Cookie-Kategorien zu Consent-Parametern**:
   - Kategorie "Analyse" → analytics_storage
   - Kategorie "Marketing" → ad_storage, ad_user_data, ad_personalization
   - Alternativ: Feinere Granularität mit separaten Optionen für jede Google-Kategorie

2. **Update-Prozess**:
   - Sofortige Aktualisierung nach Benutzerentscheidung
   - Persistierung der Einstellungen für zukünftige Seitenaufrufe
   - Berücksichtigung von Teilzustimmungen (z.B. nur Analytics, aber kein Marketing)

### Implementierungsdetails
1. **Code für die Aktualisierung**:
   ```javascript
   // Beispiel für die Aktualisierung des Consent-Status
   function updateConsentState(preferences) {
     gtag('consent', 'update', {
       'ad_storage': preferences.marketing ? 'granted' : 'denied',
       'analytics_storage': preferences.analytics ? 'granted' : 'denied',
       'ad_user_data': preferences.marketing ? 'granted' : 'denied',
       'ad_personalization': preferences.marketing ? 'granted' : 'denied'
     });
   }
   
   // Aufruf nach Benutzerentscheidung
   cookieBanner.onUserAction(function(preferences) {
     updateConsentState(preferences);
     // Weitere Aktionen wie Speichern der Präferenzen
   });
   ```

2. **Integration mit Google Tag Manager**:
   - Bei Verwendung von GTM muss der Consent-Status in den dataLayer gepusht werden
   - GTM-Trigger sollten so konfiguriert sein, dass sie nur bei entsprechender Einwilligung feuern
   - Beispiel für GTM-Integration:
   ```javascript
   dataLayer.push({
     'event': 'consent_update',
     'consent_state': {
       'ad_storage': preferences.marketing ? 'granted' : 'denied',
       'analytics_storage': preferences.analytics ? 'granted' : 'denied',
       // weitere Parameter
     }
   });
   ```

3. **Verzögertes Laden von Tags**:
   - Tags sollten erst nach der Consent-Entscheidung geladen werden
   - Bei nachträglicher Änderung der Einstellungen müssen bereits geladene Tags aktualisiert werden
   - Implementierung eines Event-Systems für Consent-Änderungen

### Technische Anforderungen
1. **Zuverlässigkeit**:
   - Die Aktualisierung muss unter allen Umständen funktionieren
   - Fehlerbehandlung für den Fall, dass Google-Dienste nicht verfügbar sind
   - Wiederholungslogik bei fehlgeschlagenen Updates

2. **Timing**:
   - Die Aktualisierung muss vor dem Auslösen von Tags erfolgen
   - Race Conditions müssen vermieden werden
   - Berücksichtigung von asynchronem Laden der Google-Bibliotheken

3. **Debugging**:
   - Logging des Consent-Status für Debugging-Zwecke
   - Möglichkeit zur Überprüfung des aktuellen Status (z.B. über Konsole)
   - Testmodus für Entwickler

### Rechtliche Anforderungen
Diese Story erfüllt die DSGVO-Anforderung, dass Tracking erst nach expliziter Einwilligung erfolgen darf. Die Implementierung stellt sicher, dass Google-Dienste nur dann Daten verarbeiten, wenn der Nutzer zugestimmt hat.

### Testszenarien
1. Akzeptanztest - Bei Zustimmung zu Analytics wird analytics_storage auf 'granted' gesetzt
2. Ablehnungstest - Bei Ablehnung von Marketing bleiben ad_storage, ad_user_data und ad_personalization auf 'denied'
3. GTM-Integrationstest - Consent-Status wird korrekt an GTM übergeben
4. Tag-Feuertest - Tags werden nur ausgelöst, wenn die entsprechenden Parameter auf 'granted' stehen
5. Persistenztest - Einstellungen bleiben bei Seitenwechsel oder erneutem Besuch erhalten
