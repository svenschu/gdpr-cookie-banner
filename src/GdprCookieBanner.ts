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

  @property({ type: Number, attribute: 'consent-expiration-days' })
  consentExpirationDays: number = 365; // Default 12 months

  private readonly CONSENT_KEY = 'gdpr-consent';

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
    this._initializeConsent();
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
    const hasAnyOptionalCategory = this._categorySettings.functional ||
                                   this._categorySettings.analytics ||
                                   this._categorySettings.marketing;

    this._storeConsentWithCategories(hasAnyOptionalCategory);
    this._consentGiven = true;
    this._nonEssentialCookiesAllowed = hasAnyOptionalCategory;
    this._showBanner = false;
    this._showSettingsModal = false;

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
    if (!this._showBanner && !this._showSettingsModal) {
      return html``;
    }

    return html`
      ${this._showBanner ? this._renderBanner() : ''}
      ${this._showSettingsModal ? this._renderSettingsModal() : ''}
    `;
  }

  private _renderBanner() {
    return html`
      <div class="banner" role="dialog" aria-labelledby="banner-title" aria-describedby="banner-description">
        <div class="banner-content">
          <div class="banner-text">
            <h2 id="banner-title" class="banner-title">Cookie Consent</h2>
            <p id="banner-description" class="banner-description">
              We use cookies to enhance your browsing experience and analyze our traffic.
              By clicking "Accept", you consent to our use of cookies.
              You can choose to reject non-essential cookies.
            </p>
          </div>
          <div class="banner-actions">
            <button
              class="banner-button accept-button"
              @click=${this._handleAccept}
              aria-label="Accept all cookies"
            >
              Accept All
            </button>
            <button
              class="banner-button reject-button"
              @click=${this._handleReject}
              aria-label="Reject non-essential cookies"
            >
              Reject All
            </button>
            <button
              class="banner-button settings-button"
              @click=${this._handleSettings}
              aria-label="Open cookie settings"
            >
              Settings
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
          <h2 id="settings-title" class="settings-title">Cookie Settings</h2>
          <p class="settings-description">
            Choose which cookies you want to allow. You can change these settings at any time.
          </p>

          <div class="categories-list">
            ${Object.entries(this.categoryInfo).map(([category, info]) =>
              this._renderCategoryItem(category as CookieCategory, info)
            )}
          </div>

          <div class="settings-actions">
            <button
              class="banner-button save-settings-button"
              @click=${this._handleSaveSettings}
              aria-label="Save cookie settings"
            >
              Save Settings
            </button>
          </div>
        </div>
      </div>
    `;
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
