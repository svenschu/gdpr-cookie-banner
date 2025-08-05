# Story 1.2 – Equivalent "Accept All" and "Reject All" Button

## Description

**As** a visitor

**I want** the banner to offer both "Accept all" and "Reject all" with the same design,

**so that** I can choose freely and do not feel manipulated.

## Acceptance Criteria

- Both buttons are on the same layer of the banner [orrick.com].
- Color and size of both buttons are equivalent (no nudging) [secureprivacy.ai].
- There is also a "Settings" button for granular choices [cookieinformation.com].

## Detailed Description

### Design Requirements
The "Accept all" and "Reject all" buttons must be visually equivalent to prevent user manipulation. This means:

1. **Same visual hierarchy**:
   - Both buttons must have the same size
   - Both buttons must have the same color contrast
   - Both buttons must be placed equally visibly

2. **Avoiding dark patterns**:
   - No highlighting of the "Accept" button with more striking colors
   - No placement of the "Reject" button in less visible locations
   - No misleading wording that pushes for acceptance

### Implementation Details
1. **Button arrangement**:
   - The buttons should be arranged side by side or one above the other with equal spacing
   - The "Settings" button may be less prominent but must remain clearly visible

2. **Functionality**:
   - "Accept all" activates all cookie categories
   - "Reject all" deactivates all non-essential cookie categories
   - "Settings" leads to a detailed selection option

### Legal Requirements
This story fulfills the GDPR requirement to avoid dark patterns and to present consent and rejection options equivalently. Data protection authorities have emphasized in several decisions that rejection must be just as easy as acceptance.

### Test Scenarios
1. Visual inspection – buttons must be the same size and equally prominent
2. "Accept all" functional test – all categories are activated
3. "Reject all" functional test – only essential cookies are set
4. "Settings" functional test – leads to the detailed selection page
