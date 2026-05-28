import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";

/* ================= ENV VALIDATION ================= */

const requiredEnv = [
  "NEXT_PUBLIC_FIREBASE_API_KEY",
  "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
  "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
  "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
  "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
  "NEXT_PUBLIC_FIREBASE_APP_ID",
];

requiredEnv.forEach((key) => {
  if (!process.env[key]) {
    console.warn(`⚠ Missing Firebase environment variable: ${key}`);
  }
});

/* ================= FIREBASE CONFIG ================= */

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

/* ================= SINGLETON APP ================= */

const app =
  getApps().length > 0
    ? getApps()[0]
    : initializeApp(firebaseConfig);

/* ================= FIRESTORE ================= */

const db = getFirestore(app);

/* ================= EXPORTS ================= */

export { app, db };
export default app;
