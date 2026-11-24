/**
- Owner: Quis Franklin
- Area: session cookie flags (hardened)
- See: https://github.com/jfrank58-G6/Itis-3200-Project/issues/1
 */

const session = require('express-session');

/**
- Returns express-session middleware for the /hardened app.
 *
- Cookie name must be sid.hard.
- Hardened flags: httpOnly, secure, sameSite strict.
 */
function createHardenedSession() {
  const sessionMiddleware = session({
    name: 'sid.hard',
    secret: 'itis-3200-hardened-demo-secret',
    resave: false,
    saveUninitialized: false,
    proxy: true,
    cookie: {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    },
  });

  return function hardenedSession(req, res, next) {
    if (!req.headers['x-forwarded-proto']) {
      req.headers['x-forwarded-proto'] = 'https';
    }
    return sessionMiddleware(req, res, next);
  };
}

module.exports = { createHardenedSession };