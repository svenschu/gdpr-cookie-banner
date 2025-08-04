# Story 4.4 – Skalierbarkeit und Mandantenfähigkeit

## Beschreibung

**Als** Administrator

**möchte ich**, dass der Banner auf mehreren Domains und Mandanten mit unterschiedlichen Konfigurationen eingesetzt werden kann,

**damit** unser Unternehmen zentrale Einstellungen verwalten und gleichzeitig individuelle Anpassungen pro Domain vornehmen kann.

## Akzeptanzkriterien

- Mehrere Mandanten können im System angelegt werden.
- Jede Domain kann eigene Texte, Farben und Kategorieeinstellungen besitzen, während die Kernlogik identisch bleibt.
- Consent‑Logs werden domänenübergreifend ausgewertet, bleiben aber getrennt nach Mandanten.

## Detaillierte Beschreibung

### Mandantenfähigkeit (Multi-Tenancy)
Die Lösung muss eine echte Mandantenfähigkeit bieten, um verschiedene Unternehmenseinheiten oder Kunden zu unterstützen:

1. **Mandantenmodell**:
   - Hierarchische Struktur: Organisation → Mandant → Domain
   - Klare Trennung der Daten zwischen Mandanten
   - Flexible Berechtigungsstrukturen innerhalb der Mandanten
   - Beispiel für Mandantenstruktur:
   ```
   ├── Organisation: Beispiel AG
   │   ├── Mandant: Beispiel Deutschland
   │   │   ├── Domain: beispiel.de
   │   │   ├── Domain: shop.beispiel.de
   │   │   └── Domain: blog.beispiel.de
   │   ├── Mandant: Beispiel Österreich
   │   │   ├── Domain: beispiel.at
   │   │   └── Domain: shop.beispiel.at
   │   └── Mandant: Beispiel Schweiz
   │       ├── Domain: beispiel.ch
   │       └── Domain: shop.beispiel.ch
   ```

2. **Mandantenverwaltung**:
   - Benutzerfreundliche Oberfläche zur Verwaltung von Mandanten
   - Einfaches Hinzufügen, Bearbeiten und Deaktivieren von Mandanten
   - Import/Export-Funktionen für Mandantenkonfigurationen

3. **Datenisolation**:
   - Strikte Trennung der Daten zwischen Mandanten
   - Mandantenspezifische Verschlüsselung
   - Keine Möglichkeit für Cross-Tenant-Zugriffe ohne explizite Berechtigung

### Domainspezifische Konfigurationen
Jede Domain muss individuell konfigurierbar sein, während die Kernlogik zentral verwaltet wird:

1. **Konfigurationsebenen**:
   - Globale Konfiguration (gilt für alle Mandanten)
   - Mandantenspezifische Konfiguration (gilt für alle Domains eines Mandanten)
   - Domainspezifische Konfiguration (gilt nur für eine bestimmte Domain)
   - Vererbungshierarchie mit Überschreibungsmöglichkeiten

2. **Konfigurierbare Elemente**:
   - **Erscheinungsbild**: Farben, Schriftarten, Logos, Positionierung
   - **Texte und Übersetzungen**: Alle Textelemente in verschiedenen Sprachen
   - **Cookie-Kategorien**: Anpassbare Kategorien und Beschreibungen
   - **Verhalten**: Timing, Animationen, Interaktionsmuster
   - **Rechtliche Einstellungen**: Datenschutzerklärung, Impressum, Links
   - **Technische Parameter**: Google Consent Mode Einstellungen, Tracking-IDs

3. **Konfigurationsschnittstelle**:
   - Benutzerfreundliches UI für nicht-technische Administratoren
   - Vorschaufunktion für Änderungen
   - Versionierung von Konfigurationen
   - Beispiel für JSON-Konfigurationsstruktur:
   ```json
   {
     "global": {
       "consentMode": "advanced",
       "defaultLanguage": "de",
       "cookieLifetime": 180,
       "requiredCategories": ["essential"]
     },
     "tenant": {
       "id": "beispiel-deutschland",
       "name": "Beispiel Deutschland",
       "branding": {
         "primaryColor": "#003366",
         "secondaryColor": "#f0f0f0",
         "logo": "https://assets.beispiel.de/logo.png"
       },
       "defaultTexts": {
         "title": "Cookie-Einstellungen",
         "description": "Wir verwenden Cookies, um Ihre Erfahrung zu verbessern.",
         "acceptAll": "Alle akzeptieren",
         "rejectAll": "Alle ablehnen",
         "save": "Einstellungen speichern"
       }
     },
     "domain": {
       "id": "shop.beispiel.de",
       "name": "Beispiel Online-Shop",
       "categories": [
         {
           "id": "essential",
           "name": "Essenziell",
           "description": "Diese Cookies sind für die Grundfunktionen der Website erforderlich.",
           "required": true
         },
         {
           "id": "functional",
           "name": "Funktional",
           "description": "Diese Cookies ermöglichen erweiterte Funktionen und Personalisierung.",
           "required": false
         },
         {
           "id": "analytics",
           "name": "Analyse",
           "description": "Diese Cookies helfen uns, die Nutzung der Website zu verstehen.",
           "required": false,
           "googleMapping": "analytics_storage"
         },
         {
           "id": "marketing",
           "name": "Marketing",
           "description": "Diese Cookies werden verwendet, um Werbung relevanter zu gestalten.",
           "required": false,
           "googleMapping": ["ad_storage", "ad_user_data", "ad_personalization"]
         }
       ],
       "services": [
         {
           "id": "google-analytics",
           "name": "Google Analytics",
           "category": "analytics",
           "cookieNames": ["_ga", "_gid", "_gat"],
           "privacyPolicyUrl": "https://policies.google.com/privacy"
         },
         {
           "id": "google-ads",
           "name": "Google Ads",
           "category": "marketing",
           "cookieNames": ["_gcl_au"],
           "privacyPolicyUrl": "https://policies.google.com/privacy"
         }
       ]
     }
   }
   ```

### Technische Skalierbarkeit
Die Lösung muss technisch skalierbar sein, um eine große Anzahl von Domains und hohe Nutzerzahlen zu unterstützen:

1. **Horizontale Skalierbarkeit**:
   - Microservices-Architektur für unabhängige Skalierung einzelner Komponenten
   - Containerisierung (z.B. Docker) für einfache Bereitstellung
   - Orchestrierung (z.B. Kubernetes) für automatische Skalierung

2. **Performance-Optimierung**:
   - Content Delivery Network (CDN) für globale Verteilung
   - Caching auf mehreren Ebenen (Browser, CDN, API)
   - Lazy Loading von Ressourcen

3. **Datenbank-Skalierung**:
   - Sharding für große Datenmengen
   - Read Replicas für hohe Leselasten
   - Caching-Layer für häufig abgefragte Daten

### Zentrale Verwaltung und Reporting
Die Lösung muss eine zentrale Verwaltung und domänenübergreifendes Reporting ermöglichen:

1. **Zentrales Dashboard**:
   - Überblick über alle Mandanten und Domains
   - Aggregierte Statistiken und KPIs
   - Drill-Down-Funktionalität für detaillierte Analysen

2. **Reporting-Funktionen**:
   - Domänenübergreifende Auswertung von Consent-Raten
   - Vergleich zwischen Domains und Mandanten
   - Trendanalysen über Zeit
   - Exportmöglichkeiten in verschiedene Formate

3. **Audit und Compliance**:
   - Zentrale Protokollierung aller Änderungen
   - Mandantenspezifische Audit-Logs
   - Compliance-Berichte für verschiedene Rechtsräume

### Deployment und Verteilung
Die Lösung muss einfach auf verschiedenen Domains bereitgestellt werden können:

1. **Deployment-Optionen**:
   - JavaScript-Snippet für einfache Integration
   - Tag Manager Integration (Google Tag Manager, Adobe Launch)
   - Server-Side Integration für maximale Kontrolle
   - Beispiel für JavaScript-Snippet:
   ```html
   <!-- Cookie Banner Integration -->
   <script>
     (function(w,d,s,t,c,m){
       w['ConsentManagerConfig'] = c;
       w['ConsentManagerTenant'] = t;
       m = d.createElement(s);
       m.async = 1;
       m.src = 'https://cdn.consent-manager.com/loader.js';
       d.head.appendChild(m);
     })(window, document, 'script', 'beispiel-deutschland', {
       domain: 'shop.beispiel.de',
       language: 'de'
     });
   </script>
   ```

2. **Automatisierte Bereitstellung**:
   - CI/CD-Pipeline für kontinuierliche Aktualisierungen
   - Rollback-Mechanismen bei Problemen
   - A/B-Testing-Unterstützung für neue Funktionen

3. **Versionierung**:
   - Semantische Versionierung der Kernkomponenten
   - Abwärtskompatibilität für ältere Konfigurationen
   - Migrations-Tools für Konfigurationsupdates

### API und Integrationen
Die Lösung muss über APIs erweiterbar und in andere Systeme integrierbar sein:

1. **RESTful API**:
   - Vollständige API-Dokumentation (z.B. OpenAPI/Swagger)
   - Authentifizierung und Autorisierung für API-Zugriffe
   - Rate Limiting und Quotas

2. **Webhooks**:
   - Event-basierte Benachrichtigungen für Consent-Änderungen
   - Konfigurierbare Webhook-Endpunkte pro Mandant
   - Retry-Mechanismen bei Zustellungsproblemen

3. **Drittanbieter-Integrationen**:
   - CMP-Zertifizierungen (Google, IAB TCF)
   - CRM-Systeme für Kundendatensynchronisation
   - Analytics-Plattformen für erweiterte Auswertungen

### Testszenarien
1. Multi-Tenant-Test - Überprüfung der Datenisolation zwischen Mandanten
2. Konfigurationstest - Anpassung und Überschreibung von Einstellungen auf verschiedenen Ebenen
3. Skalierungstest - Verhalten bei hoher Last und vielen gleichzeitigen Nutzern
4. Deployment-Test - Bereitstellung auf verschiedenen Domains und Umgebungen
5. Reporting-Test - Domänenübergreifende Auswertung von Consent-Daten
6. API-Test - Zugriff und Manipulation von Konfigurationen über die API
7. Migrations-Test - Update von Konfigurationen bei Versionswechseln
