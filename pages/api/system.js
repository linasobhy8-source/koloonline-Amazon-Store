import { initializeApp, getApps } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  limit,
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

/* ================= CACHE ================= */
let CACHE = { feed: null, ts: 0 };
const CACHE_TIME = 60 * 1000;

/* ================= CORE AI SCORE ================= */
function baseScore(p) {
  const views = p.views || 0;
  const clicks = p.clicks || 0;
  const orders = p.orders || 0;

  const ctr = views ? clicks / views : 0;
  const conv = clicks ? orders / clicks : 0;

  const freshness = p.createdAt
    ? Math.max(
        0,
        1 - (Date.now() - p.createdAt) / 86400000
      )
    : 0.5;

  return (
    views * 0.2 +
    clicks * 1.5 +
    orders * 6 +
    ctr * 120 +
    conv * 200 +
    freshness * 60
  );
}

/* ================= 1️⃣ VIRAL PREDICTION ================= */
function viralPrediction(p) {
  const momentum =
    (p.clicks || 0) * 0.4 +
    (p.orders || 0) * 2 +
    (p.views || 0) * 0.1;

  const boost = p.viralBoost ? 2 : 1;

  return momentum * boost;
}

/* ================= 2️⃣ PROFIT PRIORITY ENGINE ================= */
function profitScore(p) {
  const price = Number(p.price || 0);
  const orders = p.orders || 0;

  const affiliateValue = price * 0.05;

  return affiliateValue * orders;
}

/* ================= 3️⃣ TREND INJECTION ================= */
function trendBoost(p) {
  if (p.trending) return 2.5;
  if (p.views > 1000 && p.clicks > 50) return 1.6;
  if (p.viralBoost) return 1.8;
  return 1;
}

/* ================= 4️⃣ COLD START BOOST ================= */
function coldStart(p) {
  if (!p.views || p.views < 10) return 2;
  if (!p.clicks) return 1.5;
  return 1;
}

/* ================= FINAL AI SCORE ================= */
function finalScore(p) {
  const base = baseScore(p);
  const viral = viralPrediction(p);
  const profit = profitScore(p);

  return (
    base * 1.2 +
    viral * 1.5 +
    profit * 2 +
    (p.createdAt ? 0 : 20)
  );
}

/* ================= MAIN HANDLER ================= */
export default async function handler(req, res) {
  const { action } = req.query;

  try {
    /* ================= FEED ================= */
    if (action === "feed") {
      const page = Number(req.query.page || 1);
      const pageSize = 15;

      /* CACHE */
      if (
        CACHE.feed &&
        Date.now() - CACHE.ts < CACHE_TIME
      ) {
        const start = (page - 1) * pageSize;

        return res.json({
          success: true,
          source: "cache-ai",
          page,
          hasMore:
            start + pageSize < CACHE.feed.length,
          data: CACHE.feed.slice(
            start,
            start + pageSize
          ),
        });
      }

      /* FETCH */
      const snap = await getDocs(
        query(collection(db, "products"), limit(150))
      );

      let products = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));

      /* ================= AI ENGINE ================= */
      products = products.map((p) => {
        const score = finalScore(p);

        return {
          ...p,
          _score: score,
          viralIndex: viralPrediction(p),
          profitIndex: profitScore(p),
          boost: trendBoost(p),
          coldBoost: coldStart(p),
          finalScore:
            score *
            trendBoost(p) *
            coldStart(p),
        };
      });

      /* ================= SORT ================= */
      products.sort(
        (a, b) => b.finalScore - a.finalScore
      );

      /* ================= CACHE ================= */
      CACHE = {
        feed: products,
        ts: Date.now(),
      };

      const start = (page - 1) * pageSize;

      return res.json({
        success: true,
        source: "AI-GROWTH-ENGINE",
        page,
        hasMore:
          start + pageSize < products.length,
        data: products.slice(start, start + pageSize),
      });
    }

    return res.status(400).json({
      success: false,
      message: "Invalid action",
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      error: e.message,
    });
  }
}
