/**
 * Owner: Jordan Jacobs
 * Area: shared route wiring for /vulnerable and /hardened
 * See: https://github.com/jfrank58-G6/Itis-3200-Project/issues/4
 */

const path = require('path');
const express = require('express');
const store = require('./store');

/**
 * Builds an Express router for one mode (vulnerable or hardened).
 * @param {'vulnerable' | 'hardened'} mode
 */
function createRoutes(mode) {
  const router = express.Router();
  const publicDir = path.join(__dirname, '..', 'public', mode);

  router.use(express.urlencoded({ extended: false }));
  router.use(express.json());
  router.use(express.static(publicDir));

  router.get('/', (_req, res) => {
    res.redirect('login');
  });

  router.get('/login', (_req, res) => {
    res.sendFile(path.join(publicDir, 'login.html'));
  });

  // TODO(jordan): Confirm login sets req.session.username and redirects
  // to /profile/:username. Demo users are alice/password123 and bob/password123.
  router.post('/login', (req, res) => {
    const username = String(req.body.username || '').trim();
    const password = String(req.body.password || '');

    if (!store.checkCredentials(username, password)) {
      res.status(401).send('Bad username or password. Try alice / password123.');
      return;
    }

    req.session.username = username;
    res.redirect(`profile/${encodeURIComponent(username)}`);
  });

  router.get('/profile/:username', (req, res) => {
    const username = req.params.username;
    if (!store.findUser(username)) {
      res.status(404).send('User not found');
      return;
    }
    res.sendFile(path.join(publicDir, 'profile.html'));
  });

  // JSON used by profile.js fetch()
  router.get('/api/profile/:username', (req, res) => {
    const username = req.params.username;
    const bio = store.getBio(username);
    if (bio === null) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.json({ username, bio });
  });

  // TODO(jordan): Keep auth check: only the logged-in user updates their own bio.
  router.post('/api/profile/bio', (req, res) => {
    if (!req.session || !req.session.username) {
      res.status(401).json({ error: 'Login required' });
      return;
    }

    const username = req.session.username;
    const bio = String(req.body.bio ?? '');
    store.setBio(username, bio);
    res.json({ username, bio });
  });

  return router;
}

module.exports = { createRoutes };
