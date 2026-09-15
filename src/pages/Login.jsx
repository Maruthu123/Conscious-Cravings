import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  Lock,
  ArrowRight,
  Eye,
  EyeOff,
  ChefHat,
  Check,
  Smartphone,
  Globe,
  ArrowLeft,
  ShieldCheck,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import { isAdminEmail } from "../lib/adminConfig";

import "./Login.css";

export default function Login() {
  const {
    user,
    signIn,
    signUp,
    forgotPassword,
    googleSignIn,
    sendEmailOtp,
    completeEmailOtp,
    sendPhoneOtp,
  } = useAuth();

  const location = useLocation();
  const navigate = useNavigate();

  const [mode, setMode] = useState("login");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [terms, setTerms] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ---- alternate sign-in panels: null | "email" | "phone" ----
  const [panel, setPanel] = useState(null);

  const [otpEmail, setOtpEmail] = useState("");
  const [emailLinkSent, setEmailLinkSent] = useState(false);

  const [otpPhone, setOtpPhone] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const confirmationRef = useRef(null);
  const [otpSent, setOtpSent] = useState(false);

  // Only follow an explicit redirect (e.g. someone tried to place an
  // order or open "My Orders" while signed out). Otherwise send the
  // person to their dashboard — Admin panel for admins, "My Orders"
  // for everyone else.
  const explicitRedirect = location.state?.redirect;
  const scrollTo = location.state?.scrollTo;

  function destinationFor(loggedInUser) {
    if (explicitRedirect) return explicitRedirect;
    return isAdminEmail(loggedInUser?.email) ? "/admin" : "/account";
  }

  // The login page must always open at the top of the card, never at
  // whatever scroll position the previous page was left at.
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  // If this page was opened from an email sign-in link, finish the login.
  useEffect(() => {
    completeEmailOtp()
      .then((cred) => {
        if (cred) setSuccess("Signed in with your email link.");
      })
      .catch((err) => setError(getFirebaseError(err.code)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (user) {
      navigate(destinationFor(user), {
        state: scrollTo ? { scrollTo } : undefined,
        replace: true,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, navigate, explicitRedirect, scrollTo]);

  const getFirebaseError = (code) => {
    switch (code) {
      case "auth/invalid-email":
        return "Please enter a valid email address.";
      case "auth/user-not-found":
        return "No account found with this email.";
      case "auth/wrong-password":
        return "Incorrect password. Please try again.";
      case "auth/invalid-credential":
        return "Incorrect email or password.";
      case "auth/email-already-in-use":
        return "This email is already registered.";
      case "auth/weak-password":
        return "Password must contain at least 6 characters.";
      case "auth/network-request-failed":
        return "Network error. Please check your internet connection.";
      case "auth/too-many-requests":
        return "Too many attempts. Please try again later.";
      case "auth/popup-closed-by-user":
        return "Sign-in window was closed before finishing.";
      case "auth/popup-blocked":
        return "Your browser blocked the popup. Allow popups and try again.";
      case "auth/unauthorized-domain":
        return "This domain is not authorised in Firebase Authentication settings.";
      case "auth/operation-not-allowed":
        return "This sign-in method is switched off in the Firebase console.";
      case "auth/invalid-phone-number":
        return "Enter a valid 10-digit mobile number.";
      case "auth/invalid-verification-code":
        return "That code is incorrect. Please check and try again.";
      case "auth/code-expired":
        return "The code expired. Please request a new one.";
      case "auth/missing-email":
        return "Please enter your email first.";
      default:
        return "Something went wrong. Please try again.";
    }
  };

  function resetMessages() {
    setError("");
    setSuccess("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    resetMessages();

    if (mode === "signup") {
      if (!name.trim()) {
        setError("Please enter your name.");
        return;
      }
      if (password.length < 6) {
        setError("Password must contain at least 6 characters.");
        return;
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
      if (!terms) {
        setError("Please accept the Terms & Conditions.");
        return;
      }
    }

    try {
      setLoading(true);

      let credential;

      if (mode === "login") {
        credential = await signIn(email, password);
      } else {
        credential = await signUp(name, email, password);
        setSuccess("Account created successfully!");
      }

      navigate(destinationFor(credential.user), {
        state: scrollTo ? { scrollTo } : undefined,
        replace: true,
      });
    } catch (err) {
      setError(getFirebaseError(err.code));
    } finally {
      setLoading(false);
    }
  }

  async function handleForgotPassword() {
    resetMessages();

    if (!email.trim()) {
      setError("Please enter your email first.");
      return;
    }

    try {
      setLoading(true);
      await forgotPassword(email);
      setSuccess("Password reset link has been sent to your email.");
    } catch (err) {
      setError(getFirebaseError(err.code));
    } finally {
      setLoading(false);
    }
  }

  // ---------- social / alternate sign-in ----------

  async function handleGoogle() {
    resetMessages();
    try {
      setLoading(true);
      const credential = await googleSignIn();
      navigate(destinationFor(credential.user), { replace: true });
    } catch (err) {
      setError(getFirebaseError(err.code));
    } finally {
      setLoading(false);
    }
  }

  function openPanel(which) {
    resetMessages();
    setPanel(which);
    setEmailLinkSent(false);
    setOtpSent(false);
    setOtpCode("");
    if (which === "email" && !otpEmail) setOtpEmail(email);
  }

  function closePanel() {
    resetMessages();
    setPanel(null);
    setEmailLinkSent(false);
    setOtpSent(false);
    setOtpCode("");
    confirmationRef.current = null;
  }

  async function handleSendEmailLink() {
    resetMessages();

    if (!otpEmail.trim()) {
      setError("Please enter your email address.");
      return;
    }

    try {
      setLoading(true);
      await sendEmailOtp(otpEmail);
      setEmailLinkSent(true);
      setSuccess("Login link sent. Open your inbox and tap it to sign in.");
    } catch (err) {
      setError(getFirebaseError(err.code));
    } finally {
      setLoading(false);
    }
  }

  async function handleSendPhoneOtp() {
    resetMessages();

    const digits = otpPhone.replace(/\D/g, "");
    if (digits.length < 10) {
      setError("Enter a valid 10-digit mobile number.");
      return;
    }

    try {
      setLoading(true);
      confirmationRef.current = await sendPhoneOtp(digits, "recaptcha-container");
      setOtpSent(true);
      setSuccess("OTP sent by SMS. Enter the 6-digit code below.");
    } catch (err) {
      setError(getFirebaseError(err.code));
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyPhoneOtp() {
    resetMessages();

    if (otpCode.trim().length < 6) {
      setError("Enter the full 6-digit code.");
      return;
    }

    try {
      setLoading(true);
      const credential = await confirmationRef.current.confirm(otpCode.trim());
      navigate(destinationFor(credential.user), { replace: true });
    } catch (err) {
      setError(getFirebaseError(err.code));
    } finally {
      setLoading(false);
    }
  }

  function changeMode(newMode) {
    setMode(newMode);
    resetMessages();
    setPassword("");
    setConfirmPassword("");
  }

  const messages = (
    <>
      {error && <p className="message error-message">{error}</p>}
      {success && <p className="message success-message">{success}</p>}
    </>
  );

  return (
    <main className="waitly-auth-page">
      {/* decorative food-photo blobs, purely visual */}
      <div className="bg-blob bg-blob-top" />
      <div className="bg-blob bg-blob-bottom" />

      {/* invisible reCAPTCHA host required by Firebase phone auth */}
      <div id="recaptcha-container" />

      <motion.div
        className="auth-card"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="brand-badge">
          <div className="brand-badge-icon">
            <ChefHat size={30} strokeWidth={1.8} />
          </div>

          <h1>Waitly</h1>
          <p>YOUR TABLE, YOUR TIME</p>
        </div>

        <AnimatePresence mode="wait">
          {panel === null && (
            <motion.div
              key="main"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="auth-heading">
                <h2>
                  {mode === "login" ? "Welcome back!" : "Create your account"}
                </h2>
                <p>
                  {mode === "login"
                    ? "Sign in to keep your dineline"
                    : "Join us and start your dineline"}
                </p>
              </div>

              <div className="auth-tabs">
                <button
                  className={mode === "login" ? "active" : ""}
                  onClick={() => changeMode("login")}
                >
                  Login
                </button>

                <button
                  className={mode === "signup" ? "active" : ""}
                  onClick={() => changeMode("signup")}
                >
                  Sign Up
                </button>
              </div>

              <form onSubmit={handleSubmit} className="auth-form">
                {mode === "signup" && (
                  <div className="auth-field">
                    <User size={19} />
                    <input
                      type="text"
                      placeholder="Your Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                )}

                <div className="auth-field">
                  <Mail size={19} />
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="auth-field password-field">
                  <Lock size={19} />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {mode === "signup" && (
                  <div className="auth-field password-field">
                    <Lock size={19} />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                )}

                {mode === "login" && (
                  <div className="form-utility-row">
                    <button
                      type="button"
                      className="forgot-link"
                      onClick={handleForgotPassword}
                    >
                      Forgot Password?
                    </button>
                  </div>
                )}

                {mode === "signup" && (
                  <label className="terms-row">
                    <input
                      type="checkbox"
                      checked={terms}
                      onChange={(e) => setTerms(e.target.checked)}
                    />
                    <span className="terms-box">
                      <Check size={12} />
                    </span>
                    I agree with Terms &amp; Conditions
                  </label>
                )}

                {messages}

                <motion.button
                  type="submit"
                  className="submit-btn"
                  disabled={loading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                >
                  {loading ? (
                    "Please wait..."
                  ) : (
                    <>
                      {mode === "login" ? "Login" : "Sign Up"}
                      <ArrowRight size={18} />
                    </>
                  )}
                </motion.button>
              </form>

              <div className="auth-divider">or continue with</div>

              <div className="social-row">
                <button
                  type="button"
                  className="social-btn"
                  disabled={loading}
                  onClick={() => openPanel("email")}
                  aria-label="Sign in with an email login link"
                  title="Email login link"
                >
                  <Mail size={17} />
                </button>

                <button
                  type="button"
                  className="social-btn"
                  disabled={loading}
                  onClick={handleGoogle}
                  aria-label="Sign in with Google"
                  title="Google"
                >
                  <Globe size={17} />
                </button>

                <button
                  type="button"
                  className="social-btn"
                  disabled={loading}
                  onClick={() => openPanel("phone")}
                  aria-label="Sign in with a mobile OTP"
                  title="Mobile OTP"
                >
                  <Smartphone size={17} />
                </button>
              </div>

              <div className="bottom-switch">
                {mode === "login" ? (
                  <>
                    Don&apos;t have an account?
                    <button onClick={() => changeMode("signup")}>Sign Up</button>
                  </>
                ) : (
                  <>
                    Already have an account?
                    <button onClick={() => changeMode("login")}>Login</button>
                  </>
                )}
              </div>
            </motion.div>
          )}

          {/* ---------- Email login-link panel ---------- */}
          {panel === "email" && (
            <motion.div
              key="email"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.22 }}
            >
              <button type="button" className="panel-back" onClick={closePanel}>
                <ArrowLeft size={16} /> Back
              </button>

              <div className="auth-heading">
                <h2>Sign in with email</h2>
                <p>
                  We&apos;ll email you a one-time login link — no password
                  needed.
                </p>
              </div>

              <div className="auth-form">
                <div className="auth-field">
                  <Mail size={19} />
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={otpEmail}
                    onChange={(e) => setOtpEmail(e.target.value)}
                  />
                </div>

                {messages}

                <motion.button
                  type="button"
                  className="submit-btn"
                  disabled={loading}
                  onClick={handleSendEmailLink}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                >
                  {loading
                    ? "Please wait..."
                    : emailLinkSent
                      ? "Resend login link"
                      : "Send login link"}
                  {!loading && <ArrowRight size={18} />}
                </motion.button>

                {emailLinkSent && (
                  <p className="panel-hint">
                    Open the mail on this same device so the sign-in completes
                    automatically. Check the spam folder if it hasn&apos;t
                    arrived in a minute.
                  </p>
                )}
              </div>
            </motion.div>
          )}

          {/* ---------- Mobile OTP panel ---------- */}
          {panel === "phone" && (
            <motion.div
              key="phone"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.22 }}
            >
              <button type="button" className="panel-back" onClick={closePanel}>
                <ArrowLeft size={16} /> Back
              </button>

              <div className="auth-heading">
                <h2>Sign in with mobile</h2>
                <p>We&apos;ll text you a 6-digit code.</p>
              </div>

              <div className="auth-form">
                <div className="auth-field">
                  <Smartphone size={19} />
                  <input
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    placeholder="10-digit mobile number"
                    value={otpPhone}
                    disabled={otpSent}
                    onChange={(e) => setOtpPhone(e.target.value)}
                  />
                </div>

                {otpSent && (
                  <div className="auth-field">
                    <ShieldCheck size={19} />
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      placeholder="6-digit OTP"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                    />
                  </div>
                )}

                {messages}

                <motion.button
                  type="button"
                  className="submit-btn"
                  disabled={loading}
                  onClick={otpSent ? handleVerifyPhoneOtp : handleSendPhoneOtp}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                >
                  {loading
                    ? "Please wait..."
                    : otpSent
                      ? "Verify & sign in"
                      : "Send OTP"}
                  {!loading && <ArrowRight size={18} />}
                </motion.button>

                {otpSent && (
                  <button
                    type="button"
                    className="panel-back"
                    style={{ marginTop: 14 }}
                    onClick={() => {
                      setOtpSent(false);
                      setOtpCode("");
                      resetMessages();
                    }}
                  >
                    Change number
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </main>
  );
}
