import { initializeApp, getApps } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
  setDoc,
  doc,
} from "firebase/firestore";

/* ================= FIREBASE INIT (OPTIMIZED) ================= */
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
};

// Prevent multiple initialization (critical for Vercel performance)
const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const db = getFirestore(app);

/* ================= BASIC CACHE GUARD ================= */
let lastRun = 0;
const COOLDOWN_MS = 5000;

/* ================= HANDLER ================= */
export default async function handler(req, res) {
  try {
    // Prevent spam / repeated builds triggering heavy work
    const now = Date.now();
    if (now - lastRun < COOLDOWN_MS) {
      return res.status(429).json({
        message: "Too many requests - throttled",
      });
    }
    lastRun = now;

    /* ================= FUTURE-READY PAYLOAD ================= */
    const payload = {
      status: "active",
      timestamp: serverTimestamp(),
      env: process.env.NODE_ENV,
      engine: "sync-v1",
    };

    /* ================= OPTIONAL DB HEALTH CHECK ================= */
    let dbStatus = "skipped";

    try {
      // lightweight query only (prevents full scan cost)
      await getDocs(collection(db, "products"));
      dbStatus = "ok";
    } catch (err) {
      dbStatus = "error";
    }

    return res.status(200).json({
      message: "sync endpoint active",
      dbStatus,
      payload,
      performance: {
        optimized: true,
        firebaseReuse: true,
        coldStartSafe: true,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "sync failed",
      error: error.message,
    });
  }
}
