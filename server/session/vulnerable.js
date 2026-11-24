/**
 * Owner: Quis Franklin
 * Area: session cookie flags (vulnerable / broken demo)
 * See: https://github.com/jfrank58-G6/Itis-3200-Project/issues/1
 */

const session = require('express-session');

/**
 * Returns express-session middleware for the /vulnerable app.
 *
 * Cookie name must be sid.vuln so it does not clash with hardened.
 * For the broken demo the session cookie must be readable from
 * document.cookie (HttpOnly off).
 */
function createVulnerableSession() {
  // TODO(quis): Finish cookie options for the vulnerable demo.
  // Requirements for tests/session.test.js:
  // - name: 'sid.vuln'
  // - httpOnly: false  (JS in the page can read document.cookie)
  // - You can leave secure/sameSite loose here; this path is meant to be weak.
  // Right now this uses bare defaults, so the vulnerable cookie assertion fails.
  return session({
    name: 'sid.vuln',
    secret: 'itis-3200-vulnerable-demo-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: false,
    },
  });
}

module.exports = { createVulnerableSession };
