import { createContext, useContext, useEffect, useState } from "react";

import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
} from "firebase/auth";

import { auth } from "../lib/firebase";
import { isAdminEmail } from "../lib/adminConfig";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return unsubscribe;
  }, []);

  const signIn = (email, password) => {
    return signInWithEmailAndPassword(
      auth,
      email.trim(),
      password
    );
  };

  const signUp = async (name, email, password) => {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email.trim(),
      password
    );

    if (name) {
      await updateProfile(userCredential.user, {
        displayName: name,
      });
    }

    return userCredential;
  };

  const forgotPassword = (email) => {
    return sendPasswordResetEmail(auth, email.trim());
  };

  const logOut = () => {
    return signOut(auth);
  };

  const value = {
    user: user ?? null,
    loading: user === undefined,
    isAdmin: user ? isAdminEmail(user.email) : false,
    signIn,
    signUp,
    forgotPassword,
    logOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error(
      "useAuth must be used within AuthProvider"
    );
  }

  return ctx;
}