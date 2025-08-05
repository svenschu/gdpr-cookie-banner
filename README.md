# GDPR Cookie Banner

A TypeScript/Lit web component for GDPR-compliant cookie consent management with Google Consent Mode V2 support.

## Features

### ✅ Epic 1: Consent Banner Core Functions (IMPLEMENTED)

- **Story 1.1 - Display Banner and Block Cookies**: Shows consent banner on first visit, blocks non-essential cookies until consent is given
- **Story 1.2 - Equivalent Accept All and Reject All Buttons**: Provides equally prominent accept/reject buttons with settings option
- **Story 1.3 - Granular Cookie Settings**: Allows users to enable/disable individual cookie categories (Essential, Functional, Analytics, Marketing)
- **Story 1.4 - Withdraw and Change Preferences**: Permanent accessibility element for changing cookie preferences at any time, with immediate cookie deletion when categories are disabled
- **Story 1.5 - Multilingual and Geo-targeting**: Supports German and English languages with automatic browser language detection, geo-targeting for EU/US regions with appropriate banner variants
- **Story 1.6 - Consent Expiration**: Configurable consent expiration (30-730 days, default 365 days)

### ✅ Epic 2: Google Consent Mode V2 (IMPLEMENTED)

- **Story 2.1 - Set Default Consent Status**: Initializes Google Consent Mode with default 'denied' status for all parameters
- **Story 2.2 - Update and Send Consent Signals**: Updates and transmits consent signals to Google services when user makes choices
- **Story 2.3 - Configure Basic vs Advanced Mode**: ⚠️ Configuration options available but requires manual setup
- **Story 2.4 - Integrate with Certified CMP**: ⚠️ Framework ready but requires external CMP integration

### ❌ Epic 3: Compliance and Audit (NOT IMPLEMENTED)

- **Story 3.1 - Consent Logging and Data Protection**: Tamper-proof logging of consent actions with 5-year retention
- **Story 3.2 - Maintain Cookie List and Documentation**: Automated cookie discovery and documentation maintenance
- **Story 3.3 - Test Dark Pattern Avoidance**: Automated testing for manipulative design patterns
- **Story 3.4 - Legitimate Interest vs Consent**: Legal basis management for different cookie categories

### ❌ Epic 4: Technical and Non-Functional Requirements (PARTIALLY IMPLEMENTED)

- **Story 4.1 - Accessibility and Responsive Design**: ✅ Basic accessibility and responsive design implemented
- **Story 4.2 - Performance and Stability**: ✅ Optimized performance with 95%+ test coverage
- **Story 4.3 - Security and Data Integrity**: ⚠️ Basic security measures, comprehensive audit needed
- **Story 4.4 - Scalability and Multi-Tenancy**: ❌ Single-tenant architecture, multi-tenancy not implemented

### Key Capabilities

- **Permanent Accessibility**: Cookie settings link always available when consent has been given
- **Immediate Cookie Deletion**: Cookies are deleted instantly when categories are disabled
- **Granular Control**: Four cookie categories with individual toggle controls
- **Multilingual Support**: German and English translations with automatic browser language detection
- **Geo-targeting**: Different banner variants for EU (GDPR) and US (CCPA) regions with fallback handling
- **Accessibility**: Full keyboard navigation and screen reader support
- **Persistence**: Settings persist across browser sessions
- **Event System**: Dispatches events for consent changes and category toggles

## Usage

```html
<gdpr-cookie-banner></gdpr-cookie-banner>
```

### Configuration

```html
<!-- Basic configuration -->
<gdpr-cookie-banner consent-expiration-days="180"></gdpr-cookie-banner>

<!-- With language and region settings -->
<gdpr-cookie-banner 
  language="de" 
  user-region="EU" 
  consent-expiration-days="365">
</gdpr-cookie-banner>
```

#### Available Attributes

- `consent-expiration-days`: Consent validity period (30-730 days, default: 365)
- `language`: Interface language ("en" or "de", auto-detected if not specified)
- `user-region`: User's region for appropriate banner variant ("EU", "US", auto-detected if not specified)

## Development

```bash
npm install
npm test          # Run tests with coverage
npm run build     # Build for production
npm run dev       # Development server
```
