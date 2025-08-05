# Story 3.4 – Legitimate Interest vs. Consent

## Description

**As** the legal team

**I want** cookies that are not strictly necessary to be used only on the basis of consent,

**so that** we do not use inadmissible legal bases.

## Acceptance Criteria

- All cookies are checked by category to determine whether they are strictly necessary [orrick.com].
- For analytics and marketing cookies, consent is always obtained; "legitimate interest" is not used [secureprivacy.ai].
- Changes in the assignment of cookies are documented.

## Detailed Description

### Legal bases for cookie use
The GDPR and the ePrivacy Directive define clear rules for the legal bases for using cookies:

1. **Consent vs. legitimate interest**:
   - **Consent**: Voluntary, informed, specific and unambiguous expression of the user's will
   - **Legitimate interest**: Balancing the controller's interests with the fundamental rights of the data subject
   - **Current case law**: For non-essential cookies, consent is the only permissible legal basis

2. **Categorization of cookies by legal basis**:
   - **Usable without consent** (based on Art. 6(1)(b) or (f) GDPR):
     - Technically necessary cookies (e.g., for shopping cart, login status)
     - Security-related cookies (e.g., fraud prevention)
     - Cookies for basic website functionality
   - **Usable only with consent** (based on Art. 6(1)(a) GDPR):
     - Analytics cookies (e.g., Google Analytics, Matomo)
     - Marketing cookies (e.g., Google Ads, Facebook Pixel)
     - Functional cookies that are not strictly necessary (e.g., preferences)

### Process for categorization and review
To ensure the correct legal bases are applied, implement the following process:

1. **Cookie inventory**:
   - Complete recording of all cookies and tracking technologies used
   - Documentation of purpose, provider, storage duration, and data processing

2. **Necessity check**:
   - For each cookie, check whether it is strictly necessary for basic website functionality
   - Decision tree for categorization:
     1. Is the cookie necessary for providing a service explicitly requested by the user? → Essential
     2. Is the cookie required for website or user security? → Essential
     3. Does the cookie primarily improve user experience without being essential? → Non-essential, consent required
     4. Does the cookie analyze user behavior? → Non-essential, consent required
     5. Does the cookie serve advertising or profiling? → Non-essential, consent required

3. **Documentation of decisions**:
   - Justification for the classification of each cookie
   - Legal assessment by the legal team
   - Versioning and change tracking

### Technical Implementation
1. **Blocking non-essential cookies**:
   - Implement a technical mechanism that blocks non-essential cookies until consent is given
   - No pre-activation of cookies based on legitimate interest
   - Example implementation:
   ```javascript
   // Example for blocking non-essential cookies
   function manageCookies(consentCategories) {
     // Essential cookies are always loaded
     loadEssentialCookies();

     // Non-essential cookies only with consent
     if (consentCategories.analytics) {
       loadAnalyticsCookies();
     }

     if (consentCategories.marketing) {
       loadMarketingCookies();
     }

     if (consentCategories.functional) {
       loadFunctionalCookies();
     }
   }
   ```

2. **Regular review**:
   - Automated and manual checks to ensure non-essential cookies are not set without consent
   - Integration into the quality assurance system
   - Monitoring and alerting for unauthorized cookie usage

### Documentation and Compliance
1. **Cookie policy**:
   - Clear presentation of categorization in the cookie policy
   - Transparent information about legal bases
   - Regular updates when changes occur

2. **Change management**:
   - Documentation of all changes in cookie assignments
   - Review and approval by the legal team
   - Versioning of the cookie policy

3. **Training and awareness**:
   - Training for developers and marketing teams
   - Clear guidelines for integrating new tracking tools
   - Regular updates on legal developments

### Legal Requirements
Correct application of legal bases is a core requirement of the GDPR and the ePrivacy Directive. Data protection authorities have made clear in numerous decisions that consent is required for non-essential cookies and that legitimate interest cannot be used as a legal basis.

### Test Scenarios
1. Categorization test – verify correct classification of all cookies
2. Blocking test – non-essential cookies are not set without consent
3. Documentation test – full and current documentation of all cookies and their legal bases
4. Change test – changes in categorization are documented and implemented correctly
5. Compliance test – verify adherence to current legal requirements
