# Story 1.3 – Granular Cookie Settings

## Description

**As** a privacy-conscious user

**I want** to be able to activate or deactivate cookie categories individually in the settings,

**so that** I only consent to the tracking purposes I trust.

## Acceptance Criteria

- Categories (e.g., functional, analytics, marketing) can be selected separately and are disabled by default [orrick.com].
- Each category briefly describes its purpose and links to the full list [cookieinformation.com].
- Changes are applied immediately and corresponding scripts are enabled/disabled.

## Detailed Description

### Categorization of Cookies
Cookie categories must be clearly defined and described:

1. **Essential cookies** (always active):
   - Necessary for basic website functionality
   - Examples: session cookies, security cookies, shopping cart cookies
   - Cannot be disabled

2. **Functional cookies** (optional):
   - Improve user experience but are not essential
   - Examples: language settings, saving form data, UI personalization
   - Disabled by default

3. **Analytics cookies** (optional):
   - Collect anonymized data about website usage
   - Examples: Google Analytics, Matomo, Hotjar
   - Disabled by default

4. **Marketing cookies** (optional):
   - Enable personalized advertising and tracking across websites
   - Examples: Google Ads, Facebook Pixel, retargeting cookies
   - Disabled by default

### Implementation Details
1. **UI components**:
   - Each category should have a toggle switch or checkbox
   - Essential cookies have a disabled toggle (always on)
   - Each category includes a short description (max. 2-3 sentences)
   - A "More info" link leads to detailed information

2. **Technical implementation**:
   - Changes in the settings must take effect immediately
   - Activating a category dynamically loads the corresponding scripts
   - Deactivating removes existing cookies of that category
   - Settings are persisted in the browser storage

3. **Detailed view**:
   - An extended view should be available for each category
   - It lists all cookies in the category with name, purpose, storage duration, and provider
   - Optionally, individual cookies/services within a category can be toggled separately

### Legal Requirements
This story fulfills the GDPR requirement for granular consent and transparent information about cookies. The default setting "disabled" corresponds to the "privacy by default" principle.

### Test Scenarios
1. Check default state – all optional categories must be disabled
2. Activate individual categories – only the corresponding cookies are set
3. Deactivate a category – existing cookies of that category are deleted
4. Persistence check – settings remain on subsequent visits
5. Information text check – all descriptions must be understandable and correct
