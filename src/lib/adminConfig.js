// ===================== ADMIN EMAILS =====================
// Anyone who logs in (Firebase Auth) with one of these email addresses is
// treated as an admin — they see the Admin link in the nav and can open
// /admin to edit the menu and update order status.
//
// >>> ACTION NEEDED <<<
// Put YOUR real login email below, in lowercase. The same address must
// also go inside firestore.rules -> isAdmin(), because that is what
// actually enforces it on the server. If the two lists do not match, the
// Admin page loads but the order list comes back empty with a
// "Missing or insufficient permissions" error.
//
// After editing firestore.rules, deploy it:
//     firebase deploy --only firestore:rules
// (or paste the file into Firebase Console -> Firestore -> Rules -> Publish)
export const ADMIN_EMAILS = [
  'owner@cloudbusiness.com', // <-- replace with your real email
];

export function isAdminEmail(email) {
  if (!email) return false;
  return ADMIN_EMAILS.map((e) => e.toLowerCase()).includes(
    email.trim().toLowerCase()
  );
}
