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

/* ================= PROFIT SCORE (SAME LOGIC) ================= */
function profitBrain(product) {
  let score = 0;

  const views = product.views || 0;
  const clicks = product.clicks || 0;
  const orders = product.orders || 0;
  const price = product.price || 0;

  score += views * 0.4;
  score += clicks * 2.5;
  score += orders * 10;

  const ctr = views > 0 ? clicks / views : 0;
  const cvr = clicks > 0 ? orders / clicks : 0;

  score += ctr * 120;
  score += cvr * 250;

  if (price >= 10 && price <= 60) score += 25;
  else if (price > 60 && price <= 120) score += 10;
  else score -= 15;

  if (product.viralBoost) score += 70;

  const winners = [
    "electronics",
    "smart watch",
    "headphones",
    "gaming",
    "fitness",
    "gadgets",
    "home",
  ];

  if (winners.includes((product.category || "").toLowerCase())) {
    score += 30;
  }

  return score;
}

/* ================= FILTER RULE ================= */
function isWinner(score) {
  return score >= 100; // 🔥 فلتر الربح الحقيقي
}

/* ================= HANDLER ================= */
export default async function handler(req, res) {
  try {
    const snap = await getDocs(collection(db, "products"));

    const products = snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));

    const approved = [];
    const rejected = [];

    for (const p of products) {
      const score = profitBrain(p);

      if (isWinner(score)) {
        await addDoc(collection(db, "winning_products"), {
          ...p,
          profitScore: score,
          status: "WINNER",
          createdAt: serverTimestamp(),
        });

        approved.push({ id: p.id, score });
      } else {
        rejected.push({ id: p.id, score });
      }
    }

    return res.status(200).json({
      success: true,
      winners: approved.length,
      rejected: rejected.length,
    });

  } catch (e) {
    return res.status(500).json({
      success: false,
      error: e.message,
    });
  }
}
