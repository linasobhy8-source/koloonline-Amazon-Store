import { initializeApp, getApps } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

/* ================= FIREBASE SAFE INIT ================= */
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const db = getFirestore(app);

/* ================= PROFIT PREDICTION CORE ================= */
function predictProfit(product) {
  let score = 0;

  const views = product.views || 0;
  const clicks = product.clicks || 0;
  const orders = product.orders || 0;
  const price = product.price || 0;

  // conversion signals
  const ctr = views ? clicks / views : 0;
  const cvr = clicks ? orders / clicks : 0;

  score += ctr * 150;
  score += cvr * 300;

  // engagement
  score += views * 0.2;
  score += clicks * 2;
  score += orders * 8;

  // price sweet spot
  if (price >= 15 && price <= 70) score += 30;
  else if (price > 70) score -= 10;

  // viral boost
  if (product.viralBoost) score += 60;

  // category boost
  const hot = ["electronics", "gadgets", "fitness", "gaming", "home"];
  if (hot.includes((product.category || "").toLowerCase())) {
    score += 25;
  }

  return score;
}

/* ================= DECISION ================= */
function decision(score) {
  if (score >= 120) return "APPROVE";
  if (score >= 80) return "QUEUE";
  return "REJECT";
}

/* ================= HANDLER ================= */
export default async function handler(req, res) {
  try {
    const snap = await getDocs(collection(db, "products"));

    const results = snap.docs.map((doc) => {
      const product = { id: doc.id, ...doc.data() };

      const score = predictProfit(product);
      const action = decision(score);

      return {
        id: product.id,
        score,
        action,
      };
    });

    return res.status(200).json({
      success: true,
      total: results.length,
      results,
    });

  } catch (e) {
    return res.status(500).json({
      success: false,
      error: e.message,
    });
  }
}
