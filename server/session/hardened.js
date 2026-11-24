/**
 * Owner: Quis Franklin
 * Area: session cookie flags (hardened)
 * See: https://github.com/jfrank58-G6/Itis-3200-Project/issues/1
 */

const session = require('express-session');

/**
 * Returns express-session middleware for the /hardened app.
 *
 * Cookie name must be sid.hard.
 * Hardened flags: httpOnly, secure, sameSite strict.
 */
function createHardenedSession() {
  // TODO(quis): Finish cookie options for the hardened demo.
  // Requirements for tests/session.test.js:
  // - name: 'sid.hard'
  // - httpOnly: true
  // - secure: true
  // - sameSite: 'strict'
  // Tip: for local HTTP demos you may need app.set('trust proxy', 1) and
  // cookie.secure only when NODE_ENV === 'production', but the unit tests
  // call this with production-like options (see tests/helpers).
  return session({
    name: 'sid.hard',
    secret: 'itis-3200-hardened-demo-secret',
    resave: false,
    saveUninitialized: false,
    // cookie: { ... }  <-- fill this in
  });
}

module.exports = { createHardenedSession };
