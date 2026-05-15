import { initializeApp, getApps } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
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

/* ================= HOME PROFIT ENGINE ================= */
export default async function handler(req, res) {
  try {
    const snap = await getDocs(collection(db, "analytics_products"));

    let products = snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));

    if (!products.length) {
      return res.status(200).json({ products: [] });
    }

    /* ================= SCORE CALCULATION ================= */
    products = products.map((p) => {
      const views = p.views || 0;
      const clicks = p.clicks || 0;
      const orders = p.orders || 0;
      const aiScore = p.aiScore || 0;

      const ctr = views > 0 ? clicks / views : 0;
      const conversion = clicks > 0 ? orders / clicks : 0;

      // 🔥 Profit Score الحقيقي
      const profitScore =
        aiScore +
        ctr * 60 +
        conversion * 150 +
        orders * 20 +
        views * 0.1;

      return {
        ...p,
        profitScore,
      };
    });

    /* ================= SORT BY PROFIT ================= */
    products.sort((a, b) => b.profitScore - a.profitScore);

    /* ================= BOOST FILTER ================= */
    const topProducts = products
      .filter((p) => p.profitScore > 30)
      .slice(0, 20);

    const trending = products
      .filter((p) => p.views > 10)
      .slice(0, 10);

    const hot = products
      .filter((p) => p.isHotProduct === true)
      .slice(0, 10);

    /* ================= FINAL RESPONSE ================= */
    return res.status(200).json({
      success: true,
      topProducts,
      trending,
      hot,
      total: products.length,
    });

  } catch (e) {
    return res.status(500).json({
      success: false,
      error: e.message,
    });
  }
}
