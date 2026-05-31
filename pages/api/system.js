import { initializeApp, getApps } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  limit,
} from "firebase/firestore";

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
function aiScore(p) {
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
    orders * 5 +
    ctr * 120 +
    conv * 180 +
    freshness * 60 +
    (p.viralBoost ? 120 : 0)
  );
}

/* ================= 4️⃣ ADAPTIVE REVENUE LAYER ================= */
function revenueScore(p) {
  let boost = 1;

  const price = Number(p.price || 0);
  const orders = p.orders || 0;

  // high revenue products
  if (orders > 10) boost += 0.5;

  // high price = higher affiliate value
  if (price > 50) boost += 0.3;

  // viral multiplier
  if (p.viralBoost) boost += 1.2;

  return (p._score || 0) * boost;
}

/* ================= 5️⃣ SELF-LEARNING FEEDBACK ================= */
function selfLearningBoost(p, userSignal = {}) {
  let boost = 1;

  // click history boost
  if (p.clicks > 20) boost += 0.2;

  // conversion boost
  if (p.orders > 5) boost += 0.4;

  // weak product penalty
  if (p.clicks > 50 && p.orders === 0) boost -= 0.3;

  // user interaction signal (future-ready)
  if (userSignal?.liked?.includes(p.id)) boost += 0.5;

  return boost;
}

/* ================= MAIN HANDLER ================= */
export default async function handler(req, res) {
  const { action } = req.query;

  try {
    /* ================= FEED ================= */
    if (action === "feed") {
      const page = Number(req.query.page || 1);
      const pageSize = 15;

      /* CACHE HIT */
      if (
        CACHE.feed &&
        Date.now() - CACHE.ts < CACHE_TIME
      ) {
        const start = (page - 1) * pageSize;

        return res.json({
          success: true,
          source: "cache",
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
        query(collection(db, "products"), limit(120))
      );

      let products = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));

      /* ================= AI SCORING ================= */
      products = products.map((p) => {
        const base = aiScore(p);
        const adaptive = selfLearningBoost(p);
        const finalScore = base * adaptive;

        return {
          ...p,
          _score: base,
          revenueScore: revenueScore({
            ...p,
            _score: finalScore,
          }),
          finalScore,
        };
      });

      /* ================= 5️⃣ SELF-LEARNING SORT ================= */
      products = products.sort(
        (a, b) => b.finalScore - a.finalScore
      );

      /* CACHE UPDATE */
      CACHE = {
        feed: products,
        ts: Date.now(),
      };

      const start = (page - 1) * pageSize;

      return res.json({
        success: true,
        source: "live-ai",
        page,
        hasMore:
          start + pageSize < products.length,
        data: products.slice(start, pageSize + start),
      });
    }

    /* ================= UNKNOWN ACTION ================= */
    return res
      .status(400)
      .json({ success: false, message: "Invalid action" });
  } catch (e) {
    return res.status(500).json({
      success: false,
      error: e.message,
    });
  }
    }
