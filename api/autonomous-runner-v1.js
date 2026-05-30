import { initializeApp, getApps } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

/* ================= FIREBASE ================= */
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
};

const app = !getApps().length
  ? initializeApp(firebaseConfig)
  : getApps()[0];

const db = getFirestore(app);

/* ================= SAFE CALL ================= */
async function run(path) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}${path}`);
    return await res.json();
  } catch (e) {
    return { success: false, error: e.message };
  }
}

/* ================= HANDLER ================= */
export default async function handler(req, res) {
  try {
    const startTime = Date.now();

    /* ================= RUN PIPELINE ================= */
    const flywheel = await run("/api/growth-flywheel-v1");

    /* ================= LOG ================= */
    await addDoc(collection(db, "cron_logs"), {
      type: "autonomous_runner",
      status: flywheel.success ? "success" : "failed",
      duration: Date.now() - startTime,
      timestamp: serverTimestamp(),
      details: flywheel,
    });

    /* ================= RESPONSE ================= */
    return res.status(200).json({
      success: true,
      message: "Autonomous system executed",
      runtime: Date.now() - startTime,
      flywheel,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}
