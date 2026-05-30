import { initializeApp, getApps } from "firebase/app";
import { getFirestore, collection, getDocs, query, limit } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
};

const app = !getApps().length
  ? initializeApp(firebaseConfig)
  : getApps()[0];

const db = getFirestore(app);

/* ================= SIMPLE MEMORY CACHE ================= */
let cached = null;
let cachedTime = 0;

/* ================= OPTIMIZED FEED ENGINE ================= */

function optimize(products = []) {
  return products
    .slice(0, 30)
    .map((p) => ({
      id: p.id,
      title: p.title || "",
      image: p.image || "",
      price: p.price || 0,
      views: p.views || 0,
      clicks: p.clicks || 0,
      orders: p.orders || 0,
      viralBoost: p.viralBoost || false,
    }))
    .sort((a, b) => {
      const score = (p) =>
        (p.views || 0) +
        (p.clicks || 0) * 2 +
        (p.orders || 0) * 5 +
        (p.viralBoost ? 50 : 0);

      return score(b) - score(a);
    })
    .slice(0, 12);
}

/* ================= API ================= */

export default async function handler(req, res) {
  try {
    const now = Date.now();

    /* 🔥 CACHE 5 MIN */
    if (cached && now - cachedTime < 300000) {
      return res.status(200).json({
        success: true,
        cached: true,
        products: cached,
      });
    }

    const snap = await getDocs(
      query(collection(db, "products"), limit(50))
    );

    const products = snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));

    const optimized = optimize(products);

    cached = optimized;
    cachedTime = now;

    return res.status(200).json({
      success: true,
      cached: false,
      products: optimized,
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      error: e.message,
    });
  }
        }
