import { initializeApp, getApps } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

/* ================= FIREBASE ================= */
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

/* ================= PROFIT ENGINE ================= */
function profitScore(p) {
  const views = p.views || 0;
  const clicks = p.clicks || 0;
  const orders = p.orders || 0;
  const price = p.price || 0;
  const score = p.score || 0;

  const ctr = views > 0 ? clicks / views : 0;
  const cvr = clicks > 0 ? orders / clicks : 0;

  // 🔥 Profit Intelligence Formula
  let profit =
    score * 2 +
    clicks * 1.5 +
    orders * 10 +
    ctr * 50 +
    cvr * 120;

  // 💰 High price products boost revenue potential
  if (price > 50) profit += 20;
  if (price > 100) profit += 40;

  // 🔥 viral boost
  if (p.viralBoost) profit += 25;

  return Math.round(profit);
}

/* ================= HANDLER ================= */
export default async function handler(req, res) {
  try {
    const snap = await getDocs(collection(db, "products"));

    let products = snap.docs.map((doc) => {
      const p = doc.data();

      return {
        id: doc.id,
        title: p.title || "",
        image: p.image || "",
        price: p.price || 0,
        category: p.category || "general",
        link: p.link || "#",

        views: p.views || 0,
        clicks: p.clicks || 0,
        orders: p.orders || 0,
        score: p.score || 0,
        viralBoost: p.viralBoost || false,
      };
    });

    /* ================= AI SORTING ================= */
    products = products
      .map((p) => ({
        ...p,
        profitScore: profitScore(p),
      }))
      .sort((a, b) => b.profitScore - a.profitScore);

    /* ================= SEGMENTS ================= */

    const topProducts = products.slice(0, 10);
    const trendingProducts = products.filter((p) => p.profitScore > 80);
    const viralProducts = products.filter((p) => p.viralBoost);

    /* ================= RESPONSE ================= */
    return res.status(200).json({
      success: true,
      topProducts,
      trendingProducts,
      viralProducts,
      total: products.length,
      engine: "profit-v1-ai",
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      error: e.message,
    });
  }
      }
