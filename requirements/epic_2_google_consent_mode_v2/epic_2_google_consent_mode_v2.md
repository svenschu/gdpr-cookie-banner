# Epic 2: Google Consent Mode v2

## Epic Description

This epic covers the integration of Google Consent Mode v2, required since 2024/2025 for websites using Google services such as Analytics or Ads. The system should ensure correct parameter settings, signal transmission, and configuration of different modes to guarantee compliance with Google's new requirements.

## Business Value

- **Compliance with Google requirements**: Fulfillment of the mandatory Google Consent Mode v2 implementation since 2024/2025
- **Data protection compliance**: Correct transmission of consent signals to Google services
- **Avoidance of data loss**: Ensures analytics and conversion tracking functionality
- **Future-proofing**: Preparation for stricter Google guidelines from July 2025

## Scope and Exclusions

### In Scope:
- Implementation of the four Google Consent Mode v2 parameters
- Default consent status management
- Basic and advanced mode configuration
- Integration with certified CMPs
- Correct signal transmission to Google Tag Manager/gtag.js

### Out of Scope:
- IAB Transparency & Consent Framework v2.2 (separate user story)
- Specific third-party CMP configurations (handled individually)
- Other consent management standards besides Google

## User Stories

This epic includes the following user stories:

- **[Story 2.1](user_stories/story_2.1_set_default_consent_status.md)** – Set default consent status
- **[Story 2.2](user_stories/story_2.2_update_and_send_consent_signals.md)** – Update and send consent signals
- **[Story 2.3](user_stories/story_2.3_configure_basic_vs_advanced_mode.md)** – Configure basic vs. advanced mode
- **[Story 2.4](user_stories/story_2.4_integrate_with_certified_cmp.md)** – Integrate with certified CMP

## Technical Framework

### Google Consent Mode v2 Parameters

The four required parameters must be implemented correctly:

| Parameter | Description | Default value |
|-----------|-------------|---------------|
| ad_storage | Controls the storage of advertising cookies | denied |
| analytics_storage | Controls the storage of analytics cookies | denied |
| ad_user_data | Consent for transmitting user data to Google for advertising purposes | denied |
| ad_personalization | Consent for personalized advertising | denied |

### Architectural Principles

- **Default Deny**: Set all parameters to 'denied' by default before user interaction
- **Signal Integrity**: Correct transmission of consent signals to Google services
- **Mode Flexibility**: Support for both basic and advanced mode
- **CMP Integration**: Seamless integration with certified consent management platforms

### Compliance Requirements

- **Google Compliance**: Fulfillment of all Google Consent Mode v2 specifications
- **Time-critical implementation**: Ready for stricter guidelines from July 2025
- **CMP Certification**: Integration only with Google-certified CMPs
- **Signal Completeness**: Ensure correct transmission of all four parameters

### Integration Requirements

- **Google Tag Manager**: Correct handover of consent parameters before tag execution
- **gtag.js Integration**: Direct integration for websites without GTM
- **Mode Configuration**: Configurable choice between basic and advanced mode
- **Error Handling**: Robust handling of missing or faulty consent signals

## Priority and Dependencies

**Priority**: High priority (P1)

**Rationale**: This epic is time-critical because, from July 2025, Google will restrict websites without proper Consent Mode v2 implementation. Without it, analytics and conversion tracking data may be lost.

**Dependencies**:
- Incoming dependencies: Epic 1 (consent banner core functions) must be completed
- Technical prerequisites: Google Tag Manager or gtag.js must be implemented
- Business decisions: Basic vs. advanced mode selection and CMP choice must be made

## Acceptance Criteria (Epic Level)

- **Parameter completeness**: All four Google Consent Mode v2 parameters are implemented correctly
- **Default behavior**: All parameters default to 'denied' before user interaction
- **Signal integrity**: Consent signals are correctly transmitted to Google services after user action
- **Mode flexibility**: Both basic and advanced mode are configurable and functional
- **CMP integration**: Seamless integration with certified consent management platforms

## Definition of Done

### Development
- [ ] All user stories are implemented and meet their acceptance criteria
- [ ] All four consent parameters are set and transmitted correctly
- [ ] Basic and advanced mode are fully configurable
- [ ] Integration with Google Tag Manager/gtag.js works flawlessly
- [ ] Code review by senior developer performed
- [ ] Unit tests with at least 80% code coverage

### Quality Assurance
- [ ] Integration tests for all Google service integrations
- [ ] End-to-end tests for both modes (basic/advanced)
- [ ] CMP integration tests performed
- [ ] Cross-browser tests (Chrome, Firefox, Safari, Edge)

### Compliance & Documentation
- [ ] Google Consent Mode v2 specifications fully met
- [ ] CMP certification validated
- [ ] Technical documentation for both modes created
- [ ] Configuration manual available

### Operations
- [ ] Monitoring for consent signal transmission implemented
- [ ] Error handling for missing signals tested
- [ ] Rollback strategy for both modes defined and tested
