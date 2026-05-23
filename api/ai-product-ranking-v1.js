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

/* ================= PROFIT ENGINE ================= */
function profitScore(p) {
  const views = p.views || 0;
  const clicks = p.clicks || 0;
  const orders = p.orders || 0;
  const price = p.price || 0;

  let score = 0;

  score += views * 0.3;
  score += clicks * 2;
  score += orders * 10;

  const ctr = views ? clicks / views : 0;
  const cvr = clicks ? orders / clicks : 0;

  score += ctr * 100;
  score += cvr * 200;

  if (p.viralBoost) score += 60;

  if (price >= 10 && price <= 70) score += 20;
  else if (price > 70) score -= 10;

  const hotCats = ["electronics", "gaming", "fitness", "gadgets"];
  if (hotCats.includes((p.category || "").toLowerCase())) {
    score += 25;
  }

  return score;
}

/* ================= RANK SYSTEM ================= */
function getRank(score) {
  if (score >= 140) return "A+";
  if (score >= 110) return "A";
  if (score >= 80) return "B";
  if (score >= 50) return "C";
  return "DROP";
}

/* ================= HANDLER ================= */
export default async function handler(req, res) {
  try {
    const snap = await getDocs(collection(db, "products"));

    const products = snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));

    const rankedFeed = [];

    for (const p of products) {
      const score = profitScore(p);
      const rank = getRank(score);

      const item = {
        ...p,
        profitScore: score,
        rank,
        updatedAt: serverTimestamp(),
      };

      /* ================= SAVE ONLY WINNERS ================= */
      if (rank !== "DROP") {
        await addDoc(collection(db, "ranked_products"), item);
      }

      rankedFeed.push(item);
    }

    /* ================= SORT FOR HOMEPAGE ================= */
    rankedFeed.sort((a, b) => b.profitScore - a.profitScore);

    return res.status(200).json({
      success: true,
      total: rankedFeed.length,
      top: rankedFeed.slice(0, 20),
    });

  } catch (e) {
    return res.status(500).json({
      success: false,
      error: e.message,
    });
  }
}
