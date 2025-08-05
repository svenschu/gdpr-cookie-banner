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
});
