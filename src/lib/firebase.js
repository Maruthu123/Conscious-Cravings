import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCashXwGKaFgRGzVTDoUDb8K15L4aUDbig",
  authDomain: "admin-login-ca2e4.firebaseapp.com",
  projectId: "admin-login-ca2e4",
  storageBucket: "admin-login-ca2e4.firebasestorage.app",
  messagingSenderId: "620550501100",
  appId: "1:620550501100:web:1eefda459d1e4695dbabc9",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getFirestore(app);