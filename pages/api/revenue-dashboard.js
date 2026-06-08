import { initializeApp, getApps } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
} from "firebase/firestore";

/* ================= FIREBASE ================= */
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const db = getFirestore(app);

/* ================= SAFE ================= */
const safeNumber = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

/* ================= SCORE ENGINE ================= */
function calculateProductRevenue(p) {
  const views = safeNumber(p.views);
  const clicks = safeNumber(p.clicks);
  const orders = safeNumber(p.orders || 0);
  const price = safeNumber(p.price);

  const ctr = views ? clicks / views : 0;
  const cvr = clicks ? orders / clicks : 0;

  const revenue = orders * price;

  const score =
    revenue * 20 +
    ctr * 500 +
    cvr * 1200 +
    views * 0.2;

  return {
    revenue,
    score,
    ctr,
    cvr,
  };
}

/* ================= DASHBOARD ================= */
export default async function handler(req, res) {
  try {
    if (req.method !== "GET") {
      return res.status(405).json({ error: "GET only" });
    }

    /* ================= FETCH ================= */
    const [productsSnap, blogsSnap] = await Promise.all([
      getDocs(collection(db, "products")),
      getDocs(collection(db, "blog")),
    ]);

    const products = productsSnap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));

    const blogs = blogsSnap.docs.map((d) => d.data());

    /* ================= ANALYTICS ================= */
    let totalRevenue = 0;
    let totalScore = 0;

    const ranked = products.map((p) => {
      const result = calculateProductRevenue(p);

      totalRevenue += result.revenue;
      totalScore += result.score;

      return {
        id: p.id,
        title: p.title || "Unknown",
        revenue: result.revenue,
        score: result.score,
        ctr: result.ctr,
        cvr: result.cvr,
        views: safeNumber(p.views),
        clicks: safeNumber(p.clicks),
      };
    });

    /* ================= TOP PRODUCTS ================= */
    const topProducts = ranked
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    /* ================= GROWTH SIGNALS ================= */
    const growthSignals = {
      viralProducts: ranked.filter((p) => p.views > 100).length,
      highCTR: ranked.filter((p) => p.ctr > 0.1).length,
      highCVR: ranked.filter((p) => p.cvr > 0.05).length,
    };

    /* ================= RESPONSE ================= */
    return res.status(200).json({
      success: true,

      overview: {
        products: products.length,
        blogs: blogs.length,
        totalRevenue: Number(totalRevenue.toFixed(2)),
        totalScore: Number(totalScore.toFixed(2)),
      },

      topProducts,

      growthSignals,

      insight: {
        status:
          totalRevenue > 100
            ? "🔥 Scaling"
            : totalRevenue > 20
            ? "📈 Growing"
            : "🧠 Early Stage",
      },

      timestamp: Date.now(),
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      error: e?.message || "Dashboard error",
    });
  }
}
