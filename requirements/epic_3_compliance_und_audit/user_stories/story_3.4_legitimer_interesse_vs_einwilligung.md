# Story 3.4 – Legitimer Interesse vs. Einwilligung

## Beschreibung

**Als** Rechtsteam

**möchte ich**, dass Cookies, die nicht unbedingt erforderlich sind, ausschließlich auf Basis einer Einwilligung eingesetzt werden,

**damit** wir keine unzulässigen Rechtsgrundlagen verwenden.

## Akzeptanzkriterien

- Alle Cookies werden nach Kategorie geprüft, ob sie zwingend notwendig sind [orrick.com].
- Für Analyse‑ und Marketing‑Cookies wird immer die Einwilligung eingeholt; „berechtigtes Interesse" wird nicht genutzt [secureprivacy.ai].
- Änderungen bei der Zuordnung von Cookies werden dokumentiert.

## Detaillierte Beschreibung

### Rechtliche Grundlagen für Cookie-Einsatz
Die DSGVO und die ePrivacy-Richtlinie definieren klare Regeln für die Rechtsgrundlagen zum Einsatz von Cookies:

1. **Einwilligung vs. berechtigtes Interesse**:
   - **Einwilligung**: Freiwillige, informierte, spezifische und eindeutige Willensbekundung des Nutzers
   - **Berechtigtes Interesse**: Abwägung zwischen den Interessen des Verantwortlichen und den Grundrechten der betroffenen Person
   - **Aktuelle Rechtsprechung**: Für nicht-essentielle Cookies ist die Einwilligung die einzig zulässige Rechtsgrundlage

2. **Kategorisierung von Cookies nach Rechtsgrundlage**:
   - **Ohne Einwilligung nutzbar** (auf Basis von Art. 6 Abs. 1 lit. b oder f DSGVO):
     - Technisch notwendige Cookies (z.B. für Warenkorb, Login-Status)
     - Sicherheitsrelevante Cookies (z.B. für Betrugsschutz)
     - Cookies für grundlegende Funktionalität der Website
   - **Nur mit Einwilligung nutzbar** (auf Basis von Art. 6 Abs. 1 lit. a DSGVO):
     - Analyse-Cookies (z.B. Google Analytics, Matomo)
     - Marketing-Cookies (z.B. Google Ads, Facebook Pixel)
     - Funktionale Cookies, die nicht unbedingt erforderlich sind (z.B. Präferenzen)

### Prozess zur Kategorisierung und Prüfung
Um sicherzustellen, dass die korrekten Rechtsgrundlagen angewendet werden, ist folgender Prozess zu implementieren:

1. **Cookie-Inventarisierung**:
   - Vollständige Erfassung aller eingesetzten Cookies und Tracking-Technologien
   - Dokumentation von Zweck, Anbieter, Speicherdauer und Datenverarbeitung

2. **Notwendigkeitsprüfung**:
   - Für jedes Cookie muss geprüft werden, ob es für die Grundfunktionalität der Website zwingend erforderlich ist
   - Entscheidungsbaum für die Kategorisierung:
     1. Ist das Cookie für die Bereitstellung eines vom Nutzer ausdrücklich angeforderten Dienstes notwendig? → Essentiell
     2. Ist das Cookie für die Sicherheit der Website oder des Nutzers erforderlich? → Essentiell
     3. Dient das Cookie primär der Verbesserung des Nutzererlebnisses, ohne zwingend notwendig zu sein? → Nicht essentiell, Einwilligung erforderlich
     4. Dient das Cookie der Analyse des Nutzerverhaltens? → Nicht essentiell, Einwilligung erforderlich
     5. Dient das Cookie Werbezwecken oder der Profilbildung? → Nicht essentiell, Einwilligung erforderlich

3. **Dokumentation der Entscheidungen**:
   - Begründung für die Einstufung jedes Cookies
   - Rechtliche Bewertung durch das Rechtsteam
   - Versionierung und Änderungsverfolgung

### Technische Umsetzung
1. **Blockierung nicht-essentieller Cookies**:
   - Implementierung eines technischen Mechanismus, der nicht-essentielle Cookies blockiert, bis eine Einwilligung vorliegt
   - Keine Vorab-Aktivierung von Cookies auf Basis des berechtigten Interesses
   - Beispiel für die Implementierung:
   ```javascript
   // Beispiel für die Blockierung nicht-essentieller Cookies
   function manageCookies(consentCategories) {
     // Essentielle Cookies werden immer geladen
     loadEssentialCookies();
     
     // Nicht-essentielle Cookies nur bei Einwilligung
     if (consentCategories.analytics) {
       loadAnalyticsCookies();
     }
     
     if (consentCategories.marketing) {
       loadMarketingCookies();
     }
     
     if (consentCategories.functional) {
       loadFunctionalCookies();
     }
   }
   ```

2. **Regelmäßige Überprüfung**:
   - Automatisierte und manuelle Prüfungen, ob nicht-essentielle Cookies ohne Einwilligung gesetzt werden
   - Integration in das Qualitätssicherungssystem
   - Monitoring und Alerting bei unerlaubtem Cookie-Einsatz

### Dokumentation und Compliance
1. **Cookie-Richtlinie**:
   - Klare Darstellung der Kategorisierung in der Cookie-Richtlinie
   - Transparente Information über die Rechtsgrundlagen
   - Regelmäßige Aktualisierung bei Änderungen

2. **Änderungsmanagement**:
   - Dokumentation aller Änderungen bei der Zuordnung von Cookies
   - Prüfung und Freigabe durch das Rechtsteam
   - Versionierung der Cookie-Richtlinie

3. **Schulung und Sensibilisierung**:
   - Schulung der Entwickler und Marketing-Teams
   - Klare Richtlinien für die Integration neuer Tracking-Tools
   - Regelmäßige Updates zu rechtlichen Entwicklungen

### Rechtliche Anforderungen
Die korrekte Anwendung der Rechtsgrundlagen ist eine zentrale Anforderung der DSGVO und der ePrivacy-Richtlinie. Datenschutzbehörden haben in zahlreichen Entscheidungen klargestellt, dass für nicht-essentielle Cookies eine Einwilligung erforderlich ist und das berechtigte Interesse nicht als Rechtsgrundlage herangezogen werden kann.

### Testszenarien
1. Kategorisierungstest - Überprüfung der korrekten Einstufung aller Cookies
2. Blockierungstest - Nicht-essentielle Cookies werden ohne Einwilligung nicht gesetzt
3. Dokumentationstest - Vollständige und aktuelle Dokumentation aller Cookies und ihrer Rechtsgrundlagen
4. Änderungstest - Änderungen in der Kategorisierung werden korrekt dokumentiert und umgesetzt
5. Compliance-Test - Überprüfung der Einhaltung aktueller rechtlicher Anforderungen
