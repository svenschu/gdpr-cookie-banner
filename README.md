# GDPR Cookie Banner

A TypeScript/Lit web component for GDPR-compliant cookie consent management with Google Consent Mode V2 support.

## Features

### ✅ Implemented Stories

- **Story 1.1 - Display Banner and Block Cookies**: Shows consent banner on first visit, blocks non-essential cookies until consent is given
- **Story 1.2 - Equivalent Accept All and Reject All Buttons**: Provides equally prominent accept/reject buttons with settings option
- **Story 1.3 - Granular Cookie Settings**: Allows users to enable/disable individual cookie categories (Essential, Functional, Analytics, Marketing)
- **Story 1.4 - Withdraw and Change Preferences**: Permanent accessibility element for changing cookie preferences at any time, with immediate cookie deletion when categories are disabled
- **Story 1.5 - Multilingual and Geo-targeting**: Supports German and English languages with automatic browser language detection, geo-targeting for EU/US regions with appropriate banner variants
- **Story 1.6 - Consent Expiration**: Configurable consent expiration (30-730 days, default 365 days)

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
