// config/firebase.js

import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";

/* ================= FIREBASE CONFIG ================= */
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

/* ================= SINGLETON INIT ================= */
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

/* ================= FIRESTORE ================= */
const db = getFirestore(app);

/* ================= ANALYTICS (SAFE + OPTIMIZED) ================= */
let analytics = null;

if (typeof window !== "undefined") {
  (async () => {
    try {
      const supported = await isSupported();
      if (supported && !analytics) {
        analytics = getAnalytics(app);
      }
    } catch (e) {
      analytics = null;
    }
  })();
}

export { app, db, analytics };
