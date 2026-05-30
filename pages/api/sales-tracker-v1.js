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

/* ================= PERFORMANCE ENGINE ================= */
function performanceDelta(p) {
  const views = p.views || 0;
  const clicks = p.clicks || 0;
  const orders = p.orders || 0;

  let delta = 0;

  if (views > 0) {
    const ctr = clicks / views;
    if (ctr > 0.15) delta += 10;
    if (ctr < 0.05) delta -= 15;
  }

  if (clicks > 0) {
    const cvr = orders / clicks;
    if (cvr > 0.1) delta += 25;
    if (cvr < 0.02) delta -= 20;
  }

  if (orders > 3) delta += 30;
  if (orders === 0 && clicks > 10) delta -= 10;

  return delta;
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
      const delta = performanceDelta(p);

      const newScore = (p.profitScore || 0) + delta;

      await updateDoc(doc(db, "analytics_products", p.id), {
        profitScore: newScore,
        performanceDelta: delta,
        lastUpdated: serverTimestamp(),
      });

      updated++;
    }

    return res.status(200).json({
      success: true,
      updated,
    });

  } catch (e) {
    return res.status(500).json({
      success: false,
      error: e.message,
    });
  }
}
