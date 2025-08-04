# Story 4.2 – Performance und Stabilität

## Beschreibung

**Als** Entwickler

**möchte ich**, dass das Laden des Banners die Web‑Performance nicht spürbar beeinträchtigt,

**damit** die Nutzererfahrung positiv bleibt.

## Akzeptanzkriterien

- Der Banner wird asynchron geladen und blockiert keine essenziellen Ressourcen.
- Skript‑Blocking erfolgt effizient, ohne die Seite zu verzögern.
- Consent‑Einstellungen werden im lokalen Speicher oder via serverseitigen API‑Call performant gespeichert.

## Detaillierte Beschreibung

### Performance-Anforderungen
Ein Cookie-Banner darf die Ladezeit und Performance der Website nicht negativ beeinflussen:

1. **Ladezeit-Ziele**:
   - Maximale Verzögerung des First Contentful Paint (FCP): < 100ms
   - Maximale Verzögerung des Largest Contentful Paint (LCP): < 200ms
   - Maximale Verzögerung der Time to Interactive (TTI): < 300ms
   - Gesamtgröße des Cookie-Banner-Codes: < 100KB (komprimiert)

2. **Ressourcennutzung**:
   - Minimale CPU-Auslastung
   - Minimaler Speicherverbrauch
   - Keine Blockierung des Hauptthreads für mehr als 50ms

3. **Netzwerknutzung**:
   - Minimale Anzahl von HTTP-Requests
   - Effiziente Caching-Strategien
   - Minimale Payload-Größe

### Asynchrones Laden
Um die Hauptseite nicht zu blockieren, muss der Cookie-Banner asynchron geladen werden:

1. **Implementierungstechniken**:
   - Verwendung von `async` oder `defer` für Script-Tags
   - Dynamisches Laden des Banner-Codes nach dem Laden der Hauptseite
   - Lazy-Loading für nicht sofort benötigte Ressourcen
   - Beispiel für asynchrones Laden:
   ```html
   <!-- Asynchrones Laden des Cookie-Banner-Skripts -->
   <script async src="/path/to/cookie-banner.js"></script>
   
   <!-- Oder dynamisches Laden nach dem DOMContentLoaded-Event -->
   <script>
     document.addEventListener('DOMContentLoaded', function() {
       const script = document.createElement('script');
       script.src = '/path/to/cookie-banner.js';
       document.head.appendChild(script);
     });
   </script>
   ```

2. **Priorisierung**:
   - Kritische Ressourcen der Hauptseite haben Vorrang
   - Banner-Code wird mit niedrigerer Priorität geladen
   - Verwendung von Resource Hints (preconnect, preload) für optimierte Ladezeiten

3. **Fallback-Strategien**:
   - Graceful Degradation bei Ladeproblemen
   - Minimale Grundfunktionalität auch bei Netzwerkproblemen

### Effizientes Script-Blocking
Das Blockieren von Tracking-Skripten muss effizient implementiert werden:

1. **Blockierungsmechanismen**:
   - Verwendung von Mutation Observers zur Überwachung des DOM
   - Intercepting von `document.createElement` und ähnlichen Methoden
   - Blockierung auf DNS-Ebene für maximale Effizienz
   - Beispiel für effizientes Script-Blocking:
   ```javascript
   // Effizientes Script-Blocking durch Überschreiben von document.createElement
   (function() {
     const originalCreateElement = document.createElement;
     
     document.createElement = function(tagName) {
       const element = originalCreateElement.call(document, tagName);
       
       if (tagName.toLowerCase() === 'script') {
         // Überwachung von script-Elementen
         element.addEventListener('beforescriptexecute', function(e) {
           const src = element.src || '';
           if (isBlockedDomain(src) && !hasUserConsent('analytics')) {
             e.preventDefault();
             console.log('Blocked script:', src);
           }
         });
       }
       
       return element;
     };
   })();
   ```

2. **Optimierung der Blockierungslogik**:
   - Verwendung von Lookup-Tabellen statt komplexer Regex-Muster
   - Caching von Blockierungsentscheidungen
   - Minimierung der Anzahl der Überprüfungen

3. **Transparenz und Debugging**:
   - Logging blockierter Skripte (nur im Debug-Modus)
   - Performance-Metriken zur Überwachung des Blockierungsmechanismus
   - Möglichkeit zur Deaktivierung in Entwicklungsumgebungen

### Performante Speicherung der Consent-Einstellungen
Die Speicherung der Nutzereinstellungen muss effizient erfolgen:

1. **Lokale Speicherung**:
   - Verwendung von localStorage oder sessionStorage für schnellen Zugriff
   - Minimale Datenmenge (nur notwendige Informationen speichern)
   - Komprimierung bei größeren Datenmengen
   - Beispiel für effiziente lokale Speicherung:
   ```javascript
   // Effiziente Speicherung der Consent-Einstellungen
   const consentManager = {
     saveConsent(settings) {
       // Nur notwendige Daten speichern
       const minimalData = {
         v: '1.0', // Version
         ts: Date.now(), // Timestamp
         c: { // Consent categories
           a: settings.analytics ? 1 : 0,
           m: settings.marketing ? 1 : 0,
           f: settings.functional ? 1 : 0
         }
       };
       
       try {
         localStorage.setItem('userConsent', JSON.stringify(minimalData));
         return true;
       } catch (e) {
         console.error('Failed to save consent:', e);
         return false;
       }
     },
     
     loadConsent() {
       try {
         const data = JSON.parse(localStorage.getItem('userConsent') || '{}');
         return {
           analytics: data.c?.a === 1,
           marketing: data.c?.m === 1,
           functional: data.c?.f === 1,
           timestamp: data.ts || 0,
           version: data.v || '0'
         };
       } catch (e) {
         console.error('Failed to load consent:', e);
         return {
           analytics: false,
           marketing: false,
           functional: false,
           timestamp: 0,
           version: '0'
         };
       }
     }
   };
   ```

2. **Server-seitige Speicherung**:
   - Effiziente API-Aufrufe (minimale Payload)
   - Batching von Anfragen bei hohem Volumen
   - Verwendung von HTTP/2 oder HTTP/3 für schnellere Verbindungen
   - Fallback auf lokale Speicherung bei Netzwerkproblemen

3. **Caching-Strategien**:
   - Zwischenspeicherung der Einstellungen im Memory für schnellen Zugriff
   - Vermeidung redundanter Speicheroperationen
   - Optimierte Synchronisierung zwischen lokalem und Server-Cache

### Stabilitätsanforderungen
Der Cookie-Banner muss unter allen Umständen stabil funktionieren:

1. **Fehlerbehandlung**:
   - Robuste Fehlerbehandlung für alle Operationen
   - Keine Beeinträchtigung der Hauptseite bei Fehlern im Banner
   - Graceful Degradation bei fehlenden Funktionen

2. **Kompatibilität**:
   - Unterstützung aller gängigen Browser (inkl. älterer Versionen)
   - Funktionalität auch bei deaktiviertem JavaScript (Basis-Funktionen)
   - Korrekte Funktion bei verschiedenen Netzwerkbedingungen

3. **Isolierung**:
   - Keine Konflikte mit anderen Skripten auf der Seite
   - Verwendung von Namespaces oder Module Pattern
   - Keine globalen Variablen oder Funktionen (außer definierte API)

### Performance-Monitoring
Zur kontinuierlichen Überwachung und Optimierung:

1. **Metriken**:
   - Ladezeit des Banners
   - Auswirkung auf Core Web Vitals
   - Speicherverbrauch und CPU-Auslastung
   - Netzwerk-Overhead

2. **Monitoring-Tools**:
   - Integration mit Web Vitals Monitoring
   - Real User Monitoring (RUM)
   - Synthetic Monitoring für kontinuierliche Tests

3. **Performance-Budget**:
   - Definition klarer Performance-Grenzen
   - Automatische Alerts bei Überschreitung
   - Regelmäßige Performance-Audits

### Testszenarien
1. Ladezeit-Test - Messung der Auswirkung auf FCP, LCP und TTI
2. Ressourcen-Test - Überwachung von CPU- und Speicherverbrauch
3. Netzwerk-Test - Analyse der Netzwerkanfragen und Payload-Größen
4. Blockierungs-Test - Überprüfung der Effizienz des Script-Blockings
5. Speicher-Test - Performance-Test der Consent-Speicherung (lokal und remote)
6. Stabilitäts-Test - Funktionstest unter verschiedenen Netzwerk- und Browserbedingungen
7. Skalierungs-Test - Verhalten bei hoher Last und vielen gleichzeitigen Nutzern
