import { initializeApp, getApps } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  limit,
  query,
} from "firebase/firestore";

/* ================= FIREBASE INIT ================= */
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
};

const app = !getApps().length
  ? initializeApp(firebaseConfig)
  : getApps()[0];

const db = getFirestore(app);

/* ================= SIMPLE SCORING ENGINE ================= */
function calculateScore(product) {
  return (
    (product.views || 0) +
    (product.clicks || 0) * 2 +
    (product.viralBoost ? 50 : 0)
  );
}

/* ================= HANDLER ================= */
export default async function handler(req, res) {
  try {
    const snap = await getDocs(
      query(collection(db, "products"), limit(30))
    );

    const products = snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));

    const trending = products
      .sort((a, b) => calculateScore(b) - calculateScore(a))
      .slice(0, 10);

    return res.status(200).json({
      success: true,
      trending,
      description:
        "This endpoint provides a curated list of trending products based on basic engagement signals such as views, clicks, and content relevance. It is intended to improve product discovery and browsing experience.",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}
