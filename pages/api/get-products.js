import { initializeApp, getApps } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  orderBy,
  limit
} from "firebase/firestore";

/* ================= FIREBASE INIT ================= */
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
};

const app = !getApps().length
  ? initializeApp(firebaseConfig)
  : getApps()[0];

const db = getFirestore(app);

/* ================= AI SCORE ENGINE ================= */
function calculateWinnerScore(p) {
  let score = 0;

  /* 🔥 Engagement */
  score += (p.views || 0) * 1;
  score += (p.clicks || 0) * 3;
  score += (p.orders || 0) * 10;

  /* 🔥 Conversion Boost */
  if (p.clicks > 0) {
    const ctr = (p.orders || 0) / p.clicks;
    score += ctr * 100;
  }

  /* 🔥 Trust Boost */
  score += (p.rating || 4.2) * 10;

  /* 🔥 Viral Boost */
  if (p.viralBoost) score += 80;

  /* 🔥 Category Boost */
  const hotCategories = [
    "electronics",
    "smart watch",
    "headphones",
    "gaming",
    "fitness"
  ];

  if (hotCategories.includes((p.category || "").toLowerCase())) {
    score += 20;
  }

  /* 🔥 Price Sweet Spot (middle range wins more) */
  if (p.price >= 10 && p.price <= 80) {
    score += 15;
  }

  return score;
}

/* ================= HANDLER ================= */
export default async function handler(req, res) {
  try {
    const { max = 50 } = req.query;

    /* ================= FETCH PRODUCTS ================= */
    const snap = await getDocs(
      query(
        collection(db, "products"),
        orderBy("createdAt", "desc"),
        limit(Number(max))
      )
    );

    let products = snap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    /* ================= AI SCORING ================= */
    products = products.map((p) => ({
      ...p,
      aiScore: calculateWinnerScore(p),
    }));

    /* ================= FILTER WINNERS ONLY ================= */
    const winners = products
      .filter((p) => p.aiScore >= 60) // 🔥 فلترة قوية
      .sort((a, b) => b.aiScore - a.aiScore)
      .slice(0, 12); // 🔥 أفضل 12 فقط

    /* ================= RESPONSE ================= */
    return res.status(200).json({
      success: true,
      totalScanned: products.length,
      winnersCount: winners.length,
      products: winners,
    });

  } catch (error) {
    console.error("AI WINNER ENGINE ERROR:", error);

    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}
