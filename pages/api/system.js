import { initializeApp, getApps } from "firebase/app";
import { getFirestore, collection, getDocs, query, limit } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

/* ================= CACHE ================= */
let CACHE = { feed: null, ts: 0 };
const CACHE_TIME = 60 * 1000;

/* ================= SCORE ================= */
function aiScore(p) {
  const views = p.views || 0;
  const clicks = p.clicks || 0;
  const orders = p.orders || 0;

  const ctr = views ? clicks / views : 0;
  const conv = clicks ? orders / clicks : 0;

  const freshness = p.createdAt
    ? Math.max(0, 1 - (Date.now() - p.createdAt) / 86400000)
    : 0.5;

  return (
    views * 0.2 +
    clicks * 1.5 +
    orders * 5 +
    ctr * 100 +
    conv * 150 +
    freshness * 50 +
    (p.viralBoost ? 100 : 0)
  );
}

export default async function handler(req, res) {
  const { action } = req.query;

  try {
    if (action === "feed") {
      const page = Number(req.query.page || 1);
      const pageSize = 15;

      /* CACHE HIT */
      if (CACHE.feed && Date.now() - CACHE.ts < CACHE_TIME) {
        const start = (page - 1) * pageSize;

        return res.json({
          success: true,
          source: "cache",
          page,
          hasMore: start + pageSize < CACHE.feed.length,
          data: CACHE.feed.slice(start, start + pageSize),
        });
      }

      const snap = await getDocs(
        query(collection(db, "products"), limit(100))
      );

      let products = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));

      products = products
        .map((p) => ({ ...p, _score: aiScore(p) }))
        .sort((a, b) => b._score - a._score);

      CACHE = { feed: products, ts: Date.now() };

      const start = (page - 1) * pageSize;

      return res.json({
        success: true,
        source: "live",
        page,
        hasMore: start + pageSize < products.length,
        data: products.slice(start, start + pageSize),
      });
    }

    return res.status(400).json({ success: false });
  } catch (e) {
    return res.status(500).json({ success: false, error: e.message });
  }
    }
