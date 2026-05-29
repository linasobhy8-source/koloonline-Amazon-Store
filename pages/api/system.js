import { initializeApp, getApps } from "firebase/app";
import { getFirestore, collection, getDocs, query, limit } from "firebase/firestore";

/* ================= FIREBASE ================= */
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

/* ================= IN-MEMORY CACHE ================= */
let CACHE = {
  trending: null,
  timestamp: 0,
};

const CACHE_TIME = 60 * 1000; // 60 ثانية (مهم جدًا)

/* ================= SCORE ================= */
function score(p) {
  return (
    (p.views || 0) +
    (p.clicks || 0) * 2 +
    (p.orders || 0) * 5 +
    (p.viralBoost ? 100 : 0)
  );
}

/* ================= HANDLER ================= */
export default async function handler(req, res) {
  const { action } = req.query;

  try {
    /* ================= TRENDING (WITH CACHE) ================= */
    if (action === "trending") {
      const now = Date.now();

      /* ⚡ CACHE HIT */
      if (CACHE.trending && now - CACHE.timestamp < CACHE_TIME) {
        return res.status(200).json({
          success: true,
          cached: true,
          data: CACHE.trending,
        });
      }

      /* ⚡ CACHE MISS → FIREBASE */
      const snap = await getDocs(
        query(collection(db, "products"), limit(30))
      );

      let products = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));

      /* 🔥 SORT AI-LIKE */
      products = products
        .sort((a, b) => score(b) - score(a))
        .slice(0, 15);

      /* 💾 SAVE CACHE */
      CACHE.trending = products;
      CACHE.timestamp = now;

      return res.status(200).json({
        success: true,
        cached: false,
        data: products,
      });
    }

    /* ================= SEO ================= */
    if (action === "seo") {
      return res.status(200).json({
        success: true,
        data: {
          title: "Koloonline SEO Engine",
          status: "active",
        },
      });
    }

    return res.status(400).json({
      success: false,
      message: "Invalid action",
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
}
