# Story 1.4 – Withdraw and Change Preferences

## Description

**As** a user

**I want** to be able to easily withdraw or adjust my consent decisions at any time,

**so that** I maintain control over my data.

## Acceptance Criteria

- A permanently visible icon or link (e.g., in the footer) opens the preferences [orrick.com].
- After withdrawal all non-essential cookies are deleted and tracking stops [secureprivacy.ai].
- The interface for changing settings is available with the same languages and functions as on first display.

## Detailed Description

### Accessibility of the withdrawal option
The ability to withdraw or change cookie settings must be easily accessible at all times:

1. **Permanent accessibility**:
   - A permanently visible element must be present on all pages of the website
   - Typical implementations: cookie icon in a corner, link in the footer, button in the navigation
   - The element must be clearly recognizable as cookie/privacy-related (e.g., "Cookie settings")

2. **Accessibility**:
   - The withdrawal element must also be accessible to screen readers
   - Operation must also be possible via keyboard
   - Contrast and size must be sufficient to ensure readability

### Functionality of the withdrawal
When the withdrawal option is opened:

1. **Display of current settings**:
   - The current consent status must be displayed correctly
   - All categories with their current status (enabled/disabled) must be visible

2. **Modification options**:
   - Users can enable/disable individual categories
   - Buttons for "Accept all" and "Reject all" must be available
   - Changes must be confirmed with a "Save" or "Confirm" button

3. **Immediate effect**:
   - Deactivating a category must immediately delete all associated cookies
   - Tracking scripts must be disabled immediately
   - Activating a category must make the corresponding functions available immediately

### Technical Implementation
1. **Cookie deletion**:
   - Identify all cookies by category
   - Delete the cookies of the deactivated categories specifically
   - Update consent status in all relevant systems (e.g., Google Consent Mode)

2. **Persistence of new settings**:
   - The changed settings must be stored in the browser
   - On return visits the last settings must be respected
   - Storage must be GDPR-compliant

### Legal Requirements
This story fulfills the GDPR requirement that consent must be easily revocable. The option to withdraw must be just as easily accessible as the original consent option.

### Test Scenarios
1. Accessibility test – withdrawal option must be visible on all pages
2. Withdrawal functional test – deactivating categories must delete the corresponding cookies
3. Persistence test – changed settings must persist on subsequent visits
4. Language test – the withdrawal interface must be correctly displayed in all supported languages
