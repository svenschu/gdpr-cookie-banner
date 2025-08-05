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
});
