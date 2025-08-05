# Story 2.2 – Update and Send Consent Signals

## Description

**As** a developer

**I want** the consent parameters to be updated after the selection in the banner and passed to Google Tag Manager or gtag.js,

**so that** Google tags are triggered only according to the user's consent.

## Acceptance Criteria

- If analytics is accepted, analytics_storage = 'granted'; if rejected it remains 'denied' [developers.google.com].
- Parameters ad_user_data and ad_personalization are set according to consent [developers.google.com].
- After updating, tags for Google Ads/Analytics fire only when the relevant parameters are set to 'granted' [madebybramble.co.uk].
- When using GTM, the transfer occurs before tags fire [madebybramble.co.uk].

## Detailed Description

### Updating the consent parameters
After user interaction with the cookie banner, the consent parameters must be updated accordingly:

1. **Mapping of cookie categories to consent parameters**:
   - Category "Analytics" → analytics_storage
   - Category "Marketing" → ad_storage, ad_user_data, ad_personalization
   - Alternatively: finer granularity with separate options for each Google category

2. **Update process**:
   - Immediate update after user decision
   - Persist preferences for future page visits
   - Consider partial consents (e.g., analytics only, no marketing)

### Implementation Details
1. **Code for the update**:
   ```javascript
   // Example for updating the consent status
   function updateConsentState(preferences) {
     gtag('consent', 'update', {
       'ad_storage': preferences.marketing ? 'granted' : 'denied',
       'analytics_storage': preferences.analytics ? 'granted' : 'denied',
       'ad_user_data': preferences.marketing ? 'granted' : 'denied',
       'ad_personalization': preferences.marketing ? 'granted' : 'denied'
     });
   }

   // Call after user decision
   cookieBanner.onUserAction(function(preferences) {
     updateConsentState(preferences);
     // Further actions like saving preferences
   });
   ```

2. **Integration with Google Tag Manager**:
   - When using GTM, the consent status must be pushed to the dataLayer
   - GTM triggers should be configured to fire only with appropriate consent
   - Example for GTM integration:
   ```javascript
   dataLayer.push({
     'event': 'consent_update',
     'consent_state': {
       'ad_storage': preferences.marketing ? 'granted' : 'denied',
       'analytics_storage': preferences.analytics ? 'granted' : 'denied',
       // additional parameters
     }
   });
   ```

3. **Delayed loading of tags**:
   - Tags should load only after the consent decision
   - When settings change later, already loaded tags must be updated
   - Implement an event system for consent changes

### Technical Requirements
1. **Reliability**:
   - Update must work under all circumstances
   - Error handling if Google services are unavailable
   - Retry logic for failed updates

2. **Timing**:
   - Update must occur before tags fire
   - Avoid race conditions
   - Consider asynchronous loading of Google libraries

3. **Debugging**:
   - Log consent status for debugging
   - Ability to check current status (e.g., via console)
   - Test mode for developers

### Legal Requirements
This story fulfills the GDPR requirement that tracking may occur only after explicit consent. The implementation ensures Google services process data only with user consent.

### Test Scenarios
1. Acceptance test – if analytics is allowed, analytics_storage is set to 'granted'
2. Rejection test – if marketing is rejected, ad_storage, ad_user_data, and ad_personalization remain 'denied'
3. GTM integration test – consent status is correctly passed to GTM
4. Tag firing test – tags are triggered only when parameters are set to 'granted'
5. Persistence test – settings persist across page changes or subsequent visits
