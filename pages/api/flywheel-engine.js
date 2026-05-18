import { getFirestore, collection, getDocs } from "firebase/firestore";
import { initializeApp, getApps } from "firebase/app";

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

/* ================= FLYWHEEL CORE ================= */
function engagementScore(p) {
  return (p.views || 0) * 1 + (p.clicks || 0) * 3 + (p.orders || 0) * 10;
}

export default async function handler(req, res) {
  try {
    const productSnap = await getDocs(collection(db, "products"));

    const products = productSnap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
      score: engagementScore(d.data()),
    }));

    const sorted = products.sort((a, b) => b.score - a.score);

    const top = sorted.slice(0, 10);

    return res.status(200).json({
      success: true,
      flywheel: {
        topProducts: top,
        momentum: top.reduce((a, b) => a + b.score, 0),
      },
    });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
