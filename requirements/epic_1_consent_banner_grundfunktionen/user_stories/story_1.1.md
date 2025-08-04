# Story 1.1 – Display banner and block cookies

## Description

**As** an EU website visitor

**I want** a cookie banner to appear on my first visit and all non-essential cookies to be blocked,

**so that** my privacy is protected and no tracking scripts are executed before I give my consent.

## Acceptance Criteria

- Banner appears on the first visit and when consent settings are reset.
- Until a choice is made, only essential cookies may be set [secureprivacy.ai].
- The banner has no close button to prevent implicit consent [secureprivacy.ai].

## Detailed Description

### Technical Background

The cookie banner must automatically appear on a user’s first visit from the EU/EEA. This requires detecting the user’s
origin, either through IP geolocation or the browser’s language settings.

### Implementation Details

1. **Blocking non-essential cookies**

- All scripts that could set non-essential cookies must be blocked initially.
- This can be achieved by dynamically loading the scripts after consent or by integrating a consent mode.
- Essential cookies (e.g. for security, shopping cart) may continue to be set.

2. **Persistence of settings**

- The user’s decision must be stored in a cookie or in localStorage.
- When the user returns, the banner is displayed only if no valid consent is present.

3. **Banner behaviour**

- The banner has no close button (X icon).
- The user must make an explicit decision (accept/reject).
- Non-essential cookies remain blocked until explicit consent is given.

### Legal Requirements

This story fulfils the GDPR requirement for prior consent and prevents implicit consent, which is inadmissible under EU
law.

### Test Scenarios

1. First visit by an EU user – banner must appear.
2. Banner without a close button – user must make an explicit decision.
3. Resetting settings – banner must appear again.  
