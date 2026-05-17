import { initializeApp, getApps } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs
} from "firebase/firestore";

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

/* ================= PROFIT ENGINE ================= */
function profitScore(p) {
  const views = Number(p.views || 0);
  const clicks = Number(p.clicks || 0);
  const orders = Number(p.orders || 0);
  const price = Number(p.price || 0);
  const score = Number(p.score || 0);

  const ctr = views > 0
    ? clicks / views
    : 0;

  const cvr = clicks > 0
    ? orders / clicks
    : 0;

  let profit =
    score * 2 +
    clicks * 1.5 +
    orders * 10 +
    ctr * 50 +
    cvr * 120;

  /* ================= PRICE BOOST ================= */
  if (price > 50) profit += 20;
  if (price > 100) profit += 40;

  /* ================= VIRAL BOOST ================= */
  if (p.viralBoost === true) {
    profit += 25;
  }

  return Math.round(profit);
}

/* ================= HANDLER ================= */
export default async function handler(req, res) {
  try {
    /* ================= GET PRODUCTS ================= */
    const snap = await getDocs(
      collection(db, "products")
    );

    let products = snap.docs.map((docItem) => {
      const p = docItem.data() || {};

      return {
        id: String(docItem.id || ""),

        title: String(p.title || ""),
        image: String(p.image || ""),
        category: String(
          p.category || "general"
        ),
        link: String(p.link || "#"),

        price: Number(p.price || 0),

        views: Number(p.views || 0),
        clicks: Number(p.clicks || 0),
        orders: Number(p.orders || 0),
        score: Number(p.score || 0),

        viralBoost:
          p.viralBoost === true,
      };
    });

    /* ================= REMOVE INVALID ================= */
    products = products.filter(
      (p) => p.id && p.title
    );

    /* ================= PROFIT SCORING ================= */
    products = products
      .map((p) => ({
        ...p,
        profitScore: profitScore(p),
      }))
      .sort(
        (a, b) =>
          b.profitScore - a.profitScore
      );

    /* ================= SEGMENTS ================= */
    const topProducts =
      products.slice(0, 10);

    const trendingProducts =
      products.filter(
        (p) => p.profitScore > 80
      );

    const viralProducts =
      products.filter(
        (p) => p.viralBoost === true
      );

    const highConversionProducts =
      products.filter(
        (p) =>
          p.orders > 0 &&
          p.clicks > 0
      );

    /* ================= RESPONSE ================= */
    return res.status(200).json({
      success: true,

      topProducts,
      trendingProducts,
      viralProducts,
      highConversionProducts,

      total: products.length,

      engine: "profit-v1-ai",
    });

  } catch (e) {
    console.error(
      "HOME FEED ERROR:",
      e
    );

    return res.status(500).json({
      success: false,
      error: String(
        e?.message || "Unknown error"
      ),
    });
  }
      }
