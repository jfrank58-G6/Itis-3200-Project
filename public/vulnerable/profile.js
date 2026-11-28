/**
 * Owner: Zaheir Carillo
 * Area: DOM rendering (vulnerable = unsafe)
 * See: https://github.com/jfrank58-G6/Itis-3200-Project/issues/3
 *
 * This file runs in the browser and is also required by tests/render.test.js.
 */

/**
 * Unsafe render helper: should put raw bio HTML into a string that
 * would execute if assigned with innerHTML.
 * @param {string} bio
 * @returns {string}
 */
function renderBioUnsafe(bio) {
  // TODO(zaheir): Return the bio string unchanged so a <script> tag
  // in the bio stays as real markup when used with innerHTML.
  // tests/render.test.js expects the returned string to still contain "<script".
  //
  // Stub on purpose returns escaped junk so the test fails until you fix it.
  return String(bio ?? '');
}

/**
 * Apply bio into the page (vulnerable path).
 * @param {HTMLElement} el
 * @param {string} bio
 */
function applyBioToPage(el, bio) {
  // TODO(zaheir): Use innerHTML with renderBioUnsafe(bio) so stored XSS runs.
  // Example once helpers are done: el.innerHTML = renderBioUnsafe(bio);
  el.innerHTML = renderBioUnsafe(bio);
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
  module.exports = { renderBioUnsafe, applyBioToPage };
}
