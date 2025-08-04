# Story 4.1 – Barrierefreiheit und Responsive Design

## Beschreibung

**Als** Nutzer mit Handicap

**möchte ich**, dass das Banner barrierefrei, tastaturbedienbar und auf allen Endgeräten nutzbar ist,

**damit** niemand vom Zugriff auf die Einstellungen ausgeschlossen wird.

## Akzeptanzkriterien

- WCAG 2.1 AA‑Konformität (inkl. ARIA‑Beschriftungen) [secureprivacy.ai].
- Layout passt sich an unterschiedliche Bildschirmgrößen an (responsive).
- Farben besitzen ausreichenden Kontrast.

## Detaillierte Beschreibung

### Barrierefreiheit nach WCAG 2.1 AA
Der Cookie-Banner muss den Web Content Accessibility Guidelines (WCAG) 2.1 in der Konformitätsstufe AA entsprechen:

1. **Wahrnehmbarkeit**:
   - **Textalternativen**: Alle nicht-textlichen Inhalte (Icons, Bilder) benötigen Textalternativen
   - **Kontrast**: Texte müssen einen Kontrastverhältnis von mindestens 4,5:1 aufweisen (für normale Texte) und 3:1 (für große Texte)
   - **Textgröße**: Text muss ohne Qualitätsverlust auf 200% vergrößerbar sein
   - **Keine Informationsvermittlung ausschließlich durch Farbe**: Informationen dürfen nicht nur durch Farbe vermittelt werden

2. **Bedienbarkeit**:
   - **Tastaturbedienbarkeit**: Alle Funktionen müssen mit der Tastatur bedienbar sein
   - **Fokus-Sichtbarkeit**: Der Tastaturfokus muss deutlich sichtbar sein
   - **Ausreichend Zeit**: Nutzer müssen genügend Zeit haben, um Inhalte zu lesen und Aktionen auszuführen
   - **Keine Blitze**: Keine Inhalte, die Anfälle auslösen könnten

3. **Verständlichkeit**:
   - **Lesbarkeit**: Texte müssen klar und verständlich sein
   - **Vorhersehbarkeit**: Funktionen müssen in vorhersehbarer Weise arbeiten
   - **Eingabehilfe**: Unterstützung bei der Fehlervermeidung und -korrektur

4. **Robustheit**:
   - **Kompatibilität**: Inhalte müssen mit aktuellen und zukünftigen Benutzeragenten (inkl. Hilfstechnologien) kompatibel sein
   - **Korrekte Markup-Struktur**: Valides HTML mit korrekter Semantik

### ARIA-Implementierung
Für eine optimale Zugänglichkeit mit Screenreadern und anderen Hilfstechnologien:

1. **ARIA-Rollen und -Attribute**:
   - `role="dialog"` für den Banner
   - `aria-labelledby` zur Verknüpfung mit der Überschrift
   - `aria-describedby` für die Beschreibung des Banners
   - `aria-expanded`, `aria-controls` für aufklappbare Elemente
   - Beispiel:
   ```html
   <div role="dialog" aria-modal="true" aria-labelledby="cookie-title" aria-describedby="cookie-description">
     <h2 id="cookie-title">Cookie-Einstellungen</h2>
     <p id="cookie-description">Bitte wählen Sie, welche Cookies Sie akzeptieren möchten.</p>
     <!-- Weitere Inhalte -->
   </div>
   ```

2. **Fokus-Management**:
   - Automatische Fokussierung des Banners beim Öffnen
   - Fokus-Trap innerhalb des Banners (kein Tabben außerhalb)
   - Rückführung des Fokus nach Schließen des Banners
   - Logische Tab-Reihenfolge

3. **Screenreader-Ankündigungen**:
   - Live-Regions für dynamische Änderungen
   - Status-Updates bei Änderungen der Einstellungen

### Responsive Design
Der Cookie-Banner muss auf allen Geräten und Bildschirmgrößen optimal nutzbar sein:

1. **Flexible Layouts**:
   - Verwendung von relativen Einheiten (%, em, rem) statt fester Pixel
   - Flexbox oder Grid für flexible Anordnung der Elemente
   - Anpassung der Elementgrößen an verfügbaren Platz

2. **Breakpoints für verschiedene Geräte**:
   - Mobile-First-Ansatz
   - Mindestens drei Breakpoints: Mobil, Tablet, Desktop
   - Beispiel für CSS-Medienabfragen:
   ```css
   /* Mobile (Basis) */
   .cookie-banner {
     width: 100%;
     bottom: 0;
     left: 0;
     padding: 1rem;
   }
   
   /* Tablet */
   @media (min-width: 768px) {
     .cookie-banner {
       width: 80%;
       max-width: 600px;
       bottom: 2rem;
       left: 50%;
       transform: translateX(-50%);
       border-radius: 8px;
     }
   }
   
   /* Desktop */
   @media (min-width: 1200px) {
     .cookie-banner {
       max-width: 800px;
     }
   }
   ```

3. **Touch-freundliche Bedienung**:
   - Ausreichend große Klickflächen (min. 44x44px)
   - Angemessene Abstände zwischen interaktiven Elementen
   - Berücksichtigung von Touch-Gesten

### Farbkontrast und visuelle Gestaltung
Für eine optimale Lesbarkeit und Bedienbarkeit:

1. **Kontrastanforderungen**:
   - Text/Hintergrund-Kontrast: mindestens 4,5:1 (normal) oder 3:1 (groß)
   - Kontrast für UI-Komponenten und grafische Objekte: mindestens 3:1
   - Verwendung von Kontrast-Prüfwerkzeugen während der Entwicklung

2. **Visuelle Hierarchie**:
   - Klare visuelle Unterscheidung zwischen verschiedenen Informationsebenen
   - Konsistente Verwendung von Farben für bestimmte Funktionen
   - Unterstützung der Informationshierarchie durch Typografie

3. **Fehlertoleranz**:
   - Deutliche visuelle Rückmeldung bei Aktionen
   - Klare Fehlermeldungen mit Lösungsvorschlägen
   - Bestätigungsdialoge für wichtige Aktionen

### Technische Umsetzung
1. **HTML-Struktur**:
   - Semantisch korrektes HTML5
   - Logische Dokumentstruktur mit korrekten Überschriftenebenen
   - Korrekte Verwendung von Formularelementen mit Labels

2. **JavaScript-Zugänglichkeit**:
   - Progressives Enhancement: Grundfunktionalität auch ohne JavaScript
   - Keyboard-Event-Listener für Tastaturnavigation
   - Fokus-Management für Modaldialoge

3. **Testing**:
   - Automatisierte Accessibility-Tests (z.B. mit axe, WAVE)
   - Manuelle Tests mit Screenreadern (NVDA, JAWS, VoiceOver)
   - Tests mit verschiedenen Eingabemethoden (Tastatur, Touch, Sprachsteuerung)
   - Responsive Tests auf verschiedenen Geräten und Bildschirmgrößen

### Rechtliche Anforderungen
Die Barrierefreiheit von Websites wird in vielen Ländern gesetzlich gefordert, z.B. durch die EU-Richtlinie 2016/2102 oder den Americans with Disabilities Act (ADA). Ein barrierefreier Cookie-Banner ist daher nicht nur eine Frage der Benutzerfreundlichkeit, sondern auch der rechtlichen Compliance.

### Testszenarien
1. Screenreader-Test - Banner muss mit gängigen Screenreadern (NVDA, JAWS, VoiceOver) bedienbar sein
2. Tastatur-Test - Alle Funktionen müssen ohne Maus bedienbar sein
3. Kontrast-Test - Alle Texte und UI-Elemente müssen ausreichenden Kontrast aufweisen
4. Responsive-Test - Banner muss auf verschiedenen Geräten (Smartphone, Tablet, Desktop) korrekt dargestellt werden
5. Zoom-Test - Banner muss bei 200% Zoom nutzbar bleiben
6. Automatisierter WCAG-Test - Prüfung mit Tools wie axe oder WAVE
7. Usability-Test mit Nutzern mit verschiedenen Einschränkungen
