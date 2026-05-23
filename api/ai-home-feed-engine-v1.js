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

/* ================= SCORE BOOST ================= */
function boostScore(p) {
  let score = p.profitScore || 0;

  if (p.rank === "A+") score += 50;
  if (p.rank === "A") score += 30;
  if (p.rank === "B") score += 10;

  if (p.viralBoost) score += 40;

  if ((p.clicks || 0) > 50) score += 20;

  return score;
}

/* ================= HANDLER ================= */
export default async function handler(req, res) {
  try {
    const snap = await getDocs(collection(db, "ranked_products"));

    const products = snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));

    const feed = [];

    for (const p of products) {
      const finalScore = boostScore(p);

      const item = {
        ...p,
        feedScore: finalScore,
        createdAt: serverTimestamp(),
      };

      feed.push(item);
    }

    /* ================= SORT FEED ================= */
    feed.sort((a, b) => b.feedScore - a.feedScore);

    /* ================= SAVE TOP FEED ================= */
    const top = feed.slice(0, 20);

    for (const item of top) {
      await addDoc(collection(db, "home_feed"), item);
    }

    return res.status(200).json({
      success: true,
      total: feed.length,
      top: top.length,
    });

  } catch (e) {
    return res.status(500).json({
      success: false,
      error: e.message,
    });
  }
}
