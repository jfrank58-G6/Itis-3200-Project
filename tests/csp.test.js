/**
 * Owner: Sean Hicks
 * Issue: https://github.com/jfrank58-G6/Itis-3200-Project/issues/2
 * Expected results for Content-Security-Policy.
 * These fail until server/csp TODOs are finished.
 */

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { createTestApp, withServer } = require('./helpers/app');

const EXPECTED_CSP = "default-src 'self'; script-src 'self'";

describe('CSP headers (Sean)', () => {
  it('vulnerable profile response has no Content-Security-Policy header', async () => {
    const app = createTestApp();
    await withServer(app, async (baseUrl) => {
      const res = await fetch(`${baseUrl}/vulnerable/profile/alice`);
      assert.equal(res.status, 200);
      const csp = res.headers.get('content-security-policy');
      assert.equal(
        csp,
        null,
        'vulnerable mode must omit Content-Security-Policy so the XSS fetch is not blocked by CSP',
      );
    });
  });

  it('hardened profile response sets the expected CSP', async () => {
    const app = createTestApp();
    await withServer(app, async (baseUrl) => {
      const res = await fetch(`${baseUrl}/hardened/profile/alice`);
      assert.equal(res.status, 200);
      const csp = res.headers.get('content-security-policy');
      assert.equal(
        csp,
        EXPECTED_CSP,
        `hardened CSP must be exactly: ${EXPECTED_CSP}`,
      );
    });
  });
});
