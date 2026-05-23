import { initializeApp, getApps } from "firebase/app";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";

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
async function safeCall(name, fn) {
  try {
    const result = await fn();
    return { name, success: true, result };
  } catch (e) {
    return { name, success: false, error: e.message };
  }
}

/* ================= HANDLER ================= */
export default async function handler(req, res) {
  try {
    const results = [];

    /* ================= 1. PROFIT RANKING ================= */
    const ranking = await safeCall("profit-ranking", async () => {
      const r = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/ai-product-ranking-v1`);
      return await r.json();
    });

    results.push(ranking);

    /* ================= 2. HOME FEED ================= */
    const feed = await safeCall("home-feed", async () => {
      const r = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/ai-home-feed-engine-v1`);
      return await r.json();
    });

    results.push(feed);

    /* ================= 3. SALES TRACKING ================= */
    const sales = await safeCall("sales-tracker", async () => {
      const r = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/sales-tracker-v1`);
      return await r.json();
    });

    results.push(sales);

    /* ================= LOG ORCHESTRATION ================= */
    await addDoc(collection(db, "orchestrator_logs"), {
      type: "auto-run",
      results,
      createdAt: serverTimestamp(),
    });

    return res.status(200).json({
      success: true,
      message: "AI Orchestration Completed",
      results,
    });

  } catch (e) {
    return res.status(500).json({
      success: false,
      error: e.message,
    });
  }
}
