import { initializeApp, getApps } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  serverTimestamp
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

/* ================= AI PROFIT MODEL ================= */
function predictProfit(product) {
  let score = 0;

  /* ================= ENGAGEMENT ================= */
  const views = product.views || 0;
  const clicks = product.clicks || 0;
  const orders = product.orders || 0;

  score += views * 0.5;
  score += clicks * 2;
  score += orders * 8;

  /* ================= CONVERSION RATE ================= */
  const ctr = views > 0 ? clicks / views : 0;
  const cvr = clicks > 0 ? orders / clicks : 0;

  score += ctr * 100;
  score += cvr * 200;

  /* ================= PRICE OPTIMIZATION ================= */
  const price = product.price || 0;

  if (price >= 10 && price <= 50) {
    score += 30; // sweet spot
  } else if (price > 50 && price <= 120) {
    score += 15;
  } else {
    score -= 10;
  }

  /* ================= CATEGORY BOOST ================= */
  const hot = [
    "electronics",
    "smart watch",
    "headphones",
    "gaming",
    "fitness",
    "gadgets"
  ];

  if (hot.includes((product.category || "").toLowerCase())) {
    score += 25;
  }

  /* ================= VIRAL BOOST ================= */
  if (product.viralBoost) score += 60;

  return score;
}

/* ================= PROFIT CLASSIFIER ================= */
function classifyProfit(score) {
  if (score >= 120) return "HIGH_PROFIT";
  if (score >= 80) return "MEDIUM_PROFIT";
  if (score >= 50) return "LOW_PROFIT";
  return "REJECT";
}

/* ================= HANDLER ================= */
export default async function handler(req, res) {
  try {
    const snap = await getDocs(collection(db, "products"));

    const products = snap.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    const results = [];

    for (const p of products) {
      const score = predictProfit(p);
      const classification = classifyProfit(score);

      /* ================= SAVE ANALYSIS ================= */
      const enriched = {
        ...p,
        profitScore: score,
        profitClass: classification,
        analyzedAt: serverTimestamp(),
      };

      /* ================= SAVE BACK TO DB ================= */
      await addDoc(collection(db, "analytics_products"), enriched);

      results.push({
        id: p.id,
        score,
        classification,
      });
    }

    return res.status(200).json({
      success: true,
      analyzed: products.length,
      results,
    });

  } catch (error) {
    console.error("PROFIT ENGINE ERROR:", error);

    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}
