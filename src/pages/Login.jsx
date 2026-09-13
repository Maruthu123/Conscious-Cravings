import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
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
  } = useAuth();

  const location = useLocation();
  const navigate = useNavigate();

  const [mode, setMode] = useState("login");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [terms, setTerms] = useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  // Only follow an explicit redirect (e.g. someone tried to place an
  // order or open "My Orders" while signed out). Otherwise, after
  // logging in, send the person straight to their dashboard — the
  // Admin panel for admins, "My Orders" for everyone else — instead
  // of dropping them back on the homepage.
  const explicitRedirect =
    location.state?.redirect;

  const scrollTo =
    location.state?.scrollTo;

  function destinationFor(loggedInUser) {
    if (explicitRedirect) return explicitRedirect;
    return isAdminEmail(loggedInUser?.email)
      ? "/admin"
      : "/account";
  }

  useEffect(() => {
    if (user) {
      navigate(destinationFor(user), {
        state: scrollTo
          ? { scrollTo }
          : undefined,
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

      default:
        return "Something went wrong. Please try again.";
    }
  };

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (mode === "signup") {
      if (!name.trim()) {
        setError("Please enter your name.");
        return;
      }

      if (password.length < 6) {
        setError(
          "Password must contain at least 6 characters."
        );
        return;
      }

      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }

      if (!terms) {
        setError(
          "Please accept the Terms & Conditions."
        );
        return;
      }
    }

    try {
      setLoading(true);

      let credential;

      if (mode === "login") {
        credential = await signIn(email, password);
      } else {
        credential = await signUp(
          name,
          email,
          password
        );

        setSuccess(
          "Account created successfully!"
        );
      }

      navigate(destinationFor(credential.user), {
        state: scrollTo
          ? { scrollTo }
          : undefined,
        replace: true,
      });

    } catch (err) {
      setError(
        getFirebaseError(err.code)
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleForgotPassword() {
    setError("");
    setSuccess("");

    if (!email.trim()) {
      setError(
        "Please enter your email first."
      );
      return;
    }

    try {
      setLoading(true);

      await forgotPassword(email);

      setSuccess(
        "Password reset link has been sent to your email."
      );

    } catch (err) {
      setError(
        getFirebaseError(err.code)
      );
    } finally {
      setLoading(false);
    }
  }

  function changeMode(newMode) {
    setMode(newMode);

    setError("");
    setSuccess("");

    setPassword("");
    setConfirmPassword("");
  }

  return (
    <main className="waitly-auth-page">

      {/* decorative food-photo blobs, purely visual */}
      <div className="bg-blob bg-blob-top" />
      <div className="bg-blob bg-blob-bottom" />

      <motion.div
        className="auth-card"
        initial={{
          opacity: 0,
          y: 30,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.5,
        }}
      >

        <div className="brand-badge">
          <div className="brand-badge-icon">
            <ChefHat size={30} strokeWidth={1.8} />
          </div>

          <h1>Waitly</h1>
          <p>YOUR TABLE, YOUR TIME</p>
        </div>

        <div className="auth-heading">
          <h2>
            {mode === "login"
              ? "Welcome back!"
              : "Create your account"}
          </h2>

          <p>
            {mode === "login"
              ? "Sign in to keep your dineline"
              : "Join us and start your dineline"}
          </p>
        </div>

        <div className="auth-tabs">

          <button
            className={
              mode === "login"
                ? "active"
                : ""
            }
            onClick={() =>
              changeMode("login")
            }
          >
            Login
          </button>

          <button
            className={
              mode === "signup"
                ? "active"
                : ""
            }
            onClick={() =>
              changeMode("signup")
            }
          >
            Sign Up
          </button>

        </div>

        <form
          onSubmit={handleSubmit}
          className="auth-form"
        >

          {mode === "signup" && (
            <div className="auth-field">

              <User size={19} />

              <input
                type="text"
                placeholder="Your Name"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
              />

            </div>
          )}


          <div className="auth-field">

            <Mail size={19} />

            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              required
            />

          </div>


          <div className="auth-field password-field">

            <Lock size={19} />

            <input
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              placeholder="Password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              required
            />

            <button
              type="button"
              className="password-toggle"
              onClick={() =>
                setShowPassword(
                  !showPassword
                )
              }
            >
              {showPassword
                ? <EyeOff size={18} />
                : <Eye size={18} />
              }
            </button>

          </div>


          {mode === "signup" && (

            <div className="auth-field password-field">

              <Lock size={19} />

              <input
                type={
                  showConfirmPassword
                    ? "text"
                    : "password"
                }
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(
                    e.target.value
                  )
                }
                required
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() =>
                  setShowConfirmPassword(
                    !showConfirmPassword
                  )
                }
              >
                {showConfirmPassword
                  ? <EyeOff size={18} />
                  : <Eye size={18} />
                }
              </button>

            </div>

          )}


          {mode === "login" && (

            <div className="form-utility-row">
              <button
                type="button"
                className="forgot-link"
                onClick={
                  handleForgotPassword
                }
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
                onChange={(e) =>
                  setTerms(
                    e.target.checked
                  )
                }
              />

              <span className="terms-box">
                <Check size={12} />
              </span>

              I agree with
              Terms & Conditions

            </label>

          )}


          {error && (
            <p className="message error-message">
              {error}
            </p>
          )}

          {success && (
            <p className="message success-message">
              {success}
            </p>
          )}


          <motion.button
            type="submit"
            className="submit-btn"
            disabled={loading}
            whileHover={{
              scale: 1.02,
            }}
            whileTap={{
              scale: 0.97,
            }}
          >

            {loading
              ? "Please wait..."
              : (
                <>
                  {mode === "login" ? "Login" : "Sign Up"}
                  <ArrowRight size={18} />
                </>
              )
            }

          </motion.button>

        </form>

        <div className="auth-divider">or continue with</div>

        <div className="social-row">
          <span>
            <Mail size={17} />
          </span>
          <span>
            <Globe size={17} />
          </span>
          <span>
            <Smartphone size={17} />
          </span>
        </div>

        <div className="bottom-switch">

          {mode === "login"
            ? (
              <>
                Don't have an account?
                <button
                  onClick={() =>
                    changeMode("signup")
                  }
                >
                  Sign Up
                </button>
              </>
            )
            : (
              <>
                Already have an account?
                <button
                  onClick={() =>
                    changeMode("login")
                  }
                >
                  Login
                </button>
              </>
            )}

        </div>

      </motion.div>

    </main>
  );
}