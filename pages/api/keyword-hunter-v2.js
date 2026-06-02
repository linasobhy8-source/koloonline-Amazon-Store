import { initializeApp, getApps } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

/* ================= FIREBASE INIT ================= */
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
};

const app = !getApps().length
  ? initializeApp(firebaseConfig)
  : getApps()[0];

const db = getFirestore(app);

/* ================= SEED KEYWORDS ================= */
const seedKeywords = [
  "best wireless earbuds 2026",
  "cheap smart watch for fitness",
  "fast charging power bank review",
  "best laptop accessories for students",
  "top fitness tracker amazon",
  "budget noise cancelling headphones",
  "gaming accessories cheap amazon",
  "best amazon deals today 2026",
  "best phone under 300 dollars",
  "wireless earbuds noise cancelling review",
  "best tech gifts under 50",
  "amazon hidden gems 2026",
  "viral tiktok amazon products",
];

/* ================= SCORING ENGINE ================= */
function calculateScore(keyword = "") {
  const k = keyword.toLowerCase();
  let score = 0;

  /* ===== BUY INTENT ===== */
  if (k.includes("best")) score += 25;
  if (k.includes("cheap")) score += 20;
  if (k.includes("review")) score += 18;
  if (k.includes("deal")) score += 25;
  if (k.includes("buy")) score += 30;
  if (k.includes("under")) score += 20;
  if (k.includes("amazon")) score += 10;

  /* ===== TREND SIGNALS ===== */
  if (k.includes("2026")) score += 15;
  if (k.includes("viral")) score += 30;
  if (k.includes("tiktok")) score += 25;

  /* ===== PRODUCT CATEGORY BOOST ===== */
  if (k.includes("headphones")) score += 20;
  if (k.includes("earbuds")) score += 20;
  if (k.includes("smart watch")) score += 20;
  if (k.includes("laptop")) score += 15;
  if (k.includes("gaming")) score += 20;

  /* ===== COMMERCIAL INTENT ===== */
  if (k.includes("gifts")) score += 15;
  if (k.includes("fitness")) score += 10;
  if (k.includes("accessories")) score += 10;

  return score;
}

/* ================= HANDLER ================= */
export default async function handler(req, res) {
  const startTime = Date.now();

  try {
    console.log("🚀 Keyword Hunter v2 Started");

    /* ================= RANDOM SELECTION ================= */
    const selected = [...seedKeywords]
      .sort(() => 0.5 - Math.random())
      .slice(0, 5);

    const results = [];

    /* ================= PROCESS LOOP ================= */
    for (const keyword of selected) {
      const score = calculateScore(keyword);

      try {
        /* ================= LOW VALUE FILTER ================= */
        if (score < 40) {
          await addDoc(collection(db, "cron_logs"), {
            type: "keyword_skipped_v2",
            keyword,
            score,
            reason: "low_score",
            createdAt: serverTimestamp(),
          });

          results.push({
            keyword,
            status: "skipped",
            score,
          });

          continue;
        }

        /* ================= SAVE KEYWORD ================= */
        const ref = await addDoc(collection(db, "keywords"), {
          keyword,
          score,
          priority: score >= 70 ? "high" : "medium",
          status: "approved",
          source: "keyword_hunter_v2",
          createdAt: serverTimestamp(),
        });

        /* ================= LOG SUCCESS ================= */
        await addDoc(collection(db, "cron_logs"), {
          type: "keyword_approved_v2",
          keyword,
          score,
          docId: ref.id,
          createdAt: serverTimestamp(),
        });

        /* ================= AUTO BLOG TRIGGER ================= */
        try {
          await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/auto-blog-generator-v2`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ keyword }),
            }
          );
        } catch (e) {
          console.log("Auto blog trigger failed:", e?.message);
        }

        results.push({
          keyword,
          status: "approved",
          score,
        });

      } catch (err) {
        console.log("Keyword Processing Error:", err);

        await addDoc(collection(db, "cron_logs"), {
          type: "keyword_error_v2",
          keyword,
          error: err?.message || "Unknown error",
          createdAt: serverTimestamp(),
        });

        results.push({
          keyword,
          status: "error",
          error: err?.message,
        });
      }
    }

    /* ================= RESPONSE ================= */
    return res.status(200).json({
      success: true,
      runtime: Date.now() - startTime,
      processed: selected.length,
      results,
    });

  } catch (e) {
    console.error("❌ Keyword Hunter v2 Error:", e);

    return res.status(500).json({
      success: false,
      error: e?.message || "Internal Error",
    });
  }
}
