import { initializeApp, getApps } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  updateDoc,
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

/* ================= AI PROFIT ENGINE V2 ================= */
export default async function handler(req, res) {
  try {
    console.log("🔥 AI PROFIT ENGINE STARTED");

    /* ================= LOAD PRODUCTS ANALYTICS ================= */
    const snap = await getDocs(collection(db, "analytics_products"));

    let products = snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));

    if (!products.length) {
      return res.status(200).json({
        success: true,
        message: "No products found",
      });
    }

    /* ================= SCORE NORMALIZATION ================= */
    products = products.map((p) => {
      const views = p.views || 0;
      const clicks = p.clicks || 0;
      const orders = p.orders || 0;
      const aiScore = p.aiScore || 0;

      const ctr = views > 0 ? clicks / views : 0;
      const conversion = clicks > 0 ? orders / clicks : 0;

      const finalScore =
        aiScore +
        ctr * 50 +
        conversion * 120 +
        orders * 10;

      return {
        ...p,
        finalScore,
      };
    });

    /* ================= SORT ================= */
    products.sort((a, b) => b.finalScore - a.finalScore);

    const topProducts = products.slice(0, 10);
    const weakProducts = products.slice(-10);

    /* ================= BOOST WINNERS ================= */
    for (const p of topProducts) {
      const ref = doc(db, "products", p.id);

      await updateDoc(ref, {
        isHotProduct: true,
        boostLevel: "MAX",
        trendRank: "top",
        updatedAt: serverTimestamp(),
      });
    }

    /* ================= DOWNGRADE LOSERS ================= */
    for (const p of weakProducts) {
      const ref = doc(db, "products", p.id);

      await updateDoc(ref, {
        isHotProduct: false,
        boostLevel: "LOW",
        trendRank: "cold",
        updatedAt: serverTimestamp(),
      });
    }

    /* ================= SMART INSIGHTS ================= */

    const insights = {
      total: products.length,
      top: topProducts.length,
      weak: weakProducts.length,
      bestProduct: topProducts[0]?.id || null,
      worstProduct: weakProducts[0]?.id || null,
    };

    console.log("📊 INSIGHTS:", insights);

    /* ================= RETURN ================= */
    return res.status(200).json({
      success: true,
      message: "AI Profit Engine executed",
      insights,
    });

  } catch (e) {
    console.error("AI PROFIT ENGINE ERROR:", e);

    return res.status(500).json({
      success: false,
      error: e.message,
    });
  }
          }
