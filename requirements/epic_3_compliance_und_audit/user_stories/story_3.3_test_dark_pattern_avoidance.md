# Story 3.3 – Test Dark Pattern Avoidance

## Description

**As** a UX designer

**I want** the cookie banner to be tested for dark pattern elements,

**so that** manipulative designs are avoided and fines are prevented [secureprivacy.ai].

## Acceptance Criteria

- Equal weight for accept and reject options.
- No misleading colors, sizes, or wording [orrick.com].
- Reject is not hidden behind multiple clicks; it is directly accessible [orrick.com].

## Detailed Description

### Definition of dark patterns
Dark patterns are design practices that manipulate users into certain actions by intentionally misleading the interface:

1. **Typical dark patterns in cookie banners**:
   - Highlighting the "Accept" button with striking colors while the "Reject" button is inconspicuous
   - Hiding the reject option in submenus or behind multiple clicks
   - Using wording that induces guilt or suggests disadvantages
   - Preselected checkboxes for optional categories
   - Complicated language or overly technical explanations
   - "Cookie walls" that make website access dependent on acceptance

2. **Legal consequences**:
   - Fines from data protection authorities (up to 20 million euros or 4% of global annual turnover in the EU)
   - Warnings from consumer protection associations or competitors
   - Reputational damage and loss of user trust

### Test methods to avoid dark patterns
To ensure the cookie banner is free of dark patterns, the following tests should be performed:

1. **Visual equivalence**:
   - **Size comparison**: "Accept" and "Reject" buttons must be the same size
   - **Color contrast**: Both buttons must have similar contrast; do not use signaling colors for one option only
   - **Positioning**: Both options must be placed equally visibly (e.g., side by side or stacked)
   - **Font size and style**: Same font size and style for both options

2. **Accessibility of the reject option**:
   - **Click-path analysis**: Count necessary clicks for acceptance vs. rejection (should be identical)
   - **Layer test**: Rejection must be possible in the same layer as acceptance
   - **Visibility test**: Reject option must be visible without scrolling

3. **Linguistic neutrality**:
   - **Wording analysis**: No evaluative or emotional terms
   - **Clarity test**: Clear, simple language without jargon
   - **Neutrality check**: No suggestion of disadvantages when rejecting

4. **Usability**:
   - **Usability tests** with real users of different age groups and technical experience
   - **Eye tracking**: Analyze where users look first and how they perceive the banner
   - **A/B tests**: Compare different designs in terms of acceptance/rejection rates

### Implementation of the tests
1. **Automated tests**:
   - Develop automated tests for visual equivalence (size, color, position)
   - Integrate into CI/CD pipeline for continuous review
   - Example of an automated test:
   ```javascript
   // Example for an automated test to check button sizes
   test('Accept and Reject buttons have equal size', async () => {
     await page.goto('https://example.com');
     const acceptButton = await page.$('#accept-button');
     const rejectButton = await page.$('#reject-button');

     const acceptRect = await acceptButton.boundingBox();
     const rejectRect = await rejectButton.boundingBox();

     expect(acceptRect.width).toEqual(rejectRect.width);
     expect(acceptRect.height).toEqual(rejectRect.height);
   });
   ```

2. **Manual checks**:
   - Checklist for UX designers and developers
   - Regular reviews by data protection officers
   - External audits by experts in data protection and UX

3. **User feedback**:
   - Feedback option directly in the banner
   - Regular user surveys
   - Analysis of user behavior and drop-off rates

### Documentation and Compliance
1. **Documentation of tests**:
   - Logging all tests performed
   - Screenshots of different versions of the banner
   - Justification for design decisions

2. **Compliance evidence**:
   - Creation of a compliance report for data protection authorities
   - Documentation of measures to avoid dark patterns
   - Regular updates when designs change

### Legal Requirements
Avoiding dark patterns is a central requirement of the GDPR and is increasingly strictly monitored by data protection authorities. In particular, the French CNIL and the German data protection conference have published clear guidelines for cookie banner design.

### Test Scenarios
1. Visual equivalence test – compare size, color, and position of the buttons
2. Click-path test – count clicks needed for acceptance vs. rejection
3. Language analysis – check wording for neutrality
4. Usability test – observe real users interacting with the banner
5. Accessibility test – verify accessibility for users with impairments
6. Responsiveness test – verify equivalence on different devices and screen sizes
