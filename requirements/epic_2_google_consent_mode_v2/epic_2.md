# Epic 2: Google Consent Mode v2

## Epic Beschreibung

Dieses Epic umfasst die Integration von Google Consent Mode v2, das seit 2024/2025 für Websites mit Google-Diensten wie Analytics oder Ads erforderlich ist. Das System soll die korrekte Parametersetzung, Signalübertragung und Konfiguration verschiedener Modi ermöglichen, um die Compliance mit Googles neuen Anforderungen sicherzustellen.

## Geschäftswert

- **Compliance mit Google-Anforderungen**: Erfüllung der seit 2024/2025 verpflichtenden Google Consent Mode v2 Implementierung
- **Datenschutz-Konformität**: Korrekte Übertragung von Consent-Signalen an Google-Services
- **Vermeidung von Datenverlust**: Sicherstellung der Analytics- und Conversion-Tracking-Funktionalität
- **Zukunftssicherheit**: Vorbereitung auf verschärfte Google-Richtlinien ab Juli 2025

## Umfang und Abgrenzung

### Im Umfang:
- Implementation der vier Google Consent Mode v2 Parameter
- Default-Consent-Status-Management
- Basic und Advanced Mode Konfiguration
- Integration mit zertifizierten CMPs
- Korrekte Signalübertragung an Google Tag Manager/gtag.js

### Außerhalb des Umfangs:
- IAB Transparency & Consent Framework v2.2 (separate User Story)
- Spezifische Drittanbieter-CMP-Konfigurationen (werden individuell behandelt)
- Andere Consent-Management-Standards außer Google

## User Stories

Das Epic umfasst folgende User Stories:

- **[Story 2.1](user_stories/story_2.1_default_consent_status_setzen.md)** – Default‑Consent‑Status setzen
- **[Story 2.2](user_stories/story_2.2_consent_signale_aktualisieren_und_senden.md)** – Consent‑Signale aktualisieren und senden
- **[Story 2.3](user_stories/story_2.3_basic_vs_advanced_mode_konfigurieren.md)** – Basic vs. Advanced Mode konfigurieren
- **[Story 2.4](user_stories/story_2.4_integration_mit_zertifiziertem_cmp.md)** – Integration mit zertifiziertem CMP

## Technische Rahmenbedingungen

### Google Consent Mode v2 Parameter

Die vier verpflichtenden Parameter müssen korrekt implementiert werden:

| Parameter | Beschreibung | Standardwert |
|-----------|--------------|--------------|
| ad_storage | Steuert die Speicherung von Werbe‑Cookies | denied |
| analytics_storage | Steuert die Speicherung von Analyse‑Cookies | denied |
| ad_user_data | Parameter für Einwilligung zur Übermittlung von Nutzer‑Daten an Google für Werbezwecke | denied |
| ad_personalization | Parameter zur Einwilligung in personalisierte Werbung | denied |

### Architektur‑Prinzipien

- **Default Deny**: Alle Parameter standardmäßig auf 'denied' setzen vor Benutzerinteraktion
- **Signal Integrity**: Korrekte Übertragung der Consent‑Signale an Google‑Services
- **Mode Flexibility**: Unterstützung sowohl für Basic als auch Advanced Mode
- **CMP Integration**: Nahtlose Integration mit zertifizierten Consent Management Platforms

### Compliance‑Anforderungen

- **Google‑Konformität**: Erfüllung aller Google Consent Mode v2 Spezifikationen
- **Zeitkritische Implementierung**: Bereitschaft für verschärfte Richtlinien ab Juli 2025
- **CMP‑Zertifizierung**: Integration nur mit Google‑zertifizierten CMPs
- **Signal‑Vollständigkeit**: Sicherstellung der korrekten Übermittlung aller vier Parameter

### Integration‑Anforderungen

- **Google Tag Manager**: Korrekte Übergabe der Consent‑Parameter vor Tag‑Ausführung
- **gtag.js Integration**: Direkte Integration für Websites ohne GTM
- **Mode‑Konfiguration**: Konfigurierbare Auswahl zwischen Basic und Advanced Mode
- **Fehlerbehandlung**: Robuste Behandlung fehlender oder fehlerhafter Consent‑Signale

## Priorität und Abhängigkeiten

**Priorität**: Hohe Priorität (P1)

**Begründung**: Dieses Epic ist zeitkritisch, da Google ab Juli 2025 Websites ohne korrekte Consent Mode v2 Implementierung einschränken wird. Ohne diese Implementierung droht Datenverlust in Analytics und Conversion-Tracking.

**Abhängigkeiten**: 
- Eingehende Abhängigkeiten: Epic 1 (Consent-Banner-Grundfunktionen) muss abgeschlossen sein
- Technische Voraussetzungen: Google Tag Manager oder gtag.js muss implementiert sein
- Geschäftsentscheidungen: Basic vs. Advanced Mode Auswahl und CMP-Auswahl müssen getroffen werden

## Akzeptanzkriterien (Epic‑Level)

- **Parameter‑Vollständigkeit**: Alle vier Google Consent Mode v2 Parameter sind korrekt implementiert
- **Default‑Verhalten**: Standardmäßige 'denied' Einstellung für alle Parameter vor Benutzerinteraktion
- **Signal‑Integrität**: Korrekte Übertragung der Consent‑Signale an Google‑Services nach Benutzeraktion
- **Mode‑Flexibilität**: Sowohl Basic als auch Advanced Mode sind konfigurierbar und funktionsfähig
- **CMP‑Integration**: Nahtlose Integration mit zertifizierten Consent Management Platforms

## Definition of Done

### Entwicklung
- [ ] Alle User Stories sind implementiert und erfüllen ihre Akzeptanzkriterien
- [ ] Alle vier Consent‑Parameter werden korrekt gesetzt und übertragen
- [ ] Basic und Advanced Mode sind vollständig konfigurierbar
- [ ] Integration mit Google Tag Manager/gtag.js funktioniert einwandfrei
- [ ] Code Review durch Senior Developer durchgeführt
- [ ] Unit Tests mit mindestens 80% Code Coverage

### Qualitätssicherung
- [ ] Integration Tests für alle Google‑Service‑Integrationen
- [ ] End‑to‑End Tests für beide Modi (Basic/Advanced)
- [ ] CMP‑Integration Tests durchgeführt
- [ ] Cross‑Browser‑Tests (Chrome, Firefox, Safari, Edge)

### Compliance & Dokumentation
- [ ] Google Consent Mode v2 Spezifikationen vollständig erfüllt
- [ ] CMP‑Zertifizierung validiert
- [ ] Technische Dokumentation für beide Modi erstellt
- [ ] Konfigurationshandbuch verfügbar

### Betrieb
- [ ] Monitoring für Consent‑Signal‑Übertragung implementiert
- [ ] Fehlerbehandlung für fehlende Signale getestet
- [ ] Rollback‑Strategie für beide Modi definiert und getestet
