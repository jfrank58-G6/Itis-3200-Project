/**
 * Owner: Sean Hicks
 * Area: Content-Security-Policy (hardened)
 * See: https://github.com/jfrank58-G6/Itis-3200-Project/issues/2
 */

/**
 * Middleware for /hardened. Must set:
 *   Content-Security-Policy: default-src 'self'; script-src 'self'
 * That blocks inline script and outbound fetch() to attacker.com.
 */
function hardenedCsp(_req, _res, next) {
  // TODO(sean): Set the CSP header to exactly:
  //   default-src 'self'; script-src 'self'
  // Then call next().
  // tests/csp.test.js checks for that exact string.
  next();
}

module.exports = { hardenedCsp };
