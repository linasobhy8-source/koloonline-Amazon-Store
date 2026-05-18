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

/* ================= SAFE ================= */
const num = (v) => Number(v || 0);

/* ================= PROFIT SCORE ================= */
function profitScore(p) {
  const views = num(p.views);
  const clicks = num(p.clicks);
  const orders = num(p.orders);
  const price = num(p.price);
  const score = num(p.score);

  const ctr = views > 0 ? clicks / views : 0;
  const cvr = clicks > 0 ? orders / clicks : 0;

  let profit =
    score * 2 +
    clicks * 1.2 +
    orders * 10 +
    ctr * 60 +
    cvr * 120;

  if (price > 50) profit += 15;
  if (price > 100) profit += 30;
  if (p.viralBoost) profit += 25;

  return profit;
}

/* ================= TREND SCORE ================= */
function trendScore(p) {
  const now = Date.now();

  let updatedAt = p.updatedAt
    ? new Date(p.updatedAt).getTime()
    : now;

  const hoursOld =
    (now - updatedAt) / (1000 * 60 * 60);

  const freshness = Math.max(
    0,
    50 - hoursOld * 0.7
  );

  const engagement =
    num(p.clicks) * 2 +
    num(p.views) * 0.5 +
    num(p.orders) * 8;

  const viral = p.viralBoost ? 30 : 0;

  return engagement + freshness + viral;
}

/* ================= FINAL AI SCORE ================= */
function aiScore(p) {
  return profitScore(p) * 0.6 + trendScore(p) * 0.4;
}

/* ================= HANDLER ================= */
export default async function handler(req, res) {
  try {
    const snap = await getDocs(collection(db, "products"));

    let products = snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));

    products = products.filter(p => p.id && p.title);

    products = products.map(p => ({
      ...p,
      profitScore: profitScore(p),
      trendScore: trendScore(p),
      aiScore: aiScore(p),
    }));

    products.sort((a, b) => b.aiScore - a.aiScore);

    /* ================= SEGMENTS ================= */
    const topProducts = products.slice(0, 10);

    const trendingProducts = [...products]
      .sort((a, b) => b.trendScore - a.trendScore)
      .slice(0, 10);

    const viralProducts = products
      .filter(p => p.viralBoost)
      .slice(0, 10);

    const bestROI = [...products]
      .sort((a, b) => b.profitScore - a.profitScore)
      .slice(0, 10);

    return res.status(200).json({
      success: true,
      engine: "ai-home-feed-v2",

      topProducts,
      trendingProducts,
      viralProducts,
      bestROI,

      total: products.length,
    });

  } catch (e) {
    console.error("HOME FEED ERROR:", e);

    return res.status(500).json({
      success: false,
      error: e.message,
    });
  }
      }
