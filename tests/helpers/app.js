/**
 * Owner: Jordan Jacobs
 * Area: shared test harness
 * See: https://github.com/jfrank58-G6/Itis-3200-Project/issues/4
 *
 * Other members import createTestApp / withServer / login from here.
 * Do not break the /vulnerable and /hardened mounts.
 */

const http = require('http');
const { createApp } = require('../../server/app');

function createTestApp() {
  // TODO(jordan): Keep createApp() returning both modes. Session/CSP
  // owners rely on these URL prefixes in their tests.
  return createApp({ forceSecureCookie: true });
}

/**
 * Starts the app on an ephemeral port for one async callback, then closes.
 * @param {import('express').Express} app
 * @param {(baseUrl: string) => Promise<void>} fn
 */
async function withServer(app, fn) {
  const server = http.createServer(app);
  await new Promise((resolve, reject) => {
    server.listen(0, '127.0.0.1', (err) => (err ? reject(err) : resolve()));
  });
  const { port } = server.address();
  const baseUrl = `http://127.0.0.1:${port}`;
  try {
    await fn(baseUrl);
  } finally {
    await new Promise((resolve, reject) => {
      server.close((err) => (err ? reject(err) : resolve()));
    });
  }
}

/**
 * Logs in via the HTML form POST and returns the Response (with Set-Cookie).
 * @param {string} baseUrl
 * @param {'vulnerable' | 'hardened'} mode
 * @param {{ username?: string, password?: string }} [creds]
 */
async function login(baseUrl, mode, creds = {}) {
  const username = creds.username || 'alice';
  const password = creds.password || 'password123';
  const body = new URLSearchParams({ username, password });

  return fetch(`${baseUrl}/${mode}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
    redirect: 'manual',
  });
}

/**
 * Flattens Set-Cookie header(s) into one string for assertions.
 * @param {Headers} headers
 */
function setCookieHeader(headers) {
  if (typeof headers.getSetCookie === 'function') {
    return headers.getSetCookie().join('; ');
  }
  return headers.get('set-cookie') || '';
}

module.exports = {
  createTestApp,
  withServer,
  login,
  setCookieHeader,
};
