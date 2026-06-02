import { initializeApp, getApps } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

/* ================= FIREBASE SAFE INIT ================= */
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
};

const app = !getApps().length
  ? initializeApp(firebaseConfig)
  : getApps()[0];

const db = getFirestore(app);

/* ================= SAFE FETCH (with timeout) ================= */
async function run(path, timeout = 10000) {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}${path}`,
      { signal: controller.signal }
    );

    clearTimeout(timer);

    if (!res.ok) {
      throw new Error(`HTTP Error: ${res.status}`);
    }

    return await res.json();
  } catch (e) {
    return {
      success: false,
      error: e?.message || "Unknown error",
    };
  }
}

/* ================= API HANDLER ================= */
export default async function handler(req, res) {
  const startTime = Date.now();

  try {
    /* ================= CORE PIPELINE ================= */
    const flywheel = await run("/api/growth-flywheel-v1");

    /* ================= FIRESTORE LOG ================= */
    await addDoc(collection(db, "cron_logs"), {
      type: "autonomous_runner_v1",
      status: flywheel?.success ? "success" : "failed",
      runtime: Date.now() - startTime,
      timestamp: serverTimestamp(),
      details: flywheel,
    });

    /* ================= RESPONSE ================= */
    return res.status(200).json({
      success: true,
      message: "Autonomous system executed successfully",
      runtime: Date.now() - startTime,
      flywheel,
    });

  } catch (error) {
    console.error("AUTONOMOUS RUNNER ERROR:", error);

    return res.status(500).json({
      success: false,
      error: error?.message || "Internal Server Error",
    });
  }
}
