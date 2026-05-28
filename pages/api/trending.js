import { initializeApp, getApps } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  limit,
  query,
} from "firebase/firestore";

/* ================= FIREBASE INIT SAFE ================= */
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
};

const app = !getApps().length
  ? initializeApp(firebaseConfig)
  : getApps()[0];

const db = getFirestore(app);

/* ================= SCORING ENGINE ================= */
function score(product = {}) {
  return (
    (product.views || 0) +
    (product.clicks || 0) * 2 +
    (product.viralBoost ? 50 : 0)
  );
}

/* ================= API HANDLER ================= */
export default async function handler(req, res) {
  try {
    const q = query(collection(db, "products"), limit(50));

    const snap = await getDocs(q);

    if (snap.empty) {
      return res.status(200).json({
        success: true,
        trending: [],
        message: "No products found",
      });
    }

    const products = snap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const trending = products
      .sort((a, b) => score(b) - score(a))
      .slice(0, 10);

    return res.status(200).json({
      success: true,
      count: trending.length,
      trending,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}
