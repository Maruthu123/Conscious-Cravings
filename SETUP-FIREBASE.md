# Setting up login, menu-editing and order tracking (Firebase)

This React app uses **Firebase** (free tier — "Spark" plan, no credit card
needed) for three things:

1. **Login** — customers and you (admin) both log in with email + password.
2. **Menu editing** — `/admin` lets you edit dishes, prices, photos and
   categories. Changes appear on the live site instantly.
3. **Order tracking** — when a customer taps "Order now", the order is saved
   with a status (Order received → Food preparation started → Ready for
   delivery → Delivered). They can watch it update live on `/account`.
   You update the status from `/admin`.

Follow these steps once. It takes about 10–15 minutes.

---

## 1. Create a Firebase project

1. Go to <https://console.firebase.google.com> and sign in with any Google
   account.
2. Click **Add project**. Give it a name (e.g. "cloud-business"). You can
   turn off Google Analytics for this project — not needed.
3. Click **Create project** and wait for it to finish.

## 2. Register a Web app

1. On your new project's home screen, click the **`</>`** (Web) icon to add
   a web app.
2. Give it a nickname (e.g. "Cloud Business site") and click **Register
   app**. You do **not** need Firebase Hosting for this step.
3. Firebase will show you a code block containing a `firebaseConfig`
   object. Copy it into **`src/lib/firebase.js`** in this project, replacing
   the placeholder values.

## 3. Turn on Email/Password login

1. In the Firebase Console, open **Build → Authentication**.
2. Click **Get started**, then enable the **Email/Password** provider.

## 4. Create Firestore

1. Open **Build → Firestore Database → Create database**.
2. Start in **production mode** (the security rules below lock it down).

## 5. Deploy the security rules

`firestore.rules` at the project root controls who can read/write the
`menu` and `orders` collections. In the Firebase Console, open
**Build → Firestore Database → Rules**, paste the contents of that file in,
and click **Publish**.

**Important:** replace `owner@cloudbusiness.com` in `firestore.rules` with
your real admin email, and make the same change in
`src/lib/adminConfig.js` (`ADMIN_EMAILS`) — the two must match exactly.

## 6. Run the app

```bash
npm install
npm run dev
```

Then open the printed local URL. `npm run build` produces a production
build in `dist/` that you can deploy anywhere (Firebase Hosting, Vercel,
Netlify, etc).
