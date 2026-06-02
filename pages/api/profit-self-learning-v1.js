import { initializeApp, getApps } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  updateDoc,
  doc,
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

/* ================= LEARNING ENGINE ================= */
/**
 * AdSense/SEO note:
 * This logic helps prioritize high-performing products based on real engagement data.
 * Clean structured data improves downstream content quality for ads and indexing.
 */

function adjustScore(product) {
  const views = product.views || 0;
  const clicks = product.clicks || 0;
  const orders = product.orders || 0;

  let adjustment = 0;

  /* ================= REAL PERFORMANCE ================= */
  if (views > 0) {
    const ctr = clicks / views;

    if (ctr > 0.2) adjustment += 15;
    else if (ctr < 0.05) adjustment -= 20;
  }

  if (clicks > 0) {
    const cvr = orders / clicks;

    if (cvr > 0.1) adjustment += 25;
    else if (cvr < 0.02) adjustment -= 30;
  }

  /* ================= VIRAL LEARNING ================= */
  if (orders > 5) adjustment += 20;
  if (orders === 0 && clicks > 20) adjustment -= 10;

  return adjustment;
}

/* ================= HANDLER ================= */
export default async function handler(req, res) {
  try {
    const snap = await getDocs(collection(db, "analytics_products"));

    const products = snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));

    let updated = 0;

    for (const p of products) {
      const adjust = adjustScore(p);
      const newScore = (p.profitScore || 0) + adjust;

      await updateDoc(doc(db, "analytics_products", p.id), {
        profitScore: newScore,
        learningAdjustment: adjust,
        lastLearnedAt: new Date(),
      });

      updated++;
    }

    return res.status(200).json({
      success: true,
      updated,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
  }
