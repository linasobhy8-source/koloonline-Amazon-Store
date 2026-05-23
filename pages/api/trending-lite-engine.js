import { initializeApp, getApps } from "firebase/app";
import { getFirestore, collection, getDocs, limit, query } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

/* ================= LIGHT SCORE ================= */
function score(p) {
  return (
    (p.views || 0) +
    (p.clicks || 0) * 2 +
    (p.viralBoost ? 50 : 0)
  );
}

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
      .sort((a, b) => score(b) - score(a))
      .slice(0, 10);

    return res.status(200).json({
      success: true,
      trending,
    });

  } catch (e) {
    return res.status(500).json({
      error: e.message,
    });
  }
}
