# Story 3.1 – Consent Logging and Data Protection

## Description

**As** a data protection officer

**I want** all consent decisions (grant, reject, change) to be stored with timestamp, version and anonymized user identifier,

**so that** we can prove GDPR compliance during audits [secureprivacy.ai].

## Acceptance Criteria

- Logs are retained for at least five years.
- Access is role-based; changes to logs are recorded.
- In the event of a withdrawal, corresponding entries are also stored.

## Detailed Description

### Requirements for consent logging
A comprehensive logging system for consent decisions is essential for legal and compliance reasons:

1. **Data to be logged**:
   - Timestamp of the decision (date and time with timezone)
   - Type of decision (initial consent, change, withdrawal)
   - Selected categories (e.g., essential, functional, analytics, marketing)
   - Version of the cookie banner and privacy policy used
   - Anonymized/pseudonymized user identifier (no direct identification possible)
   - IP address (shortened/anonymized per GDPR)
   - Device and browser information (anonymized)
   - Referrer URL (where the user came from, if relevant)

2. **Retention period**:
   - Store all logs for at least five years
   - Automated deletion after retention period expires
   - Option to extend manually during ongoing audits

3. **Data protection of logs**:
   - Pseudonymization of all personal data
   - Encryption of logs at rest and in transit
   - Separation of identification data and consent information

### Technical Implementation
1. **Logging infrastructure**:
   - Central, secure database for consent logs
   - High-availability architecture with redundancy
   - Scalable solution for high access volumes
   - Example log entry:
   ```json
   {
     "consentId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
     "timestamp": "2023-06-15T14:32:45.123Z",
     "action": "initial_consent",
     "userIdentifier": "hashed_user_id_or_session_id",
     "ipAddressHash": "f7a8b9c0d1e2...",
     "userAgent": "Mozilla/5.0 (anonymized)",
     "bannerVersion": "2.3.1",
     "privacyPolicyVersion": "1.2.0",
     "categories": {
       "essential": true,
       "functional": true,
       "analytics": false,
       "marketing": false
     },
     "googleParameters": {
       "ad_storage": "denied",
       "analytics_storage": "denied",
       "ad_user_data": "denied",
       "ad_personalization": "denied"
     },
     "geoLocation": "EU",
     "referrer": "https://example.com/product-page"
   }
   ```

2. **Access control**:
   - Role-based access control (RBAC)
   - Only authorized persons (e.g., data protection officers, audit team) have access
   - Two-factor authentication for sensitive operations
   - Logging of all access to the logs

3. **Audit trail**:
   - Complete documentation of all changes to the logs
   - Immutability of logs
   - Digital signatures to ensure integrity

### Reporting and Export Functions
1. **Reporting**:
   - Dashboard with overview of consent rates
   - Trend analyses over time
   - Filtering by period, region, categories etc.

2. **Export options**:
   - Export logs for external audits
   - Various formats (CSV, JSON, PDF)
   - Automated regular reports

3. **Compliance evidence**:
   - Generation of compliance reports for authorities
   - Proof of GDPR requirement fulfillment
   - Documentation of technical and organizational measures

### Legal Requirements
Logging consent decisions is a core requirement of the GDPR to fulfill accountability. Logs must be tamper-proof and not manipulable. At the same time, data protection principles (data minimization, purpose limitation) must be observed.

### Test Scenarios
1. Completeness test – all relevant data is logged correctly
2. Persistence test – logs remain for the required period
3. Access test – only authorized persons can access the logs
4. Audit trail test – changes to the logs are recorded
5. Export test – logs can be exported in different formats
6. Data protection test – personal data is sufficiently pseudonymized
7. Deletion test – logs are automatically deleted after retention period
