import { initializeApp, getApps } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

/* ================= FIREBASE ================= */
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
};

const app = !getApps().length
  ? initializeApp(firebaseConfig)
  : getApps()[0];

const db = getFirestore(app);

/* ================= SAFE NUMBER ================= */
const num = (v) => Number(v || 0);

/* ================= PROFIT ENGINE ================= */
function profitScore(p) {
  const views = num(p.views);
  const clicks = num(p.clicks);
  const orders = num(p.orders);
  const price = num(p.price);
  const baseScore = num(p.score);

  const ctr = views > 0 ? clicks / views : 0;
  const cvr = clicks > 0 ? orders / clicks : 0;

  let score =
    baseScore * 2 +
    clicks * 1.2 +
    orders * 10 +
    ctr * 60 +
    cvr * 120;

  if (price > 50) score += 15;
  if (price > 100) score += 30;
  if (price > 200) score += 50;

  if (p.viralBoost) score += 25;

  return score;
}

/* ================= TREND ENGINE ================= */
function trendScore(p) {
  const now = Date.now();

  const updatedAt = p.updatedAt
    ? new Date(p.updatedAt).getTime()
    : now;

  const hoursOld = (now - updatedAt) / (1000 * 60 * 60);

  const freshnessBoost = Math.max(0, 50 - hoursOld * 0.7);

  const engagement =
    num(p.clicks) * 2 +
    num(p.views) * 0.5 +
    num(p.orders) * 8;

  const viralBoost = p.viralBoost ? 30 : 0;

  const ctrBoost =
    num(p.views) > 0 ? (num(p.clicks) / num(p.views)) * 100 : 0;

  return engagement + freshnessBoost + viralBoost + ctrBoost;
}

/* ================= AI FINAL SCORE ================= */
function aiScore(p) {
  return profitScore(p) * 0.6 + trendScore(p) * 0.4;
}

/* ================= CLUSTER ENGINE (NEW) ================= */
function clusterProduct(p) {
  const price = num(p.price);

  if (p.viralBoost) return "viral";
  if (price < 20) return "cheap";
  if (price < 100) return "mid";
  if (price >= 100) return "premium";

  return "general";
}

/* ================= HANDLER ================= */
export default async function handler(req, res) {
  try {
    /* ================= LOAD ================= */
    const snap = await getDocs(collection(db, "products"));

    let products = snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));

    /* ================= CLEAN ================= */
    products = products.filter((p) => p.id && p.title);

    /* ================= ENRICH ================= */
    products = products.map((p) => ({
      ...p,
      profitScore: profitScore(p),
      trendScore: trendScore(p),
      aiScore: aiScore(p),
      cluster: clusterProduct(p),
    }));

    /* ================= SORT AI CORE ================= */
    products.sort((a, b) => b.aiScore - a.aiScore);

    /* ================= SEGMENTS ================= */
    const topProducts = products.slice(0, 10);

    const trendingProducts = [...products]
      .sort((a, b) => b.trendScore - a.trendScore)
      .slice(0, 10);

    const viralProducts = products
      .filter((p) => p.cluster === "viral")
      .slice(0, 10);

    const bestROI = [...products]
      .sort((a, b) => b.profitScore - a.profitScore)
      .slice(0, 10);

    const cheapProducts = products
      .filter((p) => p.cluster === "cheap")
      .slice(0, 10);

    const premiumProducts = products
      .filter((p) => p.cluster === "premium")
      .slice(0, 10);

    /* ================= RESPONSE ================= */
    return res.status(200).json({
      success: true,
      engine: "growth-engine-final-v3",

      topProducts,
      trendingProducts,
      viralProducts,
      bestROI,
      cheapProducts,
      premiumProducts,

      total: products.length,
    });

  } catch (e) {
    console.error("GROWTH ENGINE ERROR:", e);

    return res.status(500).json({
      success: false,
      error: e?.message || "Unknown error",
    });
  }
      }
