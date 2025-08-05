# Story 2.4 – Integrate with Certified CMP

## Description

**As** a data protection officer

**I want** consent signals to be sent via a certified Consent Management Platform (CMP),

**so that** compliance with Google's requirements is ensured.

## Acceptance Criteria

- The CMP used is listed in the Google CMP partner program [madebybramble.co.uk].
- Consent settings from the CMP are correctly translated into the four parameters.
- Changes in the CMP (e.g., new vendors) are automatically reflected in the banner configuration.

## Detailed Description

### Google-certified CMPs
Google has set up a partner program for consent management platforms to ensure they correctly implement Consent Mode v2 requirements:

1. **Certified CMP providers**:
   - OneTrust
   - TrustArc
   - Cookiebot
   - Usercentrics
   - Sourcepoint
   - Quantcast Choice
   - Didomi
   - Cookiefirst
   - Additional current providers can be found on Google's list

2. **Benefits of certified CMPs**:
   - Guaranteed compatibility with Google Consent Mode v2
   - Regular updates when Google requirements change
   - Technical support for integration issues
   - Legal assurance through adherence to standards

### Selection criteria for a CMP
When choosing an appropriate CMP, consider the following factors:

1. **Functional scope**:
   - Support for all four Google Consent Mode v2 parameters
   - Granular settings for different tracking categories
   - Multilingualism and geo-targeting
   - Customizable user interface

2. **Technical integration**:
   - Easy integration into existing websites
   - Compatibility with Google Tag Manager
   - API access for custom integrations
   - Performance optimization (asynchronous loading, minimal impact on load times)

3. **Compliance and documentation**:
   - Support for GDPR, ePrivacy, CCPA and other relevant laws
   - Automatic updates for legal changes
   - Comprehensive audit logs and reporting functions
   - Documentation of consent settings for evidence purposes

### Implementation Details
1. **Integration of the CMP**:
   - Include the CMP script in the <head> of the website
   - Configure the CMP according to requirements (categories, texts, design)
   - Map CMP categories to Google Consent Mode parameters
   - Example for OneTrust integration:
   ```javascript
   // Load OneTrust script
   <script src="https://cdn.cookielaw.org/consent/[YOUR-ID]/otSDKStub.js" type="text/javascript" charset="UTF-8" data-domain-script="[YOUR-ID]"></script>

   // Callback for consent changes
   function OptanonWrapper() {
     // When consent settings change
     if (typeof OnetrustActiveGroups !== 'undefined') {
       updateGoogleConsentMode(OnetrustActiveGroups);
     }
   }

   // Mapping to Google Consent Mode
   function updateGoogleConsentMode(activeGroups) {
     const hasAnalyticsConsent = activeGroups.includes('C0003');
     const hasMarketingConsent = activeGroups.includes('C0004');

     gtag('consent', 'update', {
       'analytics_storage': hasAnalyticsConsent ? 'granted' : 'denied',
       'ad_storage': hasMarketingConsent ? 'granted' : 'denied',
       'ad_user_data': hasMarketingConsent ? 'granted' : 'denied',
       'ad_personalization': hasMarketingConsent ? 'granted' : 'denied'
     });
   }
   ```

2. **Automatic updates**:
   - Implement callbacks for changes in CMP configuration
   - Regular synchronization of the vendor list
   - Versioning of consent settings

3. **Error handling**:
   - Fallback mechanisms if the CMP fails
   - Monitoring CMP functionality
   - Logging errors and inconsistencies

### Technical Requirements
1. **Interoperability**:
   - Seamless integration with Google Consent Mode v2
   - Compatibility with other tracking tools and third-party scripts
   - Support for various browsers and devices

2. **Scalability**:
   - Support for multiple domains and subdomains
   - Central management of all consent settings
   - High availability and load distribution

3. **Security**:
   - Encrypted transmission of consent data
   - Protection against manipulation of consent settings
   - Regular security updates

### Legal Requirements
Integrating a certified CMP supports compliance with GDPR and other data protection laws. The CMP must meet all legal requirements, especially regarding obtaining consent, documentation, and the ability to withdraw.

### Test Scenarios
1. Integration test – CMP loads and initializes correctly
2. Mapping test – CMP categories are correctly mapped to Google Consent Mode parameters
3. Update test – changes in consent settings are immediately transmitted to Google
4. Configuration test – changes in CMP configuration (e.g., new vendors) are correctly reflected
5. Failure test – system behaves robustly in case of CMP outages or delays
