/**
 * Owner: Zaheir Carillo
 * Area: DOM rendering (hardened = safe)
 * See: https://github.com/jfrank58-G6/Itis-3200-Project/issues/3
 *
 * This file runs in the browser and is also required by tests/render.test.js.
 */

/**
 * Safe render helper: bio must show as plain text, not executable HTML.
 * For unit tests this returns an escaped string. In the page we prefer
 * textContent, which never parses HTML.
 * @param {string} bio
 * @returns {string}
 */
function renderBioSafe(bio) {
  // TODO(zaheir): Escape <, >, and & so a <script> payload cannot stay as markup.
  // tests/render.test.js expects the result NOT to contain the substring "<script".
  //
  // Stub on purpose returns the raw string so the test fails until you fix it.
  return String(bio);
}

/**
 * Apply bio into the page (hardened path).
 * @param {HTMLElement} el
 * @param {string} bio
 */
function applyBioToPage(el, bio) {
  // TODO(zaheir): Use element.textContent (not innerHTML) so the bio
  // cannot run as HTML/JS. You can still call renderBioSafe for the tests.
  el.innerHTML = renderBioSafe(bio);
}

function usernameFromPath() {
  const parts = window.location.pathname.split('/').filter(Boolean);
  return decodeURIComponent(parts[parts.length - 1] || '');
}

async function loadProfile() {
  const username = usernameFromPath();
  document.getElementById('username').textContent = username;

  const res = await fetch(`api/profile/${encodeURIComponent(username)}`);
  if (!res.ok) {
    document.getElementById('status').textContent = 'Could not load profile.';
    return;
  }
  const data = await res.json();
  applyBioToPage(document.getElementById('bio'), data.bio);
  document.getElementById('bio-input').value = data.bio;
}

async function saveBio(event) {
  event.preventDefault();
  const bio = document.getElementById('bio-input').value;
  const res = await fetch('api/profile/bio', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ bio }),
  });
  const status = document.getElementById('status');
  if (!res.ok) {
    status.textContent = 'Save failed. Are you logged in as this user?';
    return;
  }
  const data = await res.json();
  applyBioToPage(document.getElementById('bio'), data.bio);
  status.textContent = 'Saved.';
}

if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    loadProfile();
    document.getElementById('bio-form').addEventListener('submit', saveBio);
  });
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { renderBioSafe, applyBioToPage };
}
