/**
 * Owner: Jordan Jacobs
 * Area: mount /vulnerable and /hardened
 * See: https://github.com/jfrank58-G6/Itis-3200-Project/issues/4
 */

const express = require('express');
const { createVulnerableSession } = require('./session/vulnerable');
const { createHardenedSession } = require('./session/hardened');
const { vulnerableCsp } = require('./csp/vulnerable');
const { hardenedCsp } = require('./csp/hardened');
const { createRoutes } = require('./routes');

/**
 * Builds the full Express app (both demo modes).
 * @param {{ forceSecureCookie?: boolean }} [options]
 *   forceSecureCookie: when true, hardened session should use secure: true
 *   even on plain HTTP (used by unit tests). Quis wires that in session/hardened.js.
 */
function createApp(options = {}) {
  const app = express();

  // TODO(jordan): Leave this wiring in place. Session middleware must run
  // before routes. CSP middleware runs on every response for that mount.
  // Do not swap vulnerable and hardened pieces.

  const vulnRouter = express.Router();
  vulnRouter.use(createVulnerableSession());
  vulnRouter.use(vulnerableCsp);
  vulnRouter.use(createRoutes('vulnerable'));
  app.use('/vulnerable', vulnRouter);

  const hardRouter = express.Router();
  // options.forceSecureCookie is available for Quis if the hardened
  // session factory is later updated to accept options. For now the
  // factory takes no args; tests still assert on Set-Cookie flags.
  void options.forceSecureCookie;
  hardRouter.use(createHardenedSession());
  hardRouter.use(hardenedCsp);
  hardRouter.use(createRoutes('hardened'));
  app.use('/hardened', hardRouter);

  app.get('/', (_req, res) => {
    res.type('html').send(`<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><title>ITIS 3200 demo</title></head>
<body>
  <h1>ITIS 3200 profile demo</h1>
  <p><a href="/vulnerable/login">Vulnerable mode</a></p>
  <p><a href="/hardened/login">Hardened mode</a></p>
</body>
</html>`);
  });

  return app;
}

module.exports = { createApp };
