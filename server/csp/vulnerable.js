/**
 * Owner: Sean Hicks
 * Area: Content-Security-Policy (vulnerable / omit header)
 * See: https://github.com/jfrank58-G6/Itis-3200-Project/issues/2
 */

/**
 * Middleware for /vulnerable. This path should NOT send a CSP header
 * so the stolen-cookie fetch() in the XSS payload is not blocked by CSP.
 */
function vulnerableCsp(_req, _res, next) {
  // TODO(sean): Keep this as a no-op (do not set Content-Security-Policy).
  // tests/csp.test.js expects the vulnerable profile response to have
  // no Content-Security-Policy header at all.
  //
  // Intentionally broken stub: sets a wrong header so the test fails
  // until you replace this with a plain next() pass-through.
  _res.setHeader('Content-Security-Policy', 'default-src *');
  next();
}

module.exports = { vulnerableCsp };
