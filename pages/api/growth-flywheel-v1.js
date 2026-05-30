import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";

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
async function callAPI(path) {
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
    const logs = [];

    console.log("🚀 Growth Flywheel Started");

    /* ================= 1. KEYWORDS ================= */
    const keywords = await callAPI("/api/keywords");
    logs.push({ step: "keywords", result: keywords });

    /* ================= 2. BLOG GENERATION ================= */
    const blog = await callAPI("/api/auto-blog");
    logs.push({ step: "blog", result: blog });

    /* ================= 3. PRODUCT GENERATION ================= */
    const products = await callAPI("/api/auto-product-generator-v2");
    logs.push({ step: "products", result: products });

    /* ================= 4. PROFIT ANALYSIS ================= */
    const profit = await callAPI("/api/profit-brain-v1");
    logs.push({ step: "profit", result: profit });

    /* ================= 5. SELF LEARNING ================= */
    const learning = await callAPI("/api/profit-self-learning-v1");
    logs.push({ step: "learning", result: learning });

    /* ================= RESPONSE ================= */
    return res.status(200).json({
      success: true,
      message: "Growth Flywheel executed",
      logs,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}
