import { initializeApp, getApps } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  serverTimestamp,
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

/* ================= PROFIT INTELLIGENCE CORE ================= */
function profitBrain(product) {
  let score = 0;

  const views = product.views || 0;
  const clicks = product.clicks || 0;
  const orders = product.orders || 0;
  const price = product.price || 0;

  /* ================= ENGAGEMENT ================= */
  score += views * 0.4;
  score += clicks * 2.5;
  score += orders * 10;

  /* ================= CONVERSION ================= */
  const ctr = views > 0 ? clicks / views : 0;
  const cvr = clicks > 0 ? orders / clicks : 0;

  score += ctr * 120;
  score += cvr * 250;

  /* ================= PRICE OPTIMIZATION ================= */
  if (price >= 10 && price <= 60) score += 25;
  else if (price > 60 && price <= 120) score += 10;
  else score -= 15;

  /* ================= VIRAL SIGNAL ================= */
  if (product.viralBoost) score += 70;

  /* ================= CATEGORY INTELLIGENCE ================= */
  const winners = [
    "electronics",
    "smart watch",
    "headphones",
    "gaming",
    "fitness",
    "gadgets",
    "home"
  ];

  if (winners.includes((product.category || "").toLowerCase())) {
    score += 30;
  }

  return score;
}

/* ================= DECISION ENGINE ================= */
function decision(score) {
  if (score >= 130) return "🔥 AUTO-PUBLISH";
  if (score >= 90) return "⚡ QUEUE";
  if (score >= 60) return "🟡 REVIEW";
  return "❌ DROP";
}

/* ================= HANDLER ================= */
export default async function handler(req, res) {
  try {
    const snap = await getDocs(collection(db, "products"));

    const products = snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));

    const results = [];

    for (const p of products) {
      const score = profitBrain(p);
      const action = decision(score);

      /* ================= SAVE INTELLIGENCE ================= */
      await addDoc(collection(db, "analytics_products"), {
        ...p,
        profitScore: score,
        decision: action,
        analyzedAt: serverTimestamp(),
      });

      /* ================= AUTO FEED CONTROL ================= */
      if (action === "🔥 AUTO-PUBLISH") {
        await addDoc(collection(db, "home_feed"), {
          ...p,
          boost: true,
          createdAt: serverTimestamp(),
        });
      }

      results.push({
        id: p.id,
        score,
        action,
      });
    }

    return res.status(200).json({
      success: true,
      total: products.length,
      results,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}
