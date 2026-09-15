import { createContext, useContext, useEffect, useState } from "react";

import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";

import { auth } from "../lib/firebase";
import { isAdminEmail } from "../lib/adminConfig";

const AuthContext = createContext(null);

// Where Firebase sends the user back to after they tap the email link.
// The domain must be listed under Firebase Console -> Authentication ->
// Settings -> Authorized domains.
const EMAIL_LINK_SETTINGS = () => ({
  url: `${window.location.origin}/login`,
  handleCodeInApp: true,
});

const EMAIL_LINK_KEY = "emailForSignIn";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return unsubscribe;
  }, []);

  const signIn = (email, password) => {
    return signInWithEmailAndPassword(auth, email.trim(), password);
  };

  const signUp = async (name, email, password) => {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email.trim(),
      password
    );

    if (name) {
      await updateProfile(userCredential.user, { displayName: name });
    }

    return userCredential;
  };

  const forgotPassword = (email) => {
    return sendPasswordResetEmail(auth, email.trim());
  };

  const logOut = () => {
    return signOut(auth);
  };

  // ---------- Google ----------
  // Enable in Firebase Console -> Authentication -> Sign-in method -> Google.
  const googleSignIn = () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });
    return signInWithPopup(auth, provider);
  };

  // ---------- Email one-time link ("email OTP") ----------
  // Firebase's passwordless email method. We mail a single-use link; the
  // address is remembered locally so the return visit finishes sign-in
  // without asking again.
  // Enable in Firebase Console -> Authentication -> Sign-in method ->
  // "Email/Password" -> turn ON "Email link (passwordless sign-in)".
  const sendEmailOtp = async (email) => {
    const clean = email.trim();
    await sendSignInLinkToEmail(auth, clean, EMAIL_LINK_SETTINGS());
    window.localStorage.setItem(EMAIL_LINK_KEY, clean);
  };

  // Called on page load — if the current URL is a sign-in link, finish it.
  const completeEmailOtp = async () => {
    if (!isSignInWithEmailLink(auth, window.location.href)) return null;

    let stored = window.localStorage.getItem(EMAIL_LINK_KEY);

    // Opened on a different device than the one that requested it.
    if (!stored) {
      stored = window.prompt("Please confirm the email you used to sign in:");
      if (!stored) return null;
    }

    const credential = await signInWithEmailLink(
      auth,
      stored.trim(),
      window.location.href
    );

    window.localStorage.removeItem(EMAIL_LINK_KEY);

    // Strip the long ?apiKey=&oobCode=... query off the address bar.
    window.history.replaceState({}, document.title, "/login");

    return credential;
  };

  // ---------- Phone OTP (real 6-digit SMS code) ----------
  // Enable in Firebase Console -> Authentication -> Sign-in method -> Phone.
  // containerId must point at an empty <div> that exists in the DOM.
  const sendPhoneOtp = async (phoneNumber, containerId = "recaptcha-container") => {
    // Re-create the verifier every attempt, otherwise a second "send"
    // fails with auth/internal-error.
    if (window.__recaptchaVerifier) {
      try {
        window.__recaptchaVerifier.clear();
      } catch {
        /* already cleared */
      }
      window.__recaptchaVerifier = null;
    }

    const verifier = new RecaptchaVerifier(auth, containerId, {
      size: "invisible",
    });

    window.__recaptchaVerifier = verifier;

    const digits = String(phoneNumber).replace(/\D/g, "");
    const e164 = digits.length === 10 ? `+91${digits}` : `+${digits}`;

    // confirmationResult.confirm(code) completes the sign-in.
    return signInWithPhoneNumber(auth, e164, verifier);
  };

  const value = {
    user: user ?? null,
    loading: user === undefined,
    isAdmin: user ? isAdminEmail(user.email) : false,
    signIn,
    signUp,
    forgotPassword,
    logOut,
    googleSignIn,
    sendEmailOtp,
    completeEmailOtp,
    sendPhoneOtp,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return ctx;
}
