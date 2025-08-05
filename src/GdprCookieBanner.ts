import { html, css, LitElement } from 'lit';
import { property, state } from 'lit/decorators.js';

interface ConsentData {
  timestamp: number;
  accepted: boolean;
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

    .accept-button {
      background: #1e8449;
      color: white;
    }

    .accept-button:hover {
      background: #196f3d;
    }

    .reject-button {
      background: #c0392b;
      color: white;
    }

    .reject-button:hover {
      background: #a93226;
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
  `;

  @state()
  private _showBanner = false;

  @state()
  private _consentGiven = false;

  @state()
  private _nonEssentialCookiesAllowed = false;

  @property({ type: Number })
  consentExpirationDays: number = 365; // Default 12 months

  private readonly CONSENT_KEY = 'gdpr-consent';

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
    } else {
      this._showBanner = true;
      this._nonEssentialCookiesAllowed = false;
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
  }

  render() {
    if (!this._showBanner) {
      return html``;
    }

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
              Accept
            </button>
            <button
              class="banner-button reject-button"
              @click=${this._handleReject}
              aria-label="Reject non-essential cookies"
            >
              Reject
            </button>
          </div>
        </div>
      </div>
    `;
  }
}
