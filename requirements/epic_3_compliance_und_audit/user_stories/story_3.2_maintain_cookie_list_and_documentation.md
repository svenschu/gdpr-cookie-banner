# Story 3.2 – Maintain Cookie List and Documentation

## Description

**As** a data protection officer

**I want** an up-to-date list of all cookies and trackers used, including duration, provider, and purpose,

**so that** users can inform themselves and the list is updated whenever changes occur.

## Acceptance Criteria

- The list is updated automatically (e.g., with a scanner) weekly or monthly [secureprivacy.ai].
- Changes to the list are versioned and documented in the consent log.
- The cookie policy links to this list.

## Detailed Description

### Requirements for cookie documentation
A complete and current documentation of all cookies and tracking technologies is required for both legal and transparency reasons:

1. **Information to document per cookie/tracker**:
   - Name of the cookie/tracker
   - Provider/responsible party (first-party or third-party)
   - Purpose and functionality
   - Storage duration/lifetime
   - Category (essential, functional, analytics, marketing)
   - Legal basis for processing (consent, legitimate interest, contract fulfillment)
   - Data recipients (especially for third-party cookies)
   - Provider's privacy notice (link)

2. **Update process**:
   - Automated detection of cookies through regular scans
   - Weekly or monthly review of the website
   - Notification when new or changed cookies are detected
   - Manual review and completion of automatically detected information

3. **Versioning and change tracking**:
   - Each version of the cookie list receives a unique version number
   - Change history with date, type of change, and reason
   - Archiving of older versions for evidence

### Technical Implementation
1. **Cookie scanner**:
   - Implement or integrate an automated cookie scanner
   - Crawl all relevant pages of the website
   - Detect cookies, pixels, local storage, session storage, etc.
   - Examples of scanner tools: Cookiebot Scanner, OneTrust Cookie Scanning, Usercentrics Scanner

2. **Management system for cookie information**:
   - Central database for all cookie information
   - User-friendly interface to maintain information
   - API for integration with the cookie banner
   - Example data structure:
   ```json
   {
     "cookieId": "ga",
     "name": "_ga",
     "provider": "Google Analytics",
     "providerUrl": "https://analytics.google.com",
     "purpose": "Distinguishes users by assigning a randomly generated number as client identifier",
     "category": "analytics",
     "duration": "2 years",
     "legalBasis": "consent",
     "dataRecipients": ["Google LLC, USA (with standard contractual clauses)"],
     "privacyPolicyUrl": "https://policies.google.com/privacy",
     "firstDetected": "2023-01-15",
     "lastUpdated": "2023-06-20",
     "active": true
   }
   ```

3. **Publication system**:
   - Automatic generation of a user-friendly cookie list
   - Integration into the privacy policy and cookie policy
   - Multilingual display according to website languages
   - Filtering options by categories, providers, etc.

### User-friendly Presentation
1. **Structuring the cookie list**:
   - Group by categories
   - Sort by relevance or alphabetically
   - Clear table layout
   - Expanded information on click/expand

2. **Accessibility**:
   - Accessible presentation (WCAG 2.1 AA)
   - Responsive design for all devices
   - Print-friendly version
   - Export option (e.g., as PDF)

3. **Integration into the cookie banner**:
   - Direct link from the cookie banner
   - Detailed information for each cookie category
   - Ability to change settings directly from the list

### Legal Requirements
Providing a complete and current cookie list is a key requirement of the GDPR and the ePrivacy Directive. Information must be precise, understandable, and easily accessible. Regular updates are necessary to fulfill the transparency obligation.

### Test Scenarios
1. Scanner test – all cookies used on the website are detected correctly
2. Update test – adding new cookies updates the list automatically
3. Versioning test – changes are correctly versioned and documented
4. Integration test – the cookie list is correctly integrated into the privacy policy and cookie banner
5. Display test – the list is displayed correctly on different devices
6. Language test – the list is available in all supported languages
7. Completeness test – all required information is present for each cookie
