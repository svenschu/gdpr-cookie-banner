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

  it('passes the a11y audit', async () => {
    const el = await fixture<GdprCookieBanner>(html`<gdpr-cookie-banner></gdpr-cookie-banner>`);

    await expect(el).shadowDom.to.be.accessible();
  });
});
