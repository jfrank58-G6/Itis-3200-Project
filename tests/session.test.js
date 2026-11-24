/**
 * Owner: Quis Franklin
 * Issue: https://github.com/jfrank58-G6/Itis-3200-Project/issues/1
 * Expected results for session cookie flags.
 * These fail until server/session TODOs are finished.
 */

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const {
  createTestApp,
  withServer,
  login,
  setCookieHeader,
} = require('./helpers/app');

describe('session cookies (Quis)', () => {
  it('vulnerable login Set-Cookie for sid.vuln does not include HttpOnly', async () => {
    const app = createTestApp();
    await withServer(app, async (baseUrl) => {
      const res = await login(baseUrl, 'vulnerable');
      assert.ok(res.status === 302 || res.status === 303, `expected redirect, got ${res.status}`);

      const cookie = setCookieHeader(res.headers);
      assert.match(cookie, /sid\.vuln=/i, 'expected sid.vuln cookie');
      assert.doesNotMatch(
        cookie,
        /HttpOnly/i,
        'vulnerable cookie must be readable from document.cookie (no HttpOnly)',
      );
    });
  });

  it('hardened login Set-Cookie for sid.hard includes HttpOnly, SameSite=Strict, Secure', async () => {
    const app = createTestApp();
    await withServer(app, async (baseUrl) => {
      const res = await login(baseUrl, 'hardened');
      assert.ok(res.status === 302 || res.status === 303, `expected redirect, got ${res.status}`);

      const cookie = setCookieHeader(res.headers);
      assert.match(cookie, /sid\.hard=/i, 'expected sid.hard cookie');
      assert.match(cookie, /HttpOnly/i, 'hardened cookie must be HttpOnly');
      assert.match(cookie, /SameSite=Strict/i, 'hardened cookie must use SameSite=Strict');
      assert.match(cookie, /Secure/i, 'hardened cookie must be Secure');
    });
  });
});
