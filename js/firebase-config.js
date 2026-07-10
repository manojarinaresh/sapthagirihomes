/* ============================================================
   Mana-Properties – Firebase Configuration
   ============================================================
   SETUP INSTRUCTIONS:
   1. Go to https://console.firebase.google.com/
   2. Create a project named "mana-properties"
   3. Add a Web App → copy the firebaseConfig object below
   4. Enable Authentication: Email/Password + Google + Phone
   5. Create Firestore Database (start in test mode)
   6. Enable Storage
   7. Replace the placeholder values below with your real config
   ============================================================ */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, FacebookAuthProvider,
         createUserWithEmailAndPassword, signInWithEmailAndPassword,
         signInWithPopup, sendPasswordResetEmail, signOut,
         updateProfile, onAuthStateChanged, RecaptchaVerifier,
         signInWithPhoneNumber } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, collection,
         addDoc, query, where, getDocs, serverTimestamp }
         from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL }
         from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";

// ── Replace with your Firebase project config ──────────────────
const firebaseConfig = {
  apiKey:            "YOUR_API_KEY",
  authDomain:        "YOUR_PROJECT.firebaseapp.com",
  projectId:         "YOUR_PROJECT_ID",
  storageBucket:     "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId:             "YOUR_APP_ID"
};
// ───────────────────────────────────────────────────────────────

const app      = initializeApp(firebaseConfig);
const auth     = getAuth(app);
const db       = getFirestore(app);
const storage  = getStorage(app);
const googleProvider   = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

export {
  auth, db, storage,
  googleProvider, facebookProvider,
  createUserWithEmailAndPassword, signInWithEmailAndPassword,
  signInWithPopup, sendPasswordResetEmail, signOut,
  updateProfile, onAuthStateChanged,
  RecaptchaVerifier, signInWithPhoneNumber,
  doc, setDoc, getDoc, collection, addDoc, query, where, getDocs, serverTimestamp,
  ref, uploadBytes, getDownloadURL
};
