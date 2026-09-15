# Fix notes — what changed and what you still need to do

## 1. WhatsApp number
`src/lib/business.js` now carries **7708946388**.

- `phone: '7708946388'` → used by the `tel:` links
- `whatsapp: '917708946388'` → country code + number, no `+`, no spaces
- `whatsappLink()` strips any stray characters before building the `wa.me`
  URL, so a typo in the number can no longer produce a dead link.

Every WhatsApp button on the site (header pill, floating button, footer,
contact form, "Order now") reads from this one place.

## 2. Login page icons
The three circles under "or continue with" were plain `<span>` elements —
no click handler, nothing to click. They are now real buttons:

| Icon | What it does |
|---|---|
| Mail | Opens an email panel → sends a one-time login link to the address |
| Globe | Google sign-in popup |
| Smartphone | Mobile panel → 6-digit OTP over SMS |

**Turn these on in the Firebase console** (Authentication → Sign-in method),
or they will fail with "this sign-in method is switched off":

1. **Google** → enable.
2. **Email/Password** → open it and switch ON *Email link (passwordless
   sign-in)*.
3. **Phone** → enable. Add a test number under "Phone numbers for testing"
   while you are developing so you do not burn real SMS quota.

Also add your live domain under Authentication → Settings → **Authorized
domains**, otherwise you get `auth/unauthorized-domain`.

A note on wording: Firebase has no built-in 6-digit *email* OTP. What it
offers is a single-use email link, which is what the Mail icon now sends —
same effect, one tap instead of typing a code. A true email OTP would need
your own backend to generate and mail the code. The **phone** OTP is a real
6-digit code.

## 3. Admin order list was empty + no dashboard
Two separate causes:

- **Permissions.** `src/lib/adminConfig.js` still had the placeholder
  `owner@cloudbusiness.com`. Firestore rejects the read for any other
  email, and the page just showed an empty list. Put your real login email
  in **both** `src/lib/adminConfig.js` and the `isAdmin()` function inside
  `firestore.rules`, then publish the rules. The admin page now tells you
  which email you are signed in as when the check fails.
- **Missing `createdAt`.** The query used `orderBy('createdAt')`. Firestore
  silently drops any document that does not have that field, and a freshly
  written `serverTimestamp()` is briefly null on the client. Ordering now
  happens in the browser, so nothing is dropped.

New **Dashboard** tab: total orders, today's orders, pending count, total
value, a status breakdown and the five latest orders.

Customer side (`/account`) now shows a four-stage tracker —
Order received → Preparing → Ready → Delivered — that fills in live as you
change the status in the admin dropdown.

## 4. "My Orders" page broke and scrolled sideways
The Firestore error message contained a very long URL with no spaces. With
nothing telling it to wrap, it stretched the page far past the screen
width, which is why zooming out showed the layout sliding away.

- The index is no longer needed at all: the query is now a single
  `where('uid','==',uid)` with sorting done in the browser, so a composite
  index is not required. You can ignore that console link.
- Error text now wraps (`overflow-wrap: anywhere`) and sits in a proper
  error card.
- `/account` and `/admin` were rendering loose inside `<main>`. They now use
  the same `.page` / `.page-hero` / `.page-body` shell as the rest of the
  site, so the spacing matches every other page.

## 5. How the admin finds out about a new order
Three ways, all live:

1. The customer's "Order now" already opens WhatsApp with the order
   pre-typed to **7708946388** — that message is your first alert.
2. The admin page listens to the orders collection in real time. A new
   order plays a short chime, flashes the browser tab title, and puts a
   red count badge on the Orders tab — no refresh needed.
3. Click **Turn on alerts** once in the admin header to allow desktop
   notifications; after that every new order pops a system notification
   even when the tab is in the background.

Orders now also store `customerName` and `customerPhone` where available,
so the admin row shows who ordered.

## 6. Login page opened at the footer
React Router keeps the previous page's scroll position. Coming from the
bottom of the long homepage to the short login page dropped you straight
onto the footer. A `ScrollToTop` component in `src/App.jsx` now resets the
scroll on every route change (it skips the homepage when it is carrying a
"scroll to this section" instruction, so the menu/about links still work).

## Extras fixed along the way
- **404 on refresh.** `/login` and `/account` would 404 after a hard
  refresh on most static hosts. Added `public/_redirects` (Netlify) and
  `vercel.json` (Vercel) so every path falls back to `index.html`.
- Order status values are now defined once in `src/lib/orderStatus.js`, so
  the customer tracker and the admin dropdown cannot drift apart.
- `isAdminEmail()` was comparing a lowercased input against a list that was
  never lowercased — it now normalises both sides.
- The menu editor showed a blank screen if the menu failed to load; it now
  shows the error.
- Added a favicon and rebuilt `dist/` so it matches the source.

## 7. "Nothing happens when I click in the Orders page"
Two separate things were wrong.

**The control was invisible.** The status picker was
`<select className="admin-field">`, but the CSS rule only matched
`.admin-field select` — a select *inside* an element with that class. A
select that carries the class itself matched nothing, so it rendered as a
bare unstyled native control that reads as plain text. The selector now
matches both forms.

**Failures were silent.** `updateDoc()` had no error handler. When
Firestore rejected the write (the usual cause: your admin email is not in
`firestore.rules`), the value snapped back to what it was and the screen
looked unchanged — exactly like a dead click.

The dropdown is now replaced with four visible stage pills plus a green
"Move to <next stage>" button. The current stage is highlighted, completed
stages are greyed, and every row shows "Saving…", "Updated ✓", or the exact
error text returned by Firestore.

If you see a permission error there, it is the admin-email setup from
section 3 — put your login email in `src/lib/adminConfig.js` and in
`isAdmin()` inside `firestore.rules`, then publish the rules.
