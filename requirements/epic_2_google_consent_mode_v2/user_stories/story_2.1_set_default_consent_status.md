# Story 2.1 – Set Default Consent Status

## Description

**As** a developer

**I want** the default consent status for all four Google parameters to be set to "denied" when the page loads,

**so that** Google tags do not process data before the user has given consent.

## Acceptance Criteria

- Before user interaction, ad_storage, analytics_storage, ad_user_data and ad_personalization are each set to 'denied' [developers.google.com].
- The default settings are configurable (basic/advanced mode).

## Detailed Description

### Google Consent Mode v2 Parameters
Google Consent Mode v2 includes four parameters that control how user data is handled:

1. **ad_storage**:
   - Controls the storage of advertising cookies
   - When 'denied': no advertising cookies are set, no conversion tracking cookies
   - Affects: Google Ads, Floodlight tags

2. **analytics_storage**:
   - Controls the storage of analytics cookies
   - When 'denied': no analytics cookies are set, no user identification across sessions
   - Affects: Google Analytics, Firebase Analytics

3. **ad_user_data**:
   - Controls the transmission of user data for advertising purposes
   - When 'denied': no personal data is sent to Google for advertising
   - Affects: remarketing, custom audiences

4. **ad_personalization**:
   - Controls personalized advertising
   - When 'denied': no personalized ads are displayed
   - Affects: interest-based advertising, remarketing

### Implementation Details
1. **Initialization timing**:
   - Default settings must be set before loading Google tags
   - Ideally in the <head> of the page before Google Tag Manager or gtag.js
   - Code must run synchronously to avoid race conditions

2. **Code example**:
   ```javascript
   // Example for implementing the default consent status
   window.dataLayer = window.dataLayer || [];
   function gtag(){dataLayer.push(arguments);}

   gtag('consent', 'default', {
     'ad_storage': 'denied',
     'analytics_storage': 'denied',
     'ad_user_data': 'denied',
     'ad_personalization': 'denied',
     'wait_for_update': 500  // Wait time in milliseconds
   });
   ```

3. **Configurability**:
   - Settings should be adjustable via a configuration file or CMS settings
   - The mode (basic/advanced) should also be configurable
   - In basic mode: tags load only after consent
   - In advanced mode: tags load immediately but send only minimal data until consent

### Technical Requirements
1. **Performance**:
   - Initialization must not noticeably impact page load time
   - Code should be minimal and efficient

2. **Compatibility**:
   - Support for various implementations (GTM, gtag.js, analytics.js)
   - Works in all major browsers

3. **Error handling**:
   - Robust implementation that does not affect site functionality even in case of errors
   - Logging of errors for debugging purposes

### Legal Requirements
This story meets the GDPR requirement for prior consent and ensures no tracking data is transmitted to Google without consent.

### Test Scenarios
1. Initialization test – default status is set correctly before tags are loaded
2. Basic mode functional test – tags load only after consent
3. Advanced mode functional test – tags load immediately but send only minimal data
4. Configuration test – changes in configuration are applied correctly
