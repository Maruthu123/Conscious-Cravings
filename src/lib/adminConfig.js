// ===================== ADMIN EMAILS =====================
// Anyone who logs in (Firebase Auth) with one of these email addresses is
// treated as an admin — they see the Admin link in the nav and can open
// /admin to edit the menu and update order status.
//
// IMPORTANT: this list must exactly match the list inside firestore.rules
// (the `isAdmin()` function) — that's what actually enforces it on the
// server. This file only controls what the *website* shows; the Firestore
// rules are what actually stop a non-admin from writing menu/order changes.
export const ADMIN_EMAILS = [
  'owner@cloudbusiness.com', // <-- replace with your real email
];

export function isAdminEmail(email) {
  return !!email && ADMIN_EMAILS.includes(email.toLowerCase());
}
