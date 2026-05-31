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

/* ================= CACHE SYSTEM ================= */
let CACHE = {
  feed: null,
  ts: 0,
};

const CACHE_TIME = 60 * 1000; // 1 min

/* ================= REVENUE AI SCORE v3 ================= */
function aiScore(p) {
  const views = p.views || 0;
  const clicks = p.clicks || 0;
  const orders = p.orders || 0;

  const ctr = views > 0 ? clicks / views : 0;
  const conv = clicks > 0 ? orders / clicks : 0;

  const ageBoost = p.createdAt
    ? Math.max(0, 1 - (Date.now() - p.createdAt) / 86400000)
    : 0.5;

  const viral = p.viralBoost ? 2.2 : 1;

  // 🔥 Revenue-weighted scoring (optimized for money, not views)
  return (
    views * 0.15 +
    clicks * 2.2 +
    orders * 6.5 +
    ctr * 120 +
    conv * 180 +
    ageBoost * 60
  ) * viral;
}

/* ================= SMART FEED ENGINE ================= */
function buildFeed(products, page = 1, pageSize = 15) {
  const start = (page - 1) * pageSize;

  return {
    data: products.slice(start, start + pageSize),
    hasMore: start + pageSize < products.length,
  };
}

/* ================= MAIN HANDLER ================= */
export default async function handler(req, res) {
  const { action } = req.query;

  try {
    /* ================= AI FEED ================= */
    if (action === "feed") {
      const page = Number(req.query.page || 1);
      const pageSize = 15;

      // 🔥 CACHE HIT
      if (CACHE.feed && Date.now() - CACHE.ts < CACHE_TIME) {
        const result = buildFeed(CACHE.feed, page, pageSize);

        return res.status(200).json({
          success: true,
          source: "cache",
          page,
          ...result,
        });
      }

      // 🔥 FETCH DATA
      const snap = await getDocs(
        query(collection(db, "products"), limit(200))
      );

      let products = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));

      // 🔥 AI SORT (Revenue-first)
      products = products
        .map((p) => ({
          ...p,
          _score: aiScore(p),
        }))
        .sort((a, b) => b._score - a._score);

      // 🔥 CACHE STORE
      CACHE = {
        feed: products,
        ts: Date.now(),
      };

      const result = buildFeed(products, page, pageSize);

      return res.status(200).json({
        success: true,
        source: "live",
        page,
        ...result,
      });
    }

    /* ================= REVENUE INSIGHTS ================= */
    if (action === "insights") {
      const snap = await getDocs(collection(db, "products"));

      let products = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));

      const totalViews = products.reduce((a, p) => a + (p.views || 0), 0);
      const totalClicks = products.reduce((a, p) => a + (p.clicks || 0), 0);
      const totalOrders = products.reduce((a, p) => a + (p.orders || 0), 0);

      return res.status(200).json({
        success: true,
        revenue: {
          ctr: totalViews ? totalClicks / totalViews : 0,
          conversion: totalClicks ? totalOrders / totalClicks : 0,
          totalViews,
          totalClicks,
          totalOrders,
        },
      });
    }

    /* ================= DEFAULT ================= */
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
