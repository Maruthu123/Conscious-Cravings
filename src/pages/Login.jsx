import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  ArrowRight,
  Utensils,
  Sparkles,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import { isAdminEmail } from "../lib/adminConfig";

import "./Login.css";

export default function Login() {
  const { user, signIn, signUp, forgotPassword } = useAuth();

  const location = useLocation();
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [terms, setTerms] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Redirect: explicit redirect if given, else admin -> /admin, others -> /account
  const explicitRedirect = location.state?.redirect;
  const scrollTo = location.state?.scrollTo;

  function destinationFor(loggedInUser) {
    if (explicitRedirect) return explicitRedirect;
    return isAdminEmail(loggedInUser?.email) ? "/admin" : "/account";
  }

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  // If user is already logged in, move to the website
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

  function changeMode(loginMode) {
    setIsLogin(loginMode);
    resetMessages();
    setPassword("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    resetMessages();

    if (!isLogin) {
      if (!name.trim()) {
        setError("Please enter your name.");
        return;
      }
      if (password.length < 6) {
        setError("Password must contain at least 6 characters.");
        return;
      }
      if (!terms) {
        setError("Please accept the Terms of Service and Privacy Policy.");
        return;
      }
    }

    try {
      setLoading(true);

      let credential;

      if (isLogin) {
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

  return (
    <div className="auth-page">
      <div className="auth-background" />

      <div className="auth-layout">
        {/* Left visual section */}
        <section className="auth-visual">
          <div className="visual-overlay" />

          <div className="visual-content">
            <div className="visual-brand">
              <div className="brand-icon">
                <Utensils size={25} />
              </div>
              <span>Conscious Cravings</span>
            </div>

            <div className="visual-message">
              <span className="visual-tag">
                <Sparkles size={15} />
                Taste the difference
              </span>

              <h1>
                Good food.
                <br />
                <span>Good mood.</span>
              </h1>

              <p>
                Discover delicious moments, made with love
                and served with a little extra happiness.
              </p>
            </div>

            <div className="visual-footer">
              <span>Fresh ingredients. Beautiful experiences.</span>
            </div>
          </div>
        </section>

        {/* Right authentication section */}
        <section className="auth-panel">
          <div className="auth-card">
            <div className="mobile-brand">
              <div className="brand-icon">
                <Utensils size={22} />
              </div>
              <span>Conscious Cravings</span>
            </div>

            <div className="auth-heading">
              <span className="welcome-label">
                {isLogin ? "WELCOME BACK" : "JOIN OUR COMMUNITY"}
              </span>

              <h2>
                {isLogin ? "Let's get you in." : "Create your account."}
              </h2>

              <p>
                {isLogin
                  ? "Enter your details to continue your journey."
                  : "Sign up and start exploring delicious experiences."}
              </p>
            </div>

            <div className="auth-tabs">
              <button
                type="button"
                className={isLogin ? "active" : ""}
                onClick={() => changeMode(true)}
              >
                Login
              </button>

              <button
                type="button"
                className={!isLogin ? "active" : ""}
                onClick={() => changeMode(false)}
              >
                Sign Up
              </button>
            </div>

            <form className="auth-form" onSubmit={handleSubmit}>
              {!isLogin && (
                <div className="auth-field">
                  <label>Full Name</label>
                  <div className="input-wrap">
                    <User size={18} />
                    <input
                      type="text"
                      placeholder="Enter your name"
                      autoComplete="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                </div>
              )}

              <div className="auth-field">
                <label>Email Address</label>
                <div className="input-wrap">
                  <Mail size={18} />
                  <input
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="auth-field">
                <label>Password</label>
                <div className="input-wrap">
                  <Lock size={18} />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    autoComplete={
                      isLogin ? "current-password" : "new-password"
                    }
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              {isLogin && (
                <div className="form-utility-row">
                  <label className="remember-option">
                    <input type="checkbox" />
                    <span>Remember me</span>
                  </label>

                  <button
                    type="button"
                    className="forgot-link"
                    onClick={handleForgotPassword}
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              {!isLogin && (
                <label className="terms-row">
                  <input
                    type="checkbox"
                    checked={terms}
                    onChange={(e) => setTerms(e.target.checked)}
                  />
                  <span>
                    I agree to the Terms of Service and Privacy Policy.
                  </span>
                </label>
              )}

              {error && <p className="message error-message">{error}</p>}
              {success && <p className="message success-message">{success}</p>}

              <button type="submit" className="submit-btn" disabled={loading}>
                <span>
                  {loading
                    ? "Please wait..."
                    : isLogin
                      ? "Sign In"
                      : "Create Account"}
                </span>
                {!loading && <ArrowRight size={18} />}
              </button>
            </form>

            <div className="auth-bottom">
              <p>
                {isLogin
                  ? "New to Conscious Cravings?"
                  : "Already have an account?"}
                <button type="button" onClick={() => changeMode(!isLogin)}>
                  {isLogin ? " Create account" : " Sign in"}
                </button>
              </p>
            </div>

            <div className="auth-copyright">
              © 2026 Conscious Cravings. Made with love.
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}