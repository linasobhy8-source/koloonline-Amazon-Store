import { initializeApp, getApps } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

/* ================= FIREBASE ================= */

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
};

const app = getApps().length
  ? getApps()[0]
  : initializeApp(firebaseConfig);

const db = getFirestore(app);

/* ================= AI GUARD (OPTIONAL CONTROL) ================= */

const AI_MODE = process.env.AI_MODE === "true";

/* ================= TREND SCORE ENGINE ================= */

function getTrendScore(keyword) {
  let score = 0;
  const k = (keyword || "").toLowerCase();

  if (k.includes("best")) score += 20;
  if (k.includes("cheap")) score += 15;
  if (k.includes("viral")) score += 30;
  if (k.includes("amazon")) score += 10;
  if (k.includes("2026")) score += 10;
  if (k.includes("buy")) score += 25;
  if (k.includes("review")) score += 15;
  if (k.includes("deal")) score += 20;

  return score;
}

/* ================= HANDLER ================= */

export default async function handler(req, res) {
  try {
    console.log("🧠 V3 BRAIN ENGINE STARTED");

    /* ================= SAFE STOP SWITCH ================= */
    if (!AI_MODE) {
      return res.status(200).json({
        success: false,
        message: "AI MODE DISABLED",
      });
    }

    /* ================= LOAD KEYWORDS ================= */

    const snap = await getDocs(
      collection(db, "keywords")
    );

    const keywords = snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));

    /* ================= SCORE ================= */

    const scored = keywords.map((k) => {
      const trend = getTrendScore(k.keyword);
      const finalScore = (k.score || 0) + trend;

      return {
        ...k,
        finalScore,
      };
    });

    /* ================= TOP 3 ================= */

    const top = scored
      .sort((a, b) => b.finalScore - a.finalScore)
      .slice(0, 3);

    if (!top.length) {
      return res.status(200).json({
        success: false,
        message: "No strong keywords found",
      });
    }

    const results = [];

    /* ================= EXECUTION LOOP ================= */

    for (const item of top) {
      try {
        console.log("🚀 Processing:", item.keyword);

        /* ================= 1. BLOG GENERATION ================= */
        await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/auto-blog-generator-v2`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              keyword: item.keyword,
            }),
          }
        );

        /* ================= 2. INDEXING PIPELINE ================= */
        await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/master-pipeline`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              type: "keyword",
              id: item.id,
            }),
          }
        );

        /* ================= 3. LOG SUCCESS ================= */
        await addDoc(collection(db, "cron_logs"), {
          type: "v3_processed",
          keyword: item.keyword,
          score: item.finalScore,
          status: "success",
          createdAt: serverTimestamp(),
        });

        results.push({
          keyword: item.keyword,
          status: "done",
        });

      } catch (e) {
        /* ================= LOG ERROR ================= */

        await addDoc(collection(db, "cron_logs"), {
          type: "v3_error",
          keyword: item.keyword,
          error: e.message,
          createdAt: serverTimestamp(),
        });

        results.push({
          keyword: item.keyword,
          status: "failed",
        });
      }
    }

    /* ================= RESPONSE ================= */

    return res.status(200).json({
      success: true,
      processed: top.length,
      results,
      timestamp: Date.now(),
    });

  } catch (e) {
    console.error("❌ V3 ERROR:", e);

    return res.status(500).json({
      success: false,
      error: e.message,
    });
  }
          }
