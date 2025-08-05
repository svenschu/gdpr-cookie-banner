import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';
import { GdprCookieBanner } from '../src/GdprCookieBanner.js';
import '../src/gdpr-cookie-banner.js';

describe('GdprCookieBanner', () => {
  beforeEach(() => {
    // Clear localStorage and cookies before each test
    localStorage.clear();
    document.cookie.split(";").forEach(function(c) {
      document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });

    // Reset navigator.language to English to prevent test interference
    Object.defineProperty(navigator, 'language', {
      writable: true,
      value: 'en-US'
    });
  });

  describe('Story 1.1 - Display banner and block cookies', () => {
    it('displays banner on first visit when no consent is stored', async () => {
      const el = await fixture<GdprCookieBanner>(html`<gdpr-cookie-banner></gdpr-cookie-banner>`);

      expect(el.shouldShowBanner()).to.be.true;
      expect(el.shadowRoot!.querySelector('.banner')).to.exist;
    });

    it('does not display banner when valid consent exists', async () => {
      // Simulate existing consent
      localStorage.setItem('gdpr-consent', JSON.stringify({
        timestamp: Date.now(),
        accepted: true
      }));

      const el = await fixture<GdprCookieBanner>(html`<gdpr-cookie-banner></gdpr-cookie-banner>`);

      expect(el.shouldShowBanner()).to.be.false;
      expect(el.shadowRoot!.querySelector('.banner')).to.not.exist;
    });

    it('has no close button - requires explicit decision', async () => {
      const el = await fixture<GdprCookieBanner>(html`<gdpr-cookie-banner></gdpr-cookie-banner>`);

      expect(el.shadowRoot!.querySelector('.close-button')).to.not.exist;
      expect(el.shadowRoot!.querySelector('[aria-label*="close"]')).to.not.exist;
    });

    it('provides accept and reject buttons for explicit consent', async () => {
      const el = await fixture<GdprCookieBanner>(html`<gdpr-cookie-banner></gdpr-cookie-banner>`);

      const acceptButton = el.shadowRoot!.querySelector('.accept-button');
      const rejectButton = el.shadowRoot!.querySelector('.reject-button');

      expect(acceptButton).to.exist;
      expect(rejectButton).to.exist;
      expect(acceptButton!.textContent).to.include('Accept');
      expect(rejectButton!.textContent).to.include('Reject');
    });

    it('stores consent decision when accept is clicked', async () => {
      const el = await fixture<GdprCookieBanner>(html`<gdpr-cookie-banner></gdpr-cookie-banner>`);

      const acceptButton = el.shadowRoot!.querySelector('.accept-button') as HTMLButtonElement;
      acceptButton.click();

      await el.updateComplete;

      const consent = JSON.parse(localStorage.getItem('gdpr-consent') || '{}');
      expect(consent.accepted).to.be.true;
      expect(consent.timestamp).to.be.a('number');
      expect(el.shouldShowBanner()).to.be.false;
    });

    it('stores consent decision when reject is clicked', async () => {
      const el = await fixture<GdprCookieBanner>(html`<gdpr-cookie-banner></gdpr-cookie-banner>`);

      const rejectButton = el.shadowRoot!.querySelector('.reject-button') as HTMLButtonElement;
      rejectButton.click();

      await el.updateComplete;

      const consent = JSON.parse(localStorage.getItem('gdpr-consent') || '{}');
      expect(consent.accepted).to.be.false;
      expect(consent.timestamp).to.be.a('number');
      expect(el.shouldShowBanner()).to.be.false;
    });

    it('blocks non-essential cookies initially', async () => {
      const el = await fixture<GdprCookieBanner>(html`<gdpr-cookie-banner></gdpr-cookie-banner>`);

      expect(el.areNonEssentialCookiesAllowed()).to.be.false;
    });

    it('allows non-essential cookies after accept', async () => {
      const el = await fixture<GdprCookieBanner>(html`<gdpr-cookie-banner></gdpr-cookie-banner>`);

      const acceptButton = el.shadowRoot!.querySelector('.accept-button') as HTMLButtonElement;
      acceptButton.click();

      await el.updateComplete;

      expect(el.areNonEssentialCookiesAllowed()).to.be.true;
    });

    it('keeps non-essential cookies blocked after reject', async () => {
      const el = await fixture<GdprCookieBanner>(html`<gdpr-cookie-banner></gdpr-cookie-banner>`);

      const rejectButton = el.shadowRoot!.querySelector('.reject-button') as HTMLButtonElement;
      rejectButton.click();

      await el.updateComplete;

      expect(el.areNonEssentialCookiesAllowed()).to.be.false;
    });

    it('shows banner again when consent settings are reset', async () => {
      // First, give consent
      localStorage.setItem('gdpr-consent', JSON.stringify({
        timestamp: Date.now(),
        accepted: true
      }));

      const el = await fixture<GdprCookieBanner>(html`<gdpr-cookie-banner></gdpr-cookie-banner>`);
      expect(el.shouldShowBanner()).to.be.false;

      // Reset consent
      el.resetConsent();
      await el.updateComplete;

      expect(el.shouldShowBanner()).to.be.true;
      expect(el.shadowRoot!.querySelector('.banner')).to.exist;
    });
  });

  describe('Story 1.6 - Consent expiration', () => {
    it('uses default expiration period of 365 days', async () => {
      const el = await fixture<GdprCookieBanner>(html`<gdpr-cookie-banner></gdpr-cookie-banner>`);

      expect(el.consentExpirationDays).to.equal(365);
    });

    it('allows custom expiration period configuration', async () => {
      const el = await fixture<GdprCookieBanner>(html`<gdpr-cookie-banner consent-expiration-days="180"></gdpr-cookie-banner>`);

      expect(el.consentExpirationDays).to.equal(180);
    });

    it('enforces minimum expiration period of 30 days', async () => {
      // Store consent that would be expired with a 10-day period
      const tenDaysAgo = Date.now() - (11 * 24 * 60 * 60 * 1000);
      localStorage.setItem('gdpr-consent', JSON.stringify({
        timestamp: tenDaysAgo,
        accepted: true
      }));

      const el = await fixture<GdprCookieBanner>(html`<gdpr-cookie-banner consent-expiration-days="10"></gdpr-cookie-banner>`);

      // Should not show banner because minimum 30 days is enforced
      expect(el.shouldShowBanner()).to.be.false;
    });

    it('enforces maximum expiration period of 730 days', async () => {
      // Store consent that is 800 days old
      const veryOldConsent = Date.now() - (800 * 24 * 60 * 60 * 1000);
      localStorage.setItem('gdpr-consent', JSON.stringify({
        timestamp: veryOldConsent,
        accepted: true
      }));

      const el = await fixture<GdprCookieBanner>(html`<gdpr-cookie-banner consent-expiration-days="1000"></gdpr-cookie-banner>`);

      // Should show banner because maximum 730 days is enforced
      expect(el.shouldShowBanner()).to.be.true;
    });

    it('shows banner when consent has expired (default period)', async () => {
      // Store consent that is 400 days old (older than default 365 days)
      const expiredConsent = Date.now() - (400 * 24 * 60 * 60 * 1000);
      localStorage.setItem('gdpr-consent', JSON.stringify({
        timestamp: expiredConsent,
        accepted: true
      }));

      const el = await fixture<GdprCookieBanner>(html`<gdpr-cookie-banner></gdpr-cookie-banner>`);

      expect(el.shouldShowBanner()).to.be.true;
      expect(el.shadowRoot!.querySelector('.banner')).to.exist;
    });

    it('shows banner when consent has expired (custom period)', async () => {
      // Store consent that is 200 days old
      const oldConsent = Date.now() - (200 * 24 * 60 * 60 * 1000);
      localStorage.setItem('gdpr-consent', JSON.stringify({
        timestamp: oldConsent,
        accepted: true
      }));

      // Set expiration to 180 days
      const el = await fixture<GdprCookieBanner>(html`<gdpr-cookie-banner consent-expiration-days="180"></gdpr-cookie-banner>`);

      expect(el.shouldShowBanner()).to.be.true;
      expect(el.shadowRoot!.querySelector('.banner')).to.exist;
    });

    it('does not show banner when consent is still valid', async () => {
      // Store consent that is 100 days old (within default 365 days)
      const validConsent = Date.now() - (100 * 24 * 60 * 60 * 1000);
      localStorage.setItem('gdpr-consent', JSON.stringify({
        timestamp: validConsent,
        accepted: true
      }));

      const el = await fixture<GdprCookieBanner>(html`<gdpr-cookie-banner></gdpr-cookie-banner>`);

      expect(el.shouldShowBanner()).to.be.false;
      expect(el.shadowRoot!.querySelector('.banner')).to.not.exist;
    });

    it('blocks non-essential cookies when consent has expired', async () => {
      // Store expired consent that was previously accepted
      const expiredConsent = Date.now() - (400 * 24 * 60 * 60 * 1000);
      localStorage.setItem('gdpr-consent', JSON.stringify({
        timestamp: expiredConsent,
        accepted: true
      }));

      const el = await fixture<GdprCookieBanner>(html`<gdpr-cookie-banner></gdpr-cookie-banner>`);

      expect(el.areNonEssentialCookiesAllowed()).to.be.false;
    });

    it('removes expired consent from localStorage', async () => {
      // Store expired consent
      const expiredConsent = Date.now() - (400 * 24 * 60 * 60 * 1000);
      localStorage.setItem('gdpr-consent', JSON.stringify({
        timestamp: expiredConsent,
        accepted: true
      }));

      // Verify consent is stored
      expect(localStorage.getItem('gdpr-consent')).to.not.be.null;

      const el = await fixture<GdprCookieBanner>(html`<gdpr-cookie-banner></gdpr-cookie-banner>`);

      // After initialization, expired consent should be removed
      expect(localStorage.getItem('gdpr-consent')).to.be.null;
    });

    it('preserves valid consent in localStorage', async () => {
      // Store valid consent
      const validConsent = Date.now() - (100 * 24 * 60 * 60 * 1000);
      const consentData = {
        timestamp: validConsent,
        accepted: true
      };
      localStorage.setItem('gdpr-consent', JSON.stringify(consentData));

      const el = await fixture<GdprCookieBanner>(html`<gdpr-cookie-banner></gdpr-cookie-banner>`);

      // Valid consent should still be in localStorage
      const storedConsent = JSON.parse(localStorage.getItem('gdpr-consent') || '{}');
      expect(storedConsent.timestamp).to.equal(validConsent);
      expect(storedConsent.accepted).to.be.true;
    });

    it('handles edge case of consent exactly at expiration boundary', async () => {
      // Store consent that is exactly 365 days old
      const boundaryConsent = Date.now() - (365 * 24 * 60 * 60 * 1000);
      localStorage.setItem('gdpr-consent', JSON.stringify({
        timestamp: boundaryConsent,
        accepted: true
      }));

      const el = await fixture<GdprCookieBanner>(html`<gdpr-cookie-banner></gdpr-cookie-banner>`);

      // Should not show banner as it's exactly at the boundary (not greater than)
      expect(el.shouldShowBanner()).to.be.false;
    });
  });

  it('passes the a11y audit', async () => {
    const el = await fixture<GdprCookieBanner>(html`<gdpr-cookie-banner></gdpr-cookie-banner>`);

    await expect(el).shadowDom.to.be.accessible();
  });

  describe('Story 1.2 - Equivalent Accept All and Reject All Buttons', () => {
    beforeEach(() => {
      localStorage.clear();
    });

    it('should have three buttons: Accept All, Reject All, and Settings', async () => {
      const el = await fixture<GdprCookieBanner>(html`<gdpr-cookie-banner></gdpr-cookie-banner>`);

      const acceptButton = el.shadowRoot!.querySelector('.accept-button');
      const rejectButton = el.shadowRoot!.querySelector('.reject-button');
      const settingsButton = el.shadowRoot!.querySelector('.settings-button');

      expect(acceptButton).to.exist;
      expect(rejectButton).to.exist;
      expect(settingsButton).to.exist;
    });

    it('should have equivalent styling for Accept All and Reject All buttons', async () => {
      const el = await fixture<GdprCookieBanner>(html`<gdpr-cookie-banner></gdpr-cookie-banner>`);

      const acceptButton = el.shadowRoot!.querySelector('.accept-button') as HTMLElement;
      const rejectButton = el.shadowRoot!.querySelector('.reject-button') as HTMLElement;

      const acceptStyles = window.getComputedStyle(acceptButton);
      const rejectStyles = window.getComputedStyle(rejectButton);

      // Both buttons should have the same background color (no nudging)
      expect(acceptStyles.backgroundColor).to.equal(rejectStyles.backgroundColor);

      // Both buttons should have the same dimensions (allowing for small browser rendering differences)
      const acceptWidth = parseFloat(acceptStyles.width);
      const rejectWidth = parseFloat(rejectStyles.width);
      expect(Math.abs(acceptWidth - rejectWidth)).to.be.lessThan(2); // Allow 2px difference for browser rendering
      expect(acceptStyles.height).to.equal(rejectStyles.height);
      expect(acceptStyles.padding).to.equal(rejectStyles.padding);

      // Both buttons should have the same font styling
      expect(acceptStyles.fontSize).to.equal(rejectStyles.fontSize);
      expect(acceptStyles.fontWeight).to.equal(rejectStyles.fontWeight);
    });

    it('should have correct button labels', async () => {
      const el = await fixture<GdprCookieBanner>(html`<gdpr-cookie-banner></gdpr-cookie-banner>`);

      const acceptButton = el.shadowRoot!.querySelector('.accept-button') as HTMLElement;
      const rejectButton = el.shadowRoot!.querySelector('.reject-button') as HTMLElement;
      const settingsButton = el.shadowRoot!.querySelector('.settings-button') as HTMLElement;

      expect(acceptButton.textContent?.trim()).to.equal('Accept All');
      expect(rejectButton.textContent?.trim()).to.equal('Reject All');
      expect(settingsButton.textContent?.trim()).to.equal('Settings');
    });

    it('should dispatch settings event when Settings button is clicked', async () => {
      const el = await fixture<GdprCookieBanner>(html`<gdpr-cookie-banner></gdpr-cookie-banner>`);

      let settingsEventFired = false;
      el.addEventListener('gdpr-settings-requested', () => {
        settingsEventFired = true;
      });

      const settingsButton = el.shadowRoot!.querySelector('.settings-button') as HTMLElement;
      settingsButton.click();

      expect(settingsEventFired).to.be.true;
    });

    it('should keep banner visible after Settings button click', async () => {
      const el = await fixture<GdprCookieBanner>(html`<gdpr-cookie-banner></gdpr-cookie-banner>`);

      const settingsButton = el.shadowRoot!.querySelector('.settings-button') as HTMLElement;
      settingsButton.click();

      // Banner should still be visible after clicking Settings
      expect(el.shouldShowBanner()).to.be.true;
      expect(el.shadowRoot!.querySelector('.banner')).to.exist;
    });
  });

  describe('Story 1.3 - Granular Cookie Settings', () => {
    beforeEach(() => {
      localStorage.clear();
    });

    it('should show settings modal when settings button is clicked', async () => {
      const el = await fixture<GdprCookieBanner>(html`<gdpr-cookie-banner></gdpr-cookie-banner>`);

      const settingsButton = el.shadowRoot!.querySelector('.settings-button') as HTMLElement;
      settingsButton.click();
      await el.updateComplete;

      const settingsModal = el.shadowRoot!.querySelector('.settings-modal');
      expect(settingsModal).to.exist;
    });

    it('should have all four cookie categories defined', async () => {
      const el = await fixture<GdprCookieBanner>(html`<gdpr-cookie-banner></gdpr-cookie-banner>`);

      const settingsButton = el.shadowRoot!.querySelector('.settings-button') as HTMLElement;
      settingsButton.click();
      await el.updateComplete;

      const essentialToggle = el.shadowRoot!.querySelector('[data-category="essential"]');
      const functionalToggle = el.shadowRoot!.querySelector('[data-category="functional"]');
      const analyticsToggle = el.shadowRoot!.querySelector('[data-category="analytics"]');
      const marketingToggle = el.shadowRoot!.querySelector('[data-category="marketing"]');

      expect(essentialToggle).to.exist;
      expect(functionalToggle).to.exist;
      expect(analyticsToggle).to.exist;
      expect(marketingToggle).to.exist;
    });

    it('should have essential cookies always enabled and disabled toggle', async () => {
      const el = await fixture<GdprCookieBanner>(html`<gdpr-cookie-banner></gdpr-cookie-banner>`);

      const settingsButton = el.shadowRoot!.querySelector('.settings-button') as HTMLElement;
      settingsButton.click();
      await el.updateComplete;

      const essentialToggle = el.shadowRoot!.querySelector('[data-category="essential"] input') as HTMLInputElement;
      expect(essentialToggle.checked).to.be.true;
      expect(essentialToggle.disabled).to.be.true;
    });

    it('should have all optional categories disabled by default', async () => {
      const el = await fixture<GdprCookieBanner>(html`<gdpr-cookie-banner></gdpr-cookie-banner>`);

      const settingsButton = el.shadowRoot!.querySelector('.settings-button') as HTMLElement;
      settingsButton.click();
      await el.updateComplete;

      const functionalToggle = el.shadowRoot!.querySelector('[data-category="functional"] input') as HTMLInputElement;
      const analyticsToggle = el.shadowRoot!.querySelector('[data-category="analytics"] input') as HTMLInputElement;
      const marketingToggle = el.shadowRoot!.querySelector('[data-category="marketing"] input') as HTMLInputElement;

      expect(functionalToggle.checked).to.be.false;
      expect(analyticsToggle.checked).to.be.false;
      expect(marketingToggle.checked).to.be.false;
    });

    it('should allow individual category activation', async () => {
      const el = await fixture<GdprCookieBanner>(html`<gdpr-cookie-banner></gdpr-cookie-banner>`);

      const settingsButton = el.shadowRoot!.querySelector('.settings-button') as HTMLElement;
      settingsButton.click();
      await el.updateComplete;

      const functionalToggle = el.shadowRoot!.querySelector('[data-category="functional"] input') as HTMLInputElement;
      functionalToggle.click();
      await el.updateComplete;

      expect(functionalToggle.checked).to.be.true;
      expect(el.isCategoryEnabled('functional')).to.be.true;
    });

    it('should persist category settings in localStorage', async () => {
      const el = await fixture<GdprCookieBanner>(html`<gdpr-cookie-banner></gdpr-cookie-banner>`);

      const settingsButton = el.shadowRoot!.querySelector('.settings-button') as HTMLElement;
      settingsButton.click();
      await el.updateComplete;

      const functionalToggle = el.shadowRoot!.querySelector('[data-category="functional"] input') as HTMLInputElement;
      const analyticsToggle = el.shadowRoot!.querySelector('[data-category="analytics"] input') as HTMLInputElement;

      functionalToggle.click();
      analyticsToggle.click();
      await el.updateComplete;

      const saveButton = el.shadowRoot!.querySelector('.save-settings-button') as HTMLElement;
      saveButton.click();
      await el.updateComplete;

      const consent = JSON.parse(localStorage.getItem('gdpr-consent') || '{}');
      expect(consent.categories.functional).to.be.true;
      expect(consent.categories.analytics).to.be.true;
      expect(consent.categories.marketing).to.be.false;
    });

    it('should load persisted category settings on initialization', async () => {
      // Pre-populate localStorage with granular consent
      localStorage.setItem('gdpr-consent', JSON.stringify({
        timestamp: Date.now(),
        accepted: true,
        categories: {
          essential: true,
          functional: true,
          analytics: false,
          marketing: true
        }
      }));

      const el = await fixture<GdprCookieBanner>(html`<gdpr-cookie-banner></gdpr-cookie-banner>`);

      expect(el.isCategoryEnabled('essential')).to.be.true;
      expect(el.isCategoryEnabled('functional')).to.be.true;
      expect(el.isCategoryEnabled('analytics')).to.be.false;
      expect(el.isCategoryEnabled('marketing')).to.be.true;
    });

    it('should dispatch category change events when categories are toggled', async () => {
      const el = await fixture<GdprCookieBanner>(html`<gdpr-cookie-banner></gdpr-cookie-banner>`);

      let categoryChangeEvent: CustomEvent | null = null;
      el.addEventListener('gdpr-category-changed', (e: Event) => {
        categoryChangeEvent = e as CustomEvent;
      });

      const settingsButton = el.shadowRoot!.querySelector('.settings-button') as HTMLElement;
      settingsButton.click();
      await el.updateComplete;

      const functionalToggle = el.shadowRoot!.querySelector('[data-category="functional"] input') as HTMLInputElement;
      functionalToggle.click();
      await el.updateComplete;

      expect(categoryChangeEvent).to.not.be.null;
      expect(categoryChangeEvent!.detail.category).to.equal('functional');
      expect(categoryChangeEvent!.detail.enabled).to.be.true;
    });

    it('should have descriptions for each category', async () => {
      const el = await fixture<GdprCookieBanner>(html`<gdpr-cookie-banner></gdpr-cookie-banner>`);

      const settingsButton = el.shadowRoot!.querySelector('.settings-button') as HTMLElement;
      settingsButton.click();
      await el.updateComplete;

      const essentialDesc = el.shadowRoot!.querySelector('[data-category="essential"] .category-description');
      const functionalDesc = el.shadowRoot!.querySelector('[data-category="functional"] .category-description');
      const analyticsDesc = el.shadowRoot!.querySelector('[data-category="analytics"] .category-description');
      const marketingDesc = el.shadowRoot!.querySelector('[data-category="marketing"] .category-description');

      expect(essentialDesc).to.exist;
      expect(functionalDesc).to.exist;
      expect(analyticsDesc).to.exist;
      expect(marketingDesc).to.exist;

      expect(essentialDesc!.textContent).to.include('necessary');
      expect(functionalDesc!.textContent).to.include('improve');
      expect(analyticsDesc!.textContent).to.include('anonymized');
      expect(marketingDesc!.textContent).to.include('advertising');
    });

    it('should have "More info" links for each category', async () => {
      const el = await fixture<GdprCookieBanner>(html`<gdpr-cookie-banner></gdpr-cookie-banner>`);

      const settingsButton = el.shadowRoot!.querySelector('.settings-button') as HTMLElement;
      settingsButton.click();
      await el.updateComplete;

      const moreInfoLinks = el.shadowRoot!.querySelectorAll('.more-info-link');
      expect(moreInfoLinks.length).to.equal(4);

      moreInfoLinks.forEach(link => {
        expect(link.textContent).to.include('More info');
      });
    });

    it('should close settings modal when save button is clicked', async () => {
      const el = await fixture<GdprCookieBanner>(html`<gdpr-cookie-banner></gdpr-cookie-banner>`);

      const settingsButton = el.shadowRoot!.querySelector('.settings-button') as HTMLElement;
      settingsButton.click();
      await el.updateComplete;

      expect(el.shadowRoot!.querySelector('.settings-modal')).to.exist;

      const saveButton = el.shadowRoot!.querySelector('.save-settings-button') as HTMLElement;
      saveButton.click();
      await el.updateComplete;

      expect(el.shadowRoot!.querySelector('.settings-modal')).to.not.exist;
      expect(el.shouldShowBanner()).to.be.false;
    });
  });

  describe('Story 1.4 - Withdraw and Change Preferences', () => {
    beforeEach(() => {
      localStorage.clear();
      // Clear all cookies
      document.cookie.split(";").forEach(function(c) {
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });
    });

    it('should render a permanent accessibility element for cookie settings', async () => {
      // Set up existing consent so banner is hidden
      localStorage.setItem('gdpr-consent', JSON.stringify({
        timestamp: Date.now(),
        accepted: true,
        categories: {
          essential: true,
          functional: true,
          analytics: true,
          marketing: false
        }
      }));

      const el = await fixture<GdprCookieBanner>(html`<gdpr-cookie-banner></gdpr-cookie-banner>`);

      // Should have a permanent cookie settings link/button
      const cookieSettingsElement = el.shadowRoot!.querySelector('.cookie-settings-link');
      expect(cookieSettingsElement).to.exist;
      expect(cookieSettingsElement!.textContent).to.include('Cookie Settings');
    });

    it('should make permanent accessibility element keyboard accessible', async () => {
      localStorage.setItem('gdpr-consent', JSON.stringify({
        timestamp: Date.now(),
        accepted: true
      }));

      const el = await fixture<GdprCookieBanner>(html`<gdpr-cookie-banner></gdpr-cookie-banner>`);

      const cookieSettingsElement = el.shadowRoot!.querySelector('.cookie-settings-link') as HTMLElement;
      expect(cookieSettingsElement).to.exist;
      expect(cookieSettingsElement.tabIndex).to.equal(0);
      expect(cookieSettingsElement.getAttribute('role')).to.equal('button');
    });

    it('should open preferences modal when permanent element is clicked', async () => {
      localStorage.setItem('gdpr-consent', JSON.stringify({
        timestamp: Date.now(),
        accepted: true,
        categories: {
          essential: true,
          functional: true,
          analytics: false,
          marketing: false
        }
      }));

      const el = await fixture<GdprCookieBanner>(html`<gdpr-cookie-banner></gdpr-cookie-banner>`);

      const cookieSettingsElement = el.shadowRoot!.querySelector('.cookie-settings-link') as HTMLElement;
      cookieSettingsElement.click();
      await el.updateComplete;

      const settingsModal = el.shadowRoot!.querySelector('.settings-modal');
      expect(settingsModal).to.exist;
    });

    it('should display current consent status in withdrawal interface', async () => {
      localStorage.setItem('gdpr-consent', JSON.stringify({
        timestamp: Date.now(),
        accepted: true,
        categories: {
          essential: true,
          functional: true,
          analytics: false,
          marketing: true
        }
      }));

      const el = await fixture<GdprCookieBanner>(html`<gdpr-cookie-banner></gdpr-cookie-banner>`);

      const cookieSettingsElement = el.shadowRoot!.querySelector('.cookie-settings-link') as HTMLElement;
      cookieSettingsElement.click();
      await el.updateComplete;

      const functionalToggle = el.shadowRoot!.querySelector('[data-category="functional"] input') as HTMLInputElement;
      const analyticsToggle = el.shadowRoot!.querySelector('[data-category="analytics"] input') as HTMLInputElement;
      const marketingToggle = el.shadowRoot!.querySelector('[data-category="marketing"] input') as HTMLInputElement;

      expect(functionalToggle.checked).to.be.true;
      expect(analyticsToggle.checked).to.be.false;
      expect(marketingToggle.checked).to.be.true;
    });

    it('should delete cookies immediately when category is deactivated', async () => {
      // Set up initial consent with analytics enabled
      localStorage.setItem('gdpr-consent', JSON.stringify({
        timestamp: Date.now(),
        accepted: true,
        categories: {
          essential: true,
          functional: false,
          analytics: true,
          marketing: false
        }
      }));

      // Set some test cookies for analytics category
      document.cookie = '_ga=test_analytics_cookie; path=/';
      document.cookie = '_gid=test_analytics_cookie2; path=/';

      const el = await fixture<GdprCookieBanner>(html`<gdpr-cookie-banner></gdpr-cookie-banner>`);

      // Verify cookies exist initially
      expect(document.cookie).to.include('_ga=test_analytics_cookie');
      expect(document.cookie).to.include('_gid=test_analytics_cookie2');

      // Open settings and disable analytics
      const cookieSettingsElement = el.shadowRoot!.querySelector('.cookie-settings-link') as HTMLElement;
      cookieSettingsElement.click();
      await el.updateComplete;

      const analyticsToggle = el.shadowRoot!.querySelector('[data-category="analytics"] input') as HTMLInputElement;
      analyticsToggle.click();
      await el.updateComplete;

      const saveButton = el.shadowRoot!.querySelector('.save-settings-button') as HTMLElement;
      saveButton.click();
      await el.updateComplete;

      // Analytics cookies should be deleted
      expect(document.cookie).to.not.include('_ga=test_analytics_cookie');
      expect(document.cookie).to.not.include('_gid=test_analytics_cookie2');
    });

    it('should persist changed settings and respect them on return visits', async () => {
      // Initial consent
      localStorage.setItem('gdpr-consent', JSON.stringify({
        timestamp: Date.now(),
        accepted: true,
        categories: {
          essential: true,
          functional: false,
          analytics: true,
          marketing: false
        }
      }));

      const el = await fixture<GdprCookieBanner>(html`<gdpr-cookie-banner></gdpr-cookie-banner>`);

      // Change settings
      const cookieSettingsElement = el.shadowRoot!.querySelector('.cookie-settings-link') as HTMLElement;
      cookieSettingsElement.click();
      await el.updateComplete;

      const functionalToggle = el.shadowRoot!.querySelector('[data-category="functional"] input') as HTMLInputElement;
      const analyticsToggle = el.shadowRoot!.querySelector('[data-category="analytics"] input') as HTMLInputElement;

      functionalToggle.click(); // Enable functional
      analyticsToggle.click(); // Disable analytics
      await el.updateComplete;

      const saveButton = el.shadowRoot!.querySelector('.save-settings-button') as HTMLElement;
      saveButton.click();
      await el.updateComplete;

      // Create new instance to simulate return visit
      const el2 = await fixture<GdprCookieBanner>(html`<gdpr-cookie-banner></gdpr-cookie-banner>`);

      expect(el2.isCategoryEnabled('functional')).to.be.true;
      expect(el2.isCategoryEnabled('analytics')).to.be.false;
    });

    it('should dispatch events when categories are changed via withdrawal interface', async () => {
      localStorage.setItem('gdpr-consent', JSON.stringify({
        timestamp: Date.now(),
        accepted: true,
        categories: {
          essential: true,
          functional: true,
          analytics: true,
          marketing: false
        }
      }));

      const el = await fixture<GdprCookieBanner>(html`<gdpr-cookie-banner></gdpr-cookie-banner>`);

      let categoryChangeEvent: CustomEvent | null = null;
      el.addEventListener('gdpr-category-changed', (e: Event) => {
        categoryChangeEvent = e as CustomEvent;
      });

      const cookieSettingsElement = el.shadowRoot!.querySelector('.cookie-settings-link') as HTMLElement;
      cookieSettingsElement.click();
      await el.updateComplete;

      const analyticsToggle = el.shadowRoot!.querySelector('[data-category="analytics"] input') as HTMLInputElement;
      analyticsToggle.click();
      await el.updateComplete;

      expect(categoryChangeEvent).to.not.be.null;
      expect(categoryChangeEvent!.detail.category).to.equal('analytics');
      expect(categoryChangeEvent!.detail.enabled).to.be.false;
    });
  });

  describe('Story 1.5 - Multilingual and Geo-targeting', () => {
    describe('Geo-targeting functionality', () => {
      it('should detect EU/EEA IP addresses and show GDPR banner', async () => {
        // Mock geolocation service to return EU country
        const el = await fixture<GdprCookieBanner>(html`<gdpr-cookie-banner user-region="EU"></gdpr-cookie-banner>`);

        expect(el.shouldShowBanner()).to.be.true;
        expect(el.shadowRoot!.querySelector('.banner')).to.exist;
        // Should show GDPR-compliant banner with all required elements
        expect(el.shadowRoot!.querySelector('.accept-button')).to.exist;
        expect(el.shadowRoot!.querySelector('.reject-button')).to.exist;
        expect(el.shadowRoot!.querySelector('.settings-button')).to.exist;
      });

      it('should show different banner for US visitors', async () => {
        const el = await fixture<GdprCookieBanner>(html`<gdpr-cookie-banner user-region="US"></gdpr-cookie-banner>`);

        expect(el.shouldShowBanner()).to.be.true;
        // US banner should have different content/structure
        const bannerText = el.shadowRoot!.querySelector('.banner-description')?.textContent;
        expect(bannerText).to.include('Do Not Sell My Personal Information');
      });

      it('should fallback to GDPR banner when region is uncertain', async () => {
        const el = await fixture<GdprCookieBanner>(html`<gdpr-cookie-banner user-region="UNKNOWN"></gdpr-cookie-banner>`);

        expect(el.shouldShowBanner()).to.be.true;
        // Should show strictest (GDPR) banner as fallback
        expect(el.shadowRoot!.querySelector('.accept-button')).to.exist;
        expect(el.shadowRoot!.querySelector('.reject-button')).to.exist;
        expect(el.shadowRoot!.querySelector('.settings-button')).to.exist;
      });

      it('should handle geolocation service errors gracefully', async () => {
        // Mock geolocation service failure
        const el = await fixture<GdprCookieBanner>(html`<gdpr-cookie-banner geolocation-error="true"></gdpr-cookie-banner>`);

        expect(el.shouldShowBanner()).to.be.true;
        // Should fallback to GDPR banner on error
        expect(el.shadowRoot!.querySelector('.banner')).to.exist;
      });
    });

    describe('Multilingual functionality', () => {
      it('should display banner in German when language is set to "de"', async () => {
        const el = await fixture<GdprCookieBanner>(html`<gdpr-cookie-banner language="de"></gdpr-cookie-banner>`);

        const bannerTitle = el.shadowRoot!.querySelector('.banner-title')?.textContent;
        const acceptButton = el.shadowRoot!.querySelector('.accept-button')?.textContent;
        const rejectButton = el.shadowRoot!.querySelector('.reject-button')?.textContent;
        const settingsButton = el.shadowRoot!.querySelector('.settings-button')?.textContent;

        expect(bannerTitle).to.equal('Cookie-Einverständnis');
        expect(acceptButton).to.include('Alle akzeptieren');
        expect(rejectButton).to.include('Alle ablehnen');
        expect(settingsButton).to.include('Einstellungen');
      });

      it('should display banner in English when language is set to "en"', async () => {
        const el = await fixture<GdprCookieBanner>(html`<gdpr-cookie-banner language="en"></gdpr-cookie-banner>`);

        const bannerTitle = el.shadowRoot!.querySelector('.banner-title')?.textContent;
        const acceptButton = el.shadowRoot!.querySelector('.accept-button')?.textContent;
        const rejectButton = el.shadowRoot!.querySelector('.reject-button')?.textContent;
        const settingsButton = el.shadowRoot!.querySelector('.settings-button')?.textContent;

        expect(bannerTitle).to.equal('Cookie Consent');
        expect(acceptButton).to.include('Accept All');
        expect(rejectButton).to.include('Reject All');
        expect(settingsButton).to.include('Settings');
      });

      it('should auto-detect browser language and use appropriate translation', async () => {
        // Mock browser language to German
        Object.defineProperty(navigator, 'language', {
          writable: true,
          value: 'de-DE'
        });

        const el = await fixture<GdprCookieBanner>(html`<gdpr-cookie-banner></gdpr-cookie-banner>`);

        const bannerTitle = el.shadowRoot!.querySelector('.banner-title')?.textContent;
        expect(bannerTitle).to.equal('Cookie-Einverständnis');
      });

      it('should fallback to English for unsupported languages', async () => {
        const el = await fixture<GdprCookieBanner>(html`<gdpr-cookie-banner language="fr"></gdpr-cookie-banner>`);

        const bannerTitle = el.shadowRoot!.querySelector('.banner-title')?.textContent;
        const acceptButton = el.shadowRoot!.querySelector('.accept-button')?.textContent;

        expect(bannerTitle).to.equal('Cookie Consent');
        expect(acceptButton).to.include('Accept All');
      });

      it('should translate settings modal content', async () => {
        const el = await fixture<GdprCookieBanner>(html`<gdpr-cookie-banner language="de"></gdpr-cookie-banner>`);

        const settingsButton = el.shadowRoot!.querySelector('.settings-button') as HTMLButtonElement;
        settingsButton.click();
        await el.updateComplete;

        const settingsTitle = el.shadowRoot!.querySelector('.settings-title')?.textContent;
        const saveButton = el.shadowRoot!.querySelector('.save-settings-button')?.textContent;

        expect(settingsTitle).to.equal('Cookie-Einstellungen');
        expect(saveButton).to.include('Einstellungen speichern');
      });

      it('should translate category names and descriptions', async () => {
        const el = await fixture<GdprCookieBanner>(html`<gdpr-cookie-banner language="de"></gdpr-cookie-banner>`);

        const settingsButton = el.shadowRoot!.querySelector('.settings-button') as HTMLButtonElement;
        settingsButton.click();
        await el.updateComplete;

        const functionalCategory = el.shadowRoot!.querySelector('[data-category="functional"] .category-name')?.textContent;
        const analyticsCategory = el.shadowRoot!.querySelector('[data-category="analytics"] .category-name')?.textContent;

        expect(functionalCategory).to.equal('Funktional');
        expect(analyticsCategory).to.equal('Analytik');
      });
    });

    describe('Combined geo-targeting and multilingual functionality', () => {
      it('should show German GDPR banner for German IP addresses', async () => {
        // Mock German IP and browser language
        Object.defineProperty(navigator, 'language', {
          writable: true,
          value: 'de-DE'
        });

        const el = await fixture<GdprCookieBanner>(html`<gdpr-cookie-banner user-region="DE"></gdpr-cookie-banner>`);

        const bannerTitle = el.shadowRoot!.querySelector('.banner-title')?.textContent;
        expect(bannerTitle).to.equal('Cookie-Einverständnis');
        expect(el.shadowRoot!.querySelector('.accept-button')).to.exist;
        expect(el.shadowRoot!.querySelector('.reject-button')).to.exist;
        expect(el.shadowRoot!.querySelector('.settings-button')).to.exist;
      });

      it('should show English US banner for US IP addresses', async () => {
        Object.defineProperty(navigator, 'language', {
          writable: true,
          value: 'en-US'
        });

        const el = await fixture<GdprCookieBanner>(html`<gdpr-cookie-banner user-region="US"></gdpr-cookie-banner>`);

        const bannerText = el.shadowRoot!.querySelector('.banner-description')?.textContent;
        expect(bannerText).to.include('Do Not Sell My Personal Information');
      });
    });
  });

  describe('Story 2.1 - Set Default Consent Status', () => {
    beforeEach(() => {
      // Clear any existing dataLayer
      (window as any).dataLayer = [];
      // Clear any existing gtag function
      delete (window as any).gtag;
    });

    it('should initialize dataLayer and gtag function on component creation', async () => {
      const el = await fixture<GdprCookieBanner>(html`<gdpr-cookie-banner></gdpr-cookie-banner>`);

      expect((window as any).dataLayer).to.be.an('array');
      expect((window as any).gtag).to.be.a('function');
    });

    it('should set default consent status to denied for all four Google parameters', async () => {
      const el = await fixture<GdprCookieBanner>(html`<gdpr-cookie-banner></gdpr-cookie-banner>`);

      // Check that gtag was called with default consent settings
      const dataLayer = (window as any).dataLayer;
      const consentCall = dataLayer.find((entry: any[]) =>
        entry[0] === 'consent' && entry[1] === 'default'
      );

      expect(consentCall).to.exist;
      expect(consentCall[2]).to.deep.include({
        'ad_storage': 'denied',
        'analytics_storage': 'denied',
        'ad_user_data': 'denied',
        'ad_personalization': 'denied'
      });
    });

    it('should include wait_for_update parameter in default consent', async () => {
      const el = await fixture<GdprCookieBanner>(html`<gdpr-cookie-banner></gdpr-cookie-banner>`);

      const dataLayer = (window as any).dataLayer;
      const consentCall = dataLayer.find((entry: any[]) =>
        entry[0] === 'consent' && entry[1] === 'default'
      );

      expect(consentCall[2]).to.have.property('wait_for_update');
      expect(consentCall[2].wait_for_update).to.be.a('number');
      expect(consentCall[2].wait_for_update).to.be.greaterThan(0);
    });

    it('should set default consent before any other Google tags are loaded', async () => {
      // Mock a scenario where Google tags might be loaded
      let gtagCallOrder: string[] = [];

      (window as any).gtag = (...args: any[]) => {
        if (args[0] === 'consent') {
          gtagCallOrder.push(`consent-${args[1]}`);
        } else {
          gtagCallOrder.push('other-gtag-call');
        }
        (window as any).dataLayer.push(args);
      };

      const el = await fixture<GdprCookieBanner>(html`<gdpr-cookie-banner></gdpr-cookie-banner>`);

      // Simulate other gtag calls that might happen after initialization
      (window as any).gtag('config', 'GA_MEASUREMENT_ID');

      expect(gtagCallOrder[0]).to.equal('consent-default');
    });

    it('should be configurable for basic mode', async () => {
      const el = await fixture<GdprCookieBanner>(html`<gdpr-cookie-banner google-consent-mode="basic"></gdpr-cookie-banner>`);

      const dataLayer = (window as any).dataLayer;
      const consentCall = dataLayer.find((entry: any[]) =>
        entry[0] === 'consent' && entry[1] === 'default'
      );

      expect(consentCall).to.exist;
      // In basic mode, all parameters should still be denied by default
      expect(consentCall[2]).to.deep.include({
        'ad_storage': 'denied',
        'analytics_storage': 'denied',
        'ad_user_data': 'denied',
        'ad_personalization': 'denied'
      });
    });

    it('should be configurable for advanced mode', async () => {
      const el = await fixture<GdprCookieBanner>(html`<gdpr-cookie-banner google-consent-mode="advanced"></gdpr-cookie-banner>`);

      const dataLayer = (window as any).dataLayer;
      const consentCall = dataLayer.find((entry: any[]) =>
        entry[0] === 'consent' && entry[1] === 'default'
      );

      expect(consentCall).to.exist;
      // In advanced mode, all parameters should still be denied by default
      expect(consentCall[2]).to.deep.include({
        'ad_storage': 'denied',
        'analytics_storage': 'denied',
        'ad_user_data': 'denied',
        'ad_personalization': 'denied'
      });
    });

    it('should handle errors gracefully without affecting site functionality', async () => {
      // Mock an error in gtag function
      (window as any).gtag = () => {
        throw new Error('Simulated gtag error');
      };

      let errorThrown = false;
      try {
        const el = await fixture<GdprCookieBanner>(html`<gdpr-cookie-banner></gdpr-cookie-banner>`);
        // Component should still work normally
        expect(el.shouldShowBanner()).to.be.true;
      } catch (error) {
        errorThrown = true;
      }

      expect(errorThrown).to.be.false;
    });

    it('should expose method to get current Google consent status', async () => {
      const el = await fixture<GdprCookieBanner>(html`<gdpr-cookie-banner></gdpr-cookie-banner>`);

      expect(el).to.have.property('getGoogleConsentStatus');
      expect(el.getGoogleConsentStatus).to.be.a('function');

      const status = el.getGoogleConsentStatus();
      expect(status).to.deep.equal({
        'ad_storage': 'denied',
        'analytics_storage': 'denied',
        'ad_user_data': 'denied',
        'ad_personalization': 'denied'
      });
    });
  });
});
