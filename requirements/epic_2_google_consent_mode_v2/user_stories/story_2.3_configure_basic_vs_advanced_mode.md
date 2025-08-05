# Story 2.3 – Configure Basic vs. Advanced Mode

## Description

**As** a product owner

**I want** to decide whether Consent Mode is used in basic or advanced mode,

**so that** we can control tracking according to risk and data requirements.

## Acceptance Criteria

- The mode can be selected in the configuration.
- Basic mode: Google tags load only after consent (no pings). Advanced mode: tags load immediately but send only minimal pings until consent [cookieyes.com].
- The chosen mode is documented and can be changed at any time (may require retesting).

## Detailed Description

### Differences between basic and advanced mode
Google Consent Mode provides two operating modes with different pros and cons:

1. **Basic mode**:
   - **Functionality**: Google tags load and execute only after explicit user consent
   - **Privacy**: Maximum privacy, as no connection to Google servers is made before consent
   - **Disadvantages**: No data about users who do not consent; no conversion modeling possible

2. **Advanced mode**:
   - **Functionality**: Tags load immediately but send only anonymized "ping" data before consent
   - **Privacy**: Limited privacy, since a connection to Google is made even without consent
   - **Advantages**: Enables conversion modeling and better data quality even for users without consent
   - **Cookieless pings**: Contain no identifiers, only anonymous information such as page views

### Configuration Options
The choice between basic and advanced mode should be configurable:

1. **Configuration interface**:
   - Simple UI for product owners/marketing team
   - Clear explanation of the differences and effects of both modes
   - Ability to change without developer involvement (e.g., via CMS or configuration file)

2. **Technical implementation**:
   - In basic mode: delayed loading of Google tags until consent
   - In advanced mode: immediate loading of tags with appropriate parameters for cookieless pings
   - Example for advanced mode configuration:
   ```javascript
   gtag('consent', 'default', {
     'ad_storage': 'denied',
     'analytics_storage': 'denied',
     'ad_user_data': 'denied',
     'ad_personalization': 'denied',
     'functionality_storage': 'denied',
     'security_storage': 'granted',
     'wait_for_update': 500
   });

   // Google tags load immediately but with limited functionality
   ```

3. **Documentation**:
   - The chosen mode must be documented (including justification)
   - Changes to the mode must be logged (date, reason, responsible person)
   - Impact on data quality and privacy must be transparent

### Decision Criteria for Mode Selection
The following factors should be considered when choosing between basic and advanced mode:

1. **Privacy risk**:
   - Higher risk → basic mode recommended
   - Lower risk → advanced mode possible

2. **Data quality requirements**:
   - High conversion-tracking needs → advanced mode advantageous
   - Low requirements → basic mode sufficient

3. **Target market and legal requirements**:
   - Strict data protection regions (e.g., Germany) → basic mode safer
   - Less strict regions → advanced mode possible

### Technical Requirements
1. **Flexibility**:
   - Mode must be configurable per domain/subdomain
   - Changes must be possible without deployment

2. **Testability**:
   - Both modes must be testable in a staging environment
   - A/B testing between modes should be possible

3. **Monitoring**:
   - Impact of the chosen mode on data quality should be measurable
   - Dashboards for monitoring data quality per mode

### Legal Requirements
The choice of mode affects data protection compliance. Advanced mode sends minimal data even without consent, which may be problematic in some regions. A legal evaluation should be obtained before deciding.

### Test Scenarios
1. Configuration test – switching between basic and advanced mode works
2. Basic mode test – no connection to Google before consent
3. Advanced mode test – only anonymous pings before consent
4. Persistence test – configuration persists after deployment
5. Documentation test – changes are logged correctly
