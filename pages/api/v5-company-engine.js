import { aiGuard } from "../lib/ai-control";
aiGuard();

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

const app = !getApps().length
  ? initializeApp(firebaseConfig)
  : getApps()[0];

const db = getFirestore(app);

/* ================= MARKET SCANNER ================= */
function detectNiche(keyword) {
  const k = keyword.toLowerCase();

  if (k.includes("headphones") || k.includes("earbuds")) return "audio-tech";
  if (k.includes("fitness") || k.includes("smart watch")) return "fitness-tech";
  if (k.includes("laptop") || k.includes("gaming")) return "pc-tech";
  if (k.includes("amazon") || k.includes("deal")) return "amazon-shopping";
  if (k.includes("phone")) return "mobile-tech";

  return "general-tech";
}

/* ================= PROFIT SCORE ================= */
function scoreKeyword(k) {
  let s = 0;
  const t = k.toLowerCase();

  if (t.includes("best")) s += 20;
  if (t.includes("buy")) s += 25;
  if (t.includes("cheap")) s += 15;
  if (t.includes("review")) s += 15;
  if (t.includes("viral")) s += 30;
  if (t.includes("2026")) s += 10;

  return s;
}

/* ================= MAIN ENGINE ================= */
export default async function handler(req, res) {
  try {
    /* ================= AI GUARD SWITCH ================= */
    if (process.env.AI_MODE !== "true") {
      return res.status(200).json({
        success: false,
        message: "AI MODE is OFF",
      });
    }

    console.log("🏭 V5 AUTONOMOUS COMPANY STARTED");

    const snap = await getDocs(collection(db, "keywords"));

    const keywords = snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));

    /* ================= MARKET MAP ================= */
    const market = {};

    for (const k of keywords) {
      const niche = detectNiche(k.keyword);
      const score = scoreKeyword(k.keyword) + (k.score || 0);

      if (!market[niche]) {
        market[niche] = {
          niche,
          keywords: [],
          totalScore: 0,
        };
      }

      market[niche].keywords.push({
        ...k,
        score,
      });

      market[niche].totalScore += score;
    }

    /* ================= RANK ================= */
    const sites = Object.values(market)
      .map((s) => ({
        ...s,
        avgScore: s.totalScore / s.keywords.length,
      }))
      .sort((a, b) => b.avgScore - a.avgScore);

    const topSites = sites.slice(0, 3);

    const results = [];

    /* ================= EXECUTION ================= */
    for (const site of topSites) {
      try {
        const topKeywords = site.keywords
          .sort((a, b) => b.score - a.score)
          .slice(0, 2);

        for (const kw of topKeywords) {
          await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/auto-blog-generator-v2`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ keyword: kw.keyword }),
            }
          );
        }

        await addDoc(collection(db, "cron_logs"), {
          type: "v5_site_operated",
          niche: site.niche,
          createdAt: serverTimestamp(),
        });

        results.push({
          niche: site.niche,
          status: "operated",
        });

      } catch (e) {
        await addDoc(collection(db, "cron_logs"), {
          type: "v5_error",
          niche: site.niche,
          error: e.message,
          createdAt: serverTimestamp(),
        });

        results.push({
          niche: site.niche,
          status: "failed",
        });
      }
    }

    return res.status(200).json({
      success: true,
      activeSites: topSites.map((s) => s.niche),
      results,
    });

  } catch (e) {
    return res.status(500).json({
      success: false,
      error: e.message,
    });
  }
        }
