import { html, css, LitElement } from 'lit';
import { property, state } from 'lit/decorators.js';

type CookieCategory = 'essential' | 'functional' | 'analytics' | 'marketing';

interface CategorySettings {
  essential: boolean;
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
}

interface ConsentData {
  timestamp: number;
  accepted: boolean;
  categories?: CategorySettings;
}

interface CategoryInfo {
  name: string;
  description: string;
  required: boolean;
}

export class GdprCookieBanner extends LitElement {
  static styles = css`
    :host {
      display: block;
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      z-index: 9999;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    .banner {
      background: #2c3e50;
      color: white;
      padding: 20px;
      box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
    }

    .banner-content {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      gap: 20px;
      flex-wrap: wrap;
    }

    .banner-text {
      flex: 1;
      min-width: 300px;
    }

    .banner-title {
      font-size: 18px;
      font-weight: 600;
      margin: 0 0 8px 0;
    }

    .banner-description {
      font-size: 14px;
      line-height: 1.4;
      margin: 0;
      opacity: 0.9;
    }

    .banner-actions {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
    }

    .banner-button {
      padding: 10px 20px;
      border: none;
      border-radius: 4px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      min-width: 100px;
    }

    .accept-button,
    .reject-button {
      background: #34495e;
      color: white;
    }

    .accept-button:hover,
    .reject-button:hover {
      background: #2c3e50;
    }

    .settings-button {
      background: transparent;
      color: white;
      border: 1px solid #bdc3c7;
    }

    .settings-button:hover {
      background: #34495e;
    }

    .banner-button:focus {
      outline: 2px solid #3498db;
      outline-offset: 2px;
    }

    @media (max-width: 768px) {
      .banner-content {
        flex-direction: column;
        align-items: stretch;
      }

      .banner-actions {
        justify-content: stretch;
      }

      .banner-button {
        flex: 1;
      }
    }

    /* Settings Modal Styles */
    .settings-modal {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
    }

    .settings-content {
      background: white;
      border-radius: 8px;
      padding: 24px;
      max-width: 600px;
      max-height: 80vh;
      overflow-y: auto;
      margin: 20px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    }

    .settings-title {
      font-size: 24px;
      font-weight: 600;
      margin: 0 0 12px 0;
      color: #2c3e50;
    }

    .settings-description {
      font-size: 14px;
      line-height: 1.4;
      margin: 0 0 24px 0;
      color: #555;
    }

    .categories-list {
      display: flex;
      flex-direction: column;
      gap: 20px;
      margin-bottom: 24px;
    }

    .category-item {
      border: 1px solid #e0e0e0;
      border-radius: 6px;
      padding: 16px;
      background: #f9f9f9;
    }

    .category-header {
      margin-bottom: 8px;
    }

    .category-toggle {
      display: flex;
      align-items: center;
      gap: 12px;
      cursor: pointer;
      font-weight: 500;
    }

    .category-toggle input[type="checkbox"] {
      position: relative;
      width: 44px;
      height: 24px;
      appearance: none;
      background: #ccc;
      border-radius: 12px;
      transition: background 0.2s ease;
      cursor: pointer;
    }

    .category-toggle input[type="checkbox"]:checked {
      background: #3498db;
    }

    .category-toggle input[type="checkbox"]:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .category-toggle input[type="checkbox"]::before {
      content: '';
      position: absolute;
      top: 2px;
      left: 2px;
      width: 20px;
      height: 20px;
      background: white;
      border-radius: 50%;
      transition: transform 0.2s ease;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
    }

    .category-toggle input[type="checkbox"]:checked::before {
      transform: translateX(20px);
    }

    .category-name {
      font-size: 16px;
      color: #2c3e50;
    }

    .category-description {
      font-size: 14px;
      line-height: 1.4;
      color: #666;
      margin-bottom: 8px;
    }

    .more-info-link {
      font-size: 13px;
      color: #3498db;
      text-decoration: none;
    }

    .more-info-link:hover {
      text-decoration: underline;
    }

    .settings-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      border-top: 1px solid #e0e0e0;
      padding-top: 16px;
    }

    .save-settings-button {
      background: #3498db;
      color: white;
    }

    .save-settings-button:hover {
      background: #2980b9;
    }

    @media (max-width: 768px) {
      .settings-content {
        margin: 10px;
        padding: 20px;
        max-height: 90vh;
      }

      .settings-actions {
        justify-content: stretch;
      }

      .save-settings-button {
        flex: 1;
      }
    }
  `;

  @state()
  private _showBanner = false;

  @state()
  private _consentGiven = false;

  @state()
  private _nonEssentialCookiesAllowed = false;

  @state()
  private _showSettingsModal = false;

  @state()
  private _categorySettings: CategorySettings = {
    essential: true,
    functional: false,
    analytics: false,
    marketing: false
  };

  @state()
  private _googleConsentStatus = {
    ad_storage: 'denied' as 'granted' | 'denied',
    analytics_storage: 'denied' as 'granted' | 'denied',
    ad_user_data: 'denied' as 'granted' | 'denied',
    ad_personalization: 'denied' as 'granted' | 'denied'
  };

  @property({ type: Number, attribute: 'consent-expiration-days' })
  consentExpirationDays: number = 365; // Default 12 months

  @property({ type: String })
  language: string = '';

  @property({ type: String, attribute: 'user-region' })
  userRegion: string = '';

  @property({ type: Boolean, attribute: 'geolocation-error' })
  geolocationError: boolean = false;

  @property({ type: String, attribute: 'google-consent-mode' })
  googleConsentMode: 'basic' | 'advanced' = 'advanced';

  private readonly CONSENT_KEY = 'gdpr-consent';

  private _currentLanguage: string = 'en';
  private _currentRegion: string = 'EU';

  private readonly translations = {
    en: {
      bannerTitle: 'Cookie Consent',
      bannerDescription: 'We use cookies to enhance your browsing experience and analyze our traffic. By clicking "Accept", you consent to our use of cookies. You can choose to reject non-essential cookies.',
      bannerDescriptionUS: 'We use cookies to enhance your browsing experience and analyze our traffic. By clicking "Accept", you consent to our use of cookies. Do Not Sell My Personal Information.',
      acceptAll: 'Accept All',
      rejectAll: 'Reject All',
      settings: 'Settings',
      settingsTitle: 'Cookie Settings',
      settingsDescription: 'Choose which cookies you want to allow. You can change these settings at any time.',
      saveSettings: 'Save Settings',
      cookieSettings: 'Cookie Settings',
      categories: {
        essential: { name: 'Essential Cookies', description: 'These cookies are necessary for basic website functionality and cannot be disabled.' },
        functional: { name: 'Functional Cookies', description: 'These cookies improve user experience but are not essential for the website to function.' },
        analytics: { name: 'Analytics Cookies', description: 'These cookies collect anonymized data about website usage to help us improve our services.' },
        marketing: { name: 'Marketing Cookies', description: 'These cookies enable personalized advertising and tracking across websites.' }
      }
    },
    de: {
      bannerTitle: 'Cookie-Einverständnis',
      bannerDescription: 'Wir verwenden Cookies, um Ihr Browsing-Erlebnis zu verbessern und unseren Traffic zu analysieren. Durch Klicken auf "Alle akzeptieren" stimmen Sie der Verwendung von Cookies zu. Sie können nicht-essenzielle Cookies ablehnen.',
      bannerDescriptionUS: 'Wir verwenden Cookies, um Ihr Browsing-Erlebnis zu verbessern und unseren Traffic zu analysieren. Sie können dem Verkauf Ihrer persönlichen Daten widersprechen. Verkaufen Sie meine persönlichen Daten nicht.',
      acceptAll: 'Alle akzeptieren',
      rejectAll: 'Alle ablehnen',
      settings: 'Einstellungen',
      settingsTitle: 'Cookie-Einstellungen',
      settingsDescription: 'Wählen Sie, welche Cookies Sie zulassen möchten. Sie können diese Einstellungen jederzeit ändern.',
      saveSettings: 'Einstellungen speichern',
      cookieSettings: 'Cookie-Einstellungen',
      categories: {
        essential: { name: 'Essenzielle Cookies', description: 'Diese Cookies sind für die grundlegende Website-Funktionalität erforderlich und können nicht deaktiviert werden.' },
        functional: { name: 'Funktional', description: 'Diese Cookies verbessern die Benutzererfahrung, sind aber nicht essentiell für die Website-Funktion.' },
        analytics: { name: 'Analytik', description: 'Diese Cookies sammeln anonymisierte Daten über die Website-Nutzung, um unsere Dienste zu verbessern.' },
        marketing: { name: 'Marketing', description: 'Diese Cookies ermöglichen personalisierte Werbung und Tracking über Websites hinweg.' }
      }
    }
  };

  private readonly categoryInfo: Record<CookieCategory, CategoryInfo> = {
    essential: {
      name: 'Essential Cookies',
      description: 'These cookies are necessary for basic website functionality and cannot be disabled.',
      required: true
    },
    functional: {
      name: 'Functional Cookies',
      description: 'These cookies improve user experience but are not essential for the website to function.',
      required: false
    },
    analytics: {
      name: 'Analytics Cookies',
      description: 'These cookies collect anonymized data about website usage to help us improve our services.',
      required: false
    },
    marketing: {
      name: 'Marketing Cookies',
      description: 'These cookies enable personalized advertising and tracking across websites.',
      required: false
    }
  };

  connectedCallback() {
    super.connectedCallback();
    this._initializeGoogleConsentMode();
    this._detectLanguageAndRegion();
    this._initializeConsent();
  }

  private _initializeGoogleConsentMode() {
    try {
      // In basic mode, delay initialization until consent is given
      if (this.googleConsentMode === 'basic') {
        // Don't initialize gtag or dataLayer yet in basic mode
        return;
      }

      // Advanced mode: Initialize immediately with default denied status
      // Initialize dataLayer if it doesn't exist
      (window as any).dataLayer = (window as any).dataLayer || [];

      // Initialize gtag function if it doesn't exist
      if (!(window as any).gtag) {
        (window as any).gtag = function() {
          (window as any).dataLayer.push(arguments);
        };
      }

      // Set default consent status - all parameters denied by default
      // Advanced mode starts with denied status but allows cookieless pings
      const consentConfig = {
        'ad_storage': 'denied',
        'analytics_storage': 'denied',
        'ad_user_data': 'denied',
        'ad_personalization': 'denied',
        'wait_for_update': 500
      };

      (window as any).gtag('consent', 'default', consentConfig);
    } catch (error) {
      // Silently handle errors to not affect site functionality
      console.warn('Google Consent Mode initialization failed:', error);
    }
  }

  private _initializeGoogleConsentModeForBasic() {
    try {
      // Initialize dataLayer if it doesn't exist
      (window as any).dataLayer = (window as any).dataLayer || [];

      // Initialize gtag function if it doesn't exist
      if (!(window as any).gtag) {
        (window as any).gtag = function() {
          (window as any).dataLayer.push(arguments);
        };
      }

      // In basic mode, we initialize gtag only when consent is given
      // No default consent call needed since tags load only after consent
    } catch (error) {
      // Silently handle errors to not affect site functionality
      console.warn('Google Consent Mode basic initialization failed:', error);
    }
  }

  getGoogleConsentStatus() {
    return { ...this._googleConsentStatus };
  }

  private _updateGoogleConsentMode(categorySettings: CategorySettings) {
    try {
      // Map category settings to Google consent parameters
      const consentConfig = {
        'ad_storage': categorySettings.marketing ? 'granted' as const : 'denied' as const,
        'analytics_storage': categorySettings.analytics ? 'granted' as const : 'denied' as const,
        'ad_user_data': categorySettings.marketing ? 'granted' as const : 'denied' as const,
        'ad_personalization': categorySettings.marketing ? 'granted' as const : 'denied' as const
      };

      // Update Google consent parameters
      if ((window as any).gtag) {
        (window as any).gtag('consent', 'update', consentConfig);
      }

      // Push consent update event to dataLayer for GTM integration
      if ((window as any).dataLayer) {
        (window as any).dataLayer.push({
          'event': 'consent_update',
          'consent_state': { ...consentConfig }
        });
      }

      // Update internal status
      this._googleConsentStatus = { ...consentConfig };
    } catch (error) {
      // Silently handle errors to not affect site functionality
      console.warn('Google Consent Mode update failed:', error);
    }
  }

  private _detectLanguageAndRegion() {
    // Detect language
    if (this.language) {
      this._currentLanguage = this.language;
    } else {
      // Auto-detect browser language
      const browserLang = navigator.language || navigator.languages?.[0] || 'en';
      const langCode = browserLang.split('-')[0]; // Extract language code (e.g., 'de' from 'de-DE')

      // Check if we support this language, fallback to English if not
      this._currentLanguage = this.translations[langCode as keyof typeof this.translations] ? langCode : 'en';
    }

    // Detect region
    if (this.userRegion) {
      this._currentRegion = this.userRegion;
    } else if (this.geolocationError) {
      // Fallback to GDPR (strictest) on geolocation error
      this._currentRegion = 'EU';
    } else {
      // Default to EU for GDPR compliance
      this._currentRegion = 'EU';
    }
  }

  private _translate(key: string): string {
    const lang = this._currentLanguage as keyof typeof this.translations;
    const translations = this.translations[lang] || this.translations.en;

    // Handle nested keys like 'categories.functional.name'
    const keys = key.split('.');
    let value: any = translations;
    for (const k of keys) {
      value = value?.[k];
    }

    return value || key;
  }

  private _getBannerDescription(): string {
    if (this._currentRegion === 'US') {
      return this._translate('bannerDescriptionUS');
    }
    return this._translate('bannerDescription');
  }

  private _getCategoryInfo(category: CookieCategory): CategoryInfo {
    return {
      name: this._translate(`categories.${category}.name`),
      description: this._translate(`categories.${category}.description`),
      required: this.categoryInfo[category].required
    };
  }

  private _initializeConsent() {
    const consent = this._getStoredConsent();
    if (consent) {
      this._consentGiven = true;
      this._nonEssentialCookiesAllowed = consent.accepted;
      this._showBanner = false;

      // Load granular category settings if available
      if (consent.categories) {
        this._categorySettings = { ...consent.categories };
      } else {
        // Backward compatibility: if no categories, use binary consent
        this._categorySettings = {
          essential: true,
          functional: consent.accepted,
          analytics: consent.accepted,
          marketing: consent.accepted
        };
      }
    } else {
      this._showBanner = true;
      this._nonEssentialCookiesAllowed = false;
      this._categorySettings = {
        essential: true,
        functional: false,
        analytics: false,
        marketing: false
      };
    }
  }

  private _getStoredConsent(): ConsentData | null {
    try {
      const stored = localStorage.getItem(this.CONSENT_KEY);
      if (stored) {
        const consent = JSON.parse(stored) as ConsentData;
        // Validate the consent data structure
        if (typeof consent.timestamp === 'number' && typeof consent.accepted === 'boolean') {
          // Check if consent has expired
          const consentAgeInDays = (Date.now() - consent.timestamp) / (1000 * 60 * 60 * 24);
          const expirationDays = Math.max(30, Math.min(730, this.consentExpirationDays)); // Enforce min 30, max 730 days

          if (consentAgeInDays > expirationDays) {
            // Consent has expired, remove it from storage
            console.info('Cookie consent has expired and will be removed');
            this._removeExpiredConsent();
            return null;
          }

          return consent;
        }
      }
    } catch (error) {
      console.warn('Failed to parse stored consent:', error);
    }
    return null;
  }

  private _removeExpiredConsent(): void {
    try {
      localStorage.removeItem(this.CONSENT_KEY);
    } catch (error) {
      console.error('Failed to remove expired consent:', error);
    }
  }

  private _storeConsent(accepted: boolean) {
    const consent: ConsentData = {
      timestamp: Date.now(),
      accepted
    };

    try {
      localStorage.setItem(this.CONSENT_KEY, JSON.stringify(consent));
    } catch (error) {
      console.error('Failed to store consent:', error);
    }
  }

  private _handleAccept() {
    this._storeConsent(true);
    this._consentGiven = true;
    this._nonEssentialCookiesAllowed = true;
    this._showBanner = false;

    // Update category settings for accept all
    this._categorySettings = {
      essential: true,
      functional: true,
      analytics: true,
      marketing: true
    };

    // Initialize Google Consent Mode for basic mode (if needed)
    if (this.googleConsentMode === 'basic') {
      this._initializeGoogleConsentModeForBasic();
    }

    // Update Google Consent Mode parameters
    this._updateGoogleConsentMode(this._categorySettings);

    // Dispatch custom event for external scripts to listen to
    this.dispatchEvent(new CustomEvent('gdpr-consent-given', {
      detail: { accepted: true },
      bubbles: true,
      composed: true
    }));
  }

  private _handleReject() {
    this._storeConsent(false);
    this._consentGiven = true;
    this._nonEssentialCookiesAllowed = false;
    this._showBanner = false;

    // Update category settings for reject all
    this._categorySettings = {
      essential: true,
      functional: false,
      analytics: false,
      marketing: false
    };

    // Initialize Google Consent Mode for basic mode (if needed)
    if (this.googleConsentMode === 'basic') {
      this._initializeGoogleConsentModeForBasic();
    }

    // Update Google Consent Mode parameters
    this._updateGoogleConsentMode(this._categorySettings);

    // Dispatch custom event for external scripts to listen to
    this.dispatchEvent(new CustomEvent('gdpr-consent-given', {
      detail: { accepted: false },
      bubbles: true,
      composed: true
    }));
  }

  private _handleSettings() {
    this._showSettingsModal = true;
    // Dispatch custom event for external scripts to listen to
    this.dispatchEvent(new CustomEvent('gdpr-settings-requested', {
      bubbles: true,
      composed: true
    }));
  }

  // Public API methods for external use
  shouldShowBanner(): boolean {
    return this._showBanner;
  }

  areNonEssentialCookiesAllowed(): boolean {
    return this._nonEssentialCookiesAllowed;
  }

  resetConsent(): void {
    try {
      localStorage.removeItem(this.CONSENT_KEY);
    } catch (error) {
      console.error('Failed to reset consent:', error);
    }

    this._consentGiven = false;
    this._nonEssentialCookiesAllowed = false;
    this._showBanner = true;
    this._categorySettings = {
      essential: true,
      functional: false,
      analytics: false,
      marketing: false
    };
  }

  isCategoryEnabled(category: CookieCategory): boolean {
    return this._categorySettings[category];
  }

  private _handleCategoryToggle(category: CookieCategory) {
    if (category === 'essential') return; // Essential cookies cannot be disabled

    this._categorySettings = {
      ...this._categorySettings,
      [category]: !this._categorySettings[category]
    };

    // Dispatch category change event
    this.dispatchEvent(new CustomEvent('gdpr-category-changed', {
      detail: {
        category,
        enabled: this._categorySettings[category]
      },
      bubbles: true,
      composed: true
    }));
  }

  private _handleSaveSettings() {
    // Delete cookies for disabled categories before saving new settings
    this._deleteCookiesForDisabledCategories();

    const hasAnyOptionalCategory = this._categorySettings.functional ||
                                   this._categorySettings.analytics ||
                                   this._categorySettings.marketing;

    this._storeConsentWithCategories(hasAnyOptionalCategory);
    this._consentGiven = true;
    this._nonEssentialCookiesAllowed = hasAnyOptionalCategory;
    this._showBanner = false;
    this._showSettingsModal = false;

    // Initialize Google Consent Mode for basic mode (if needed)
    if (this.googleConsentMode === 'basic') {
      this._initializeGoogleConsentModeForBasic();
    }

    // Update Google Consent Mode parameters
    this._updateGoogleConsentMode(this._categorySettings);

    // Dispatch consent event
    this.dispatchEvent(new CustomEvent('gdpr-consent-given', {
      detail: {
        accepted: hasAnyOptionalCategory,
        categories: { ...this._categorySettings }
      },
      bubbles: true,
      composed: true
    }));
  }

  private _deleteCookiesForDisabledCategories() {
    // Define cookie patterns by category
    const cookiePatterns = {
      functional: ['_func', 'functional'],
      analytics: ['_ga', '_gid', '_gat', '_gtag', 'analytics'],
      marketing: ['_fbp', '_fbc', 'marketing', 'ads']
    };

    // Delete cookies for each disabled category
    Object.entries(this._categorySettings).forEach(([category, enabled]) => {
      if (!enabled && category !== 'essential') {
        const patterns = cookiePatterns[category as keyof typeof cookiePatterns];
        if (patterns) {
          this._deleteCookiesByPatterns(patterns);
        }
      }
    });
  }

  private _deleteCookiesByPatterns(patterns: string[]) {
    // Get all cookies
    const cookies = document.cookie.split(';');

    cookies.forEach(cookie => {
      const cookieName = cookie.split('=')[0].trim();

      // Check if cookie matches any pattern for this category
      const shouldDelete = patterns.some(pattern =>
        cookieName.includes(pattern) || cookieName.startsWith(pattern)
      );

      if (shouldDelete) {
        // Delete cookie by setting expiration date in the past
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`;
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${window.location.hostname};`;
      }
    });
  }

  private _storeConsentWithCategories(accepted: boolean) {
    const consent: ConsentData = {
      timestamp: Date.now(),
      accepted,
      categories: { ...this._categorySettings }
    };

    try {
      localStorage.setItem(this.CONSENT_KEY, JSON.stringify(consent));
    } catch (error) {
      console.error('Failed to store consent:', error);
    }
  }

  render() {
    return html`
      ${this._showBanner ? this._renderBanner() : ''}
      ${this._showSettingsModal ? this._renderSettingsModal() : ''}
      ${this._renderPermanentAccessibilityElement()}
    `;
  }

  private _renderBanner() {
    return html`
      <div class="banner" role="dialog" aria-labelledby="banner-title" aria-describedby="banner-description">
        <div class="banner-content">
          <div class="banner-text">
            <h2 id="banner-title" class="banner-title">${this._translate('bannerTitle')}</h2>
            <p id="banner-description" class="banner-description">
              ${this._getBannerDescription()}
            </p>
          </div>
          <div class="banner-actions">
            <button
              class="banner-button accept-button"
              @click=${this._handleAccept}
              aria-label="Accept all cookies"
            >
              ${this._translate('acceptAll')}
            </button>
            <button
              class="banner-button reject-button"
              @click=${this._handleReject}
              aria-label="Reject non-essential cookies"
            >
              ${this._translate('rejectAll')}
            </button>
            <button
              class="banner-button settings-button"
              @click=${this._handleSettings}
              aria-label="Open cookie settings"
            >
              ${this._translate('settings')}
            </button>
          </div>
        </div>
      </div>
    `;
  }

  private _renderSettingsModal() {
    return html`
      <div class="settings-modal" role="dialog" aria-labelledby="settings-title">
        <div class="settings-content">
          <h2 id="settings-title" class="settings-title">${this._translate('settingsTitle')}</h2>
          <p class="settings-description">
            ${this._translate('settingsDescription')}
          </p>

          <div class="categories-list">
            ${Object.entries(this.categoryInfo).map(([category, info]) =>
              this._renderCategoryItem(category as CookieCategory, this._getCategoryInfo(category as CookieCategory))
            )}
          </div>

          <div class="settings-actions">
            <button
              class="banner-button save-settings-button"
              @click=${this._handleSaveSettings}
              aria-label="Save cookie settings"
            >
              ${this._translate('saveSettings')}
            </button>
          </div>
        </div>
      </div>
    `;
  }

  private _renderPermanentAccessibilityElement() {
    // Only show permanent element when banner is not visible (consent has been given)
    if (this._showBanner) {
      return html``;
    }

    return html`
      <div class="cookie-settings-container">
        <button
          class="cookie-settings-link"
          @click=${this._handleSettings}
          @keydown=${this._handleKeydown}
          tabindex="0"
          role="button"
          aria-label="Open cookie settings to change your preferences"
        >
          ${this._translate('cookieSettings')}
        </button>
      </div>
    `;
  }

  private _handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      this._handleSettings();
    }
  }

  private _renderCategoryItem(category: CookieCategory, info: CategoryInfo) {
    const isEnabled = this._categorySettings[category];
    const isRequired = info.required;

    return html`
      <div class="category-item" data-category="${category}">
        <div class="category-header">
          <label class="category-toggle">
            <input
              type="checkbox"
              .checked=${isEnabled}
              .disabled=${isRequired}
              @change=${() => this._handleCategoryToggle(category)}
            />
            <span class="toggle-slider"></span>
            <span class="category-name">${info.name}</span>
          </label>
        </div>
        <div class="category-description">${info.description}</div>
        <a href="#" class="more-info-link" @click=${(e: Event) => e.preventDefault()}>
          More info
        </a>
      </div>
    `;
  }
}
