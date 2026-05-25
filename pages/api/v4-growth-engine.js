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

/* ================= SAFE SWITCH ================= */

const AI_MODE = process.env.AI_MODE === "true";

/* ================= NICHE ENGINE ================= */

function extractNiche(keyword) {
  const k = (keyword || "").toLowerCase();

  if (k.includes("headphones") || k.includes("earbuds"))
    return "audio-tech";

  if (k.includes("smart watch") || k.includes("fitness"))
    return "fitness-tech";

  if (k.includes("laptop") || k.includes("gaming"))
    return "pc-accessories";

  if (k.includes("amazon") || k.includes("deal"))
    return "amazon-deals";

  return "general-tech";
}

/* ================= PROFIT SCORE ================= */

function profitScore(k) {
  let score = 0;
  const t = (k || "").toLowerCase();

  if (t.includes("best")) score += 20;
  if (t.includes("buy")) score += 25;
  if (t.includes("cheap")) score += 15;
  if (t.includes("review")) score += 15;
  if (t.includes("2026")) score += 10;
  if (t.includes("viral")) score += 30;

  return score;
}

/* ================= HANDLER ================= */

export default async function handler(req, res) {
  try {
    console.log("🚀 V4 SELF GROWTH ENGINE STARTED");

    /* ================= SAFE MODE CHECK ================= */
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

    /* ================= BUILD CLUSTERS ================= */

    const clusters = {};

    for (const k of keywords) {
      const niche = extractNiche(k.keyword);

      const score =
        profitScore(k.keyword) + (k.score || 0);

      if (!clusters[niche]) {
        clusters[niche] = [];
      }

      clusters[niche].push({
        ...k,
        finalScore: score,
      });
    }

    /* ================= RANK NICHES ================= */

    const rankedNiches = Object.keys(clusters)
      .map((niche) => {
        const items = clusters[niche];

        const avgScore =
          items.reduce(
            (a, b) => a + (b.finalScore || 0),
            0
          ) / items.length;

        return {
          niche,
          avgScore,
          items,
        };
      })
      .sort(
        (a, b) => b.avgScore - a.avgScore
      );

    const topNiche = rankedNiches[0];

    if (!topNiche) {
      return res.status(200).json({
        success: false,
        message: "No niches found",
      });
    }

    console.log(
      "🔥 Selected Niche:",
      topNiche.niche
    );

    /* ================= TOP KEYWORDS ================= */

    const topKeywords = topNiche.items
      .sort(
        (a, b) =>
          b.finalScore - a.finalScore
      )
      .slice(0, 3);

    const results = [];

    /* ================= AUTO GENERATION LOOP ================= */

    for (const item of topKeywords) {
      try {
        await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/auto-blog-generator-v2`,
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              keyword: item.keyword,
            }),
          }
        );

        await addDoc(
          collection(db, "cron_logs"),
          {
            type: "v4_generated",
            niche: topNiche.niche,
            keyword: item.keyword,
            score: item.finalScore,
            createdAt: serverTimestamp(),
          }
        );

        results.push({
          keyword: item.keyword,
          status: "generated",
        });

      } catch (e) {
        await addDoc(
          collection(db, "cron_logs"),
          {
            type: "v4_error",
            keyword: item.keyword,
            error: e.message,
            createdAt: serverTimestamp(),
          }
        );

        results.push({
          keyword: item.keyword,
          status: "failed",
        });
      }
    }

    /* ================= FEEDBACK LOOP ================= */

    await addDoc(
      collection(db, "cron_logs"),
      {
        type: "v4_niche_selected",
        niche: topNiche.niche,
        avgScore: topNiche.avgScore,
        createdAt: serverTimestamp(),
      }
    );

    /* ================= RESPONSE ================= */

    return res.status(200).json({
      success: true,
      niche: topNiche.niche,
      processed: topKeywords.length,
      results,
    });

  } catch (e) {
    console.error("❌ V4 ERROR:", e);

    return res.status(500).json({
      success: false,
      error: e.message,
    });
  }
    }
